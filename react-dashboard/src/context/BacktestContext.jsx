import React, { createContext, useContext, useState } from 'react';

const BacktestContext = createContext();

export const useBacktest = () => useContext(BacktestContext);

export const BacktestProvider = ({ children }) => {
  const [backtests, setBacktests] = useState([]);

  const addBacktest = (result) => {
    setBacktests((prev) => [result, ...prev]);
  };

  const getBacktestById = (id) => {
    return backtests.find((b) => b.backtest_id === id);
  };

  const deleteBacktest = (id) => {
    setBacktests((prev) => prev.filter((b) => b.backtest_id !== id));
  };

  return (
    <BacktestContext.Provider
      value={{ backtests, addBacktest, getBacktestById, deleteBacktest }}
    >
      {children}
    </BacktestContext.Provider>
  );
};
