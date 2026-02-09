import React from 'react';
import ParameterGroup from './ParameterGroup';
import ParameterInput from './ParameterInput';
import { TIME_FRAME_OPTIONS } from '../../constants/strategies';

/**
 * StrategyConfig component.
 * Renders the configuration form for a selected strategy.
 *
 * @param {Object} props
 * @param {Object} props.config - Current configuration object
 * @param {Function} props.onChange - Handler for configuration changes
 * @param {string} props.strategyName - Name of the strategy
 */
const StrategyConfig = ({ config, onChange }) => {
    if (!config) return null;

    const handleNestedChange = (group, field, value) => {
        onChange({
            ...config,
            [group]: {
                ...config[group],
                [field]: value,
            },
        });
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-slate-900 p-6">
            <div className="space-y-6">
                {/* HTF Group */}
                <ParameterGroup title="Higher Timeframe (HTF)">
                    <ParameterInput
                        label="Timeframe"
                        type="select"
                        value={config.htf.timeframe}
                        options={TIME_FRAME_OPTIONS}
                        onChange={(val) => handleNestedChange('htf', 'timeframe', val)}
                    />
                    <ParameterInput
                        label="Fast Span"
                        type="number"
                        value={config.htf.fastSpan}
                        onChange={(val) => handleNestedChange('htf', 'fastSpan', val)}
                    />
                    <ParameterInput
                        label="Slow Span"
                        type="number"
                        value={config.htf.slowSpan}
                        onChange={(val) => handleNestedChange('htf', 'slowSpan', val)}
                    />
                </ParameterGroup>

                {/* LTF1 Group */}
                <ParameterGroup title="Lower Timeframe 1 (LTF1)">
                    <ParameterInput
                        label="Timeframe"
                        type="select"
                        value={config.ltf1.timeframe}
                        options={TIME_FRAME_OPTIONS}
                        onChange={(val) => handleNestedChange('ltf1', 'timeframe', val)}
                    />
                    <ParameterInput
                        label="Fast Span"
                        type="number"
                        value={config.ltf1.fastSpan}
                        onChange={(val) => handleNestedChange('ltf1', 'fastSpan', val)}
                    />
                    <ParameterInput
                        label="Slow Span"
                        type="number"
                        value={config.ltf1.slowSpan}
                        onChange={(val) => handleNestedChange('ltf1', 'slowSpan', val)}
                    />
                </ParameterGroup>

                {/* LTF2 Group */}
                <ParameterGroup title="Lower Timeframe 2 (LTF2)">
                    <ParameterInput
                        label="Timeframe"
                        type="select"
                        value={config.ltf2.timeframe}
                        options={TIME_FRAME_OPTIONS}
                        onChange={(val) => handleNestedChange('ltf2', 'timeframe', val)}
                    />
                    <ParameterInput
                        label="Fast Span"
                        type="number"
                        value={config.ltf2.fastSpan}
                        onChange={(val) => handleNestedChange('ltf2', 'fastSpan', val)}
                    />
                    <ParameterInput
                        label="Slow Span"
                        type="number"
                        value={config.ltf2.slowSpan}
                        onChange={(val) => handleNestedChange('ltf2', 'slowSpan', val)}
                    />
                </ParameterGroup>

                {/* Thresholds Group */}
                <ParameterGroup title="Thresholds & Limits">
                    <ParameterInput
                        label="Trade Upper Threshold"
                        type="number"
                        value={config.thresholds.tradeUpper}
                        onChange={(val) => handleNestedChange('thresholds', 'tradeUpper', val)}
                    />
                    <ParameterInput
                        label="Trade Lower Threshold"
                        type="number"
                        value={config.thresholds.tradeLower}
                        onChange={(val) => handleNestedChange('thresholds', 'tradeLower', val)}
                    />
                    <ParameterInput
                        label="Daily PNL Upper Limit"
                        type="number"
                        value={config.thresholds.dailyPnlUpper}
                        onChange={(val) => handleNestedChange('thresholds', 'dailyPnlUpper', val)}
                    />
                    <ParameterInput
                        label="Daily PNL Lower Limit"
                        type="number"
                        value={config.thresholds.dailyPnlLower}
                        onChange={(val) => handleNestedChange('thresholds', 'dailyPnlLower', val)}
                    />
                </ParameterGroup>
            </div>
        </div>
    );
};

export default StrategyConfig;
