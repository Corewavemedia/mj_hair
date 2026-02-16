import React from 'react';
import { Download, MoreVertical } from 'lucide-react';
import { useAnalyticsStore } from '../../context/AnalyticsContext';

export const TopCategoryList: React.FC = () => {
    const { topCategories } = useAnalyticsStore();

    return (
        <div className="bg-primary-background p-4 rounded-xl shadow-sm h-full font-sans">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-text-primary">Top Category</h3>
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-text-primary/10 rounded-lg hover:text-text-primary text-text-secondary">
                        <Download size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-text-primary/10 rounded-lg hover:text-text-primary text-text-secondary">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
            <p className="text-xs text-text-secondary mb-6">Top selling categories</p>

            <div className="flex flex-col gap-6">
                {topCategories.length === 0 ? (
                    <p className="text-sm text-text-secondary">No category data available yet.</p>
                ) : (
                    topCategories.map((cat, index) => {
                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold text-text-primary">{cat.name}</h4>
                                    <p className="text-[10px] text-text-secondary">{cat.sales} Sales</p>
                                </div>
                                <span className="text-xs font-bold text-text-primary">£{cat.revenue.toLocaleString()}</span>    
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
