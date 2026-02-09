export const TIME_FRAME_OPTIONS = [
    { label: '1 min', value: '1m' },
    { label: '3 min', value: '3m' },
    { label: '5 min', value: '5m' },
    { label: '15 min', value: '15m' },
    { label: '30 min', value: '30m' },
    { label: '1 hour', value: '1h' },
    { label: '4 hour', value: '4h' },
    { label: '1 day', value: '1d' },
];

export const STRATEGY_TEMPLATES = [
    {
        id: 'ema-crossover-multi-timeframe',
        name: 'Trend Based Ema Cross Over in Multiple TimeFrames',
        description: 'Executes trades based on EMA crossovers across multiple timeframes.',
        type: 'EMACrossoverMultiTimeFrame',
        parameters: {
            htf: {
                timeframe: '1h',
                fastSpan: 9,
                slowSpan: 21,
            },
            ltf1: {
                timeframe: '5m',
                fastSpan: 9,
                slowSpan: 21,
            },
            ltf2: {
                timeframe: '3m',
                fastSpan: 9,
                slowSpan: 21,
            },
            thresholds: {
                tradeUpper: 100,
                tradeLower: -100,
                dailyPnlUpper: 1000,
                dailyPnlLower: -1000,
            }
        }
    }
];
