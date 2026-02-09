import React from 'react';
import { STRATEGIES, CONFIGS } from '../../constants/backtest';

const StrategySection = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Strategy <span className="text-green-400 text-xs ml-2">1 AVAILABLE</span></label>
                <select
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                >
                    <option value="">Select strategy</option>
                    {STRATEGIES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Strategy Configuration</label>
                <select
                    name="config"
                    value={formData.config}
                    onChange={handleChange}
                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                >
                    <option value="">Select configuration</option>
                    {CONFIGS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default StrategySection;
