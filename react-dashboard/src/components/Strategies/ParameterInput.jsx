import React from 'react';

/**
 * ParameterInput component for strategy configuration.
 * Supports text, number, and select inputs.
 *
 * @param {Object} props
 * @param {string} props.label - Label for the input
 * @param {string|number} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.type='text'] - Input type (text, number, select)
 * @param {Array} [props.options=[]] - Options for select input
 * @param {string} [props.className] - Additional classes
 * @param {boolean} [props.error] - Error state
 */
const ParameterInput = ({
    label,
    value,
    onChange,
    type = 'text',
    options = [],
    className = '',
    error = false,
    ...props
}) => {
    const baseInputClass =
        "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors";

    return (
        <div className={`flex flex-col space-y-1 ${className}`}>
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {label}
            </label>

            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInputClass}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value;
                        // Allow empty string to clear input, otherwise cast if number
                        if (type === 'number') {
                            onChange(val === '' ? '' : Number(val));
                        } else {
                            onChange(val);
                        }
                    }}
                    className={`${baseInputClass} ${error ? 'border-red-500' : ''}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default ParameterInput;
