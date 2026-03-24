import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Loader2 } from 'lucide-react';
import { INITIAL_BACKTEST_FORM, STRATEGY_PARAMS } from '../constants/backtest';
import StrategySection from './BacktestForm/StrategySection';
import BasicInfoSection from './BacktestForm/BasicInfoSection';
import MarketDataSection from './BacktestForm/MarketDataSection';
import ParametersSection from './BacktestForm/ParametersSection';
import IntradayToggle from './BacktestForm/IntradayToggle';
import { runBacktest } from '../services/api';
import { useBacktest } from '../context/BacktestContext';

const CreateBacktestModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState(INITIAL_BACKTEST_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { addBacktest } = useBacktest();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'strategy') {
            setFormData(prev => ({
                ...prev,
                strategy: value,
                strategy_config: STRATEGY_PARAMS[value] || {}
            }));
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleConfigChange = (e) => {
        const { name, value, type } = e.target;
        let parsedValue = value;
        if (type === 'number') {
            parsedValue = value === '' ? '' : Number(value);
        }
        setFormData(prev => ({
            ...prev,
            strategy_config: {
                ...prev.strategy_config,
                [name]: parsedValue
            }
        }));
    };

    const handleStart = async () => {
        setError(null);
        setIsLoading(true);

        try {
            // Prepare payload with corrected types and pruned fields
            const payload = { ...formData };
            payload.initial_cash = Number(payload.initial_cash);
            payload.commission = Number(payload.commission);
            payload.slippage = Number(payload.slippage);
            if (payload.order_size_mode === 'PCT_EQUITY') {
                payload.order_size_pct = Number(payload.order_size_pct);
                payload.order_size_usdt = null;
            } else {
                payload.order_size_usdt = Number(payload.order_size_usdt) || null;
            }

            const response = await runBacktest(payload);
            addBacktest(response);
            onClose(); // Close modal on success
        } catch (err) {
            setError(err.message || 'Failed to start simulation');
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />

            <div className="relative w-full max-w-2xl bg-[#0f0f1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Play className="text-primary" size={20} />
                        Start New Backtest
                    </h2>
                    <button onClick={!isLoading ? onClose : undefined} className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar grow">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <StrategySection formData={formData} handleChange={handleChange} handleConfigChange={handleConfigChange} />
                    <BasicInfoSection formData={formData} handleChange={handleChange} />
                    <MarketDataSection formData={formData} handleChange={handleChange} />
                    <ParametersSection formData={formData} handleChange={handleChange} />
                    <IntradayToggle intraday={formData.intraday} setFormData={setFormData} />
                </div>

                <div className="px-6 py-4 bg-dark-bg/50 border-t border-white/10 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} disabled={isLoading} className="px-6 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium disabled:opacity-50">
                        Cancel
                    </button>
                    <button 
                        onClick={handleStart} 
                        disabled={isLoading || !formData.strategy}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-accent-purple text-white font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Start Simulation'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CreateBacktestModal;
