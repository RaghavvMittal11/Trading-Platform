# File: src/components/BacktestForm/MarketDataSection.jsx

## ELI5: What is this file?
This is **Part 3 of the Form**. It asks about the market type. "Are we trading Stocks (Equity) or Futures?" and "Which Exchange (NSE)?"

## How it works
- It draws dropdown menus.
- It pulls the list of options (like 'FUTURE', 'EQUITY') from the `constants` file so we don't have to hardcode them here.

## Summary for Developers
- Using constants ensures that if we rename "EQUITY" to "STOCKS" in the future, we only have to change it in one place (the constants file).
