import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Customer, Order } from '../../types/analytics';

interface VisitorInsightsProps {
    customers?: Customer[];
    orders?: Order[];
}

export const VisitorInsights: React.FC<VisitorInsightsProps> = ({ customers = [], orders = [] }) => {
    const data = useMemo(() => {
        const today = new Date();
        const last12Months = Array.from({ length: 12 }, (_, i) => {
            // Month index logic: Current month is index 11 (last element)
            const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            return {
                date: d,
                label: d.toLocaleString('default', { month: 'short' }),
                monthIndex: d.getMonth(),
                year: d.getFullYear()
            };
        });

        return last12Months.map(({ label, monthIndex, year }) => {
            // Unique (New) Customers: Joined in this specific month/year
            const unique = customers.filter(c => {
                const joined = new Date(c.joinedAt);
                return joined.getMonth() === monthIndex && joined.getFullYear() === year;
            }).length;

            // Loyal Customers: Unique customers with >1 order total who placed ANY order in this specific month
            const activeLoyalCustomers = new Set<string>();
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                if (orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year) {
                    // Start by identifying the customer
                    const customer = customers.find(c =>
                        // fallback matching if no ID strictly linked (assumed logic from context)
                        c.email === order.customer.email || c.name === order.customer.name
                    );

                    if (customer && customer.totalOrders > 1) {
                        activeLoyalCustomers.add(customer.id);
                    }
                }
            });

            return {
                month: label,
                loyal: activeLoyalCustomers.size,
                unique: unique,
            };
        });
    }, [customers, orders]);

    return (
        <div className="bg-primary-background p-8 rounded-[30px] h-full font-sans">
            <h3 className="text-xl font-bold text-text-primary mb-6">Visitor Insights</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="loyal" name="Loyal Customers" stroke="#A700FF" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="unique" name="Unique Customers" stroke="#3CD856" strokeWidth={3} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
