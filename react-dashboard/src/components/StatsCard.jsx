import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, isPositive, icon: Icon, glowColor = "rgba(99, 102, 241, 0.5)" }) => {
    return (
        <div
            className="glass-card p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1"
            style={{ '--glow-color': glowColor }}
        >
            {/* Background Glow Effect */}
            <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: glowColor }}
            />

            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    <Icon size={24} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {change}
                    </div>
                )}
            </div>

            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        </div>
    );
};

export default StatsCard;
