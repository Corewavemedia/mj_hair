import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { SalesOverTimeChart } from '../components/products/SalesOverTimeChart';
import { TopProductList } from '../components/products/TopProductList';
import { TopCategoryList } from '../components/products/TopCategoryList';
import { ProductTable } from '../components/products/ProductTable';
import { useAnalyticsStore } from '../context/AnalyticsContext';

export const Products: React.FC = () => {
    const { orders, loading } = useAnalyticsStore();

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <p>Loading Products...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-6 pb-8 h-full">
                {/* Top Statistics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-16 gap-2 h-auto">
                    {/* Sales Chart - Spans 5 cols */}
                    <div className="lg:col-span-8 h-full">
                        <SalesOverTimeChart orders={orders} />
                    </div>

                    {/* Top Products - Spans 4 cols */}
                    <div className="lg:col-span-4 h-full">
                        <TopProductList />
                    </div>

                    {/* Top Categories - Spans 3 cols */}
                    <div className="lg:col-span-4 h-full">
                        <TopCategoryList />
                    </div>
                </div>

                {/* Product Data Table */}
                <ProductTable />
            </div>
        </MainLayout>
    );
};
