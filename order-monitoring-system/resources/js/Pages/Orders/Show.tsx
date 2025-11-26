import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Order, PageProps } from '@/types';
import StatusBadge from '@/Components/StatusBadge';
import { useState } from 'react';

interface OrderShowProps extends PageProps {
    order: Order;
    statuses: string[];
}

export default function Show({ order, statuses }: OrderShowProps) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);
    const [statusNotes, setStatusNotes] = useState('');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleStatusUpdate = () => {
        router.patch(route('orders.update-status', order.id), {
            status: newStatus,
            notes: statusNotes,
        }, {
            onSuccess: () => {
                setShowStatusModal(false);
                setStatusNotes('');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order {order.order_number}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowStatusModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700"
                        >
                            Update Status
                        </button>
                        <Link
                            href={route('orders.edit', order.id)}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                        >
                            Edit Order
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Details */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order Number</p>
                                        <p className="font-medium">{order.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <StatusBadge status={order.status} type="order" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Status</p>
                                        <StatusBadge status={order.payment_status} type="payment" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium capitalize">{order.payment_method?.replace('_', ' ') || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Created At</p>
                                        <p className="font-medium">{order.created_at}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Est. Delivery</p>
                                        <p className="font-medium">{order.estimated_delivery || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {order.items?.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{item.product_sku || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 text-center">{item.quantity}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 text-right">{formatCurrency(item.unit_price)}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Subtotal</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(order.subtotal)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Tax</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(order.tax)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Shipping</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(order.shipping_cost)}</td>
                                        </tr>
                                        {order.discount > 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Discount</td>
                                                <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">-{formatCurrency(order.discount)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-900 text-right">Total</td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(order.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Status History */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {order.status_history?.map((history, idx) => (
                                            <li key={history.id}>
                                                <div className="relative pb-8">
                                                    {idx !== (order.status_history?.length ?? 0) - 1 && (
                                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                    )}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                                                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                            <div>
                                                                <p className="text-sm text-gray-500">
                                                                    {history.from_status ? (
                                                                        <>
                                                                            Status changed from <span className="font-medium capitalize">{history.from_status}</span> to{' '}
                                                                        </>
                                                                    ) : (
                                                                        'Order created with status '
                                                                    )}
                                                                    <span className="font-medium capitalize">{history.to_status}</span>
                                                                    {history.notes && (
                                                                        <span className="block text-gray-400 text-xs mt-1">{history.notes}</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                                <p>{history.created_at}</p>
                                                                <p className="text-xs">{history.changed_by}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium">{order.customer?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{order.customer?.email}</p>
                                    </div>
                                    {order.customer?.phone && (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{order.customer.phone}</p>
                                        </div>
                                    )}
                                    <Link
                                        href={route('customers.show', order.customer?.id)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                                    >
                                        View Customer Profile →
                                    </Link>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {order.shipping_address || 'No shipping address provided'}
                                </p>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                                    <p className="text-sm text-gray-700">{order.notes}</p>
                                </div>
                            )}

                            {/* Payments */}
                            {order.payments && order.payments.length > 0 && (
                                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments</h3>
                                    <div className="space-y-3">
                                        {order.payments.map((payment) => (
                                            <div key={payment.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-medium">{formatCurrency(payment.amount)}</span>
                                                    <StatusBadge status={payment.status} type="payment" />
                                                </div>
                                                <p className="text-xs text-gray-500 capitalize">{payment.method.replace('_', ' ')}</p>
                                                {payment.transaction_id && (
                                                    <p className="text-xs text-gray-400">ID: {payment.transaction_id}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowStatusModal(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s} className="capitalize">
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                                    <textarea
                                        value={statusNotes}
                                        onChange={(e) => setStatusNotes(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Add notes about this status change..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
