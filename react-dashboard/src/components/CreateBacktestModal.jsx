import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';
import { INITIAL_BACKTEST_FORM } from '../constants/backtest';
import StrategySection from './BacktestForm/StrategySection';
import BasicInfoSection from './BacktestForm/BasicInfoSection';
import MarketDataSection from './BacktestForm/MarketDataSection';
import ParametersSection from './BacktestForm/ParametersSection';
import IntradayToggle from './BacktestForm/IntradayToggle';

const CreateBacktestModal = ({ isOpen, onClose, onStart }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState(INITIAL_BACKTEST_FORM);

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
                    <StrategySection formData={formData} handleChange={handleChange} />
                    <BasicInfoSection formData={formData} handleChange={handleChange} />
                    <MarketDataSection formData={formData} handleChange={handleChange} />
                    <ParametersSection formData={formData} handleChange={handleChange} />
                    <IntradayToggle intraday={formData.intraday} setFormData={setFormData} />
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
