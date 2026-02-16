import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

interface SalesChartProps {
    data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="relative">
                <div className="bg-[#A3C4BC] text-admin-burgundy text-xs font-bold py-2 px-3 rounded-xl shadow-lg mb-2 text-center min-w-[80px]">
                    <p>{label}</p>
                    <p>{`£${payload[0].value.toLocaleString()}`}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#A3C4BC]"></div>
            </div>
        );
    }
    return null;
};

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {

    return (
        <div className="w-full h-full flex flex-col font-sans">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-text-primary">Report for this week</h2>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 0,
                            left: -20, // Pull axis closer
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#E6F4F1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#E6F4F1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* Remove horizontal grid lines if needed, or keep them minimal. Image shows NO grid lines or very subtle ones. */}
                        {/* <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" /> */}

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#A3C4BC', strokeWidth: 2, strokeDasharray: '4 4' }}
                            position={{ y: 90 }} // Force tooltip y-position somewhat to match the "speech bubble" feel relative to data point if needed, though Recharts handles this.
                        // However, strictly adhering to Recharts defaults + custom content is safer for responsiveness.
                        />
                        <Area
                            type="monotone" // or "monotone" for smooth curves
                            dataKey="value"
                            stroke="#5D4037" // Dark brown/burgundy
                            strokeWidth={2}
                            fill="url(#colorValue)"
                            activeDot={{ r: 6, fill: 'white', stroke: '#A3C4BC', strokeWidth: 2 }} // Generic active dot
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
