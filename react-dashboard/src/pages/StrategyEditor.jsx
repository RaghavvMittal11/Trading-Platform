import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStrategies } from '../hooks/useStrategies';
import StrategyConfig from '../components/Strategies/StrategyConfig';
import { STRATEGY_TEMPLATES } from '../constants/strategies';
import { ArrowLeft, Save, Copy } from 'lucide-react';

const StrategyEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { strategies, loading: strategiesLoading, getStrategy, saveStrategy } = useStrategies();

    const [strategy, setStrategy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for strategies to load from localStorage
        if (strategiesLoading) {
            return;
        }

        if (id === 'new') {
            // Default to the first template for new strategies
            const newStrategy = {
                ...JSON.parse(JSON.stringify(STRATEGY_TEMPLATES[0])), // Deep copy
                id: `strategy-${Date.now()}`,
                name: 'New Strategy',
                description: 'Custom strategy configuration',
            };
            setStrategy(newStrategy);
            setLoading(false);
        } else {
            const existing = getStrategy(id);
            if (existing) {
                setStrategy(JSON.parse(JSON.stringify(existing))); // Deep copy
                setLoading(false);
            } else {
                // Handle not found
                console.error('Strategy not found:', id);
                navigate('/strategies');
            }
        }
    }, [id, strategies, strategiesLoading, getStrategy, navigate]);

    const handleSave = () => {
        if (strategy) {
            console.log('Saving strategy:', strategy);
            saveStrategy(strategy);
            // Add small delay to ensure state updates
            setTimeout(() => {
                navigate('/strategies');
            }, 100);
        }
    };

    const handleClone = () => {
        if (strategy) {
            const cloned = {
                ...JSON.parse(JSON.stringify(strategy)), // Deep copy
                id: `strategy-${Date.now()}`,
                name: `${strategy.name} (Copy)`,
            };
            console.log('Cloning strategy:', cloned);
            saveStrategy(cloned);
            setTimeout(() => {
                navigate(`/strategies/${cloned.id}`);
            }, 100);
        }
    };

    const handleBacktest = () => {
        // Navigate to backtest creation with this strategy selected (simulated)
        console.log('Starting backtest for strategy:', strategy.id);
        navigate('/backtest');
    };

    const handleConfigChange = (newConfig) => {
        console.log('Config changed:', newConfig);
        setStrategy((prev) => ({
            ...prev,
            parameters: newConfig,
        }));
    };

    if (loading || strategiesLoading || !strategy) {
        return (
            <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading strategy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900 shrink-0">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                        onClick={() => navigate('/strategies')}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0"
                        aria-label="Back to strategies"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <input
                            type="text"
                            value={strategy.name}
                            onChange={(e) => setStrategy({ ...strategy, name: e.target.value })}
                            className="bg-slate-800/50 text-2xl font-bold text-white focus:outline-none focus:bg-slate-800 rounded px-3 py-1 w-full border border-transparent focus:border-blue-500 transition-all placeholder-slate-600"
                            placeholder="Strategy Name"
                        />
                        <input
                            type="text"
                            value={strategy.description}
                            onChange={(e) => setStrategy({ ...strategy, description: e.target.value })}
                            className="bg-slate-800/50 text-sm text-slate-400 focus:outline-none focus:text-white w-full mt-2 border border-transparent focus:border-blue-500 rounded px-3 py-1 focus:bg-slate-800 transition-all placeholder-slate-600"
                            placeholder="Description"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 ml-4 shrink-0">
                    <button
                        onClick={handleClone}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Clone Strategy"
                    >
                        <Copy size={20} />
                    </button>

                    <button
                        onClick={handleBacktest}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm border border-slate-700"
                    >
                        Run Backtest
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <StrategyConfig
                    config={strategy.parameters}
                    onChange={handleConfigChange}
                />
            </div>
        </div>
    );
};

export default StrategyEditor;
