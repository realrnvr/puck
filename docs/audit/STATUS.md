# Project status and resume guide

- Last updated: 2026-10-22
- Current `main`: `a61749a` (`docs(plan): mark client auth migration done`)
- Plan: [`docs/audit/PLAN.md`](./PLAN.md)
- Migration conventions: [`docs/TS_MIGRATION.md`](../TS_MIGRATION.md)

## Overall state

The audit/remediation work through PR 10 is complete. The server TypeScript migration is complete. The client TypeScript migration is in progress and is being merged leaf-first so every PR stays green.

| Area                        | Status            | Notes                                                      |
| --------------------------- | ----------------- | ---------------------------------------------------------- |
| Server runtime              | TypeScript        | 42 `.ts` source files; no server source `.js` files        |
| Server tests                | Green             | 91 tests across 15 files                                   |
| Server lint/typecheck       | Green             | ESLint includes TypeScript                                 |
| Client runtime              | Partly TypeScript | 61 `.ts`/`.tsx` source files, 97 `.js`/`.jsx` source files |
| Client tests                | Green             | 38 tests across 17 files                                   |
| Client lint/typecheck/build | Green             | React, hooks, a11y, TanStack Query, and TS rules enabled   |
| CI/Vercel previews          | Green             | Client, server, format, typecheck, and previews            |

## Merged migration PRs

### Server

- #75–#83: server leaves, config, services, controllers, app entrypoint, and TypeScript ESLint.
- The production entrypoint is `server/app.ts`; `tsx` is a production dependency.
- Server TypeScript keeps `.js` import specifiers so Node ESM resolution stays correct.

### Client

- #84 `refactor/client-ts-leaves`: helper functions, form data, Zod schemas, shared types, Axios instance, query functions, QueryClient config, and route loaders.
- #85 `chore/client-ts-lint`: TypeScript/TSX ESLint coverage; two side-effect ternaries replaced with equivalent `if`/`else`.
- #86 `refactor/client-ts-hooks`: all 18 hooks, auth/manga types, typed query/mutation cache behavior, and `getErrorMessage`.
- #87 `refactor/client-ts-mutations`: favourite, newsletter, and auth mutation services.
- #88 `refactor/client-ts-auth`: all auth components/pages plus the shared `Input` boundary.
- #89 documentation-only status update.

## Important client types and helpers

- `client/src/types/api.ts`: manga, favourite, search, AniList, chapter, cover, and message response shapes.
- `client/src/types/auth.ts`: `AuthUser`, `AuthContextValue`, auth request bodies, and `AuthResponse`.
- `client/src/types/manga.ts`: `MangaData` and `MangaState`.
- `client/src/types/forms.ts`: `FormField` and `ScrollVerticalImage`.
- `client/src/helper/getErrorMessage.ts`: narrows Axios errors; accepts an optional fallback with overloads.
- `client/src/helper/getErrorResponseData.ts`: structural `error.response.data` narrowing that still works with test mocks.
- `client/src/components/ui/input/Input.tsx`: generic React Hook Form input boundary.

## Client migration remaining

Next planned PR is **12f** (`refactor/client-ts-manga`), followed by 12g (app shell/routing/providers), 12h (lightbox/sliderbox), and 12i (cleanup).

Remaining client source files by area:

- 16 shared UI components (`components/ui/**`): header, footer, cards, carousels, newsletter, loader, tag, buttons.
- 13 lightbox files (`services/lightbox/**`): controller, chapter list, buttons, and SVG icons.
- 12 skeleton components (`utils/skeletons/**`).
- 6 sliderbox files (`services/sliderbox/**`).
- 4 providers (`services/provider/**`), including `AuthProvider`.
- 4 auth guards (`services/auth/**`).
- 9 route files (`routes/**`).
- 17 page source files: about, account, account settings, change password, community, error, favourite, home, layout, manga (4 files), mangas, read, viewer, watch.
- Shared utilities: markdown, notification, templates, errors, and `main.jsx`.

Client tests remain JavaScript for now. New TypeScript-only helpers have Vitest `.test.ts` coverage. Tests can be migrated after the application source is converted.

## Conventions to preserve

- Client source uses extensionless imports with `moduleResolution: "Bundler"`.
- New client `.ts`/`.tsx` files are strict and must typecheck without `any`.
- `allowJs: true` and `checkJs: false` remain until the cleanup strictness PR.
- `react/prop-types` remains enabled for JSX components and disabled for TSX.
- Do not mix behavior changes with migration refactors. Behavior fixes need tests.
- Do not commit `server/.env`, `server/.env.local`, or `server/.env.production`.

## Local runbook

Use separate terminals from the repository root.

### Server

```bash
cd server
npm run dev
```

The server starts with `tsx watch app.ts` on `PORT` from `server/.env` (default `3000`). It requires Mongo and Redis access through the configured environment. Check it with:

```bash
curl -i http://localhost:3000/api/v1/ping
```

A healthy response is `HTTP/1.1 200 OK` with `PONG!`.

### Client

```bash
cd client
npm run dev
```

Vite defaults to `http://localhost:5173`. The client API base URL comes from `VITE_BACKEND_BASE_URL`; CORS on the server comes from `CLIENT_APP_URL`.

### Verification commands

```bash
# Client
cd client
npm test -- --run
npm run lint
npm run build

# Server
cd server
npm test -- --run
npm run lint
npm run typecheck

# Root
npm run typecheck
npx prettier --check .
```

## Troubleshooting: “Something went wrong. Please try again later.”

That text comes from the server error handler (`server/middleware/errorHandlerMiddleware.ts`) or from client-side fallback messages when an API request fails. Common causes:

1. The API server is not running. Start `cd server && npm run dev`, then hit `/api/v1/ping`.
2. Mongo or Redis is unreachable. The server exits during `startServer()` after logging the connection error.
3. The client points at the wrong API URL. Check `VITE_BACKEND_BASE_URL` in `client/.env*` and `CLIENT_APP_URL` in `server/.env`.
4. CORS rejects the client origin. The server allows `CLIENT_APP_URL` with credentials, so both sides must use matching localhost/port values.
5. A route returns a 500 because a required server environment variable is missing. Run `validateEnv()` through server startup and read the terminal output.

Do not paste `.env` contents into issues or PRs; share only variable names and non-secret error logs.
