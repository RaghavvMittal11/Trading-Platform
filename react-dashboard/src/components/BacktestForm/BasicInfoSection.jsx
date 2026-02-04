import React from 'react';

const BasicInfoSection = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Backtest Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Test Run 1"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Symbol</label>
                <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    placeholder="RELIANCE"
                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                />
            </div>
        </div>
    );
};

export default BasicInfoSection;
