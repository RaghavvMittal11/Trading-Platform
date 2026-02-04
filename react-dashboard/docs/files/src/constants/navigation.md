# File: src/constants/navigation.js

## ELI5: What is this file?
This is the **Map** for your sidebar. It's a simple list that defines what buttons appear on the left side of the screen.

## What's inside this code?

### `NAV_ITEMS`
- **What it is**: A list (array) of navigation objects.
- **Each Item contains**:
  1.  **`icon`**: Which picture to show (like the little robot `Bot` icon).
  2.  **`label`**: The text name (e.g., "Trading Bots").
  3.  **`path`**: Where the user should go when they click it (e.g., `/bots`).

## Summary for Developers
- If you want to add a new link to the sidebar, you don't touch the `Sidebar.jsx` code at all. You just add a line here:
  ```javascript
  { icon: NewIcon, label: 'My New Page', path: '/new-page' }
  ```
- This keeps the logic (Sidebar component) separate from the data (this list).
