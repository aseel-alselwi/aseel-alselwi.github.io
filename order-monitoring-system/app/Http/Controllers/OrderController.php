<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['customer', 'items']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by customer
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date,
                $request->end_date . ' 23:59:59',
            ]);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Sort
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'search', 'start_date', 'end_date']),
            'statuses' => Order::getStatuses(),
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(): Response
    {
        $customers = Customer::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Orders/Create', [
            'customers' => $customers,
            'paymentMethods' => ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(StoreOrderRequest $request): RedirectResponse
    {
        $this->orderService->createOrder(
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('orders.index')
            ->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load(['customer', 'items', 'payments', 'statusHistory.user']);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'shipping_cost' => $order->shipping_cost,
                'discount' => $order->discount,
                'total' => $order->total,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'shipping_address' => $order->shipping_address,
                'billing_address' => $order->billing_address,
                'notes' => $order->notes,
                'estimated_delivery' => $order->estimated_delivery?->format('M d, Y'),
                'delivered_at' => $order->delivered_at?->format('M d, Y H:i'),
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'customer' => [
                    'id' => $order->customer->id,
                    'name' => $order->customer->name,
                    'email' => $order->customer->email,
                    'phone' => $order->customer->phone,
                    'address' => $order->customer->address,
                    'city' => $order->customer->city,
                    'country' => $order->customer->country,
                ],
                'items' => $order->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_sku' => $item->product_sku,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                ]),
                'payments' => $order->payments->map(fn($payment) => [
                    'id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'amount' => $payment->amount,
                    'method' => $payment->method,
                    'status' => $payment->status,
                    'paid_at' => $payment->paid_at?->format('M d, Y H:i'),
                ]),
                'status_history' => $order->statusHistory->map(fn($history) => [
                    'id' => $history->id,
                    'from_status' => $history->from_status,
                    'to_status' => $history->to_status,
                    'notes' => $history->notes,
                    'changed_by' => $history->user?->name ?? 'System',
                    'created_at' => $history->created_at->format('M d, Y H:i'),
                ]),
            ],
            'statuses' => Order::getStatuses(),
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order): Response
    {
        $order->load(['customer', 'items']);
        $customers = Customer::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'customers' => $customers,
            'statuses' => Order::getStatuses(),
            'paymentMethods' => ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $this->orderService->updateOrder(
            $order,
            $request->validated(),
            $request->user()->id
        );

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:' . implode(',', Order::getStatuses()),
            'notes' => 'nullable|string|max:500',
        ]);

        $this->orderService->updateOrderStatus(
            $order,
            $request->status,
            $request->user()->id,
            $request->notes
        );

        return redirect()->back()
            ->with('success', 'Order status updated successfully.');
    }
}
