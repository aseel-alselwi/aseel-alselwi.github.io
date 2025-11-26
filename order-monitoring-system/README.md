# Order Monitoring System

A comprehensive order monitoring system built with Laravel, Inertia.js, React, and TailwindCSS. This system provides a web dashboard for admins and a REST API for mobile applications.

## 🧩 Tech Stack

- **Backend**: Laravel 12
- **Frontend (Web Admin)**: Laravel + Inertia.js + React + TailwindCSS
- **Mobile App**: REST API for Android/iOS
- **State Management**: React Query (recommended) or Zustand
- **Database**: MySQL/SQLite
- **Authentication**:
  - Web Dashboard: Laravel Breeze (Inertia + React)
  - Mobile App: Laravel Sanctum
- **Real-time Updates**: Laravel Echo + Pusher (configurable)
- **Charts**: Recharts

## 📋 Features

### 1. Order Management (Web + API)
- List all orders (paginated)
- Filtering by status, customer, date range, payment method
- Search by order ID, customer name
- Order creation/update
- Real-time updates for new orders or status changes

### 2. Order Details Page
- Customer profile
- Items list
- Payment info
- Order timeline (status history)
- Notes / admin remarks

### 3. Dashboard Overview (Web Only)
- KPIs: total orders, revenue, status counts
- Recent orders table
- Charts: sales (daily/weekly/monthly), orders by status

### 4. Customer Management
- List all customers
- Customer details with order history
- Create/update customer profiles

## 🏗️ Project Architecture

```
order-monitoring-system/
├── app/
│   ├── Events/                    # Broadcasting events
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/V1/           # API controllers (versioned)
│   │   │   ├── CustomerController.php
│   │   │   ├── DashboardController.php
│   │   │   └── OrderController.php
│   │   ├── Requests/             # Form request validation
│   │   └── Resources/            # API resources
│   ├── Models/                   # Eloquent models
│   └── Services/                 # Business logic layer
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Data seeders
├── resources/
│   └── js/
│       ├── Components/           # Reusable React components
│       ├── Layouts/              # Layout components
│       ├── Pages/                # Inertia pages
│       │   ├── Auth/
│       │   ├── Customers/
│       │   ├── Orders/
│       │   └── Profile/
│       └── types/                # TypeScript definitions
└── routes/
    ├── api/v1.php               # API v1 routes
    ├── auth.php                 # Authentication routes
    └── web.php                  # Web routes
```

## 📊 Database Schema

### Tables

#### customers
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Customer name |
| email | string | Unique email |
| phone | string | Phone number |
| address | text | Street address |
| city | string | City |
| country | string | Country |
| postal_code | string | Postal/ZIP code |

#### orders
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| order_number | string | Unique order identifier |
| customer_id | bigint | Foreign key to customers |
| status | enum | pending, processing, shipped, delivered, cancelled, refunded |
| subtotal | decimal | Order subtotal |
| tax | decimal | Tax amount |
| shipping_cost | decimal | Shipping cost |
| discount | decimal | Discount amount |
| total | decimal | Total amount |
| payment_method | enum | credit_card, debit_card, paypal, bank_transfer, cash_on_delivery |
| payment_status | enum | pending, paid, failed, refunded |

#### order_items
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| order_id | bigint | Foreign key to orders |
| product_name | string | Product name |
| product_sku | string | Product SKU |
| quantity | integer | Quantity ordered |
| unit_price | decimal | Price per unit |
| total_price | decimal | Line total |

#### payments
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| order_id | bigint | Foreign key to orders |
| transaction_id | string | Payment gateway transaction ID |
| amount | decimal | Payment amount |
| method | enum | Payment method |
| status | enum | pending, completed, failed, refunded |

## 🚀 Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL or SQLite

### Setup Steps

1. **Navigate to the project directory**
```bash
cd order-monitoring-system
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node.js dependencies**
```bash
npm install
```

4. **Environment configuration**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure database in `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=order_monitoring
DB_USERNAME=root
DB_PASSWORD=
```

6. **Run migrations and seeders**
```bash
php artisan migrate --seed
```

7. **Build assets**
```bash
npm run build
```

8. **Start the development server**
```bash
php artisan serve
```

### Default Admin Credentials
- Email: `admin@example.com`
- Password: `password`

## 📡 API Documentation

### Authentication

All API endpoints (except login) require authentication via Bearer token.

#### Login
```http
POST /api/v1/login
Content-Type: application/json

{
    "email": "admin@example.com",
    "password": "password",
    "device_name": "mobile_app"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com"
        },
        "token": "1|abc123...",
        "token_type": "Bearer"
    }
}
```

### Orders

#### List Orders
```http
GET /api/v1/orders
Authorization: Bearer {token}

Query Parameters:
- status: pending|processing|shipped|delivered|cancelled|refunded
- payment_status: pending|paid|failed|refunded
- customer_id: integer
- search: string (order number or customer name)
- start_date: YYYY-MM-DD
- end_date: YYYY-MM-DD
- page: integer
- per_page: integer (max 100)
```

#### Get Order
```http
GET /api/v1/orders/{id}
Authorization: Bearer {token}
```

#### Create Order
```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
    "customer_id": 1,
    "payment_method": "credit_card",
    "shipping_address": "123 Main St, City, Country",
    "items": [
        {
            "product_name": "Product 1",
            "product_sku": "SKU-001",
            "quantity": 2,
            "unit_price": 29.99
        }
    ]
}
```

#### Update Order Status
```http
PATCH /api/v1/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "processing",
    "notes": "Order is being prepared"
}
```

### Customers

#### List Customers
```http
GET /api/v1/customers
Authorization: Bearer {token}
```

#### Get Customer
```http
GET /api/v1/customers/{id}
Authorization: Bearer {token}
```

## 🔔 Real-time Updates

The system broadcasts events when orders are created or status changes:

### Events
- `order.created` - New order created
- `order.status.updated` - Order status changed

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
