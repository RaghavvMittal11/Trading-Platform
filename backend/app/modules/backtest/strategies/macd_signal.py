"""
app/modules/backtest/strategies/macd_signal.py
────────────────────────────────────────────────
MACD Signal Strategy

Signal logic:
  BUY  when MACD line crosses ABOVE signal line (bullish momentum)
  SELL when MACD line crosses BELOW signal line (bearish momentum)
  HOLD otherwise

Params: fast_period (12), slow_period (26), signal_period (9)
"""

from __future__ import annotations

from collections import deque
from typing import Any, Dict

import numpy as np
import pandas as pd

from app.modules.backtest.strategies.base import (
    SIGNAL_BUY,
    SIGNAL_HOLD,
    SIGNAL_SELL,
    BaseStrategy,
    StrategyConfigError,
)


class MACDSignalStrategy(BaseStrategy):
    display_name = "MACD Signal"
    strategy_id = "MACD_SIGNAL"

    def _validate_config(self, config: Dict[str, Any]) -> None:
        try:
            self.fast_period = int(config.get("fast_period", 12))
            self.slow_period = int(config.get("slow_period", 26))
            self.signal_period = int(config.get("signal_period", 9))
        except (TypeError, ValueError) as exc:
            raise StrategyConfigError(f"MACD Signal: invalid config – {exc}") from exc

        if self.fast_period < 2:
            raise StrategyConfigError("fast_period must be ≥ 2")
        if self.slow_period <= self.fast_period:
            raise StrategyConfigError("slow_period must be > fast_period")
        if self.signal_period < 2:
            raise StrategyConfigError("signal_period must be ≥ 2")

        # Live state
        self._prices: deque[float] = deque(maxlen=self.slow_period * 3)
        self._prev_macd: float | None = None
        self._prev_signal: float | None = None

    @property
    def min_bars_required(self) -> int:
        return self.slow_period + self.signal_period

    # ─── Backtesting ─────────────────────────────────────────────────────────

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        df["macd_fast"] = df["close"].ewm(span=self.fast_period, adjust=False).mean()
        df["macd_slow"] = df["close"].ewm(span=self.slow_period, adjust=False).mean()
        df["macd_line"] = df["macd_fast"] - df["macd_slow"]
        df["macd_signal"] = df["macd_line"].ewm(span=self.signal_period, adjust=False).mean()
        df["macd_hist"] = df["macd_line"] - df["macd_signal"]

        prev_macd = df["macd_line"].shift(1)
        prev_signal = df["macd_signal"].shift(1)

        buy_signal = (df["macd_line"] > df["macd_signal"]) & (prev_macd <= prev_signal)
        sell_signal = (df["macd_line"] < df["macd_signal"]) & (prev_macd >= prev_signal)

        df["signal"] = np.where(buy_signal, SIGNAL_BUY,
                       np.where(sell_signal, SIGNAL_SELL, SIGNAL_HOLD))

        warmup = self.slow_period + self.signal_period
        df.loc[df.index[:warmup], "signal"] = SIGNAL_HOLD
        return df

    # ─── Live ────────────────────────────────────────────────────────────────

    def evaluate_tick(self, tick: Dict[str, float], position: int) -> int:
        self._prices.append(tick["close"])
        prices = list(self._prices)

        if len(prices) < self.slow_period + self.signal_period:
            return SIGNAL_HOLD

        macd_line, signal_line = _calc_macd(prices, self.fast_period, self.slow_period, self.signal_period)

        result = SIGNAL_HOLD
        if self._prev_macd is not None and self._prev_signal is not None:
            if macd_line > signal_line and self._prev_macd <= self._prev_signal:
                result = SIGNAL_BUY
            elif macd_line < signal_line and self._prev_macd >= self._prev_signal:
                result = SIGNAL_SELL

        self._prev_macd = macd_line
        self._prev_signal = signal_line
        return result


def _ema_series(prices: list[float], period: int) -> list[float]:
    k = 2 / (period + 1)
    ema = [prices[0]]
    for p in prices[1:]:
        ema.append(p * k + ema[-1] * (1 - k))
    return ema


def _calc_macd(
    prices: list[float],
    fast: int,
    slow: int,
    signal: int,
) -> tuple[float, float]:
    fast_ema = _ema_series(prices, fast)
    slow_ema = _ema_series(prices, slow)
    macd = [f - s for f, s in zip(fast_ema, slow_ema)]
    signal_ema = _ema_series(macd[slow - 1:], signal)
    return macd[-1], signal_ema[-1]