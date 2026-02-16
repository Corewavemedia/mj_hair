import React, { useMemo } from 'react';
import type { Customer } from '../../types/analytics';

interface SalesMapProps {
    customers?: Customer[];
}

export const SalesMap: React.FC<SalesMapProps> = ({ customers = [] }) => {
    const { mapData, isSingleCountry, dominantCountry } = useMemo(() => {
        const countryStats: Record<string, number> = {};
        const stateStats: Record<string, number> = {};
        let total = 0;

        customers.forEach(customer => {
            if (!customer.location) return;
            const parts = customer.location.split(',').map(p => p.trim());

            // Assume format: "City, State, Country" or "State, Country" or just "Country"
            // Simple logic: Last part = Country. Second to last (if exists) = State/Region.
            const country = parts[parts.length - 1];
            // If parts length > 2 (City, State, Country), State is index 1. 
            // If parts length == 2 (State, Country), State is index 0.
            // Simplified: Second to last part if available, else 'Unknown'
            const state = parts.length > 1 ? parts[parts.length - 2] : 'Unknown';

            if (country) {
                countryStats[country] = (countryStats[country] || 0) + 1;
                // Accumulate state stats regardless for now, will filter later
                if (state !== 'Unknown') {
                    stateStats[state] = (stateStats[state] || 0) + 1;
                }
                total++;
            }
        });

        const countries = Object.keys(countryStats);
        // "Single country" logic: If >90% of customers are from one country (or strictly all)
        // Let's use strictly all for now to keep it simple as per prompt "from one country"
        const isSingle = countries.length === 1 && total > 0;
        const dominant = isSingle ? countries[0] : (countries.length > 0 ? countries[0] : '');

        // If single country, use state stats. Else use country stats.
        const activeStats = isSingle ? stateStats : countryStats;

        const sorted = Object.entries(activeStats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5

        if (sorted.length === 0) {
            return { mapData: [{ name: "USA", value: 0 }], isSingleCountry: false, dominantCountry: '' };
        }

        return { mapData: sorted, isSingleCountry: isSingle, dominantCountry: dominant };
    }, [customers]);

    const maxValue = Math.max(...mapData.map(d => d.value), 1);

    return (
        <div className="bg-primary-background p-8 rounded-[30px] h-full flex flex-col font-sans">
            <h3 className="text-xl font-bold text-text-primary mb-6">
                {isSingleCountry ? `Sales by Region (${dominantCountry})` : 'Sales Mapping by Country'}
            </h3>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                {mapData.length > 0 ? (
                    mapData.map((item, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{item.name}</span>
                                <span className="text-sm font-bold text-text-primary">{item.value}</span>
                            </div>
                            <div className="w-full h-2 bg-secondary-background rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500 group-hover:bg-blue-600"
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary">
                        No location data available
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-secondary-background text-xs text-center text-text-secondary">
                {isSingleCountry ? `Showing top regions in ${dominantCountry}` : 'Top countries based on customer addresses'}
            </div>
        </div>
    );
};
