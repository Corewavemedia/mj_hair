import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Order, Product, AnalyticsState } from "../types/analytics";
import {
    calculateOrderCounts,
    calculateTotalRevenue,
    calculateWeeklyRevenue,
    calculateCategoryBreakdown,
    calculateProductStats,
    calculateTopCategories,
    processCustomers
} from "../utils/analytics";

const AnalyticsContext = createContext<AnalyticsState | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Using new getOrders query to fetch all orders with customer details
    const orders = useQuery(api.orders.getOrders) || [];
    const products = useQuery(api.products.getProducts) || [];
    const visitorCount = useQuery(api.visitors.getVisitorCount) || 0;

    const analytics = useMemo(() => {
        const isLoading = orders === undefined || products === undefined;

        if (isLoading) {
            return {
                orders: [],
                products: [],
                loading: true,
                totalRevenue: 0,
                totalSales: 0,
                totalOrders: 0,
                totalVisitors: 0,
                newOrders: 0,
                completedOrders: 0,
                cancelledOrders: 0,
                weeklyRevenue: [],
                recentTransactions: [],
                categoryBreakdown: {},
                bestSellingProduct: null,
                topProducts: [],
                topCategories: [],
                customers: [],
            };
        }

        const safeOrders = (orders as Order[]);
        const safeProducts = (products as Product[]);

        const validCompletedOrders = safeOrders.filter(o => o.orderStatus === "completed");

        // Basic Stats
        const orderCounts = calculateOrderCounts(safeOrders);
        const totalRevenue = calculateTotalRevenue(safeOrders);
        const totalSales = safeOrders.length; // Keeping logic as per original file (count of all orders)

        // Weekly Report
        const weeklyRevenue = calculateWeeklyRevenue(safeOrders);

        // Recent Transactions
        const recentTransactions = safeOrders.slice(0, 5);

        // Category Breakdown (using completed orders as per original logic)
        const categoryBreakdown = calculateCategoryBreakdown(validCompletedOrders, safeProducts);

        // Product Stats (Top Products/Best Selling)
        // Using validCompletedOrders as suggested by comments in original file
        const { bestSellingProduct, topProducts } = calculateProductStats(validCompletedOrders, safeProducts);

        // Top Categories
        // Using validCompletedOrders as suggested by comments in original file
        const topCategories = calculateTopCategories(validCompletedOrders, safeProducts);

        // Customers
        const customers = processCustomers(safeOrders);

        return {
            orders: safeOrders,
            loading: false,
            totalRevenue,
            totalSales,
            totalVisitors: visitorCount,
            ...orderCounts,
            weeklyRevenue,
            recentTransactions,
            categoryBreakdown,
            bestSellingProduct,
            topProducts,
            topCategories,
            products: safeProducts,
            customers,
        };

    }, [orders, products]);

    return (
        <AnalyticsContext.Provider value={analytics}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalyticsStore = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error("useAnalyticsStore must be used within an AnalyticsProvider");
    }
    return context;
};
