import React from 'react';

interface BestSellingWidgetProps {
    bestSellingProduct: { name: string; quantity: number; image?: string | null } | null;
    categories: Record<string, number>;
}

export const BestSellingWidget: React.FC<BestSellingWidgetProps> = ({ bestSellingProduct, categories }) => {
    return (
        <div className="bg-primary-background rounded-2xl shadow-sm p-6 h-full font-sans overflow-y-auto">
            {/* Categories Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-text-primary">Categories (Revenue)</h2>
                </div>
                <p className="text-xs text-text-secondary mb-4">Top Revenue Categories</p>

                <div className="space-y-3">
                    {Object.entries(categories).map(([category, revenue], index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-text-primary/15 p-1 flex items-center justify-center">
                                    <div className="w-full h-full rounded-md flex items-center justify-center text-base font-bold text-text-primary">
                                        {category.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold text-text-primary block">{category}</span>
                                    <span className="text-xs text-text-secondary">£{revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(categories).length === 0 && (
                        <p className="text-sm text-text-secondary text-center py-4">No category data available.</p>
                    )}
                </div>
            </div>

            {/* Best Selling Products Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-text-primary">Best Selling Product</h2>
                </div>

                <div className="space-y-3">
                    {bestSellingProduct ? (
                        <div className="flex items-center justify-between p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-text-primary/15 p-1 flex items-center justify-center">
                                    <img src={bestSellingProduct.image || "https://via.placeholder.com/50"} alt="Product" className="w-full h-full object-cover rounded-md" />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary text-sm">{bestSellingProduct.name}</p>
                                    <p className="text-[#22c55e] font-bold text-sm">{bestSellingProduct.quantity} units sold</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-text-secondary text-center py-4">No top selling product yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
};
