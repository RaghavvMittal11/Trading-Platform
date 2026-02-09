# File: src/components/Sidebar.jsx

## ELI5: What is this file?
This is the **Navigation Menu** on the left. It's like the table of contents for a book. It lets you jump between different chapters (pages) like Dashboard, Backtest, etc.

## What functions are there?

### `isActive(path)`
- **What it does**: It checks "Are we currently on this page?"
- **ELI5**: If you are on the "Dashboard" page, this function returns `true` for the Dashboard button. We use this to light that button up (make it glow) so you know where you are.

### `Sidebar` (The Component)
- It gets the list of buttons from `constants/navigation.js`.
- It loops through them and draws a link for each one.
- **Mobile Logic**: If you are on a phone and click a link, it calls `toggleSidebar()` to properly slide the menu away so you can see the page.

## Summary for Developers
- The visual style (Glassmorphism, hover expansion) is handled by Tailwind classes here.
- It automatically highlights the correct tab based on the URL.
