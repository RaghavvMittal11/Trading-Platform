"""
app/modules/backtest/strategies/bollinger_bands.py
────────────────────────────────────────────────────
Bollinger Bands Strategy

Signal logic:
  BUY  when close crosses BELOW the lower band (mean-reversion entry)
  SELL when close crosses ABOVE the upper band (mean-reversion exit / short)
  HOLD otherwise

Params: period (default 20), std_dev (default 2.0)
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


class BollingerBandsStrategy(BaseStrategy):
    display_name = "Bollinger Bands"
    strategy_id = "BOLLINGER_BANDS"

    def _validate_config(self, config: Dict[str, Any]) -> None:
        try:
            self.period = int(config.get("period", 20))
            self.std_dev = float(config.get("std_dev", 2.0))
        except (TypeError, ValueError) as exc:
            raise StrategyConfigError(f"Bollinger Bands: invalid config – {exc}") from exc

        if self.period < 2:
            raise StrategyConfigError("period must be ≥ 2")
        if self.std_dev <= 0:
            raise StrategyConfigError("std_dev must be > 0")

        # Live state
        self._prices: deque[float] = deque(maxlen=self.period)
        self._prev_close: float | None = None
        self._prev_upper: float | None = None
        self._prev_lower: float | None = None

    @property
    def min_bars_required(self) -> int:
        return self.period

    # ─── Backtesting ─────────────────────────────────────────────────────────

    def generate_signals(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()

        df["bb_mid"] = df["close"].rolling(window=self.period, min_periods=self.period).mean()
        df["bb_std"] = df["close"].rolling(window=self.period, min_periods=self.period).std(ddof=1)
        df["bb_upper"] = df["bb_mid"] + self.std_dev * df["bb_std"]
        df["bb_lower"] = df["bb_mid"] - self.std_dev * df["bb_std"]

        prev_close = df["close"].shift(1)
        prev_upper = df["bb_upper"].shift(1)
        prev_lower = df["bb_lower"].shift(1)

        # Price touches / crosses lower band
        buy_signal = (df["close"] < df["bb_lower"]) & (prev_close >= prev_lower)
        # Price touches / crosses upper band
        sell_signal = (df["close"] > df["bb_upper"]) & (prev_close <= prev_upper)

        df["signal"] = np.where(buy_signal, SIGNAL_BUY,
                       np.where(sell_signal, SIGNAL_SELL, SIGNAL_HOLD))

        df.loc[df.index[: self.period], "signal"] = SIGNAL_HOLD
        return df

    # ─── Live ────────────────────────────────────────────────────────────────

    def evaluate_tick(self, tick: Dict[str, float], position: int) -> int:
        close = tick["close"]
        self._prices.append(close)

        if len(self._prices) < self.period:
            self._prev_close = close
            return SIGNAL_HOLD

        prices = list(self._prices)
        mean = np.mean(prices)
        std = np.std(prices, ddof=1)
        upper = mean + self.std_dev * std
        lower = mean - self.std_dev * std

        signal = SIGNAL_HOLD
        if self._prev_close is not None and self._prev_upper is not None and self._prev_lower is not None:
            if close < lower and self._prev_close >= self._prev_lower:
                signal = SIGNAL_BUY
            elif close > upper and self._prev_close <= self._prev_upper:
                signal = SIGNAL_SELL

        self._prev_close = close
        self._prev_upper = upper
        self._prev_lower = lower
        return signal