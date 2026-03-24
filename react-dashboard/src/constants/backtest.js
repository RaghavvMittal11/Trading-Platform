export const STRATEGY_PARAMS = {
    EMA_CROSSOVER: { fast_period: 12, slow_period: 26, source: 'CLOSE' },
    RSI_DIVERGENCE: { period: 14, overbought: 70.0, oversold: 30.0, source: 'CLOSE' },
    BOLLINGER_BANDS: { period: 20, std_dev: 2.0, source: 'CLOSE' },
    MACD_SIGNAL: { fast_period: 12, slow_period: 26, signal_period: 9, source: 'CLOSE' },
};

export const INITIAL_BACKTEST_FORM = {
    strategy: 'EMA_CROSSOVER',
    strategy_config: STRATEGY_PARAMS.EMA_CROSSOVER,
    name: 'Test Backtest',
    symbol: 'BTCUSDT',
    contract_type: 'SPOT',
    trading_market: 'BINANCE',
    interval: '1d',
    initial_cash: 10000.0,
    commission: 0.001,
    slippage: 0.0005,
    order_size_mode: 'PCT_EQUITY',
    order_size_pct: 100.0,
    order_size_usdt: '',
    intraday: false,
    start_date: '2024-01-01',
    end_date: '2024-06-30',
};

export const STRATEGIES = [
    { value: 'EMA_CROSSOVER', label: 'EMA CrossOver' },
    { value: 'RSI_DIVERGENCE', label: 'RSI Divergence' },
    { value: 'BOLLINGER_BANDS', label: 'Bollinger Bands' },
    { value: 'MACD_SIGNAL', label: 'MACD Signal' },
];

export const CONTRACT_TYPES = [
    { value: 'SPOT', label: 'SPOT' },
    { value: 'FUTURE', label: 'FUTURE' }
];

export const MARKETS = [
    { value: 'BINANCE', label: 'BINANCE' }
];

export const INTERVALS = [
    { value: '1m', label: '1m' },
    { value: '3m', label: '3m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
    { value: '2h', label: '2h' },
    { value: '4h', label: '4h' },
    { value: '6h', label: '6h' },
    { value: '8h', label: '8h' },
    { value: '12h', label: '12h' },
    { value: '1d', label: '1d' },
    { value: '3d', label: '3d' },
    { value: '1w', label: '1w' },
    { value: '1M', label: '1M' },
];

export const ORDER_SIZE_MODES = [
    { value: 'PCT_EQUITY', label: 'Percentage of Equity (%)' },
    { value: 'FIXED_USDT', label: 'Fixed USDT' }
];

export const CANDLE_SOURCES = [
    { value: 'CLOSE', label: 'CLOSE' },
    { value: 'OPEN', label: 'OPEN' },
    { value: 'HL2', label: 'HL2' }
];
