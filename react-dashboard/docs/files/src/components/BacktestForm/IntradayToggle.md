# File: src/components/BacktestForm/IntradayToggle.jsx

## ELI5: What is this file?
This is the **Switch**. It's the little toggle button at the bottom that says "Intraday Trading".

## How it works
- **`toggle` function**: When you click the switch, this function runs. It takes the previous answer (e.g., No) and swaps it to the opposite (Yes).
- **CSS Magic**: It uses CSS to slide the little white circle left or right depending on if the value is `true` or `false`.

## Summary for Developers
- It updates the `intraday` boolean in the main form data.
