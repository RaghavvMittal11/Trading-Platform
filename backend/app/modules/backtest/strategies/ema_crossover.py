"""
app/modules/backtest/strategies/ema_crossover.py
──────────────────────────────────────────────────
EMA Crossover Strategy

Signal logic:
  BUY  when fast EMA crosses ABOVE slow EMA (bullish crossover)
  SELL when fast EMA crosses BELOW slow EMA (bearish crossover)
  HOLD otherwise

Params: fast_period (default 12), slow_period (default 26)
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


class EMACrossoverStrategy(BaseStrategy):
    display_name = "EMA CrossOver"
    strategy_id = "EMA_CROSSOVER"

    def _validate_config(self, config: Dict[str, Any]) -> None:
        try:
            self.fast_period = int(config.get("fast_period", 12))
            self.slow_period = int(config.get("slow_period", 26))
        except (TypeError, ValueError) as exc:
            raise StrategyConfigError(f"EMA CrossOver: invalid config – {exc}") from exc

        if self.fast_period < 2:
            raise StrategyConfigError("fast_period must be ≥ 2")
        if self.slow_period <= self.fast_period:
            raise StrategyConfigError("slow_period must be > fast_period")

        # State for live tick evaluation (Module 4)
        self._fast_prices: deque[float] = deque(maxlen=self.fast_period * 3)
        self._slow_prices: deque[float] = deque(maxlen=self.slow_period * 3)
        self._prev_fast_ema: float | None = None
        self._prev_slow_ema: float | None = None

    @property
    def min_bars_required(self) -> int:
        return self.slow_period

    # ─── Backtesting (vectorised) ─────────────────────────────────────────────

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        df["ema_fast"] = df["close"].ewm(span=self.fast_period, adjust=False).mean()
        df["ema_slow"] = df["close"].ewm(span=self.slow_period, adjust=False).mean()

        # Detect crossovers: current bar's relationship vs previous bar
        prev_fast = df["ema_fast"].shift(1)
        prev_slow = df["ema_slow"].shift(1)

        bullish_cross = (df["ema_fast"] > df["ema_slow"]) & (prev_fast <= prev_slow)
        bearish_cross = (df["ema_fast"] < df["ema_slow"]) & (prev_fast >= prev_slow)

        df["signal"] = np.where(bullish_cross, SIGNAL_BUY,
                       np.where(bearish_cross, SIGNAL_SELL, SIGNAL_HOLD))

        # Zero out the warm-up period
        df.loc[df.index[: self.slow_period], "signal"] = SIGNAL_HOLD

        return df

    # ─── Live tick evaluation (Module 4) ─────────────────────────────────────

    def evaluate_tick(self, tick: Dict[str, float], position: int) -> int:
        close = tick["close"]
        self._fast_prices.append(close)
        self._slow_prices.append(close)

        if len(self._fast_prices) < self.fast_period or len(self._slow_prices) < self.slow_period:
            return SIGNAL_HOLD

        # Recalculate EMA from history
        fast_ema = _calc_ema(list(self._fast_prices), self.fast_period)
        slow_ema = _calc_ema(list(self._slow_prices), self.slow_period)

        signal = SIGNAL_HOLD
        if self._prev_fast_ema is not None and self._prev_slow_ema is not None:
            if fast_ema > slow_ema and self._prev_fast_ema <= self._prev_slow_ema:
                signal = SIGNAL_BUY
            elif fast_ema < slow_ema and self._prev_fast_ema >= self._prev_slow_ema:
                signal = SIGNAL_SELL

        self._prev_fast_ema = fast_ema
        self._prev_slow_ema = slow_ema
        return signal


def _calc_ema(prices: list[float], period: int) -> float:
    """Compute the final EMA value from a price list."""
    k = 2 / (period + 1)
    ema = prices[0]
    for p in prices[1:]:
        ema = p * k + ema * (1 - k)
    return ema