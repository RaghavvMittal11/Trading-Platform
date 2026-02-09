import React from 'react';

const trades = [
    { symbol: 'AAPL', type: 'LONG', pnl: 234.56, pnlPercent: 2.1, status: 'RUNNING' },
    { symbol: 'GOOGL', type: 'SHORT', pnl: -45.23, pnlPercent: -0.8, status: 'CLOSED' },
    { symbol: 'TSLA', type: 'LONG', pnl: 567.89, pnlPercent: 4.2, status: 'RUNNING' },
    { symbol: 'MSFT', type: 'LONG', pnl: 123.45, pnlPercent: 1.5, status: 'RUNNING' },
    { symbol: 'AMZN', type: 'SHORT', pnl: -78.92, pnlPercent: -1.2, status: 'CLOSED' },
];

const ActiveTrades = () => {
    return (
        <div className="glass-card p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Active Trades</h3>
                <span className="px-2 py-1 text-xs font-bold bg-green-500/20 text-green-400 rounded-md border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    5 OPEN
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-400 border-b border-dark-border">
                            <th className="pb-3 font-medium">SYMBOL</th>
                            <th className="pb-3 font-medium">TYPE</th>
                            <th className="pb-3 font-medium text-right">P&L</th>
                            <th className="pb-3 font-medium text-right">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {trades.map((trade, i) => (
                            <tr key={i} className="group border-b border-dark-border/50 last:border-0 hover:bg-white/5 transition-colors">
                                <td className="py-4 font-bold text-white group-hover:text-primary-glow transition-colors">{trade.symbol}</td>
                                <td className="py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${trade.type === 'LONG'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                                        }`}>
                                        {trade.type}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                                    </div>
                                    <div className={`text-xs ${trade.pnl >= 0 ? 'text-green-500/60' : 'text-red-500/60'}`}>
                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnlPercent}%
                                    </div>
                                </td>
                                <td className="py-4 text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wider ${trade.status === 'RUNNING'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)] animate-pulse'
                                            : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                                        }`}>
                                        {trade.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveTrades;
