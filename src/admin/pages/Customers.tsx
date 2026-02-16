import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StatsCard } from '../components/orders/statcard';
import { CustomerOverviewChart } from '../components/customers/CustomerOverviewChart';
import { CustomerList } from '../components/customers/CustomerList';
import { useAnalyticsStore } from '../context/AnalyticsContext';

export const Customers: React.FC = () => {
    const { customers, loading } = useAnalyticsStore();

    // Derived Stats
    const totalCustomers = customers.length;
    // New Customers (e.g. joined in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomersCount = customers.filter(c => c.joinedAt >= thirtyDaysAgo.getTime()).length;

    // Active Customers (Status = "Active")
    const activeCustomersCount = customers.filter(c => c.status === "Active").length;
    const activeRate = totalCustomers > 0 ? ((activeCustomersCount / totalCustomers) * 100).toFixed(1) + '%' : '0%';

    // New Customers Rate (vs Total)
    const newCustomerRate = totalCustomers > 0 ? ((newCustomersCount / totalCustomers) * 100).toFixed(1) + '%' : '0%';

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p>Loading Customers...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col space-y-6 pb-6 w-full">
                {/* Header Section */}
                <div className="flex-shrink-0 font-sans">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Stats Column */}
                        <div className="flex flex-col gap-6 xl:col-span-1">
                            <StatsCard
                                title="Total Customers"
                                value={totalCustomers.toLocaleString()}
                                trend="+0%"
                                isPositive={true}
                                className="shadow-sm bg-primary-background"
                            />
                            <StatsCard
                                title="New Customers"
                                value={newCustomersCount.toLocaleString()}
                                trend={newCustomerRate}
                                isPositive={true}
                                className="shadow-sm bg-primary-background"
                            />
                            <StatsCard
                                title="Active Customers"
                                value={activeCustomersCount.toLocaleString()}
                                trend={activeRate}
                                isPositive={true}
                                className="shadow-sm bg-primary-background"
                            />
                        </div>

                        {/* Chart Column */}
                        <div className="xl:col-span-2 bg-primary-background rounded-2xl shadow-sm p-6 h-full">
                            <CustomerOverviewChart customers={customers} />
                        </div>
                    </div>
                </div>

                {/* Main Content (Split View) */}
                <CustomerList customers={customers} />
            </div>
        </MainLayout>
    );
};
