import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    trend: string;
    icon: LucideIcon;
    iconColorClass: string;
    backgroundColorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    trend,
    icon: Icon,
    iconColorClass,
    backgroundColorClass
}) => {
    return (
        <div className={`${backgroundColorClass} p-4 rounded-3xl flex flex-col justify-between h-[180px] w-[160px]`}>
            <div className={`w-12 h-12 rounded-full ${iconColorClass} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
            </div>

            <div className="mt-4">
                <h3 className="text-2xl font-bold text-[#151D48] mb-1">{value}</h3>
                <p className="text-base text-[#425166] font-medium mb-2">{title}</p>
                <p className="text-[12px] font-semibold text-[#4079ED]">{trend}</p>
            </div>
        </div>
    );
};
