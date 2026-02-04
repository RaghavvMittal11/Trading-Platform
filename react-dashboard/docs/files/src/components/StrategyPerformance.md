# File: src/components/StrategyPerformance.jsx

## ELI5: What is this file?
This is the **Spider Web Chart** (technically called a Radar Chart). It creates a hexagon shape to compare your strategy's skills, like "Win Rate", "Profit Factor", etc.

## How does it work?

### The Chart
- It uses `RadarChart` from the `recharts` library.
- **`PolarGrid`**: Draws the spider web lines in the background.
- **`Radar`**: Draws the purple shape that represents your strategy's score.

### The Data
- `subject`: The corner of the web (e.g., "Win Rate").
- `A`: The score (out of 100 usually) for that subject.

## Summary for Developers
- It's useful for seeing strengths and weaknesses at a glance.
- If the purple shape is big and covers the whole web, your strategy is great. If it's tiny in the middle, your strategy is bad.
