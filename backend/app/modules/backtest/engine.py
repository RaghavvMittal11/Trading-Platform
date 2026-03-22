"""
app/modules/backtest/engine.py
────────────────────────────────
Backtesting Engine — HLD §4.2 (Module 2: Strategy & Backtesting Engine)

Responsibilities:
  1. Receive a validated BacktestRunRequest.
  2. Retrieve historical K-line data via the LRU-cached data layer.
  3. Construct the appropriate strategy instance (from registry).
  4. Off-load CPU-bound vectorised Pandas/NumPy work to a thread pool
     (keeping FastAPI's async event loop unblocked).
  5. Run the walk-forward trade simulation.
  6. Pass results through the Performance Synthesizer.
  7. Return a fully populated BacktestRunResponse.

Integration contracts:
  ┌───────────────────────────────────────────────────────────────────────┐
  │ Module 1 (Auth):    user_id injected into request before engine call  │
  │ Module 3 (Stream):  strategies.evaluate_tick() reused for live bots   │
  │ Module 4 (Bot):     get_strategy() shared from strategy registry       │
  │ Module 5 (Order):   no direct dependency                               │
  └───────────────────────────────────────────────────────────────────────┘
"""

from __future__ import annotations

import asyncio
import logging
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from typing import Optional

import pandas as pd

from app.core.config import settings
from app.modules.backtest.data_cache import get_historical_data
from app.modules.backtest.performance import simulate_trades, synthesize
from app.modules.backtest.strategies import get_strategy
from app.modules.backtest.strategies.base import StrategyConfigError
from app.schemas.backtest import (
    BacktestParameters,
    BacktestRunRequest,
    BacktestRunResponse,
    BacktestStatus,
)
from app.services.market_data.base import OHLCV

logger = logging.getLogger(__name__)

# Shared thread pool for CPU-bound vectorised operations (HLD §4.2)
_thread_pool = ThreadPoolExecutor(
    max_workers=settings.BACKTEST_THREAD_POOL_SIZE,
    thread_name_prefix="backtest-worker",
)


class BacktestError(RuntimeError):
    """Raised when the backtest cannot be completed."""


async def run_backtest(request: BacktestRunRequest) -> BacktestRunResponse:
    """
    Primary entry point — called by the API route handler.

    Raises:
        BacktestError: On data, strategy, or simulation failures.
    """
    backtest_id = str(uuid.uuid4())
    created_at  = datetime.now(tz=timezone.utc)

    logger.info(
        "Backtest %s starting | strategy=%s symbol=%s interval=%s [%s → %s]",
        backtest_id, request.strategy.value, request.symbol,
        request.interval.value, request.start_date, request.end_date,
    )

    # ── 1. Fetch historical K-lines (cached) ──────────────────────────────────
    try:
        bars = await get_historical_data(
            market=request.trading_market.value,
            symbol=request.symbol.upper(),
            interval=request.interval.value,
            start_date=request.start_date,
            end_date=request.end_date,
        )
    except KeyError as exc:
        raise BacktestError(f"Market not supported: {exc}") from exc
    except Exception as exc:
        raise BacktestError(f"Failed to fetch market data: {exc}") from exc

    if not bars:
        raise BacktestError(
            f"No data returned for {request.symbol} [{request.start_date} → {request.end_date}]. "
            "The symbol may not exist or the date range is outside available history."
        )

    # ── 2. Build DataFrame ────────────────────────────────────────────────────
    df = _bars_to_dataframe(bars)

    # ── 3. Instantiate strategy ───────────────────────────────────────────────
    try:
        strategy = get_strategy(request.strategy.value, request.strategy_config)
    except KeyError as exc:
        raise BacktestError(str(exc)) from exc
    except StrategyConfigError as exc:
        raise BacktestError(f"Strategy config error: {exc}") from exc

    if len(df) < strategy.min_bars_required:
        raise BacktestError(
            f"Insufficient data: {request.strategy.value} requires at least "
            f"{strategy.min_bars_required} bars; got {len(df)}."
        )

    # ── 4. Off-load vectorised computation to thread pool ─────────────────────
    loop = asyncio.get_running_loop()
    try:
        df_with_signals = await loop.run_in_executor(
            _thread_pool,
            _vectorise,
            strategy,
            df,
        )
    except Exception as exc:
        raise BacktestError(f"Signal generation failed: {exc}") from exc

    # ── 5. Trade simulation ───────────────────────────────────────────────────
    try:
        equity_curve, raw_trades, _ = await loop.run_in_executor(
            _thread_pool,
            _simulate,
            df_with_signals,
            request.initial_cash,
            request.commission,
            request.quantity,
            request.spread,
            request.intraday,
        )
    except Exception as exc:
        raise BacktestError(f"Trade simulation failed: {exc}") from exc

    # ── 6. Performance synthesis ──────────────────────────────────────────────
    statistics, trade_records = synthesize(equity_curve, raw_trades, request.initial_cash)

    # ── 7. Assemble response ──────────────────────────────────────────────────
    duration_days = (request.end_date - request.start_date).days

    parameters = BacktestParameters(
        strategy=request.strategy.value,
        strategy_config=request.strategy_config,
        symbol=request.symbol.upper(),
        interval=request.interval.value,
        contract_type=request.contract_type.value,
        trading_market=request.trading_market.value,
        initial_cash=request.initial_cash,
        commission=request.commission,
        quantity=request.quantity,
        spread=request.spread,
        intraday=request.intraday,
        start_date=str(request.start_date),
        end_date=str(request.end_date),
        duration_days=duration_days,
    )

    response = BacktestRunResponse(
        backtest_id=backtest_id,
        name=request.name,
        status=BacktestStatus.COMPLETED,
        created_at=created_at,
        equity_curve=equity_curve,
        start_date=str(request.start_date),
        end_date=str(request.end_date),
        duration_days=duration_days,
        total_return=statistics.total_return,
        total_return_pct=statistics.total_return_pct,
        statistics=statistics,
        parameters=parameters,
        trade_log=trade_records,
    )

    logger.info(
        "Backtest %s completed | trades=%d total_return=%.2f%%",
        backtest_id,
        statistics.total_trades,
        statistics.total_return_pct,
    )

    # ── 8. Persist to DB (stub — Module 4 / DB integration) ──────────────────
    await _persist_result_stub(backtest_id, request, response)

    return response


# ─── Synchronous helpers (run inside thread pool) ─────────────────────────────

def _vectorise(strategy, df: pd.DataFrame) -> pd.DataFrame:
    """Call strategy.generate_signals() inside the thread pool."""
    return strategy.generate_signals(df)


def _simulate(
    df: pd.DataFrame,
    initial_cash: float,
    commission: float,
    quantity: int,
    spread: float,
    intraday: bool,
) -> tuple:
    """Call simulate_trades() inside the thread pool."""
    return simulate_trades(df, initial_cash, commission, quantity, spread, intraday)


# ─── DataFrame construction ───────────────────────────────────────────────────

def _bars_to_dataframe(bars: list[OHLCV]) -> pd.DataFrame:
    records = [
        {
            "timestamp": b.timestamp,
            "open":      b.open,
            "high":      b.high,
            "low":       b.low,
            "close":     b.close,
            "volume":    b.volume,
        }
        for b in bars
    ]
    df = pd.DataFrame(records)
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df = df.set_index("timestamp").sort_index()

    # Ensure numeric types (defensive; Binance returns strings)
    for col in ["open", "high", "low", "close", "volume"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["open", "high", "low", "close"])
    return df


# ─── DB persistence stub (wired up when Module 4 DB layer is ready) ──────────

async def _persist_result_stub(
    backtest_id: str,
    request: BacktestRunRequest,
    response: BacktestRunResponse,
) -> None:
    """
    Placeholder for persisting backtest results to PostgreSQL.

    Replace this with an actual async DB call once Module 4 /
    the database layer is integrated.  The result should be stored so that:
      • The Backtest Results page can list all runs.
      • The detail view can show equity curve + trade log from DB.
    """
    logger.debug("DB persist stub called for backtest_id=%s (no-op)", backtest_id)