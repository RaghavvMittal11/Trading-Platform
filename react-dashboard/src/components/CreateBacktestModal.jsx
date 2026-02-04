import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';

const CreateBacktestModal = ({ isOpen, onClose, onStart }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        strategy: '',
        config: '',
        name: '',
        symbol: '',
        type: 'FUTURE',
        market: 'NSE',
        cash: '100000',
        commission: '0.001',
        quantity: '10',
        spread: '0.0005',
        intraday: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Play className="text-primary" size={20} />
                        Start New Backtest
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar grow">

                    {/* Strategy Section */}
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
                                <option value="EMA">EMA CrossOver</option>
                                <option value="RSI">RSI Divergence</option>
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
                                <option value="default">Default Config</option>
                                <option value="aggressive">Aggressive Mode</option>
                            </select>
                        </div>
                    </div>

                    {/* Basic Info */}
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

                    {/* Market Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Contract Type</label>
                            <select name="type" onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
                                <option value="FUTURE">FUTURE</option>
                                <option value="EQUITY">EQUITY</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Trading Market</label>
                            <select name="market" onChange={handleChange} className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none">
                                <option value="NSE">NSE</option>
                            </select>
                        </div>
                    </div>

                    {/* Numbers Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Initial Cash</label>
                            <div className="relative">
                                <input
                                    type="text" name="cash" value={formData.cash} onChange={handleChange}
                                    className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 pl-7 text-white text-sm focus:border-primary transition-colors"
                                />
                                <span className="absolute left-2.5 top-2 text-gray-500 text-xs">$</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Commission</label>
                            <input
                                type="text" name="commission" value={formData.commission} onChange={handleChange}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                            <input
                                type="text" name="quantity" value={formData.quantity} onChange={handleChange}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spread</label>
                            <input
                                type="text" name="spread" value={formData.spread} onChange={handleChange}
                                className="w-full bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div>
                            <h4 className="font-semibold text-white">Intraday Trading</h4>
                            <p className="text-xs text-gray-400">Enable for same-day trading only</p>
                        </div>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, intraday: !prev.intraday }))}
                            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${formData.intraday ? 'bg-primary' : 'bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${formData.intraday ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-dark-bg/50 border-t border-white/10 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onStart(formData)}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent-purple text-white font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all transform active:scale-95"
                    >
                        Start Simulation
                    </button>
                </div>

            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CreateBacktestModal;
