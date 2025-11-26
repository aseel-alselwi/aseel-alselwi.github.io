<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $stats = $this->orderService->getDashboardStats();
        $salesData = $this->orderService->getSalesData('daily');
        
        $recentOrders = Order::with('customer')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->customer->name,
                    'status' => $order->status,
                    'total' => $order->total,
                    'payment_status' => $order->payment_status,
                    'created_at' => $order->created_at->format('M d, Y H:i'),
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
        ]);
    }
}
