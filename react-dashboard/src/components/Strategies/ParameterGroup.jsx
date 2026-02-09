import React from 'react';

/**
 * ParameterGroup component to visually group related strategy parameters.
 *
 * @param {Object} props
 * @param {string} props.title - Group title
 * @param {React.ReactNode} props.children - Child components
 * @param {string} [props.className] - Additional classes
 */
const ParameterGroup = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 ${className}`}>
            <h3 className="text-sm font-semibold text-blue-400 mb-4 border-b border-slate-700/50 pb-2">
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {children}
            </div>
        </div>
    );
};

export default ParameterGroup;
