# File: src/main.jsx

## ELI5: What is this file?
This is the **Big Bang** of your application. It is the very first piece of code that runs. It takes your entire React application and "injects" it into the HTML page so the user can see it.

## What's inside this code?

### `createRoot(...).render(...)`
- **What it does**:
  1.  It looks for an HTML element with the id `'root'` (which exists in `index.html`).
  2.  It takes control of that element.
  3.  It puts the `<App />` component inside it.

### `<StrictMode>`
- **What it does**: This is like a safety wrapper. It doesn't show anything on screen, but it runs extra checks during development. For example, it might run your code twice to make sure you didn't do anything sloppy that breaks when things update.

### `import './index.css'`
- **What it does**: This line loads the global styles (like the Tailwind directives) so the app looks pretty immediately.

## Summary for Developers
- This is the entry point.
- You rarely modify this file unless you are setting up something global like a Redux Store provider or defined a new Context Provider that needs to wrap the *entire* app.
