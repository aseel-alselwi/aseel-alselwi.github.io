<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order with items.
     */
    public function createOrder(array $data, ?int $userId = null): Order
    {
        return DB::transaction(function () use ($data, $userId) {
            // Create the order
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_id' => $data['customer_id'],
                'user_id' => $userId,
                'status' => Order::STATUS_PENDING,
                'payment_method' => $data['payment_method'] ?? null,
                'payment_status' => Order::PAYMENT_STATUS_PENDING,
                'shipping_address' => $data['shipping_address'] ?? null,
                'billing_address' => $data['billing_address'] ?? null,
                'notes' => $data['notes'] ?? null,
                'estimated_delivery' => $data['estimated_delivery'] ?? null,
            ]);

            // Create order items
            $subtotal = 0;
            foreach ($data['items'] as $itemData) {
                $totalPrice = $itemData['quantity'] * $itemData['unit_price'];
                $subtotal += $totalPrice;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $itemData['product_name'],
                    'product_sku' => $itemData['product_sku'] ?? null,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'total_price' => $totalPrice,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            // Calculate totals
            $tax = $subtotal * 0.08; // 8% tax
            $shippingCost = $data['shipping_cost'] ?? 0;
            $discount = $data['discount'] ?? 0;
            $total = $subtotal + $tax + $shippingCost - $discount;

            $order->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'discount' => $discount,
                'total' => $total,
            ]);

            // Create initial status history
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'user_id' => $userId,
                'from_status' => null,
                'to_status' => Order::STATUS_PENDING,
                'notes' => 'Order created',
            ]);

            // Dispatch event
            event(new OrderCreated($order));

            return $order->load(['customer', 'items', 'statusHistory']);
        });
    }

    /**
     * Update order status.
     */
    public function updateOrderStatus(Order $order, string $newStatus, ?int $userId = null, ?string $notes = null): Order
    {
        $fromStatus = $order->status;

        $order->update(['status' => $newStatus]);

        // If delivered, set delivered_at
        if ($newStatus === Order::STATUS_DELIVERED) {
            $order->update(['delivered_at' => now()]);
        }

        // Create status history
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'user_id' => $userId,
            'from_status' => $fromStatus,
            'to_status' => $newStatus,
            'notes' => $notes ?? "Status changed from {$fromStatus} to {$newStatus}",
        ]);

        // Dispatch event
        event(new OrderStatusUpdated($order, $fromStatus, $newStatus));

        return $order->fresh(['customer', 'items', 'statusHistory']);
    }

    /**
     * Update order details.
     */
    public function updateOrder(Order $order, array $data, ?int $userId = null): Order
    {
        // Check if status is being updated
        if (isset($data['status']) && $data['status'] !== $order->status) {
            $this->updateOrderStatus(
                $order,
                $data['status'],
                $userId,
                $data['status_notes'] ?? null
            );
            unset($data['status'], $data['status_notes']);
        }

        // Update other fields
        $order->update($data);

        return $order->fresh(['customer', 'items', 'statusHistory']);
    }

    /**
     * Get dashboard statistics.
     */
    public function getDashboardStats(): array
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        return [
            'total_orders' => Order::count(),
            'orders_today' => Order::whereDate('created_at', $today)->count(),
            'orders_this_month' => Order::where('created_at', '>=', $thisMonth)->count(),
            'total_revenue' => Order::where('payment_status', 'paid')->sum('total'),
            'revenue_today' => Order::where('payment_status', 'paid')
                ->whereDate('created_at', $today)
                ->sum('total'),
            'revenue_this_month' => Order::where('payment_status', 'paid')
                ->where('created_at', '>=', $thisMonth)
                ->sum('total'),
            'pending_orders' => Order::status(Order::STATUS_PENDING)->count(),
            'processing_orders' => Order::status(Order::STATUS_PROCESSING)->count(),
            'shipped_orders' => Order::status(Order::STATUS_SHIPPED)->count(),
            'delivered_orders' => Order::status(Order::STATUS_DELIVERED)->count(),
            'cancelled_orders' => Order::status(Order::STATUS_CANCELLED)->count(),
            'status_counts' => [
                'pending' => Order::status(Order::STATUS_PENDING)->count(),
                'processing' => Order::status(Order::STATUS_PROCESSING)->count(),
                'shipped' => Order::status(Order::STATUS_SHIPPED)->count(),
                'delivered' => Order::status(Order::STATUS_DELIVERED)->count(),
                'cancelled' => Order::status(Order::STATUS_CANCELLED)->count(),
                'refunded' => Order::status(Order::STATUS_REFUNDED)->count(),
            ],
        ];
    }

    /**
     * Get sales data for charts.
     */
    public function getSalesData(string $period = 'daily'): array
    {
        $query = Order::where('payment_status', 'paid')
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as count');

        switch ($period) {
            case 'daily':
                $query->where('created_at', '>=', now()->subDays(30));
                break;
            case 'weekly':
                $query->where('created_at', '>=', now()->subWeeks(12));
                break;
            case 'monthly':
                $query->where('created_at', '>=', now()->subMonths(12));
                break;
        }

        return $query->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }
}
