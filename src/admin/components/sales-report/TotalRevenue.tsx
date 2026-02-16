import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Order } from '../../types/analytics';

interface TotalRevenueProps {
    orders: Order[];
}

export const TotalRevenue: React.FC<TotalRevenueProps> = ({ orders }) => {
    const revenueData = useMemo(() => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const data = days.map(day => ({ day, revenue: 0 }));

        orders.forEach(order => {
            if (order.orderStatus === 'completed') {
                const date = new Date(order.createdAt);
                // getDay() returns 0 for Sunday, 1 for Monday...
                // We want to map it to our array where Monday is index 0
                let dayIndex = date.getDay() - 1;
                if (dayIndex < 0) dayIndex = 6; // Sunday

                // Assuming all orders are 'Online' for now
                data[dayIndex].revenue += order.totalPrice;
            }
        });
        return data;
    }, [orders]);

    return (
        <div className="bg-primary-background p-8 rounded-[30px] h-full font-sans">
            <h3 className="text-xl font-bold text-text-primary mb-6">Total Revenue</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} barSize={12} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="revenue" name="Total Revenue" fill="#0095FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
