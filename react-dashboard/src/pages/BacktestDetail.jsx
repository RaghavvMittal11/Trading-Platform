import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, BarChart2, Layers, Activity } from 'lucide-react';
import PortfolioChart from '../components/PortfolioChart';
import { useBacktest } from '../context/BacktestContext';

const StatGrid = ({ items, cols = 4 }) => (
    <div className={`grid grid-cols-2 lg:grid-cols-${cols} gap-4`}>
        {items.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-white tracking-tight">{item.value}</p>
                {item.sub && <p className="text-xs text-gray-500 mt-1">{item.sub}</p>}
            </div>
        ))}
    </div>
);

const BacktestDetail = () => {
    const { id } = useParams();
    const { getBacktestById } = useBacktest();
    const [activeTab, setActiveTab] = useState('overview');

    const backtest = getBacktestById(id);

    if (!backtest) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <p>Backtest not found or was deleted.</p>
                <Link to="/backtest" className="mt-4 text-primary hover:underline">Return to Results List</Link>
            </div>
        );
    }

    const {
        name,
        status,
        equity_curve,
        start_date,
        end_date,
        duration_days,
        total_return,
        total_return_pct,
        statistics = {},
        parameters = {}
    } = backtest;

    // Build chart data
    const chartData = (equity_curve || []).map(pt => ({
        time: pt.timestamp.split(' ')[0] || pt.timestamp, // Simple date truncation
        value: pt.value
    }));

    // Build stats for grids
    const quickStats = [
        { label: 'Start Date', value: start_date },
        { label: 'End Date', value: end_date },
        { label: 'Duration', value: `${duration_days} days` },
        { 
            label: 'Total Return', 
            value: total_return_pct !== undefined ? `${total_return_pct.toFixed(2)}%` : '---',
            sub: total_return !== undefined ? `$${total_return.toFixed(2)}` : ''
        },
        { label: 'Win Rate', value: statistics.win_rate !== undefined ? `${statistics.win_rate.toFixed(1)}%` : '---' },
        { label: 'Total Trades', value: statistics.total_trades || 0 },
        { label: 'Profit Factor', value: statistics.profit_factor !== undefined && statistics.profit_factor !== null ? statistics.profit_factor.toFixed(2) : '---' },
        { label: 'Max Drawdown', value: statistics.max_drawdown_pct !== undefined ? `${statistics.max_drawdown_pct.toFixed(2)}%` : '---' },
    ];

    const configItems = [
        { label: 'Strategy', value: parameters.strategy || '---' },
        { label: 'Market', value: parameters.trading_market || '---' },
        { label: 'Symbol', value: parameters.symbol || '---' },
        { label: 'Interval', value: parameters.interval || '---' },
        { label: 'Contract Type', value: parameters.contract_type || '---' },
        { label: 'Initial Cash', value: parameters.initial_cash ? `$${parameters.initial_cash.toLocaleString()}` : '---' },
        { label: 'Commission', value: parameters.commission || '---' },
        { label: 'Slippage', value: parameters.slippage || '---' },
        { label: 'Position Size', value: parameters.order_size_mode === 'PCT_EQUITY' ? `${parameters.order_size_pct}% Equity` : `$${parameters.order_size_usdt} Fixed` },
        { label: 'Intraday', value: parameters.intraday ? 'Yes' : 'No' }
    ];

    // parse strategy specific configs
    const specificConfigs = parameters.strategy_config || {};
    Object.entries(specificConfigs).forEach(([k, v]) => {
        configItems.push({ label: k.replace(/_/g, ' ').toUpperCase(), value: v });
    });

    const detailedMetrics = [
        { label: 'Final Portfolio', value: statistics.final_portfolio_value ? `$${statistics.final_portfolio_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---' },
        { label: 'Avg Win', value: statistics.avg_win ? `$${statistics.avg_win.toFixed(2)}` : '---' },
        { label: 'Avg Loss', value: statistics.avg_loss ? `$${statistics.avg_loss.toFixed(2)}` : '---' },
        { label: 'Winning Trades', value: statistics.winning_trades || 0 },
        { label: 'Losing Trades', value: statistics.losing_trades || 0 },
        { label: 'Open Trades', value: statistics.open_trades || 0 }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/backtest" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">{name}</h1>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                status === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                                {status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                            <span className="bg-white/10 px-1.5 rounded text-xs text-gray-300">{parameters.strategy || 'Strategy'}</span>
                            <span>•</span>
                            <span className="font-mono">{parameters.symbol || 'SYMBOL'}</span>
                        </p>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-semibold">
                    <ExternalLink size={16} />
                    Export Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-white/5 p-1 rounded-xl w-fit">
                {['overview', 'parameters', 'statistics'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${activeTab === tab
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {status === 'ERROR' ? (
                            <div className="glass-card p-6 bg-red-500/10 border-red-500/20">
                                <h3 className="text-lg font-bold text-red-500 mb-2">Backtest Error</h3>
                                <p className="text-red-400">{backtest.error_message || 'An unknown error occurred during simulation.'}</p>
                            </div>
                        ) : (
                            <>
                                <div className="glass-card">
                                    <PortfolioChart chartData={chartData} />
                                </div>
                                <div className="glass-card p-6 border border-white/5">
                                    <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                                    <StatGrid items={quickStats.slice(0, 4)} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'parameters' && (
                    <div className="glass-card p-6 animate-in fade-in duration-300 border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-primary" />
                            Configuration
                        </h3>
                        <StatGrid items={configItems} cols={3} />
                    </div>
                )}

                {activeTab === 'statistics' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="glass-card p-6 border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Activity size={20} className="text-primary" />
                                Key Performance Indicators
                            </h3>
                            <StatGrid items={quickStats} cols={4} />
                        </div>
                        <div className="glass-card p-6 border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart2 size={20} className="text-primary" />
                                Trade Analytics
                            </h3>
                            <StatGrid items={detailedMetrics} cols={3} />
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default BacktestDetail;
