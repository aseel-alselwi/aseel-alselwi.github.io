<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '+1234567890',
                'address' => '123 Main Street',
                'city' => 'New York',
                'country' => 'USA',
                'postal_code' => '10001',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '+1234567891',
                'address' => '456 Oak Avenue',
                'city' => 'Los Angeles',
                'country' => 'USA',
                'postal_code' => '90001',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob.johnson@example.com',
                'phone' => '+1234567892',
                'address' => '789 Pine Road',
                'city' => 'Chicago',
                'country' => 'USA',
                'postal_code' => '60601',
            ],
            [
                'name' => 'Alice Williams',
                'email' => 'alice.williams@example.com',
                'phone' => '+1234567893',
                'address' => '321 Elm Street',
                'city' => 'Houston',
                'country' => 'USA',
                'postal_code' => '77001',
            ],
            [
                'name' => 'Charlie Brown',
                'email' => 'charlie.brown@example.com',
                'phone' => '+1234567894',
                'address' => '654 Maple Drive',
                'city' => 'Phoenix',
                'country' => 'USA',
                'postal_code' => '85001',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
