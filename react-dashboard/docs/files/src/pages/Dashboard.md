# File: src/pages/Dashboard.jsx

## ELI5: What is this file?
This is the **Home Page**. When you open the app, this is the command center you see first. It's like a dashboard in a car—showing you speed (performance), fuel (active trades), and engine status (stats).

## What's inside this code?

### `Dashboard` (Main Function)
This is the main container. It organizes the screen into a neat grid. It's made of three main parts:
1.  **Top Row (Stats)**: Four little cards showing "Active Bots", "Total Trades", etc.
2.  **Middle Row (Chart)**: A big chart showing your money growing over time.
3.  **Bottom Row (Details)**: Lists of active trades and a radar chart for strategy performance.

### How it works
It doesn't do much complex "thinking" itself. It acts like a **Frame**.
- It imports other smaller components (like `StatsCard`, `PortfolioChart`).
- It places them in specific spots on the screen using CSS Grid (`grid-cols-4`, etc.).

## Summary for Developers
- If you want to rearrange the home page layout (e.g., move the chart to the bottom), this is the file to edit.
- Currently, the data (like "Win Rate: 73.4%") is hardcoded here passed as "props" to the child components. In a real app, you'd fetch this data from an API first.
