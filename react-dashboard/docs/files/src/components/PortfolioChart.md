# File: src/components/PortfolioChart.jsx

## ELI5: What is this file?
This is the **Big Line Chart** on the dashboard. It shows a wavy line representing your account balance going up (hopefully) or down.

## What's inside this code?

### `CustomTooltip`
- **What it does**: This small function defines what happens when your mouse hovers over the line.
- **ELI5**: It makes a little black box appear that says the exact date and price (e.g., "Aug 14: $1250") so you can see details.

### `PortfolioChart` (Component)
- **`AreaChart`**: The library component that draws the shape.
- **`<defs>`**: This part defines the "Gradient". It tells the computer "Make the color fade from bright purple at the top to invisible at the bottom," which gives it that cool glowing look.

## Summary for Developers
- We use the `recharts` library.
- It is responsive (it shrinks/grows if you resize the window).
- The data is currently fake (`data` array at the top).
