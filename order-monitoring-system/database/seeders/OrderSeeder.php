<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\OrderStatusHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $user = User::first();
        
        $products = [
            ['name' => 'Wireless Headphones', 'sku' => 'WH-001', 'price' => 79.99],
            ['name' => 'Bluetooth Speaker', 'sku' => 'BS-002', 'price' => 49.99],
            ['name' => 'USB-C Cable', 'sku' => 'UC-003', 'price' => 12.99],
            ['name' => 'Phone Case', 'sku' => 'PC-004', 'price' => 24.99],
            ['name' => 'Screen Protector', 'sku' => 'SP-005', 'price' => 9.99],
            ['name' => 'Laptop Stand', 'sku' => 'LS-006', 'price' => 39.99],
            ['name' => 'Mechanical Keyboard', 'sku' => 'MK-007', 'price' => 129.99],
            ['name' => 'Gaming Mouse', 'sku' => 'GM-008', 'price' => 59.99],
        ];

        $statuses = Order::getStatuses();
        $paymentMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'];
        $paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

        // Create 50 sample orders
        for ($i = 0; $i < 50; $i++) {
            $customer = $customers->random();
            $status = $statuses[array_rand($statuses)];
            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
            
            // Payment status logic based on order status
            $paymentStatus = match($status) {
                'delivered', 'shipped', 'processing' => 'paid',
                'cancelled' => 'refunded',
                'refunded' => 'refunded',
                default => $paymentStatuses[array_rand($paymentStatuses)],
            };

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'customer_id' => $customer->id,
                'user_id' => $user?->id,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'shipping_address' => $customer->address . ', ' . $customer->city . ', ' . $customer->country . ' ' . $customer->postal_code,
                'billing_address' => $customer->address . ', ' . $customer->city . ', ' . $customer->country . ' ' . $customer->postal_code,
                'notes' => rand(0, 1) ? 'Sample order notes' : null,
                'estimated_delivery' => now()->addDays(rand(3, 14)),
                'delivered_at' => $status === 'delivered' ? now()->subDays(rand(1, 5)) : null,
                'created_at' => now()->subDays(rand(0, 60)),
            ]);

            // Add 1-5 items per order
            $itemCount = rand(1, 5);
            $subtotal = 0;
            
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products[array_rand($products)];
                $quantity = rand(1, 3);
                $totalPrice = $product['price'] * $quantity;
                $subtotal += $totalPrice;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $product['name'],
                    'product_sku' => $product['sku'],
                    'quantity' => $quantity,
                    'unit_price' => $product['price'],
                    'total_price' => $totalPrice,
                ]);
            }

            // Update order totals
            $tax = $subtotal * 0.08; // 8% tax
            $shipping = rand(0, 1) ? 9.99 : 0; // Free shipping sometimes
            $discount = rand(0, 1) ? rand(5, 20) : 0;
            
            $order->update([
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shipping,
                'discount' => $discount,
                'total' => $subtotal + $tax + $shipping - $discount,
            ]);

            // Create payment record for paid orders
            if ($paymentStatus === 'paid') {
                Payment::create([
                    'order_id' => $order->id,
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'amount' => $order->total,
                    'method' => $paymentMethod,
                    'status' => 'completed',
                    'paid_at' => $order->created_at->addHours(rand(1, 24)),
                ]);
            }

            // Create status history
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'user_id' => $user?->id,
                'from_status' => null,
                'to_status' => 'pending',
                'notes' => 'Order created',
                'created_at' => $order->created_at,
            ]);

            if ($status !== 'pending') {
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'user_id' => $user?->id,
                    'from_status' => 'pending',
                    'to_status' => $status,
                    'notes' => 'Status updated to ' . $status,
                    'created_at' => $order->created_at->addHours(rand(2, 48)),
                ]);
            }
        }
    }
}
