# File: eslint.config.js

## ELI5: What is this file?
**ESLint** is like a strict spelling and grammar checker for your code. This file contains the rules it uses to grade your work. If you make a mistake (like creating a variable but never using it), ESLint will yell at you (show a red underline).

## What's inside this code?

### `ignores`
- **What it does**: Tells ESLint to ignore the `dist` folder.
- **Why**: The `dist` folder contains messy computer-generated code. We don't want to check that for grammar.

### `files: ['**/*.{js,jsx}']`
- **What it does**: Tells ESLint to only check JavaScript and React files.

### `languageOptions`
- **What it does**: Tells ESLint "Hey, we are writing modern JavaScript (ECMAScript 2020) and we are using browser variables like `window` or `document`, so don't mark those as errors."

### `plugins`
- **`react-hooks`**: Checks that you use `useEffect` and `useState` correctly (e.g., following the Rules of Hooks).
- **`react-refresh`**: Helps with the feature where the browser updates without reloading when you save code.

### `rules`
- **`no-unused-vars`**: This specific rule says "It's an error if you define a variable but don't use it, UNLESS the variable name starts with an underscore or capital letter."

## Summary for Developers
- This keeps our code clean and prevents bugs.
- If you see a red squiggly line in VS Code, it's likely because of a rule defined in this file.
