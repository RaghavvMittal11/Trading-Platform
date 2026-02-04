# Coding Standards

## General Principles
- **Clarity over Cleverness**: Write code that is easy to understand.
- **Consistency**: Follow the existing patterns for naming and structure.
- **Preservation**: Do not alter business logic during refactoring.

## Naming Conventions
- **Components**: PascalCase (e.g., `StatsCard.jsx`)
- **Functions/Variables**: camelCase (e.g., `handleOpen`, `isValid`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `NAV_ITEMS`, `DEFAULT_CONFIG`)
- **Files**: PascalCase for components, camelCase for utilities/constants.

## Component Structure
1. **Imports**: Group libraries, then local components, then styles.
2. **Component Definition**: Use functional components with hooks.
3. **Props**: Destructure props in the function signature.
4. **State**: Define `useState` and hooks at the top.
5. **Logic**: Helper functions and handlers.
6. **Render**: Return JSX.

## Tailwind CSS Usage
- Use utility classes directly in `className`.
- For complex repeated styles, consider extracting a component rather than `@apply`.
- Maintain responsiveness using `md:`, `lg:` prefixes.

## Documentation
- Add JSDoc to complex functions and components.
- Explain "why" in comments, not "what" (unless complex).
