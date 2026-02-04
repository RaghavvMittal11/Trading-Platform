import React from 'react';
import { CONTRACT_TYPES, MARKETS } from '../../constants/backtest';

const MarketDataSection = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Contract Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
                    {CONTRACT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Trading Market</label>
                <select name="market" value={formData.market} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
                    {MARKETS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MarketDataSection;
