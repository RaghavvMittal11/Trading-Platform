import React from 'react';
import { STRATEGIES, CANDLE_SOURCES } from '../../constants/backtest';

const StrategySection = ({ formData, handleChange, handleConfigChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Strategy</label>
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
            </div>
            
            <div className="space-y-4 bg-dark-bg/30 p-4 rounded-xl border border-white/5">
                <label className="text-sm font-medium text-primary">Strategy Configuration</label>
                {formData.strategy && formData.strategy_config ? (
                    <div className="grid gap-3">
                        {Object.entries(formData.strategy_config).map(([key, value]) => {
                            if (key === 'source') {
                                return (
                                    <div key={key} className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</label>
                                        <select
                                            name={key}
                                            value={value}
                                            onChange={handleConfigChange}
                                            className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50"
                                        >
                                            {CANDLE_SOURCES.map(src => (
                                                <option key={src.value} value={src.value}>{src.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }
                            return (
                                <div key={key} className="flex flex-col gap-1">
                                    <label className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</label>
                                    <input
                                        type="number"
                                        step="any"
                                        name={key}
                                        value={value === '' ? '' : value}
                                        onChange={handleConfigChange}
                                        className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary/50"
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-xs text-gray-500">Select a strategy to configure parameters.</p>
                )}
            </div>
        </div>
    );
};

export default StrategySection;
