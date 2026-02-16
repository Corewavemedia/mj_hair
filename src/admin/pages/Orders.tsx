import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StatsCard } from '../components/orders/statcard';
import { OrderList } from '../components/orders/OrderList';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '../context/AnalyticsContext';

export const Orders: React.FC = () => {
    const {
        orders,
        totalOrders,
        newOrders,
        completedOrders,
        cancelledOrders,
        loading
    } = useAnalyticsStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="p-8 text-center">Loading Orders...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
            >
                {/* Header Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div variants={itemVariants}>
                        <StatsCard
                            title="Total Order"
                            value={totalOrders.toString()}
                            isPositive={true}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatsCard
                            title="New Order"
                            value={newOrders.toString()}
                            isPositive={true}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatsCard
                            title="Completed Order"
                            value={completedOrders.toString()}
                            isPositive={true}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatsCard
                            title="Canceled Order"
                            value={cancelledOrders.toString()}
                            isPositive={false}
                        />
                    </motion.div>
                </div>

                {/* Main Content */}
                <OrderList orders={orders} />
            </motion.div>
        </MainLayout>
    );
};

