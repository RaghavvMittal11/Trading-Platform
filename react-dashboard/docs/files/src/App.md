# File: src/App.jsx

## ELI5: What is this file?
This is the **Traffic Controller** of your app. It handles "Routing". When a user goes to `/backtest`, this file decides which page to show them. It also makes sure the Sidebar and Header stay visible on every page.

## What's inside this code?

### `Router` (BrowserRouter)
- **What it does**: It enables the app to change the URL without reloading the page. It's the "container" for all navigation logic.

### `Layout`
- **What it does**: It acts as a wrapper.
- **The Flow**:
  1.  The App renders the `Layout`.
  2.  The `Layout` draws the Sidebar and Header.
  3.  Inside the `Layout`, we have the `Routes`...

### `Routes` & `Route`
- **What they do**: These work like a switch statement for the URL.
  - If the URL path is `'/'`, show the `<Dashboard />` page.
  - If the URL path is `'/backtest'`, show the `<BacktestList />` page.
  - If the URL path is `'/backtest/:id'` (like `/backtest/123`), show the `<BacktestDetail />` page.
  - If the URL is anything else (`*`), redirect the user back to `'/'`.

## Summary for Developers
- If you create a new Page (e.g., Settings Page), you must come here and add a new `<Route path="/settings" ... />` line, or no one will be able to visit it.
