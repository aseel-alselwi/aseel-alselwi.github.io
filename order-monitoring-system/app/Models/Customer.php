<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'postal_code',
    ];

    /**
     * Get all orders for the customer.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the total revenue from this customer.
     */
    public function getTotalRevenueAttribute(): float
    {
        return $this->orders()
            ->where('payment_status', 'paid')
            ->sum('total');
    }

    /**
     * Get the order count for this customer.
     */
    public function getOrderCountAttribute(): int
    {
        return $this->orders()->count();
    }
}
