# File: tailwind.config.js

## ELI5: What is this file?
This is the **Styling Rulebook**. Tailwind is a tool that lets us style our app using class names like `text-red-500`. This file tells Tailwind which files to look at and allows us to define our *own* special colors and fonts.

## What's inside this code?

### `content`
- **What it does**: It gives Tailwind a list of places to look for styles.
- **ELI5**: "Hey Tailwind, please look inside `index.html` and any file in the `src` folder that ends in `.js` or `.jsx`. If you see a class name used there, generate the CSS for it. If not, throw it away."

### `theme.extend`
- **What it does**: This is where we customize the look.
- **Why `extend`?**: We use `extend` so we keep all the default Tailwind stuff (like `bg-white`, `p-4`) but *add* our own stuff on top.

#### Specific Customizations:
- **`colors`**: We defined a custom **"Scientific Dark"** palette.
  - `dark.bg`: The deep blue/black background you see everywhere.
  - `primary`: That specific Indigo/Purple color used for buttons.
  - `accent`: Bright neon colors for charts and highlights.
- **`fontFamily`**: We told it to use the "Inter" font whenever we use `font-sans`.

## Summary for Developers
- If you want to change the "Main Brand Color" of the entire app, you change the hex code under `colors -> primary` here.
- Tailwind reads this file before it builds the CSS.
