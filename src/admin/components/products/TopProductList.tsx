import React from 'react';
import { Download, MoreVertical } from 'lucide-react';
import { useAnalyticsStore } from '../../context/AnalyticsContext';

export const TopProductList: React.FC = () => {
    const { topProducts } = useAnalyticsStore();

    return (
        <div className="bg-primary-background p-6 rounded-2xl shadow-sm h-full font-sans">
            <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-text-primary">Top Product</h3>
                <div className="flex gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-text-primary/10 hover:text-text-primary text-text-secondary">
                        <Download size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-text-primary/10 rounded-lg hover:text-text-primary text-text-secondary">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
            <p className="text-xs text-text-secondary mb-6">Top selling products</p>

            <div className="flex flex-col gap-6">
                {topProducts.length === 0 ? (
                    <p className="text-sm text-text-secondary">No sales data available yet.</p>
                ) : (
                    topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-8 h-8 rounded-sm object-cover bg-gray-50" />
                                ) : (
                                    <div className="w-8 h-8 rounded-sm bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">Img</div>
                                )}
                                <div>
                                    <h4 className="text-xs font-bold text-text-primary">{product.name}</h4>
                                    <p className="text-[10px] text-text-secondary">{product.category}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-text-primary">£{product.revenue.toLocaleString()}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
