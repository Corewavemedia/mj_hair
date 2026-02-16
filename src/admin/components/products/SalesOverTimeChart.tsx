import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu } from 'lucide-react';
import type { Order } from '../../types/analytics';

interface SalesOverTimeChartProps {
    orders?: Order[];
}

export const SalesOverTimeChart: React.FC<SalesOverTimeChartProps> = ({ orders = [] }) => {
    const data = useMemo(() => {
        const today = new Date();
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            return {
                label: d.toLocaleString('default', { month: 'short' }),
                monthIndex: d.getMonth(),
                year: d.getFullYear()
            };
        });

        return last12Months.map(({ label, monthIndex, year }) => {
            let revenue = 0;
            let orderCount = 0;

            orders.forEach(order => {
                if (order.orderStatus === 'completed' || order.orderStatus === 'active') { // Assuming Active or Completed counts?
                    const d = new Date(order.createdAt);
                    if (d.getMonth() === monthIndex && d.getFullYear() === year) {
                        revenue += order.totalPrice;
                        orderCount += 1; // Count order itself, or use order.items.reduce for units? Use order count.
                    }
                }
            });

            return {
                month: label,
                revenue,
                orders: orderCount
            };
        });
    }, [orders]);

    return (
        <div className="bg-primary-background p-6 rounded-2xl shadow-sm h-full font-sans">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-text-primary">Sales Over time</h3>

                {/* Legend & Action */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span>
                        <span className="text-sm text-text-secondary font-medium">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                        <span className="text-sm text-text-secondary font-medium">Orders</span>
                    </div>
                    <button className="p-2 hover:bg-text-primary/10 hover:text-text-primary rounded-lg text-text-secondary">
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            tickFormatter={(value) => `£${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ strokeWidth: 2, stroke: '#E5E7EB' }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
