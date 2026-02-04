export const INITIAL_BACKTEST_FORM = {
    strategy: '',
    config: '',
    name: '',
    symbol: '',
    type: 'FUTURE',
    market: 'NSE',
    cash: '100000',
    commission: '0.001',
    quantity: '10',
    spread: '0.0005',
    intraday: false,
};

export const STRATEGIES = [
    { value: 'EMA', label: 'EMA CrossOver' },
    { value: 'RSI', label: 'RSI Divergence' },
];

export const CONFIGS = [
    { value: 'default', label: 'Default Config' },
    { value: 'aggressive', label: 'Aggressive Mode' },
];

export const CONTRACT_TYPES = [
    { value: 'FUTURE', label: 'FUTURE' },
    { value: 'EQUITY', label: 'EQUITY' }
];

export const MARKETS = [
    { value: 'NSE', label: 'NSE' }
];
