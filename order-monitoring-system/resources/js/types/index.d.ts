export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    orders_count?: number;
    order_count?: number;
    total_revenue?: number;
    created_at: string;
    recent_orders?: Order[];
}

export interface OrderItem {
    id: number;
    product_name: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    notes?: string;
}

export interface Payment {
    id: number;
    transaction_id?: string;
    amount: number;
    method: string;
    status: string;
    paid_at?: string;
}

export interface StatusHistoryEntry {
    id: number;
    from_status?: string;
    to_status: string;
    notes?: string;
    changed_by: string;
    created_at: string;
}

export interface Order {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    discount: number;
    total: number;
    payment_method?: string;
    payment_status: string;
    shipping_address?: string;
    billing_address?: string;
    notes?: string;
    estimated_delivery?: string;
    delivered_at?: string;
    created_at: string;
    customer?: Customer;
    customer_name?: string;
    items?: OrderItem[];
    payments?: Payment[];
    status_history?: StatusHistoryEntry[];
}

export interface DashboardStats {
    total_orders: number;
    orders_today: number;
    orders_this_month: number;
    total_revenue: number;
    revenue_today: number;
    revenue_this_month: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    status_counts: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        refunded: number;
    };
}

export interface SalesDataPoint {
    date: string;
    revenue: number;
    count: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev?: string;
        next?: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
