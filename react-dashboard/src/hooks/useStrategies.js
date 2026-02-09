import { useState, useEffect } from 'react';
import { STRATEGY_TEMPLATES } from '../constants/strategies';

const STORAGE_KEY = 'numatix_strategies';

/**
 * Custom hook to manage strategies.
 * Simulates an API by persisting to localStorage.
 */
export const useStrategies = () => {
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load from localStorage or fall back to templates
    useEffect(() => {
        const loadStrategies = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setStrategies(parsed);
                } else {
                    // Initialize with templates and save to localStorage
                    setStrategies(STRATEGY_TEMPLATES);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(STRATEGY_TEMPLATES));
                }
            } catch (error) {
                console.error('Failed to load strategies:', error);
                setStrategies(STRATEGY_TEMPLATES);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(STRATEGY_TEMPLATES));
            } finally {
                setLoading(false);
            }
        };

        loadStrategies();
    }, []);

    // Save changes to localStorage
    const saveStrategy = (strategy) => {
        setStrategies((prev) => {
            const exists = prev.find((s) => s.id === strategy.id);
            let newStrategies;
            if (exists) {
                newStrategies = prev.map((s) => (s.id === strategy.id ? strategy : s));
            } else {
                newStrategies = [...prev, strategy];
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStrategies));
            return newStrategies;
        });
    };

    const deleteStrategy = (id) => {
        setStrategies((prev) => {
            const newStrategies = prev.filter((s) => s.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStrategies));
            return newStrategies;
        });
    };

    const getStrategy = (id) => {
        return strategies.find((s) => s.id === id);
    };

    return {
        strategies,
        loading,
        saveStrategy,
        deleteStrategy,
        getStrategy,
    };
};
