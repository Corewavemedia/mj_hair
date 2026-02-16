import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { SalesStats } from '../components/sales-report/SalesStats';
import { TotalRevenue } from '../components/sales-report/TotalRevenue';
import { SalesMap } from '../components/sales-report/SalesMap';
import { TopProducts } from '../components/sales-report/TopProducts';
// VisitorInsights currently static as we don't have visitor tracking
import { VisitorInsights } from '../components/sales-report/VisitorInsights';
import { useAnalyticsStore } from '../context/AnalyticsContext';

export const SalesReport: React.FC = () => {
    const {
        orders,
        totalRevenue,
        totalOrders,
        customers,
        topProducts,
        loading
    } = useAnalyticsStore();

    // Derived Stats
    // "Products Sold" - summing up quantity of items in completed orders
    const productsSold = orders
        .filter(o => o.orderStatus === 'completed')
        .reduce((acc, order) => {
            return acc + order.items.reduce((sum, item) => sum + item.quantity, 0);
        }, 0);

    // New Customers (Joined today) - simplified for "today" stats
    // In a real app we'd compare dates properly
    const today = new Date();
    const newCustomersCount = customers.filter(c => {
        const joined = new Date(c.joinedAt);
        return joined.getDate() === today.getDate() &&
            joined.getMonth() === today.getMonth() &&
            joined.getFullYear() === today.getFullYear();
    }).length;

    const activeCustomersCount = customers.filter(c => c.status === "Active").length;

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p>Loading Sales Report...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-4 pb-8">
                {/* Top Section (Header + Stats) */}
                <SalesStats
                    totalRevenue={totalRevenue}
                    totalOrders={totalOrders}
                    productsSold={productsSold}
                    newCustomers={newCustomersCount}
                    activeCustomers={activeCustomersCount}
                />

                {/* Charts Section 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    <div className="lg:col-span-6">
                        <TotalRevenue orders={orders} />
                    </div>
                    <div className="lg:col-span-4">
                        <SalesMap customers={customers} />
                    </div>
                </div>

                {/* Charts Section 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    <div className="lg:col-span-6">
                        <TopProducts topProducts={topProducts} />
                    </div>
                    <div className="lg:col-span-4">
                        <VisitorInsights customers={customers} orders={orders} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
