"""
app/modules/backtest/engine.py
────────────────────────────────
Backtesting Engine Orchestrator — HLD §4.2, Module 2
Binance / Cryptocurrency only (SRS §1.2)

Pipeline:
  1. Fetch historical K-lines (LRU cached, Binance REST).
  2. Build Pandas DataFrame with candle source-price column.
  3. Instantiate strategy from registry; validate config.
  4. Off-load vectorised signal generation to ThreadPoolExecutor.
  5. Off-load trade simulation to ThreadPoolExecutor.
  6. Synthesize performance metrics.
  7. Return BacktestRunResponse.
  8. Persist to DB (stub — replace with PostgreSQL insert for Module 4).
"""

from __future__ import annotations

import asyncio
import logging
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

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

_thread_pool = ThreadPoolExecutor(
    max_workers=settings.BACKTEST_THREAD_POOL_SIZE,
    thread_name_prefix="backtest-worker",
)


class BacktestError(RuntimeError):
    """Raised when a backtest cannot be completed."""


async def run_backtest(request: BacktestRunRequest) -> BacktestRunResponse:
    """Primary entry point — called by the API route handler."""

    backtest_id = str(uuid.uuid4())
    created_at  = datetime.now(tz=timezone.utc)

    logger.info(
        "Backtest %s | strategy=%s symbol=%s interval=%s [%s → %s]",
        backtest_id, request.strategy.value, request.symbol,
        request.interval.value, request.start_date, request.end_date,
    )

    # ── 1. Fetch historical K-lines (LRU cached) ──────────────────────────────
    try:
        bars = await get_historical_data(
            market=request.trading_market.value,
            symbol=request.symbol,
            interval=request.interval.value,
            start_date=request.start_date,
            end_date=request.end_date,
        )
    except KeyError as exc:
        raise BacktestError(f"Unsupported market: {exc}") from exc
    except Exception as exc:
        raise BacktestError(f"Failed to fetch market data: {exc}") from exc

    if not bars:
        raise BacktestError(
            f"No data returned for {request.symbol} "
            f"[{request.start_date} → {request.end_date}]. "
            "Check the symbol name and date range."
        )

    # ── 2. Build DataFrame ────────────────────────────────────────────────────
    df = _bars_to_dataframe(bars)

    # ── 3. Instantiate and validate strategy ──────────────────────────────────
    try:
        strategy = get_strategy(request.strategy.value, request.strategy_config)
    except KeyError as exc:
        raise BacktestError(str(exc)) from exc
    except StrategyConfigError as exc:
        raise BacktestError(f"Strategy config error: {exc}") from exc

    if len(df) < strategy.min_bars_required:
        raise BacktestError(
            f"Insufficient data: {request.strategy.value} requires at least "
            f"{strategy.min_bars_required} bars; got {len(df)}. "
            "Extend the date range or use a shorter interval."
        )

    # ── 4. Vectorised signal generation (thread pool) ────────────────────────
    loop = asyncio.get_running_loop()
    try:
        df_signals = await loop.run_in_executor(
            _thread_pool, strategy.generate_signals, df
        )
    except Exception as exc:
        raise BacktestError(f"Signal generation failed: {exc}") from exc

    # ── 5. Trade simulation (thread pool) ────────────────────────────────────
    try:
        equity_curve, raw_trades, _ = await loop.run_in_executor(
            _thread_pool,
            _run_simulation,
            df_signals,
            request,
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
        symbol=request.symbol,
        interval=request.interval.value,
        contract_type=request.contract_type.value,
        trading_market=request.trading_market.value,
        initial_cash=request.initial_cash,
        commission=request.commission,
        slippage=request.slippage,
        order_size_mode=request.order_size_mode.value,
        order_size_usdt=request.order_size_usdt,
        order_size_pct=request.order_size_pct,
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
        "Backtest %s completed | trades=%d return=%.2f%%",
        backtest_id, statistics.total_trades, statistics.total_return_pct,
    )

    await _persist_result_stub(backtest_id, request, response)
    return response


# ─── Synchronous helpers (run inside thread pool) ─────────────────────────────

def _run_simulation(df: pd.DataFrame, req: BacktestRunRequest) -> tuple:
    return simulate_trades(
        df=df,
        initial_cash=req.initial_cash,
        commission=req.commission,
        slippage=req.slippage,
        order_size_mode=req.order_size_mode,
        order_size_pct=req.order_size_pct,
        order_size_usdt=req.order_size_usdt,
        intraday=req.intraday,
    )


def _bars_to_dataframe(bars: list[OHLCV]) -> pd.DataFrame:
    records = [
        {"timestamp": b.timestamp, "open": b.open, "high": b.high,
         "low": b.low, "close": b.close, "volume": b.volume}
        for b in bars
    ]
    df = pd.DataFrame(records)
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
    df = df.set_index("timestamp").sort_index()
    for col in ("open", "high", "low", "close", "volume"):
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df.dropna(subset=["open", "high", "low", "close"])


# ─── DB persistence stub ─────────────────────────────────────────────────────

async def _persist_result_stub(backtest_id, request, response) -> None:
    """
    Replace with asyncpg / SQLAlchemy insert once Module 4 DB layer is ready.
    The Backtest Results listing page depends on persisted data.
    """
    logger.debug("DB persist stub — backtest_id=%s (no-op)", backtest_id)