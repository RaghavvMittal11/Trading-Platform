import React from 'react';

const IntradayToggle = ({ intraday, setFormData }) => {
    const toggle = () => {
        setFormData(prev => ({ ...prev, intraday: !prev.intraday }));
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
                <h4 className="font-semibold text-white">Intraday Trading</h4>
                <p className="text-xs text-gray-400">Enable for same-day trading only</p>
            </div>
            <button
                onClick={toggle}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${intraday ? 'bg-primary' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${intraday ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );
};

export default IntradayToggle;
