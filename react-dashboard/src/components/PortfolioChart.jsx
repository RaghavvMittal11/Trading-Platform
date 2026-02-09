import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '00:00', value: 125000 },
    { time: '02:00', value: 126500 },
    { time: '04:00', value: 127800 },
    { time: '06:00', value: 126200 },
    { time: '08:00', value: 124500 },
    { time: '10:00', value: 123800 },
    { time: '12:00', value: 125600 },
    { time: '14:00', value: 126900 },
    { time: '16:00', value: 127200 },
    { time: '18:00', value: 125400 },
    { time: '20:00', value: 123900 },
    { time: '22:00', value: 124800 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-4 border border-white/10 !bg-dark-bg/90 backdrop-blur-xl">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-xl font-bold text-primary-glow">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const PortfolioChart = () => {
    return (
        <div className="glass-card p-6 h-[400px] w-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Portfolio Performance (24h)</h3>
                <p className="text-sm text-gray-400">Real-time portfolio value tracking</p>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#818cf8"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChart;
