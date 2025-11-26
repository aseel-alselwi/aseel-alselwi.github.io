<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API V1 Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for version 1 of the Order Monitoring System.
| These routes are prefixed with /api/v1
|
*/

// Public routes (no authentication required)
Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('api.logout-all');
    Route::post('/refresh-token', [AuthController::class, 'refresh'])->name('api.refresh');
    Route::get('/profile', [AuthController::class, 'profile'])->name('api.profile');
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('api.profile.update');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->name('api.password.change');

    // Orders
    Route::get('/orders/statistics', [OrderController::class, 'statistics'])->name('api.orders.statistics');
    Route::get('/orders/sales-data', [OrderController::class, 'salesData'])->name('api.orders.sales-data');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('api.orders.status');
    Route::apiResource('orders', OrderController::class);

    // Customers
    Route::get('/customers/{customer}/orders', [CustomerController::class, 'orders'])->name('api.customers.orders');
    Route::apiResource('customers', CustomerController::class);
});
