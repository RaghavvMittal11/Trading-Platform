"""
app/services/market_data/binance.py
─────────────────────────────────────
Binance REST API market data provider.

Handles:
  • Automatic pagination for date ranges > 1 000 bars
  • Retry with exponential backoff on transient errors
  • Connection to Testnet or Mainnet (configurable via settings)

Integration with Module 3 (Market Data Streamer):
  The Binance WebSocket Supervisor in Module 3 reuses the same base-URL
  constants from config.  This file covers only the REST / historical side.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import date, datetime, timezone
from typing import List

import httpx

from app.core.config import settings
from app.services.market_data.base import OHLCV, MarketDataProvider

logger = logging.getLogger(__name__)

_KLINES_ENDPOINT = "/api/v3/klines"
_EXCHANGE_INFO_ENDPOINT = "/api/v3/exchangeInfo"
_MAX_LIMIT = 1000      # Binance maximum bars per request
_MAX_RETRIES = 3
_RETRY_BACKOFF_BASE = 1.5  # seconds


def _to_ms(dt: datetime) -> int:
    return int(dt.timestamp() * 1000)


def _parse_row(row: list) -> OHLCV:
    return OHLCV(
        timestamp=datetime.fromtimestamp(row[0] / 1000, tz=timezone.utc).isoformat(),
        open=float(row[1]),
        high=float(row[2]),
        low=float(row[3]),
        close=float(row[4]),
        volume=float(row[5]),
    )


class BinanceMarketData(MarketDataProvider):
    """
    Concrete Binance implementation of MarketDataProvider.

    Uses the public (unauthenticated) REST endpoints for K-line data,
    so no API key is required for historical backtesting.
    """

    def __init__(self, base_url: str | None = None) -> None:
        self._base_url = base_url or settings.binance_history_base_url

    async def fetch_klines(
        self,
        symbol: str,
        interval: str,
        start_date: date,
        end_date: date,
    ) -> List[OHLCV]:
        """
        Fetch all K-lines for the given range via paginated requests.
        Returns a time-ascending list of OHLCV objects.
        """
        start_ms = _to_ms(datetime(start_date.year, start_date.month, start_date.day, tzinfo=timezone.utc))
        end_ms = _to_ms(datetime(end_date.year, end_date.month, end_date.day, 23, 59, 59, tzinfo=timezone.utc))

        all_bars: List[OHLCV] = []
        current_start = start_ms

        async with httpx.AsyncClient(base_url=self._base_url, timeout=30.0) as client:
            while current_start < end_ms:
                params = {
                    "symbol": symbol.upper(),
                    "interval": interval,
                    "startTime": current_start,
                    "endTime": end_ms,
                    "limit": _MAX_LIMIT,
                }

                raw = await self._get_with_retry(client, _KLINES_ENDPOINT, params)

                if not raw:
                    break  # no more data from Binance

                bars = [_parse_row(r) for r in raw]
                all_bars.extend(bars)

                # Advance cursor past the last received bar's close time (index 6)
                last_close_ms: int = raw[-1][6]
                current_start = last_close_ms + 1

                if len(raw) < _MAX_LIMIT:
                    break  # received fewer than max → we've hit the end

        logger.info(
            "Fetched %d bars for %s/%s [%s → %s]",
            len(all_bars), symbol, interval, start_date, end_date,
        )
        return all_bars

    async def validate_symbol(self, symbol: str) -> bool:
        """Return True if Binance recognises the symbol."""
        try:
            async with httpx.AsyncClient(base_url=self._base_url, timeout=10.0) as client:
                resp = await client.get(_EXCHANGE_INFO_ENDPOINT, params={"symbol": symbol.upper()})
                return resp.status_code == 200
        except Exception:
            return False

    @staticmethod
    async def _get_with_retry(
        client: httpx.AsyncClient,
        endpoint: str,
        params: dict,
    ) -> list:
        """GET with exponential backoff retry."""
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                resp = await client.get(endpoint, params=params)
                resp.raise_for_status()
                return resp.json()
            except httpx.HTTPStatusError as exc:
                # 429 rate-limited → always retry with backoff
                if exc.response.status_code == 429 or attempt < _MAX_RETRIES:
                    wait = _RETRY_BACKOFF_BASE ** attempt
                    logger.warning("Binance %s (attempt %d/%d) – retrying in %.1fs",
                                   exc.response.status_code, attempt, _MAX_RETRIES, wait)
                    await asyncio.sleep(wait)
                else:
                    raise
            except httpx.RequestError as exc:
                if attempt < _MAX_RETRIES:
                    wait = _RETRY_BACKOFF_BASE ** attempt
                    logger.warning("Network error (attempt %d/%d): %s – retrying in %.1fs",
                                   attempt, _MAX_RETRIES, exc, wait)
                    await asyncio.sleep(wait)
                else:
                    raise
        return []