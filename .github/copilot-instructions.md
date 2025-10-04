# Project: KaizenLife MVP

## Purpose

KaizenLife is a habit & goal-tracking MVP built with TypeScript, Angular, and Firebase. Users earn two credit types (KP — productivity, and KZ — health) by logging actions. The app provides authentication, an action catalog, logging, and balance tracking. The backend uses Firebase (Firestore + Functions) implemented in TypeScript to ensure a small, maintainable codebase and maximum reuse of types/validation between frontend and backend.

## High-level decisions (current)

- Main language: TypeScript for both frontend (Angular) and backend (Firebase Functions). Node/TypeScript Functions keep the best developer experience with Firebase (emulators, deploys).
- Monorepo layout with shared TypeScript package to maximize DTO/validator reuse and avoid duplication.
- Firestore is the primary persistence; server-side transactional updates ensure balances stay consistent.
- Use Firebase emulators for local development (Auth, Firestore, Functions, Hosting).

---

## Repository layout (recommended)

- / (repo root)
  - package.json (workspace scripts)
  - tsconfig.base.json
  - .eslintrc.json
  - firebase.json
  - .firebaserc
  - README.md
  - /apps
    - /web (Angular app)
    - /functions (Firebase Functions in TypeScript)
  - /packages
    - /shared (shared DTOs, TypeScript types, zod validators)
  - /tests (integration & e2e)
  - /docs

Notes:
- Use npm workspaces or pnpm to link `packages/shared` into `apps/web` and `apps/functions` for zero-copy sharing.

---

## Firestore data model (concise)

- users/{userId}
  - { displayName, email, balanceKP: number, balanceKZ: number, createdAt, updatedAt }
- actionTypes/{actionTypeId}
  - { name, category, orientation: 'Routine'|'Base'|'Targeted', unit, creditValue:number, type: 'KP'|'KZ', createdAt }
- userActions/{userActionId}
  - { userId, actionTypeId, amount:number, calculatedCredits:number, type:'KP'|'KZ', date: timestamp, snapshotActionType: {...}, createdAt }

Index recommendations:
- Composite index on `userActions` (userId, date desc) for efficient logs listing.

Validation rule:
- Reject amount <= 0 unless a clear business case exists; validate incoming DTOs both client- and server-side using shared zod schemas.

---

## REST API (Firebase Functions, TypeScript)

- POST /actions/add
  - Input: { actionTypeId, amount, date? }
  - Auth: Firebase ID token (uid used server-side)
  - Behavior: validate input, read `actionTypes/{id}`, transactionally create `userActions` and update `users/{uid}` balances.
  - Output: { userActionId, newBalanceKP, newBalanceKZ, calculatedCredits }

- DELETE /actions/{userActionId}
  - Auth: Firebase ID token
  - Behavior: transactionally remove action and update balances (uses snapshotActionType stored on userAction to avoid missing actionType issues).

- GET /balance/{userId}
  - Auth: Firebase ID token (only allow uid === userId unless admin)
  - Output: { balanceKP, balanceKZ }

- GET /logs/{userId}?limit=&cursor=
  - Paginated action logs for userId (with actionType snapshot in each item)

Server-side notes:
- Always verify ID tokens using `firebase-admin` and use the token's `uid` for authorization checks.
- Use Firestore transactions for add/delete so updates to `users` balances and `userActions` are atomic.

---

## Shared code and validation

- `packages/shared` should expose TypeScript interfaces and runtime validators (zod) for:
  - `User`, `ActionType`, `UserAction`, request/response DTOs, and enums (KP/KZ, orientations).
- Both `apps/web` and `apps/functions` import from `@kaizen/shared` so validation logic and types stay consistent.

Benefits:
- Single source of truth for DTOs and validation.
- Fewer bugs and type drift between client/server.

---

## Local development workflow

1. Install dependencies from repo root (workspaces): `npm install` (or `pnpm install`).
2. Start Angular dev server: `npm run start:web` (script proxies to `apps/web`).
3. Start Firebase emulators: `firebase emulators:start --only auth,firestore,functions,hosting` (emulators will load functions from `apps/functions` and serve hosting from `dist/web` or local build).
4. Use shared package in watch mode or rely on workspace linking so changes in `packages/shared` propagate to both apps.

Emulator tips:
- Use the Firestore emulator during tests to avoid production reads/writes.

---

## Testing

- Unit tests: use Jest for functions and key frontend services. Mock `firebase-admin` for unit tests when appropriate.
- Integration tests: run against the Firestore emulator and functions emulator (tests in `/tests/functions` can use the HTTP endpoints exposed by emulator).
- End-to-end: optional Cypress or Playwright tests against hosting + emulator backend.

---

## Deployment

- Functions: `firebase deploy --only functions` (TypeScript functions are compiled to JS during the functions build step).
- Hosting: `firebase deploy --only hosting` (serve compiled Angular in `dist/web`).
- CI: GitHub Actions pipeline should build `packages/shared`, `apps/functions`, and `apps/web`, run lint/tests, then deploy using a service account stored in secrets.

---

## Security & operational notes

- Verify ID tokens server-side using `firebase-admin.auth().verifyIdToken()`.
- Use Firestore security rules that mirror server-side permissions for any client reads.
- Use `functions.config()` or Secret Manager for sensitive configs; never commit secrets.
- Set budgets/alerts in GCP and cap `maxInstances` for functions to avoid runaway costs.

---

## Cost-awareness (short)

- Language doesn't determine cost — runtime (invocations, CPU/memory time), Firestore reads/writes, and bandwidth do.
- Prefer Cloud Functions gen2 or Cloud Run with concurrency >1 if you need lower per-request cost, but for this project we stick with Firebase Functions (TypeScript) for best Firebase integration.
- Cache `actionTypes` client-side and in-memory on functions where safe to reduce Firestore reads.

---

## Next practical steps (recommended)

1. Create `packages/shared` with TypeScript interfaces and zod schemas for `ActionType`, `User`, `UserAction` and common DTOs.
2. Implement `apps/functions/src/controllers/actions.ts` with `POST /actions/add` using shared validators and a Firestore transaction.
3. Wire `apps/web` to use shared DTOs and build the `AddAction` form using the shared zod schema for client validation.

If you'd like, I can scaffold `packages/shared` and a minimal `POST /actions/add` function (TypeScript) next and run a local typecheck.
