const BASE_URL = '/api/v1/backtest';

/**
 * Run a new backtest simulation.
 * @param {Object} payload - The BacktestRunRequest payload
 * @returns {Promise<Object>} The BacktestRunResponse
 */
export const runBacktest = async (payload) => {
  const response = await fetch(`${BASE_URL}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        throw new Error(errorData.detail.map(e => e.msg).join(', '));
      }
      throw new Error(errorData.detail);
    }
    throw new Error('Failed to run backtest');
  }
  return response.json();
};

/**
 * Fetch available strategies from the backend.
 * @returns {Promise<Array>} List of strategy objects
 */
export const fetchStrategies = async () => {
  const response = await fetch(`${BASE_URL}/strategies`);
  if (!response.ok) {
    throw new Error('Failed to fetch strategies');
  }
  return response.json();
};

/**
 * Fetch engine health.
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Failed to check health');
  }
  return response.json();
};
