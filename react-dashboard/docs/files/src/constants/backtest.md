# File: src/constants/backtest.js

## ELI5: What is this file?
This is a **Dictionary** or a **Menu Card**. It doesn't contain logic (functions); it just contains *data* that we use to fill up dropdown selection lists.

## What's inside this code?

### `INITIAL_BACKTEST_FORM`
- **What it is**: A cheat sheet for what a blank form looks like.
- **Usage**: When the "New Backtest" modal opens, we use this to make sure all the text boxes start empty (or with default values like '100000' for cash).

### `STRATEGIES`
- **What it is**: A list of options.
- **Data**: Contains items like "EMA CrossOver" and "RSI Divergence".
- **Usage**: The "Strategy" dropdown menu reads this list to know what to show the user.

### `CONFIGS` / `CONTRACT_TYPES` / `MARKETS`
- **What they are**: Similar lists for other dropdowns.
- **Usage**: Used to populate the "Configuration", "Type" (Future vs Equity), and "Market" options.

## Summary for Developers
- **Why do we separate this?** Imagine we wanted to add a new Market called "FOREX". Instead of hunting through the complex code in the Modal component, we just add `{ value: 'FX', label: 'FOREX' }` to the `MARKETS` list here, and it automatically appears in the UI. Convenient!
