"""
app/schemas/backtest.py
────────────────────────
All Pydantic request / response models for the Backtesting Engine.

Mirrors the "Start New Backtest" modal visible in the frontend designs and
the report tabs (Overview / Parameters / Statistics).
"""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, model_validator


# ─── Enums ────────────────────────────────────────────────────────────────────

class StrategyName(str, Enum):
    EMA_CROSSOVER = "EMA_CROSSOVER"
    RSI_DIVERGENCE = "RSI_DIVERGENCE"
    BOLLINGER_BANDS = "BOLLINGER_BANDS"
    MACD_SIGNAL = "MACD_SIGNAL"


class ContractType(str, Enum):
    SPOT = "SPOT"
    FUTURE = "FUTURE"


class TradingMarket(str, Enum):
    BINANCE = "BINANCE"         # live / paper (current scope per SRS §1.2)
    # NSE / BSE stubs – future Multi-Broker scope (SRS §1.4)
    NSE = "NSE"
    BSE = "BSE"


class Interval(str, Enum):
    """Binance-compatible K-line intervals."""
    M1 = "1m"
    M3 = "3m"
    M5 = "5m"
    M15 = "15m"
    M30 = "30m"
    H1 = "1h"
    H2 = "2h"
    H4 = "4h"
    H6 = "6h"
    H8 = "8h"
    H12 = "12h"
    D1 = "1d"
    D3 = "3d"
    W1 = "1w"
    MO1 = "1M"


class BacktestStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    ERROR = "ERROR"


# ─── Strategy Parameter Schemas ───────────────────────────────────────────────

class EMACrossoverParams(BaseModel):
    fast_period: int = Field(default=12, ge=2, le=200, description="Fast EMA window")
    slow_period: int = Field(default=26, ge=2, le=500, description="Slow EMA window")

    @model_validator(mode="after")
    def _validate_periods(self) -> "EMACrossoverParams":
        if self.fast_period >= self.slow_period:
            raise ValueError("fast_period must be less than slow_period")
        return self


class RSIDivergenceParams(BaseModel):
    period: int = Field(default=14, ge=2, le=100, description="RSI rolling window")
    overbought: float = Field(default=70.0, ge=50.0, le=100.0)
    oversold: float = Field(default=30.0, ge=0.0, le=50.0)

    @model_validator(mode="after")
    def _validate_thresholds(self) -> "RSIDivergenceParams":
        if self.oversold >= self.overbought:
            raise ValueError("oversold must be less than overbought")
        return self


class BollingerBandsParams(BaseModel):
    period: int = Field(default=20, ge=2, le=200, description="Rolling window for SMA/std")
    std_dev: float = Field(default=2.0, ge=0.5, le=5.0, description="Standard deviation multiplier")


class MACDSignalParams(BaseModel):
    fast_period: int = Field(default=12, ge=2, le=100)
    slow_period: int = Field(default=26, ge=2, le=300)
    signal_period: int = Field(default=9, ge=2, le=100)

    @model_validator(mode="after")
    def _validate_periods(self) -> "MACDSignalParams":
        if self.fast_period >= self.slow_period:
            raise ValueError("fast_period must be less than slow_period")
        return self


# ─── Request ─────────────────────────────────────────────────────────────────

class BacktestRunRequest(BaseModel):
    """
    Matches the "Start New Backtest" modal in the UI.
    user_id is injected by Module 1 JWT middleware (stub: None until then).
    """
    # Strategy
    strategy: StrategyName
    strategy_config: Dict[str, Any] = Field(
        default_factory=dict,
        description="Strategy-specific parameters; validated per strategy inside the engine",
    )

    # Metadata
    name: str = Field(..., min_length=1, max_length=120, description="Human-readable backtest name")

    # Market
    symbol: str = Field(..., min_length=1, max_length=20, description="e.g. BTCUSDT")
    contract_type: ContractType = ContractType.SPOT
    trading_market: TradingMarket = TradingMarket.BINANCE
    interval: Interval = Interval.H1

    # Simulation parameters (matches UI modal)
    initial_cash: float = Field(default=100_000.0, ge=1.0)
    commission: float = Field(default=0.001, ge=0.0, le=0.1, description="Fraction per trade leg, e.g. 0.001 = 0.1%")
    quantity: int = Field(default=1, ge=1, description="Units per trade")
    spread: float = Field(default=0.0005, ge=0.0, le=0.05, description="Half-spread fraction applied to execution price")
    intraday: bool = Field(default=False, description="If True, all positions are closed at end of each trading day")

    # Date range
    start_date: date = Field(..., description="Backtest start date (UTC)")
    end_date: date = Field(..., description="Backtest end date (UTC)")

    # Injected by Module 1 JWT middleware once integrated
    user_id: Optional[str] = Field(default=None, exclude=True)

    @model_validator(mode="after")
    def _validate_dates(self) -> "BacktestRunRequest":
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be before end_date")
        return self

    model_config = {"json_schema_extra": {
        "example": {
            "strategy": "EMA_CROSSOVER",
            "strategy_config": {"fast_period": 12, "slow_period": 26},
            "name": "EMA Test Run 1",
            "symbol": "BTCUSDT",
            "contract_type": "SPOT",
            "trading_market": "BINANCE",
            "interval": "1d",
            "initial_cash": 100000,
            "commission": 0.001,
            "quantity": 1,
            "spread": 0.0005,
            "intraday": False,
            "start_date": "2024-01-01",
            "end_date": "2024-06-30",
        }
    }}


# ─── Response ─────────────────────────────────────────────────────────────────

class EquityPoint(BaseModel):
    timestamp: str
    value: float


class TradeRecord(BaseModel):
    trade_number: int
    direction: str             # LONG / SHORT (SHORT added when strategies support it)
    entry_date: str
    entry_price: float
    exit_date: Optional[str]
    exit_price: Optional[float]
    quantity: int
    pnl: Optional[float]
    return_pct: Optional[float]
    status: str                # OPEN / CLOSED


class BacktestStatistics(BaseModel):
    """Detailed statistics tab – Performance Synthesizer output (HLD §4.2)."""
    total_return: float
    total_return_pct: float
    final_portfolio_value: float
    win_rate: float             # percentage 0–100
    max_drawdown: float         # absolute dollar value
    max_drawdown_pct: float     # percentage
    total_trades: int
    winning_trades: int
    losing_trades: int
    open_trades: int
    avg_win: float
    avg_loss: float
    profit_factor: Optional[float]
    avg_trade_duration_bars: Optional[float]


class BacktestParameters(BaseModel):
    """Parameters tab – mirrors the request for reference."""
    strategy: str
    strategy_config: Dict[str, Any]
    symbol: str
    interval: str
    contract_type: str
    trading_market: str
    initial_cash: float
    commission: float
    quantity: int
    spread: float
    intraday: bool
    start_date: str
    end_date: str
    duration_days: int


class BacktestRunResponse(BaseModel):
    """Full backtest report returned on completion."""
    backtest_id: str
    name: str
    status: BacktestStatus
    created_at: datetime

    # Overview tab
    equity_curve: List[EquityPoint]

    # Quick stats (shown below chart)
    start_date: str
    end_date: str
    duration_days: int
    total_return: float
    total_return_pct: float

    # Statistics tab
    statistics: BacktestStatistics

    # Parameters tab
    parameters: BacktestParameters

    # Detailed trade log
    trade_log: List[TradeRecord]

    # Non-null only if status == ERROR
    error_message: Optional[str] = None


class BacktestListItem(BaseModel):
    """Card shown on the Backtest Results page."""
    backtest_id: str
    name: str
    status: BacktestStatus
    strategy: str
    symbol: str
    total_return_pct: Optional[float]
    created_at: datetime