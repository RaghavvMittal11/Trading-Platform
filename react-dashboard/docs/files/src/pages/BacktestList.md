# File: src/pages/BacktestList.jsx

## ELI5: What is this file?
This is the **Results Manager**. Imagine a file cabinet where you keep reports of all your past experiments. This page lets you view that list, search through it, throw away bad reports, or start a new experiment.

## What functions are there and what do they do?

### 1. `BacktestList` (The Component)
This is the main function that draws the whole page. It remembers things (State) like:
- **`backtests`**: The list of all your reports.
- **`searchQuery`**: What you typed in the search bar.
- **`statusFilter`**: If you only want to see "Completed" or "Running" items.
- **`isModalOpen`**: Whether the "New Simulation" popup is visible.

### 2. `handleStartBacktest(data)`
- **What it does**: This is called when you finish filling out the "New Backtest" form.
- **ELI5**: It takes the paper you just filled out, stamps "RUNNING" on it, and adds it to the top of your list pile (`setBacktests`). It then closes the popup.

### 3. `handleDelete(id)`
- **What it does**: This is called when you click the Trash icon.
- **ELI5**: It first asks "Are you sure?". If you say yes, it looks through the list, finds the item with that specific ID, and removes it.

### 4. `getStatusInfo(status)`
- **What it does**: This is a styling helper.
- **ELI5**: You give it a word like "ERROR", and it gives you back the color Red and a Warning Triangle icon. If you give it "COMPLETED", it gives you Green and a Checkmark.

### 5. `filteredBacktests` (The Logic)
- **What it does**: This isn't a function but a calculated list.
- **Flow**: It takes the big list of backtests → Checks if the name matches your Search → Checks if the status matches your Filter → Returns the final list to show on screen.

## Summary for Developers
- This is a "Smart" component because it manages its own data.
- It handles Searching, Filtering, and Deleting all right here in the browser.
