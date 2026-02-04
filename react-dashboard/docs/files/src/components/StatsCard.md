# File: src/components/StatsCard.jsx

## ELI5: What is this file?
This is a **sticker** or **widget**. It handles drawing *one single box* of information, like "Active Bots: 7".

## What's inside this code?

### `StatsCard` (Component)
It is a "Dumb" component (it just displays what you tell it).
- **Inputs (Props)**:
  - `title`: The label (e.g., "Win Rate").
  - `value`: The big number (e.g., "73.4%").
  - `isPositive`: A true/false switch.
    - If `true`, it draws the little trend arrow Green and pointing Up.
    - If `false`, it draws it Red and pointing Down.
  - `glowColor`: Tells it what color shadow to put behind the icon (Purple, Green, Blue, etc.).

## Summary for Developers
- You use this component multiple times on the Dashboard.
- You don't write logic here—you just pass data *into* it.
