"""
app/modules/backtest/strategies/rsi_divergence.py
───────────────────────────────────────────────────
RSI Divergence Strategy

Signal logic:
  BUY  when RSI crosses UP through the oversold threshold (momentum reversal)
  SELL when RSI crosses DOWN through the overbought threshold
  HOLD otherwise

Params: period (default 14), overbought (default 70), oversold (default 30)
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


class RSIDivergenceStrategy(BaseStrategy):
    display_name = "RSI Divergence"
    strategy_id = "RSI_DIVERGENCE"

    def _validate_config(self, config: Dict[str, Any]) -> None:
        try:
            self.period = int(config.get("period", 14))
            self.overbought = float(config.get("overbought", 70.0))
            self.oversold = float(config.get("oversold", 30.0))
        except (TypeError, ValueError) as exc:
            raise StrategyConfigError(f"RSI Divergence: invalid config – {exc}") from exc

        if self.period < 2:
            raise StrategyConfigError("period must be ≥ 2")
        if not (0 < self.oversold < self.overbought < 100):
            raise StrategyConfigError("Must satisfy 0 < oversold < overbought < 100")

        # Live state
        self._prices: deque[float] = deque(maxlen=self.period + 1)
        self._prev_rsi: float | None = None

    @property
    def min_bars_required(self) -> int:
        return self.period + 1

    # ─── Backtesting ─────────────────────────────────────────────────────────

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        delta = df["close"].diff()
        gain = delta.clip(lower=0).rolling(window=self.period, min_periods=self.period).mean()
        loss = (-delta.clip(upper=0)).rolling(window=self.period, min_periods=self.period).mean()

        rs = gain / loss.replace(0, np.nan)
        df["rsi"] = 100 - (100 / (1 + rs))

        prev_rsi = df["rsi"].shift(1)

        # Crossover: RSI moves from below oversold to above (buy momentum)
        buy_signal = (df["rsi"] > self.oversold) & (prev_rsi <= self.oversold)
        # Crossover: RSI moves from above overbought to below (sell momentum)
        sell_signal = (df["rsi"] < self.overbought) & (prev_rsi >= self.overbought)

        df["signal"] = np.where(buy_signal, SIGNAL_BUY,
                       np.where(sell_signal, SIGNAL_SELL, SIGNAL_HOLD))

        df.loc[df.index[: self.period + 1], "signal"] = SIGNAL_HOLD
        return df

    # ─── Live ────────────────────────────────────────────────────────────────

    def evaluate_tick(self, tick: Dict[str, float], position: int) -> int:
        self._prices.append(tick["close"])
        if len(self._prices) < self.period + 1:
            return SIGNAL_HOLD

        prices = list(self._prices)
        rsi = _calc_rsi(prices, self.period)

        signal = SIGNAL_HOLD
        if self._prev_rsi is not None:
            if rsi > self.oversold and self._prev_rsi <= self.oversold:
                signal = SIGNAL_BUY
            elif rsi < self.overbought and self._prev_rsi >= self.overbought:
                signal = SIGNAL_SELL

        self._prev_rsi = rsi
        return signal


def _calc_rsi(prices: list[float], period: int) -> float:
    deltas = [prices[i] - prices[i - 1] for i in range(1, len(prices))]
    gains = [d for d in deltas if d > 0]
    losses = [-d for d in deltas if d < 0]
    avg_gain = sum(gains[-period:]) / period if gains else 0.0
    avg_loss = sum(losses[-period:]) / period if losses else 0.0
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))