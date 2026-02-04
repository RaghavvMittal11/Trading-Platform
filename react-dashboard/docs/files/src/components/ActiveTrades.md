# File: src/components/ActiveTrades.jsx

## ELI5: What is this file?
This is the **Live Trades List**. It's the table on the dashboard that shows "What am I buying/selling right now?".

## How does it work?

### The Logic
It loops through a list of trades (the `trades` array).
- **Color Logic**: It checks if you are winning or losing money.
  - If `PNL > 0` (Positive), it makes the text **Green**.
  - If `PNL < 0` (Negative), it makes the text **Red**.

### The Layout
It's just a simple table.
- Column 1: Symbol (e.g., BTCUSDT).
- Column 2: Entry Price vs Current Price.
- Column 3: The Profit/Loss number.

## Summary for Developers
- This is a display-only component.
- It doesn't execute trades; it just shows them.
