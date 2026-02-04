import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BacktestList from './pages/BacktestList';
import BacktestDetail from './pages/BacktestDetail';

/**
 * Main App component.
 * Handles routing and layout wrapping.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/backtest" element={<BacktestList />} />
          <Route path="/backtest/:id" element={<BacktestDetail />} />
          {/* Fallback for other routes for now */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
