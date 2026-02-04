import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Trash2, CheckCircle, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import CreateBacktestModal from '../components/CreateBacktestModal';
import { useNavigate } from 'react-router-dom';

const BacktestList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [backtests, setBacktests] = useState([
        { id: 1, name: 'EMA Strategy Test 1', strategy: 'EMA CrossOver', symbol: 'RELIANCE', status: 'COMPLETED', date: '2 mins ago', return: '+12.5%' },
        { id: 2, name: 'BTC Scalp V2', strategy: 'RSI Divergence', symbol: 'BTCUSDT', status: 'RUNNING', date: 'In progress', return: '---' },
        { id: 3, name: 'Failed Run', strategy: 'Bollinger Bands', symbol: 'NIFTY', status: 'ERROR', date: '1 hour ago', return: '0.00%' },
        { id: 4, name: 'MACD Trend', strategy: 'MACD', symbol: 'ES', status: 'COMPLETED', date: 'Yesterday', return: '+4.2%' },
    ]);

    const handleStartBacktest = (data) => {
        // In a real app, this would make an API call
        console.log("Starting backtest:", data);
        setBacktests(prev => [{
            id: prev.length + 1,
            name: data.name || 'New Backtest',
            strategy: data.strategy || 'Unknown',
            symbol: data.symbol || 'N/A',
            status: 'RUNNING',
            date: 'Just now',
            return: '---'
        }, ...prev]);
        setIsModalOpen(false);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle };
            case 'RUNNING': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: Clock };
            case 'ERROR': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: AlertTriangle };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Clock };
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Backtest Results</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage and analyze your strategy simulations.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={16} className="text-white/90" />
                    <span>New Simulation</span>
                </button>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, symbol, or strategy..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 sm:text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-colors w-full sm:w-auto justify-center">
                        <Filter size={14} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {backtests.map((test) => {
                    const status = getStatusInfo(test.status);
                    const StatusIcon = status.icon;

                    return (
                        <div key={test.id} className="group relative bg-[#0f0f12] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/50">
                            {/* Card Header */}
                            <div className="p-5 border-b border-white/5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${status.bg} border ${status.border} ${status.color}`}>
                                            <StatusIcon size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-medium text-white group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/backtest/${test.id}`)}>
                                                {test.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {test.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Status Badge */}
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase border ${status.bg} ${status.border} ${status.color}`}>
                                        {test.status}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 pt-4 space-y-5">
                                {/* Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Strategy</p>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <Activity size={12} className="text-primary" />
                                            <span className="text-sm font-medium">{test.strategy}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Market</p>
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <span className="text-sm font-medium font-mono bg-white/5 px-1.5 rounded">{test.symbol}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* KPI */}
                                <div className="flex items-end justify-between bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Total Return</p>
                                        <div className={`text-lg font-bold flex items-center gap-1 ${test.status === 'ERROR' ? 'text-gray-500' : 'text-emerald-400'}`}>
                                            {test.status !== 'ERROR' && <TrendingUp size={14} />}
                                            {test.return}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/backtest/${test.id}`); }}
                                            className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                            title="View Analysis"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Delete simulation"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <CreateBacktestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStart={handleStartBacktest}
            />
        </div>
    );
};

export default BacktestList;
