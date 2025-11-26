interface StatusBadgeProps {
    status: string;
    type?: 'order' | 'payment';
}

const ORDER_STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
};

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
    const styles = type === 'payment' ? PAYMENT_STATUS_STYLES : ORDER_STATUS_STYLES;
    const statusStyle = styles[status] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle}`}>
            {status}
        </span>
    );
}
