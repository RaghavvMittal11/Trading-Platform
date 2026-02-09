import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, BarChart2, Layers, Activity } from 'lucide-react';
import PortfolioChart from '../components/PortfolioChart'; // Reusing for now

const StatGrid = ({ items, cols = 4 }) => (
    <div className={`grid grid-cols-2 md:grid-cols-${cols} gap-4`}>
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
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - normally fetched by ID
    const stats = [
        { label: 'Start Date', value: '2024-08-14' },
        { label: 'End Date', value: '2024-09-02' },
        { label: 'Duration', value: '19 days' },
        { label: 'Total Return', value: '-0.54%', sub: '-$540.00' },
        { label: 'Win Rate', value: '65.2%' },
        { label: 'Total Trades', value: '45' },
        { label: 'Sharpe Ratio', value: '1.24' },
        { label: 'Max Drawdown', value: '-2.4%' },
    ];

    const params = [
        { label: 'Strategy', value: 'EMA CrossOver' },
        { label: 'Timeframe', value: '15min' },
        { label: 'Fast Period', value: '9' },
        { label: 'Slow Period', value: '21' },
        { label: 'Stop Loss', value: '1.5%' },
        { label: 'Take Profit', value: '3.0%' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/backtest" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white">Backtest Run #{id}</h1>
                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                COMPLETED
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                            <span className="bg-white/10 px-1.5 rounded text-xs text-gray-300">EMA CrossOver</span>
                            <span>•</span>
                            <span>RELIANCE</span>
                        </p>
                    </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-semibold">
                    <ExternalLink size={16} />
                    Export Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
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
                        <div className="glass-card">
                            <PortfolioChart />
                        </div>
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                            <StatGrid items={stats.slice(0, 4)} />
                        </div>
                    </div>
                )}

                {activeTab === 'parameters' && (
                    <div className="glass-card p-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-primary" />
                            Configuration
                        </h3>
                        <StatGrid items={params} cols={3} />
                    </div>
                )}

                {activeTab === 'statistics' && (
                    <div className="glass-card p-6 animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-primary" />
                            Detailed Metrics
                        </h3>
                        <StatGrid items={stats} cols={4} />
                    </div>
                )}
            </div>

        </div>
    );
};

export default BacktestDetail;
