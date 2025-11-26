import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Customer, PageProps } from '@/types';
import { FormEventHandler, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface OrderCreateProps extends PageProps {
    customers: Customer[];
    paymentMethods: string[];
}

interface OrderItem {
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
}

export default function Create({ customers, paymentMethods }: OrderCreateProps) {
    const [items, setItems] = useState<OrderItem[]>([
        { product_name: '', product_sku: '', quantity: 1, unit_price: 0 }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        payment_method: '',
        shipping_address: '',
        billing_address: '',
        notes: '',
        estimated_delivery: '',
        items: items,
    });

    const addItem = () => {
        const newItems = [...items, { product_name: '', product_sku: '', quantity: 1, unit_price: 0 }];
        setItems(newItems);
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
            setData('items', newItems);
        }
    };

    const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
        setData('items', newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Order
                    </h2>
                    <Link
                        href={route('orders.index')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Orders
                    </Link>
                </div>
            }
        >
            <Head title="Create Order" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Customer Selection */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="customer_id" value="Customer *" />
                                    <select
                                        id="customer_id"
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select a customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} ({customer.email})
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.customer_id} className="mt-2" />
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

                        {/* Order Items */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    + Add Item
                                </button>
                            </div>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                            <div className="md:col-span-2">
                                                <InputLabel htmlFor={`product_name_${index}`} value="Product Name *" />
                                                <TextInput
                                                    id={`product_name_${index}`}
                                                    value={item.product_name}
                                                    onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor={`product_sku_${index}`} value="SKU" />
                                                <TextInput
                                                    id={`product_sku_${index}`}
                                                    value={item.product_sku}
                                                    onChange={(e) => updateItem(index, 'product_sku', e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor={`quantity_${index}`} value="Qty *" />
                                                <TextInput
                                                    id={`quantity_${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor={`unit_price_${index}`} value="Price *" />
                                                <TextInput
                                                    id={`unit_price_${index}`}
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={item.unit_price}
                                                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Line Total: ${(item.quantity * item.unit_price).toFixed(2)}
                                            </span>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-600 hover:text-red-900 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                                <span className="text-lg font-semibold">
                                    Subtotal: ${calculateSubtotal().toFixed(2)}
                                </span>
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
                        <div className="flex justify-end">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Creating...' : 'Create Order'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
