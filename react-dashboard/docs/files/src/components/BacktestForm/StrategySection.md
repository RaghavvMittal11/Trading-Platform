# File: src/components/BacktestForm/StrategySection.jsx

## ELI5: What is this file?
This is **Part 1 of the Form**. It asks the user: "What trading strategy do you want to test?" (like EMA or RSI).

## How it works
- It receives `formData` (the answers) and `handleChange` (the pen to write answers) from the parent popup.
- It draws two dropdown menus (<select>).
- It reads the list of available strategies from the `constants` file so it knows what options to show.

## Summary for Developers
- Separating this into its own file makes the main Modal code much cleaner/shorter.
