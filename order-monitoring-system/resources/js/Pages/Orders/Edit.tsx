import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Customer, Order, PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface OrderEditProps extends PageProps {
    order: Order;
    customers: Customer[];
    statuses: string[];
    paymentMethods: string[];
}

export default function Edit({ order, customers, statuses, paymentMethods }: OrderEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        status: order.status,
        payment_method: order.payment_method || '',
        payment_status: order.payment_status,
        shipping_address: order.shipping_address || '',
        billing_address: order.billing_address || '',
        notes: order.notes || '',
        estimated_delivery: order.estimated_delivery ? order.estimated_delivery.split('T')[0] : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('orders.update', order.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Order {order.order_number}
                    </h2>
                    <Link
                        href={route('orders.show', order.id)}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Order
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Order ${order.order_number}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Order Status */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <InputLabel htmlFor="status" value="Order Status" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="payment_status" value="Payment Status" />
                                    <select
                                        id="payment_status"
                                        value={data.payment_status}
                                        onChange={(e) => setData('payment_status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                    <InputError message={errors.payment_status} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="payment_method" value="Payment Method" />
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Select payment method</option>
                                        {paymentMethods.map((method) => (
                                            <option key={method} value={method}>
                                                {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.payment_method} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Notes */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Notes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="shipping_address" value="Shipping Address" />
                                    <textarea
                                        id="shipping_address"
                                        value={data.shipping_address}
                                        onChange={(e) => setData('shipping_address', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.shipping_address} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="billing_address" value="Billing Address" />
                                    <textarea
                                        id="billing_address"
                                        value={data.billing_address}
                                        onChange={(e) => setData('billing_address', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.billing_address} className="mt-2" />
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="estimated_delivery" value="Estimated Delivery" />
                                    <TextInput
                                        id="estimated_delivery"
                                        type="date"
                                        value={data.estimated_delivery}
                                        onChange={(e) => setData('estimated_delivery', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.estimated_delivery} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="notes" value="Notes" />
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('orders.show', order.id)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
