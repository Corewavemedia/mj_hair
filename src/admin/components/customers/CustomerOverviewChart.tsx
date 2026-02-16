import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import type { Customer } from '../../types/analytics';

interface CustomerOverviewChartProps {
    customers?: Customer[];
}

// Custom Tooltip Component (Active point)
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-text-primary/15 text-text-primary text-xs font-bold py-2 px-3 rounded-lg shadow-sm mb-1 text-center min-w-[100px]">
                <p className="font-semibold">{label}</p>
                <p className="text-lg">{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export const CustomerOverviewChart: React.FC<CustomerOverviewChartProps> = ({ customers = [] }) => {
    const { chartData, stats } = useMemo(() => {
        // Calculate Stats
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'Active').length;
        const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;

        const conversionRate = totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) + '%' : '0%';

        const statsData = [
            { label: 'Active Customers', value: activeCustomers.toLocaleString(), active: true },
            { label: 'Repeat Customers', value: repeatCustomers.toLocaleString(), active: false },
            { label: 'Total Customers', value: totalCustomers.toLocaleString(), active: false },
            { label: 'Active Rate', value: conversionRate, active: false },
        ];

        // Calculate Chart Data (New Customers Last 7 Days)
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - (6 - i)); // 6 days ago to today
            return d;
        });

        const data = last7Days.map(date => {
            const dayName = days[date.getDay()];
            const count = customers.filter(c => {
                const joined = new Date(c.joinedAt);
                return joined.toDateString() === date.toDateString();
            }).length;
            return { name: dayName, value: count, fullDate: date.toLocaleDateString() };
        });

        return { chartData: data, stats: statsData };
    }, [customers]);

    return (
        <div className="h-full flex flex-col font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-text-primary">Customer Overview</h2>
            </div>

            {/* Stats Row */}
            <div className="flex items-start gap-8 md:gap-16 mb-8 pb-0 overflow-x-auto">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="pb-4 min-w-[100px] cursor-pointer transition-all relative text-text-primary"
                    >
                        <p className="text-3xl font-bold mb-1">{stat.value}</p>
                        <p className="text-sm font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 0,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValueGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#dcfce7" stopOpacity={0.8} /> {/* Green-100 */}
                                <stop offset="95%" stopColor="#dcfce7" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            allowDecimals={false}
                        // Removing domain/ticks to let it auto-scale based on real data which might be small
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#1a502eff', strokeWidth: 2, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#519C66" // Darker green line
                            strokeWidth={3}
                            fill="url(#colorValueGreen)"
                            activeDot={{ r: 6, fill: 'white', stroke: '#519C66', strokeWidth: 3 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
