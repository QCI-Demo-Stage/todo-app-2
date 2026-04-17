# Todo App — Frontend

React + TypeScript single-page app for the Todo App 2 project. It is scaffolded with Vite, uses ESLint (Airbnb) and Prettier for consistent code quality, and is organized for components, state, styles, and custom hooks.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck and production build
- `npm run lint` — run ESLint
- `npm run format` — format source with Prettier

## Layout

- `src/components/` — UI components
- `src/store/` — application state
- `src/styles/` — shared styles
- `src/hooks/` — reusable React hooks

The ESLint config lives in `.eslintrc.cjs` (CommonJS) so it works with `"type": "module"` in `package.json`.
