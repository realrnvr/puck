# Coding standards

This document is the target baseline for the Puck client and server. It is intentionally pragmatic: apply it to new and touched code first, then migrate the rest in the refactor PRs described in `docs/audit/PLAN.md`.

Sources: Airbnb JavaScript/React style guide, Node.js Best Practices, Express Security Best Practices, OWASP ASVS/Cheat Sheets, React documentation, Vercel React best practices, and the project-scoped skills in `.agents/skills`.

## 1. Formatting and tooling

- **Prettier** is the source of truth for formatting: 2 spaces, double quotes, semicolons, trailing commas, 80-column soft wrap.
- **ESLint** catches correctness and framework issues. Do not disable a rule inline without a comment explaining why.
- **EditorConfig** keeps indentation and line endings stable.
- **TypeScript** is the target language; see `docs/TS_MIGRATION.md`.
- Run before pushing:

```bash
npm run format:check
npm run lint
npm run typecheck   # once enabled
npm test
npm run build
```

### File naming

| Kind | Convention | Example |
| --- | --- | --- |
| React component | `PascalCase.jsx` / `PascalCase.tsx` | `MangaCard.jsx` |
| Hook | `useCamelCase.js` / `.ts` | `usePrefetchChapter.ts` |
| Utility/helper | `camelCase.js` / `.ts` | `setCacheHeaders.ts` |
| Route module | `camelCase.routes.js` / `.ts` | `auth.routes.ts` |
| Test | `<subject>.test.js` / `.test.tsx` | `auth.test.ts` |
| Type-only module | `camelCase.types.ts` | `manga.types.ts` |
| Constant/config | `camelCase.js` / `.ts` | `queryClient.ts` |

Existing files keep their names until the structure PR; new files follow this table.

## 2. JavaScript and TypeScript

- Prefer `const`; use `let` only for reassignment; never `var`.
- Use strict equality (`===` / `!==`).
- Prefer early returns over nested conditionals.
- Keep functions small and single-purpose. If a function needs a comment to explain its sections, split it.
- Avoid boolean parameters that change behavior; use an options object.
- Do not mutate function parameters or imported objects.
- Use optional chaining and nullish coalescing instead of manual `&&`/`||` chains where it improves clarity.
- Do not use `== null` as a catch-all unless intentional; prefer explicit checks.
- No `console.log` in production code. Use the server logger or client error reporting.
- No commented-out code. Delete it; git remembers.

### TypeScript rules (new code)

- `strict: true` is required.
- Do not use `any`. Use `unknown` and narrow, or define a type.
- Use `type` for unions, intersections, and aliases; `interface` for extendable object contracts.
- Use `satisfies` to validate object shapes without widening.
- Prefer union literals over `enum`.
- Use `readonly` for data that must not be mutated.
- Derive API types from Zod schemas with `z.infer<typeof Schema>`.
- Type all exported functions and public module boundaries.
- Avoid type assertions (`as`) unless the value is validated at the boundary.
- Use `import type` for type-only imports.
- Enable `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` in the strictness PR.

### Imports

- Group imports: Node/built-ins, external packages, internal absolute aliases, relative imports, styles/assets.
- One blank line between groups.
- Prefer named exports for utilities and hooks; default export only for route/page components where the router expects it.
- No circular imports. If two modules need each other, extract the shared piece.

## 3. React

- Components are functions. No class components.
- One component per file; small private subcomponents may live in the same file.
- Keep components focused on rendering and event wiring. Move data shaping to hooks/helpers.
- Do not perform side effects during render. `localStorage`, `JSON.parse`, network calls, and subscriptions belong in effects or event handlers.
- Every `useEffect` must have a clear dependency list and a cleanup function if it subscribes to anything.
- Do not disable `react-hooks/exhaustive-deps` without a comment.
- Derive state instead of syncing it with effects.
- Use stable, descriptive TanStack Query keys. Include every parameter that changes the result.
- Handle all four UI states: loading, error, empty, success.
- Use `key` values that identify the item, not the array index, for dynamic lists.
- Prefer composition over prop drilling. Use context only for cross-cutting concerns (auth, theme).
- Lazy-load route-level pages; keep the initial bundle small.
- Do not import a package that is only a transitive dependency. Declare it in `package.json` or use the direct package (for example `motion/react`).

### Accessibility

- Every interactive element must be a real `button`, `a`, or form control; do not attach click handlers to `div`.
- Every image needs an `alt`; decorative images use `alt=""`.
- Every form control needs a label or `aria-label`.
- Maintain visible focus styles and logical focus order.
- Do not trap focus unless implementing a modal, and always provide an escape path.
- Respect `prefers-reduced-motion`.
- Color cannot be the only way to convey state.

## 4. Server and API

### Structure

- `router/` defines routes only.
- `controller/` parses input, calls services/models, and returns a response.
- `services/` contains integrations and reusable business logic.
- `models/` contains schemas, indexes, and model methods.
- `middleware/` contains cross-cutting request behavior.
- `errors/` contains typed application errors.
- `utils/` and `helper/` contain pure, testable functions.

### HTTP semantics

- Use the correct status code: `200` for reads/updates, `201` for creation, `204` for empty success, `400` for validation, `401` for unauthenticated, `403` for forbidden, `404` for missing, `409` for conflicts, `429` for rate limits, `500` for unexpected errors.
- Never return `200` with an error-shaped body.
- Error responses use a stable shape:

```json
{ "message": "Human-readable message", "code": "MACHINE_READABLE_CODE" }
```

- Success responses keep the shape expected by the current client. New endpoints use `{ "data": ... }` and document their shape.
- Validate `req.params`, `req.query`, and `req.body` at the boundary. Do not trust types at runtime.
- Whitelist fields explicitly. Never spread `req.body` into a model.
- Pagination requires a bounded `limit` (for example 1-100) and an opaque cursor.

### Authentication and authorization

- Access tokens are short-lived and sent in the `Authorization: Bearer <token>` header.
- Refresh tokens are `httpOnly`, `secure` in production, `SameSite=Strict`, and scoped to the refresh endpoint.
- Never return passwords, refresh tokens, verification tokens, or reset tokens in a response.
- Mark sensitive schema fields `select: false`.
- Revoke or rotate refresh tokens on logout, password change, and password reset.
- Authorization middleware returns `401` when credentials are missing/invalid and `403` when the identity is valid but not allowed.
- Rate-limit login, signup, password reset, and resend endpoints.

### Security

- Validate all outbound URLs against an allowlist. Require HTTPS. Reject loopback, link-local, private, and metadata addresses. Cap redirects, response size, and time.
- Do not log secrets, tokens, cookies, passwords, or full request bodies for auth routes.
- Use Helmet or equivalent security headers.
- Configure CORS with an explicit origin allowlist and credentials only where needed.
- Keep dependencies pinned through the lockfile and audit them in CI.
- Fail fast at startup if required environment variables are missing.

## 5. Error handling

- Throw typed errors (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`).
- The centralized error handler formats the response and logs unexpected errors with context (request id, route, user id if safe).
- Do not swallow errors. If a failure is non-critical (for example a newsletter email), log it with context and continue deliberately.
- Client code must handle network and HTTP errors explicitly; do not assume `response.data` exists.
- Never show raw server errors to users.

## 6. Testing

- Test behavior and contracts, not implementation details.
- Every bug fix includes a regression test that fails without the fix.
- Server integration tests use `supertest` and an in-memory MongoDB; Redis and mail are replaced with test doubles.
- Client tests use Testing Library and MSW; do not mock React Query internals.
- Test names describe the behavior: `rejects non-allowlisted proxy hosts`.
- Avoid snapshot-only tests. Use snapshots for stable serialized output only.
- Keep tests deterministic: no real network, no real clock, no shared mutable state.
- See `docs/TESTING.md` for the harness and coverage policy.

## 7. Git and PRs

- Branch names: `fix/...`, `feat/...`, `refactor/...`, `chore/...`, `test/...`, `docs/...`.
- Commits use Conventional Commits: `fix(auth): require authentication for deleteUser`.
- One concern per commit; one concern per PR.
- PR description includes: what changed, why, risk, rollback, test evidence, and screenshots for UI changes.
- Do not mix formatting with logic.
- Do not commit generated build output, `.env` files, or editor state.
- Keep the PR under ~400 changed source lines where practical; split otherwise.

## 8. Documentation

- Update the relevant doc when behavior, configuration, or public API changes.
- New environment variables go in `.env.example` (never in `.env`).
- Document non-obvious security decisions in code comments and in the PR.
- Keep `docs/audit/BASELINE.md` current at each phase boundary.

## 9. Enforcement

| Rule | Tool | When |
| --- | --- | --- |
| Formatting | Prettier | Pre-commit / CI |
| Correctness | ESLint | CI |
| Types | `tsc --noEmit` | CI |
| Tests | Vitest | CI |
| Build | Vite / `tsc` | CI |
| Security | ESLint + review + `npm audit` | CI / PR |
| Accessibility | `vitest-axe` + review | CI / PR |

Rules start as warnings only when the existing codebase cannot pass them immediately. A warning that is not on a path to becoming an error is not a standard.
