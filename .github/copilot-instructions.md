# React + Vite + TypeScript — Agentic Rules

## Architecture
- `src/app/`
- `src/shared/` — `api`, `components`, `hooks`, `theme`, `types`, `utils`, `store`, `providers`.
- `src/features/<feature>/` — `api`, `services`, `hooks`, `components`, `pages`, `types`.
- Root: `App.tsx`, `main.tsx`, `routes.tsx`.

- Modular, Layered and DRY code.

---

## Core Rules
- `src/shared/api/` — HTTP client, auth interceptors, error normalisation.
- Naming: `*.types.ts`, `*.schema.ts`, `*Provider.tsx`, `*Page.tsx`, `use<Feature>.ts`.
- Object-based React Router. Route-level lazy loading.
- Error Boundaries + `ErrorHandler`. Never expose stack traces to UI.
- No hardcoded secrets. `.env.example` kept current.
- No dead code. No linter suppressions without justification.
- Per-feature `README.md` kept current.

---

## UI/UX
- Design tokens only — CSS variables or Tailwind. No one-off values.
- Light and dark theme support.
- Framer Motion for purposeful motion only.
- Every feature has loading, empty, success, and error states.
- Layout sections reusable and intentionally mounted per route.

---

## After Every Change
```bash
npm run format
npm run lint
npm run typecheck
npm run build
```
Fix all errors before marking complete.