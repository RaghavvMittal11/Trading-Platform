import React from 'react';

const ParametersSection = ({ formData, handleChange }) => {
    return (
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
    );
};

export default ParametersSection;
