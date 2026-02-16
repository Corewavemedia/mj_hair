import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: string;
    isPositive?: boolean;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    trend,
    isPositive,
    className = ''
}) => {
    return (
        <div className={`h-full bg-primary-background p-4 rounded-xl shadow-sm ${className}`}>
            <div className="mb-1">
                <h3 className="font-bold text-text-primary text-lg font-sans">{title}</h3>
            </div>
            <p className="text-text-secondary text-xs mb-6 font-sans">Last 7 days</p>
            <div className="mb-2">
                <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-4xl font-bold text-text-primary font-sans tracking-tight">{value}</h3>
                    {title === 'Total Sales' && <span className="text-sm text-text-primary font-medium">Orders</span>}
                    {trend && (
                        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '↑' : '↓'} {trend}
                        </span>
                    )}
                </div>
                <p className="text-xs text-text-secondary font-sans">last 7 days</p>
            </div>
        </div>
    );
};