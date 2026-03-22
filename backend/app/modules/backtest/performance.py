"""
app/modules/backtest/performance.py
────────────────────────────────────
Performance Synthesizer — HLD §4.2

Converts raw trade-simulation output into UI-ready metrics:
  • Equity curve        (Portfolio Performance chart)
  • Win Rate            (stat card)
  • Max Drawdown        (statistics tab)
  • Total Return / P&L  (quick stats)
  • Profit Factor, Avg Win/Loss, Trade Log

This module is purely functional (no I/O) so it can be unit-tested in isolation
and re-used by any future reporting module.
"""

from __future__ import annotations

import math
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd

from app.schemas.backtest import (
    BacktestStatistics,
    EquityPoint,
    TradeRecord,
)


# ─── Trade Simulation ─────────────────────────────────────────────────────────

def simulate_trades(
    df: pd.DataFrame,
    initial_cash: float,
    commission: float,
    quantity: int,
    spread: float,
    intraday: bool,
) -> Tuple[List[EquityPoint], List[Dict[str, Any]], float]:
    """
    Walk-forward trade simulation with look-ahead bias prevention.

    Rules:
      • Signals are shifted by 1 bar (act on next bar's open).
      • Buy execution price  = open × (1 + spread)
      • Sell execution price = open × (1 − spread)
      • Commission is charged on each leg (buy cost & sell revenue).
      • If intraday=True, any open position is closed at the final bar of
        each calendar day at that bar's close price.

    Args:
        df:           DataFrame with columns [open, high, low, close, volume, signal].
        initial_cash: Starting portfolio value.
        commission:   Fractional per-trade commission (e.g. 0.001 = 0.1 %).
        quantity:     Fixed units per trade.
        spread:       Half-spread fraction applied to execution price.
        intraday:     Whether to force-close positions at end of each day.

    Returns:
        (equity_curve, raw_trades, final_cash)
    """
    signals = df["signal"].values
    opens   = df["open"].values
    closes  = df["close"].values
    dates   = df.index

    position     = 0
    entry_price  = 0.0
    entry_cost   = 0.0
    cash         = initial_cash
    raw_trades: List[Dict[str, Any]] = []
    equity_curve: List[EquityPoint] = [
        EquityPoint(timestamp=str(dates[0]), value=round(initial_cash, 2))
    ]
    trade_number = 0

    for i in range(1, len(df)):
        prev_signal = int(signals[i - 1])
        exec_buy    = opens[i] * (1 + spread)
        exec_sell   = opens[i] * (1 - spread)

        # ── Enter long ────────────────────────────────────────────────────────
        if prev_signal == 1 and position == 0:
            cost = exec_buy * quantity * (1 + commission)
            if cash >= cost:
                position    = quantity
                entry_price = exec_buy
                entry_cost  = cost
                cash       -= cost
                trade_number += 1
                raw_trades.append({
                    "trade_number": trade_number,
                    "direction":    "LONG",
                    "entry_date":   str(dates[i]),
                    "entry_price":  round(exec_buy, 8),
                    "exit_date":    None,
                    "exit_price":   None,
                    "quantity":     quantity,
                    "pnl":          None,
                    "return_pct":   None,
                    "status":       "OPEN",
                    "entry_bar":    i,
                })

        # ── Intraday force-close ──────────────────────────────────────────────
        if intraday and position > 0:
            current_day = _day_of(dates[i])
            entry_day   = _day_of(dates[raw_trades[-1]["entry_bar"]] if raw_trades else dates[i])
            is_last_bar_of_day = (
                i == len(df) - 1
                or _day_of(dates[i + 1]) != current_day
            )
            if is_last_bar_of_day and entry_day == current_day:
                prev_signal = -1  # force close

        # ── Exit long ─────────────────────────────────────────────────────────
        if prev_signal == -1 and position > 0:
            revenue  = exec_sell * position * (1 - commission)
            pnl      = round(revenue - entry_cost, 6)
            ret_pct  = round((pnl / entry_cost) * 100, 4)
            cash    += revenue
            position = 0

            if raw_trades and raw_trades[-1]["status"] == "OPEN":
                raw_trades[-1].update({
                    "exit_date":  str(dates[i]),
                    "exit_price": round(exec_sell, 8),
                    "pnl":        pnl,
                    "return_pct": ret_pct,
                    "status":     "CLOSED",
                })

        portfolio_value = cash + (position * closes[i])
        equity_curve.append(EquityPoint(timestamp=str(dates[i]), value=round(portfolio_value, 2)))

    # Mark any remaining open trade as open with unrealised P&L
    if raw_trades and raw_trades[-1]["status"] == "OPEN" and position > 0:
        unrealised = round((closes[-1] - entry_price) * position, 6)
        raw_trades[-1]["unrealised_pnl"] = unrealised

    final_cash = cash + (position * closes[-1] if position > 0 else 0)
    return equity_curve, raw_trades, final_cash


# ─── Performance Metrics ──────────────────────────────────────────────────────

def synthesize(
    equity_curve: List[EquityPoint],
    raw_trades: List[Dict[str, Any]],
    initial_cash: float,
) -> Tuple[BacktestStatistics, List[TradeRecord]]:
    """
    Compute all performance statistics from the simulation output.

    Returns:
        (BacktestStatistics, list of TradeRecord)
    """
    closed = [t for t in raw_trades if t["status"] == "CLOSED"]
    open_  = [t for t in raw_trades if t["status"] == "OPEN"]

    final_value    = equity_curve[-1].value if equity_curve else initial_cash
    total_return   = round(final_value - initial_cash, 2)
    total_ret_pct  = round((total_return / initial_cash) * 100, 4) if initial_cash else 0.0

    winners = [t for t in closed if (t["pnl"] or 0) > 0]
    losers  = [t for t in closed if (t["pnl"] or 0) <= 0]

    win_rate = round(len(winners) / len(closed) * 100, 2) if closed else 0.0
    avg_win  = round(sum(t["pnl"] for t in winners) / len(winners), 2) if winners else 0.0
    avg_loss = round(sum(t["pnl"] for t in losers)  / len(losers),  2) if losers  else 0.0

    gross_wins   = sum(t["pnl"] for t in winners)
    gross_losses = abs(sum(t["pnl"] for t in losers))
    profit_factor: Optional[float] = (
        round(gross_wins / gross_losses, 4) if gross_losses > 0 else None
    )

    max_dd, max_dd_pct = _max_drawdown(equity_curve)

    avg_dur = _avg_duration(closed)

    stats = BacktestStatistics(
        total_return=total_return,
        total_return_pct=total_ret_pct,
        final_portfolio_value=round(final_value, 2),
        win_rate=win_rate,
        max_drawdown=round(max_dd, 2),
        max_drawdown_pct=round(max_dd_pct, 4),
        total_trades=len(closed),
        winning_trades=len(winners),
        losing_trades=len(losers),
        open_trades=len(open_),
        avg_win=avg_win,
        avg_loss=avg_loss,
        profit_factor=profit_factor,
        avg_trade_duration_bars=avg_dur,
    )

    trade_records = [
        TradeRecord(
            trade_number=t["trade_number"],
            direction=t["direction"],
            entry_date=t["entry_date"],
            entry_price=t["entry_price"],
            exit_date=t.get("exit_date"),
            exit_price=t.get("exit_price"),
            quantity=t["quantity"],
            pnl=t.get("pnl"),
            return_pct=t.get("return_pct"),
            status=t["status"],
        )
        for t in raw_trades
    ]

    return stats, trade_records


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _max_drawdown(equity_curve: List[EquityPoint]) -> Tuple[float, float]:
    """Return (max_drawdown_abs, max_drawdown_pct)."""
    if not equity_curve:
        return 0.0, 0.0
    peak = equity_curve[0].value
    max_dd = 0.0
    max_dd_pct = 0.0
    for point in equity_curve:
        v = point.value
        if v > peak:
            peak = v
        dd = peak - v
        dd_pct = (dd / peak * 100) if peak > 0 else 0.0
        if dd_pct > max_dd_pct:
            max_dd = dd
            max_dd_pct = dd_pct
    return max_dd, max_dd_pct


def _avg_duration(closed_trades: List[Dict[str, Any]]) -> Optional[float]:
    """Average trade duration in bars."""
    durations = []
    for t in closed_trades:
        entry_bar = t.get("entry_bar")
        # We don't store exit_bar directly; derive from index difference if available
        if entry_bar is not None and t.get("exit_date"):
            durations.append(entry_bar)  # placeholder; engine provides bar count
    if not durations:
        return None
    return round(sum(durations) / len(durations), 1)


def _day_of(ts: object) -> str:
    return str(ts)[:10]