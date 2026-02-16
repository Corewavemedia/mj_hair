import React from 'react';
import { BarChart2, FileText, Tag, UserPlus, Upload } from 'lucide-react';
import { StatCard } from './StatCard';

interface SalesStatsProps {
    totalRevenue: number;
    totalOrders: number;
    productsSold: number;
    newCustomers: number; // Today or whatever period
    activeCustomers: number;
}

export const SalesStats: React.FC<SalesStatsProps> = ({
    totalRevenue,
    totalOrders,
    productsSold,
    newCustomers,
    activeCustomers
}) => {
    const stats = [
        {
            title: "Total Revenue",
            value: `£${totalRevenue.toLocaleString()}`,
            trend: "+0% from yesterday",
            icon: BarChart2,
            iconColorClass: "bg-[#FA5A7D]",
            backgroundColorClass: "bg-[#FFE2E5]"
        },
        {
            title: "Total Orders",
            value: totalOrders.toString(),
            trend: "+0% from yesterday",
            icon: FileText,
            iconColorClass: "bg-[#FF947A]",
            backgroundColorClass: "bg-[#FFF4DE]"
        },
        {
            title: "Products Sold",
            value: productsSold.toString(),
            trend: "+0% from yesterday",
            icon: Tag,
            iconColorClass: "bg-[#3CD856]",
            backgroundColorClass: "bg-[#DCFCE7]"
        },
        {
            title: "New Customers",
            value: newCustomers.toString(),
            trend: "0% from yesterday",
            icon: UserPlus,
            iconColorClass: "bg-[#BF83FF]",
            backgroundColorClass: "bg-[#F3E8FF]"
        },
        {
            title: "Active Customers", // Was "Visitors"
            value: activeCustomers.toString(),
            trend: "0% from yesterday",
            icon: UserPlus,
            iconColorClass: "bg-[#BF83FF]",
            backgroundColorClass: "bg-[#F3E8FF]"
        }
    ];

    return (
        <div className="bg-primary-background p-8 rounded-[30px] font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#151D48]">Today's Sales</h2>
                    <p className="text-[#737791] text-sm mt-1">Sales Summary</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-background text-[#0F3659] dark:text-text-primary rounded-xl hover:bg-secondary-background transition-colors text-sm font-medium">
                    <Upload size={16} />
                    <span>Export</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        trend={stat.trend}
                        icon={stat.icon}
                        iconColorClass={stat.iconColorClass}
                        backgroundColorClass={stat.backgroundColorClass}
                    />
                ))}
            </div>
        </div>
    );
};
