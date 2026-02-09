import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStrategies } from '../hooks/useStrategies';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const StrategyList = () => {
    const navigate = useNavigate();
    const { strategies, loading, deleteStrategy } = useStrategies();
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredStrategies = strategies.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                Loading strategies...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Strategies</h1>
                    <p className="text-slate-400">Manage and configure your trading algorithms</p>
                </div>
                <button
                    onClick={() => navigate('/strategies/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Create New Strategy
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search strategies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Strategy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStrategies.map((strategy) => (
                    <div
                        key={strategy.id}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/strategies/${strategy.id}`);
                                }}
                                className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Edit Strategy"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this strategy?')) {
                                        deleteStrategy(strategy.id);
                                    }
                                }}
                                className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Delete Strategy"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <span className="text-xl font-bold text-blue-400">
                                    {strategy.name.charAt(0)}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                                {strategy.name}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">
                                {strategy.description || 'No description provided.'}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                                {strategy.type}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Mock backtest navigation
                                        navigate('/backtest/new', { state: { strategyId: strategy.id } });
                                    }}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    Run
                                </button>
                                <button
                                    onClick={() => navigate(`/strategies/${strategy.id}`)}
                                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Configure &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredStrategies.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
                        <p className="text-slate-500 mb-4">No strategies found matching your search.</p>
                        <button
                            onClick={() => navigate('/strategies/new')}
                            className="text-blue-400 hover:underline"
                        >
                            Create a new strategy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StrategyList;
