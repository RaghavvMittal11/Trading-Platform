import React from 'react';
import { CONTRACT_TYPES, MARKETS, INTERVALS } from '../../constants/backtest';

const MarketDataSection = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Market</label>
                <select name="trading_market" value={formData.trading_market} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none focus:border-primary/50">
                    {MARKETS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                <select name="contract_type" value={formData.contract_type} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none focus:border-primary/50">
                    {CONTRACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interval</label>
                <select name="interval" value={formData.interval} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none focus:border-primary/50">
                    {INTERVALS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50" />
            </div>
            <div className="space-y-2 lg:col-start-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50" />
            </div>
        </div>
    );
};

export default MarketDataSection;
