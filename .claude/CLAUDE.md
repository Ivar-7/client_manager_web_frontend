# React + Vite + TypeScript — Agentic Rules

## Architecture

- **`src/app/`** — Core application setup and global configuration.
- **`src/shared/`** — Reusable primitives: `api`, `components`, `hooks`, `theme`, `types`, `utils`, `store`, `providers`.
- **`src/features/<feature>/`** — Domain-driven modules: `api`, `services`, `hooks`, `widgets`, `pages`, `types`.
- **Root Files** — `App.tsx`, `main.tsx`, `routes.tsx`.
- **Directive** — Keep the codebase strictly modular, layered, and DRY.

---

## Core Rules

- **API Layer** — `src/shared/api/` manages the HTTP client, auth interceptors, and error normalization.
- **Page Isolation** — `*.Page.tsx` files act strictly as state/layout orchestrators. Fetch data, wire hooks, and pass props down to widgets.
- **Naming Conventions** — Enforce exact patterns: `*.types.ts`, `*.schema.ts`, `*Provider.tsx`, `*Page.tsx`, `use<Feature>.ts`.
- **Routing** — Utilize object-based React Router configurations with route-level lazy loading.
- **Error Handling** — Implement Error Boundaries combined with an `ErrorHandler` (strictly no UI stack traces).
- **Security & Cleanliness** — Zero hardcoded secrets (maintain `.env.example`). No dead code or unjustified linter suppressions.
- **Documentation** — Keep per-feature `README.md` files updated with every change.

---

## Firebase

- **Architecture**: Firebase config (rules, indexes) in src/config/firebsase.
- **Rules**: Authorization-focused rules. Application code manages schema and business logic.
- **Performance**: Indexes deliberately small to keep cost/latency low.
- **Deploy**: Deploy indexes and rules if changes, all indexes should be in firestore indexes.

---

## UI/UX

- **Design Tokens** — Use CSS variables/Tailwind classes only. **No arbitrary values** (e.g., no `h-[13px]`).
- **Theming** — Full, seamless light/dark theme support.
- **Motion** — Use Framer Motion exclusively for purposeful, UX-driven animations.
- **Component States** — Every feature must explicitly handle 4 states: `loading`, `empty`, `success`, and `error`.
- **Layouts** — Use reusable layouts mounted at the route level.

---

## Verification Pipeline

Run this sequence after every change before pushing code:

```bash
npm run format
npm run lint
npm run typecheck
npm run build
```
