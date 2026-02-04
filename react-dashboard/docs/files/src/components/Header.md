# File: src/components/Header.jsx

## ELI5: What is this file?
This is the **Top Bar**. It sits at the very top of the screen.

## What's inside this code?

### `Header` (Component)
It doesn't have complex logic. It mainly displays:
1.  **Hamburger Icon**: Only shows on mobile. Clicking it opens the Sidebar.
2.  **Breadcrumbs**: Little text saying "Pages / Dashboard" so you know where you are.
3.  **Action Icons**: Search, Notifications, and Settings icons on the right side.

## Summary for Developers
- Ideally, the Breadcrumbs should update dynamically based on the page. Right now, they might be static or simple.
- It receives `toggleSidebar` from the Layout so the Hamburger button works.
