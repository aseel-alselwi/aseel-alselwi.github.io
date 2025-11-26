import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Customer, Order, PageProps } from '@/types';
import StatusBadge from '@/Components/StatusBadge';

interface CustomerShowProps extends PageProps {
    customer: Customer & {
        order_count: number;
        total_revenue: number;
        recent_orders: Order[];
    };
}

export default function Show({ customer }: CustomerShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Customer: {customer.name}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('customers.edit', customer.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                        >
                            Edit
                        </Link>
                        <Link
                            href={route('customers.index')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Customer: ${customer.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{customer.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{customer.email}</p>
                                    </div>
                                    {customer.phone && (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{customer.phone}</p>
                                        </div>
                                    )}
                                    {customer.address && (
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium">
                                                {customer.address}
                                                {customer.city && `, ${customer.city}`}
                                                {customer.country && `, ${customer.country}`}
                                                {customer.postal_code && ` ${customer.postal_code}`}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500">Customer Since</p>
                                        <p className="font-medium">{customer.created_at}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                                        <p className="text-3xl font-bold text-indigo-600">{customer.order_count}</p>
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <p className="text-xl font-bold text-green-600">{formatCurrency(customer.total_revenue)}</p>
                                        <p className="text-sm text-gray-600">Total Revenue</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                    <Link
                                        href={route('orders.index', { customer_id: customer.id })}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                    >
                                        View All Orders →
                                    </Link>
                                </div>
                                
                                {customer.recent_orders && customer.recent_orders.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {customer.recent_orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {order.order_number}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <StatusBadge status={order.status} type="order" />
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                            {formatCurrency(order.total)}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {order.created_at}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Link
                                                                href={route('orders.show', order.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No orders yet for this customer.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
