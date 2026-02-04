# File: src/components/Layout.jsx

## ELI5: What is this file?
This is the **Frame** of your painting. No matter what picture (page) you look at, the frame stays the same. The `Layout` makes sure that the Sidebar (left) and Header (top) are always visible, while the content in the middle changes.

## What functions are there?

### `Layout` (Main Component)
- **`useState(isOpen)`**: It remembers if the sidebar is open or closed (mostly for mobile phones).
- **`toggleSidebar`**: This is a simple switch. If the sidebar is open, it closes it. If closed, it opens it.

### How the wrapper works
- It takes a special input called `children`.
- **ELI5**: Think of `Layout` like a sandwich bun. The `Sidebar` and `Header` are the bread. The `children` is the meat (the specific page you are on, like Dashboard). The Layout wraps the bread around whatever meat you give it.

## Summary for Developers
- Use this component to wrap your Routes in `App.jsx`.
- It handles the responsive mobile menu logic for you.
