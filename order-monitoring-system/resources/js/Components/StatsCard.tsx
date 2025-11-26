import { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon?: ReactNode | string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
    const getTrendColor = () => {
        switch (trend) {
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="text-3xl">{icon}</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                            </dd>
                            {subtitle && (
                                <dd className={`text-sm ${getTrendColor()}`}>
                                    {subtitle}
                                </dd>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
