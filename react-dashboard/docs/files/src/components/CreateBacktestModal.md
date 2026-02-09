# File: src/components/CreateBacktestModal.jsx

## ELI5: What is this file?
This is the **New Simulation Popup**. When you click the "+" button, this is the window that appears over the screen. It's a form where you fill in details (like Strategy, Cash, etc.) to start a new test.

## What functions are there?

### `CreateBacktestModal` (Component)
It manages the data for the form.
- **`createPortal`**: This is a React magic trick. Even though this component is inside the list, this function forces the popup to draw itself *on top of everything else* (attached to the HTML body), so it doesn't get cut off by other boxes.

### `handleChange`
- **What it does**: This is the listener.
- **ELI5**: When you type in a text box or choose a dropdown, this function runs. It looks at *what* you changed (e.g., "Cash") and updates the memory (`formData`) with the new value.

### Sub-Components (The Breakdown)
Instead of one giant file with 500 lines, we split the form into pieces:
- **`StrategySection`**: Handles the top part.
- **`BasicInfoSection`**: Name and Symbol.
- **`MarketDataSection`**: Market type.
- **`ParametersSection`**: The numbers (Cash, Spread).
- **`IntradayToggle`**: The switch at the bottom.

## Summary for Developers
- The form state lives here in the parent.
- The state is passed *down* to the children.
- When you click "Start Simulation", this parent component bundles up all the data and sends it back to the `BacktestList`.
