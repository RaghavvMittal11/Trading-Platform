import React from 'react';
import { ORDER_SIZE_MODES } from '../../constants/backtest';

const ParametersSection = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Cash</label>
                <div className="relative">
                    <input
                        type="number" step="any" name="initial_cash" value={formData.initial_cash} onChange={handleChange}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 pl-7 text-white text-sm focus:border-primary transition-colors"
                    />
                    <span className="absolute left-2.5 top-2 text-gray-500 text-xs">$</span>
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commission fraction</label>
                <input
                    type="number" step="any" name="commission" value={formData.commission} onChange={handleChange}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary transition-colors"
                    placeholder="e.g. 0.001"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slippage fraction</label>
                <input
                    type="number" step="any" name="slippage" value={formData.slippage} onChange={handleChange}
                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary transition-colors"
                    placeholder="e.g. 0.0005"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Position Size Mode</label>
                <select name="order_size_mode" value={formData.order_size_mode} onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm appearance-none focus:border-primary transition-colors">
                    {ORDER_SIZE_MODES.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>

            {formData.order_size_mode === 'PCT_EQUITY' ? (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">% Of Equity</label>
                    <div className="relative">
                        <input
                            type="number" step="any" max={100} name="order_size_pct" value={formData.order_size_pct} onChange={handleChange}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 pr-7 text-white text-sm focus:border-primary transition-colors"
                        />
                        <span className="absolute right-2.5 top-2 text-gray-500 text-xs">%</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fixed USDT</label>
                    <div className="relative">
                        <input
                            type="number" step="any" name="order_size_usdt" value={formData.order_size_usdt} onChange={handleChange}
                            className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 pl-7 text-white text-sm focus:border-primary transition-colors"
                        />
                        <span className="absolute left-2.5 top-2 text-gray-500 text-xs">$</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParametersSection;
