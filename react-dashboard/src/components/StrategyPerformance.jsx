import React from 'react';

const strategies = [
    { name: 'EMA CrossOver', perf: 85, trades: 23, winRate: 78, color: '#d946ef' },
    { name: 'RSI Divergence', perf: 72, trades: 18, winRate: 67, color: '#8b5cf6' },
    { name: 'Bollinger Bands', perf: 91, trades: 31, winRate: 84, color: '#ec4899' },
    { name: 'MACD Signal', perf: 68, trades: 15, winRate: 60, color: '#a855f7' },
];

const StrategyPerformance = () => {
    return (
        <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Strategy Performance</h3>
                <span className="text-xs font-bold text-primary hover:text-white cursor-pointer transition-colors">
                    VIEW ALL
                </span>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {strategies.map((strategy, index) => (
                    <div key={index} className="p-4 rounded-xl bg-dark-bg/40 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 group">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-white group-hover:text-primary-glow transition-colors">{strategy.name}</h4>
                            <span className="text-lg font-bold text-white">{strategy.perf}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${strategy.perf}%`, background: strategy.color }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-gray-500 group-hover:text-gray-400">
                            <span>{strategy.trades} Trades</span>
                            <span className="font-mono">Win Rate: <span className="text-green-400">{strategy.winRate}%</span></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StrategyPerformance;
