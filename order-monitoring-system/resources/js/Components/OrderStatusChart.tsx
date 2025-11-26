import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrderStatusChartProps {
    statusCounts: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        refunded: number;
    };
}

const COLORS = {
    pending: '#FCD34D',
    processing: '#60A5FA',
    shipped: '#A78BFA',
    delivered: '#34D399',
    cancelled: '#F87171',
    refunded: '#9CA3AF',
};

const STATUS_LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
};

export default function OrderStatusChart({ statusCounts }: OrderStatusChartProps) {
    const data = Object.entries(statusCounts)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
            name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
            value,
            color: COLORS[key as keyof typeof COLORS],
        }));

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No order data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
