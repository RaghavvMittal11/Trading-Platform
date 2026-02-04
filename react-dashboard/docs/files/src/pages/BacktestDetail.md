# File: src/pages/BacktestDetail.jsx

## ELI5: What is this file?
This is the **Report Card**. When you click on one specific item in the list, this page opens up. It shows you the deep details of *that specific* experiment—like exactly how much money it made, a chart of its performance, and what settings were used.

## What functions are there and what do they do?

### 1. `BacktestDetail` (The Component)
The main function that draws the page.
- **`useParams`**: It grabs the ID from the URL (e.g., if you are at `/backtest/5`, it grabs `5`). This lets the page know *which* report to show.
- **`activeTab`**: It remembers which tab you clicked on: "Overview", "Parameters", or "Statistics".

### 2. `StatGrid` (Helper Component)
- **What it does**: Instead of writing the code for a "little box with a number inside" 20 times, we wrote this helper.
- **ELI5**: You give it a list of numbers (like `[Win Rate: 60%, Profit: $500]`), and it automatically draws a neat grid of boxes for you.

## How the Logic works
- The page is split into three tabs.
- If `activeTab` is **'overview'**, it shows the Chart and high-level stats.
- If `activeTab` is **'parameters'**, it shows the settings (like "Stop Loss: 1.5%") used to run the test.
- If `activeTab` is **'statistics'**, it shows the detailed math numbers.

## Summary for Developers
- Currently, the data inside `stats` and `params` is fake (static).
- In a real app, you would use the `id` from `useParams()` to ask the server for the real data for that specific backtest.
