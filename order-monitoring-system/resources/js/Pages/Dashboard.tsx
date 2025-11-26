import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DashboardStats, Order, SalesDataPoint, PageProps } from '@/types';
import StatsCard from '@/Components/StatsCard';
import SalesChart from '@/Components/SalesChart';
import OrderStatusChart from '@/Components/OrderStatusChart';
import RecentOrdersTable from '@/Components/RecentOrdersTable';

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    salesData: SalesDataPoint[];
    recentOrders: Order[];
}

export default function Dashboard({ stats, salesData, recentOrders }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Orders"
                            value={stats.total_orders.toString()}
                            subtitle={`${stats.orders_today} today`}
                            icon="📦"
                            trend="up"
                        />
                        <StatsCard
                            title="Total Revenue"
                            value={formatCurrency(stats.total_revenue)}
                            subtitle={`${formatCurrency(stats.revenue_today)} today`}
                            icon="💰"
                            trend="up"
                        />
                        <StatsCard
                            title="Pending Orders"
                            value={stats.pending_orders.toString()}
                            subtitle="Awaiting processing"
                            icon="⏳"
                            trend="neutral"
                        />
                        <StatsCard
                            title="Delivered Orders"
                            value={stats.delivered_orders.toString()}
                            subtitle="Successfully completed"
                            icon="✅"
                            trend="up"
                        />
                    </div>

                    {/* Charts */}
                    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                                <SalesChart data={salesData} />
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
                                <OrderStatusChart statusCounts={stats.status_counts} />
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="mt-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                                <RecentOrdersTable orders={recentOrders} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
