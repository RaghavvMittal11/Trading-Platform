"""
app/services/market_data/__init__.py
──────────────────────────────────────
Provider factory.  To add a new broker, register it here.
"""

from app.services.market_data.base import OHLCV, MarketDataProvider
from app.services.market_data.binance import BinanceMarketData

_PROVIDER_REGISTRY: dict[str, type[MarketDataProvider]] = {
    "BINANCE": BinanceMarketData,
    # "NSE": UpstoxMarketData,   # Future – SRS §1.4
    # "BSE": DhanMarketData,     # Future – SRS §1.4
}


def get_market_data_provider(market: str) -> MarketDataProvider:
    """
    Return a market data provider instance for *market*.
    Raises KeyError if the market is not yet supported.
    """
    cls = _PROVIDER_REGISTRY.get(market.upper())
    if cls is None:
        raise KeyError(
            f"Market '{market}' is not supported. "
            f"Supported: {list(_PROVIDER_REGISTRY)}"
        )
    return cls()


__all__ = ["OHLCV", "MarketDataProvider", "BinanceMarketData", "get_market_data_provider"]