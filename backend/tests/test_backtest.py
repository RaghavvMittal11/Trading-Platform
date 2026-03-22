"""
tests/test_backtest.py
───────────────────────
Test suite for the Backtesting Engine (Module 2).

Coverage:
  • Pydantic request / response schemas
  • All four strategy signal generators (vectorised)
  • Trade simulation (simulate_trades)
  • Performance synthesizer (synthesize)
  • LRU data cache (get_historical_data)
  • API endpoints (FastAPI TestClient)

Run:
    pip install pytest pytest-asyncio httpx
    cd backend
    python -m pytest tests/test_backtest.py -v

"""

from __future__ import annotations

import asyncio
from datetime import date
from typing import Any, Dict, List
from unittest.mock import AsyncMock, patch

import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.modules.backtest.engine import BacktestError, run_backtest
from app.modules.backtest.performance import simulate_trades, synthesize
from app.modules.backtest.strategies import get_strategy
from app.modules.backtest.strategies.base import SIGNAL_BUY, SIGNAL_HOLD, SIGNAL_SELL
from app.schemas.backtest import BacktestRunRequest, StrategyName


# ─── Fixtures ─────────────────────────────────────────────────────────────────

def _make_df(n: int = 100, start_price: float = 100.0) -> pd.DataFrame:
    """Create a synthetic OHLCV DataFrame for testing."""
    import numpy as np

    np.random.seed(42)
    prices = start_price + np.cumsum(np.random.randn(n) * 0.5)
    prices = prices.clip(min=1.0)

    index = pd.date_range("2024-01-01", periods=n, freq="D", tz="UTC")
    return pd.DataFrame(
        {
            "open":   prices,
            "high":   prices * 1.01,
            "low":    prices * 0.99,
            "close":  prices + np.random.randn(n) * 0.2,
            "volume": np.random.randint(1000, 100000, n).astype(float),
        },
        index=index,
    )


def _make_request(**overrides) -> BacktestRunRequest:
    defaults: Dict[str, Any] = {
        "strategy": StrategyName.EMA_CROSSOVER,
        "strategy_config": {"fast_period": 5, "slow_period": 10},
        "name": "Test Run",
        "symbol": "BTCUSDT",
        "interval": "1d",
        "trading_market": "BINANCE",
        "initial_cash": 10_000.0,
        "commission": 0.001,
        "quantity": 1,
        "spread": 0.0005,
        "intraday": False,
        "start_date": date(2024, 1, 1),
        "end_date": date(2024, 6, 30),
    }
    defaults.update(overrides)
    return BacktestRunRequest(**defaults)


# ─── Schema Tests ──────────────────────────────────────────────────────────────

class TestSchemas:
    def test_valid_request(self):
        req = _make_request()
        assert req.symbol == "BTCUSDT"
        assert req.initial_cash == 10_000.0

    def test_date_validation(self):
        from pydantic import ValidationError
        with pytest.raises(ValidationError):
            _make_request(start_date=date(2024, 6, 30), end_date=date(2024, 1, 1))

    def test_ema_params_validation(self):
        """
        strategy_config is a free-form Dict[str, Any] at schema level.
        Invalid EMA params (fast >= slow) are caught by the strategy engine
        at run time, not by Pydantic.  Verify that the request itself is
        accepted but the engine raises StrategyConfigError.
        """
        from app.modules.backtest.strategies.base import StrategyConfigError
        req = _make_request(strategy_config={"fast_period": 30, "slow_period": 10})
        # Request is valid at schema level
        assert req.strategy_config["fast_period"] == 30
        # Strategy instantiation raises StrategyConfigError
        with pytest.raises(StrategyConfigError):
            get_strategy("EMA_CROSSOVER", req.strategy_config)


# ─── Strategy Tests ────────────────────────────────────────────────────────────

class TestEMACrossover:
    strategy = get_strategy("EMA_CROSSOVER", {"fast_period": 5, "slow_period": 10})

    def test_signals_column_present(self):
        df = _make_df(60)
        result = self.strategy.generate_signals(df)
        assert "signal" in result.columns

    def test_warmup_is_zero(self):
        df = _make_df(60)
        result = self.strategy.generate_signals(df)
        warmup = result["signal"].iloc[: self.strategy.slow_period]
        assert (warmup == SIGNAL_HOLD).all()

    def test_signals_valid_values(self):
        df = _make_df(60)
        result = self.strategy.generate_signals(df)
        assert result["signal"].isin([-1, 0, 1]).all()

    def test_invalid_config(self):
        from app.modules.backtest.strategies.base import StrategyConfigError
        with pytest.raises(StrategyConfigError):
            get_strategy("EMA_CROSSOVER", {"fast_period": 20, "slow_period": 10})

    def test_evaluate_tick_returns_valid(self):
        tick = {"open": 100, "high": 101, "low": 99, "close": 100.5, "volume": 5000}
        result = self.strategy.evaluate_tick(tick, 0)
        assert result in (SIGNAL_BUY, SIGNAL_SELL, SIGNAL_HOLD)


class TestRSIDivergence:
    strategy = get_strategy("RSI_DIVERGENCE", {"period": 14, "overbought": 70, "oversold": 30})

    def test_rsi_column_present(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        assert "rsi" in result.columns

    def test_warmup_is_zero(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        warmup = result["signal"].iloc[: self.strategy.period + 1]
        assert (warmup == SIGNAL_HOLD).all()

    def test_rsi_bounds(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        valid = result["rsi"].dropna()
        assert (valid >= 0).all() and (valid <= 100).all()


class TestBollingerBands:
    strategy = get_strategy("BOLLINGER_BANDS", {"period": 20, "std_dev": 2.0})

    def test_band_columns_present(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        for col in ["bb_mid", "bb_upper", "bb_lower"]:
            assert col in result.columns

    def test_warmup_is_zero(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        assert (result["signal"].iloc[: self.strategy.period] == SIGNAL_HOLD).all()

    def test_upper_above_lower(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df).dropna()
        assert (result["bb_upper"] >= result["bb_lower"]).all()


class TestMACDSignal:
    strategy = get_strategy("MACD_SIGNAL", {"fast_period": 5, "slow_period": 10, "signal_period": 3})

    def test_macd_columns_present(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        for col in ["macd_line", "macd_signal", "macd_hist"]:
            assert col in result.columns

    def test_signals_valid_values(self):
        df = _make_df(80)
        result = self.strategy.generate_signals(df)
        assert result["signal"].isin([-1, 0, 1]).all()


# ─── Simulation Tests ──────────────────────────────────────────────────────────

class TestSimulateTrades:
    def _df_with_buy_signals(self) -> pd.DataFrame:
        """DataFrame that triggers a buy on bar 10, sell on bar 20."""
        df = _make_df(50)
        df["signal"] = SIGNAL_HOLD
        df.iloc[10, df.columns.get_loc("signal") if "signal" in df.columns else -1] = SIGNAL_BUY
        df["signal"].iloc[10] = SIGNAL_BUY
        df["signal"].iloc[20] = SIGNAL_SELL
        return df

    def test_equity_curve_length(self):
        strategy = get_strategy("EMA_CROSSOVER", {"fast_period": 5, "slow_period": 10})
        df = _make_df(60)
        df = strategy.generate_signals(df)
        equity, trades, final = simulate_trades(df, 10000, 0.001, 1, 0.0005, False)
        assert len(equity) == len(df)

    def test_initial_equity_is_cash(self):
        strategy = get_strategy("EMA_CROSSOVER", {"fast_period": 5, "slow_period": 10})
        df = _make_df(60)
        df = strategy.generate_signals(df)
        equity, _, _ = simulate_trades(df, 10000, 0.001, 1, 0.0005, False)
        assert equity[0].value == 10000.0

    def test_no_negative_cash(self):
        strategy = get_strategy("EMA_CROSSOVER", {"fast_period": 5, "slow_period": 10})
        df = _make_df(60)
        df = strategy.generate_signals(df)
        equity, _, final = simulate_trades(df, 10000, 0.001, 1, 0.0005, False)
        assert final >= 0


class TestSynthesize:
    def test_statistics_fields_present(self):
        strategy = get_strategy("EMA_CROSSOVER", {"fast_period": 5, "slow_period": 10})
        df = _make_df(60)
        df = strategy.generate_signals(df)
        equity, raw_trades, _ = simulate_trades(df, 10000, 0.001, 1, 0.0005, False)
        stats, records = synthesize(equity, raw_trades, 10000)

        assert hasattr(stats, "total_return")
        assert hasattr(stats, "win_rate")
        assert hasattr(stats, "max_drawdown_pct")
        assert 0.0 <= stats.win_rate <= 100.0

    def test_win_rate_bounds(self):
        strategy = get_strategy("MACD_SIGNAL", {"fast_period": 5, "slow_period": 10, "signal_period": 3})
        df = _make_df(80)
        df = strategy.generate_signals(df)
        equity, raw, _ = simulate_trades(df, 10000, 0.001, 1, 0.0005, False)
        stats, _ = synthesize(equity, raw, 10000)
        assert 0.0 <= stats.win_rate <= 100.0


# ─── Engine Integration Tests ─────────────────────────────────────────────────

class TestEngine:
    """Integration tests against run_backtest() with mocked market data."""

    def _mock_bars(self, n: int = 100):
        from app.services.market_data.base import OHLCV
        import numpy as np
        np.random.seed(0)
        prices = 30000 + np.cumsum(np.random.randn(n) * 50)
        index = pd.date_range("2024-01-01", periods=n, freq="D", tz="UTC")
        return [
            OHLCV(
                timestamp=str(ts),
                open=float(p),
                high=float(p * 1.005),
                low=float(p * 0.995),
                close=float(p + 10),
                volume=500000.0,
            )
            for ts, p in zip(index, prices)
        ]

    def test_run_backtest_success(self):
        req = _make_request(
            strategy=StrategyName.EMA_CROSSOVER,
            strategy_config={"fast_period": 5, "slow_period": 10},
            start_date=date(2024, 1, 1),
            end_date=date(2024, 4, 10),
        )
        mock_bars = self._mock_bars(100)
        with patch("app.modules.backtest.engine.get_historical_data", new_callable=AsyncMock) as m:
            m.return_value = mock_bars
            result = asyncio.get_event_loop().run_until_complete(run_backtest(req))

        assert result.status.value == "COMPLETED"
        assert len(result.equity_curve) == len(mock_bars)
        assert result.statistics.win_rate >= 0

    def test_run_backtest_no_data(self):
        req = _make_request()
        with patch("app.modules.backtest.engine.get_historical_data", new_callable=AsyncMock) as m:
            m.return_value = []
            with pytest.raises(BacktestError, match="No data returned"):
                asyncio.get_event_loop().run_until_complete(run_backtest(req))

    def test_insufficient_bars(self):
        req = _make_request(
            strategy=StrategyName.EMA_CROSSOVER,
            strategy_config={"fast_period": 50, "slow_period": 200},
        )
        mock_bars = self._mock_bars(10)  # far fewer than 200
        with patch("app.modules.backtest.engine.get_historical_data", new_callable=AsyncMock) as m:
            m.return_value = mock_bars
            with pytest.raises(BacktestError, match="Insufficient data"):
                asyncio.get_event_loop().run_until_complete(run_backtest(req))


# ─── API Endpoint Tests ────────────────────────────────────────────────────────

client = TestClient(app)


class TestAPI:
    def test_health_endpoint(self):
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"

    def test_strategies_endpoint(self):
        resp = client.get("/api/v1/backtest/strategies")
        assert resp.status_code == 200
        strategies = resp.json()
        ids = [s["id"] for s in strategies]
        assert "EMA_CROSSOVER" in ids
        assert "RSI_DIVERGENCE" in ids
        assert "BOLLINGER_BANDS" in ids
        assert "MACD_SIGNAL" in ids

    def test_engine_health_endpoint(self):
        resp = client.get("/api/v1/backtest/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert "cache" in data

    def test_run_backtest_invalid_dates(self):
        payload = {
            "strategy": "EMA_CROSSOVER",
            "strategy_config": {"fast_period": 5, "slow_period": 10},
            "name": "Bad Dates",
            "symbol": "BTCUSDT",
            "interval": "1d",
            "trading_market": "BINANCE",
            "initial_cash": 10000,
            "commission": 0.001,
            "quantity": 1,
            "spread": 0.0005,
            "intraday": False,
            "start_date": "2024-06-30",
            "end_date": "2024-01-01",
        }
        resp = client.post("/api/v1/backtest/run", json=payload)
        assert resp.status_code == 422

    def test_run_backtest_unknown_strategy(self):
        payload = {
            "strategy": "NONEXISTENT",
            "strategy_config": {},
            "name": "Bad Strategy",
            "symbol": "BTCUSDT",
            "interval": "1d",
            "trading_market": "BINANCE",
            "initial_cash": 10000,
            "commission": 0.001,
            "quantity": 1,
            "spread": 0.0005,
            "intraday": False,
            "start_date": "2024-01-01",
            "end_date": "2024-06-30",
        }
        resp = client.post("/api/v1/backtest/run", json=payload)
        assert resp.status_code == 422

    def test_run_backtest_success_mocked(self):
        """Full end-to-end API test with mocked Binance data."""
        from app.services.market_data.base import OHLCV
        import numpy as np
        np.random.seed(1)
        prices = 30000 + np.cumsum(np.random.randn(100) * 50)
        index = pd.date_range("2024-01-01", periods=100, freq="D", tz="UTC")
        mock_bars = [
            OHLCV(str(ts), float(p), float(p * 1.005), float(p * 0.995), float(p + 10), 5e5)
            for ts, p in zip(index, prices)
        ]

        payload = {
            "strategy": "EMA_CROSSOVER",
            "strategy_config": {"fast_period": 5, "slow_period": 10},
            "name": "API Test",
            "symbol": "BTCUSDT",
            "interval": "1d",
            "trading_market": "BINANCE",
            "initial_cash": 10000,
            "commission": 0.001,
            "quantity": 1,
            "spread": 0.0005,
            "intraday": False,
            "start_date": "2024-01-01",
            "end_date": "2024-04-10",
        }

        with patch("app.modules.backtest.engine.get_historical_data", new_callable=AsyncMock) as m:
            m.return_value = mock_bars
            resp = client.post("/api/v1/backtest/run", json=payload)

        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "COMPLETED"
        assert "equity_curve" in data
        assert "statistics" in data
        assert "trade_log" in data
        assert "parameters" in data