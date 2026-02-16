import React, { useMemo } from 'react';


interface TopProductsProps {
    topProducts: {
        name: string;
        category: string;
        price: number;
        sales: number;
        revenue: number;
        image?: string | null;
    }[];
}

const COLORS = ['#0095FF', '#00E096', '#884DFF', '#FF8F0D', '#FA5A7D'];
const BG_COLORS = ['#F0F9FF', '#F0FDF4', '#FBF1FF', '#FEF6E6', '#FFE2E5'];

export const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {

    const maxSales = useMemo(() => {
        return Math.max(...topProducts.map(p => p.sales), 1);
    }, [topProducts]);

    return (
        <div className="bg-primary-background p-6 rounded-[20px] font-sans h-full shadow-sm">
            <h3 className="text-xl font-bold text-[#151D48] mb-6">Top Products</h3>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-5 pl-2 text-sm font-normal text-[#96A0B5]">#</th>
                            <th className="pb-5 text-sm font-normal text-[#96A0B5]">Name</th>
                            <th className="pb-5 text-sm font-normal text-[#96A0B5] w-[40%]">Popularity</th>
                            <th className="pb-5 pr-2 text-sm font-normal text-[#96A0B5] text-right">Sales</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => {
                                const color = COLORS[index % COLORS.length];
                                const bgColor = BG_COLORS[index % BG_COLORS.length];
                                const popularity = Math.round((product.sales / maxSales) * 100);

                                return (
                                    <tr key={index}>
                                        <td className="py-5 pl-2 text-sm font-semibold text-[#444A6D]">{index + 1 < 10 ? `0${index + 1}` : index + 1}</td>
                                        <td className="py-5 text-sm font-semibold text-[#151D48]">{product.name}</td>
                                        <td className="py-5 pr-8">
                                            <div className="w-full h-1 bg-[#F0F9FF] rounded-full overflow-hidden" style={{ backgroundColor: bgColor }}>
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${popularity}%`, backgroundColor: color }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className="py-5 pr-2 text-right">
                                            <span
                                                className="px-3 py-1 rounded-lg text-sm font-medium"
                                                style={{ color: color, backgroundColor: bgColor }}
                                            >
                                                {popularity}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-text-secondary">No top products data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
