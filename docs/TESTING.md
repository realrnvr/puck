# Testing strategy

## Goals

1. Catch regressions in authentication, authorization, and data handling before they reach production.
2. Make P0 security fixes test-first.
3. Give the TypeScript migration a safety net.
4. Keep tests fast, deterministic, and independent of external services.

## Tooling

| Area           | Choice                  | Why                                               |
| -------------- | ----------------------- | ------------------------------------------------- |
| Runner         | Vitest                  | Native ESM, Vite integration, Jest-compatible API |
| Server HTTP    | Supertest               | Exercises Express routes without a live port      |
| Server DB      | `mongodb-memory-server` | Real Mongoose behavior without a local MongoDB    |
| Client DOM     | jsdom + Testing Library | User-centric component tests                      |
| Client network | MSW                     | Mock at the HTTP boundary, not inside React Query |
| Accessibility  | `vitest-axe`            | Automated axe checks in component tests           |
| Coverage       | `@vitest/coverage-v8`   | Built-in V8 coverage                              |
| E2E (optional) | Playwright              | Critical user journeys after P0/P1 work           |

## Layout

```text
client/
  vitest.config.js
  src/test/
    setup.js
    msw/server.js
    msw/handlers.js
    render.jsx
  src/**/*.test.jsx
  src/**/*.test.js

server/
  vitest.config.js
  test/
    setup.js
    helpers/
      db.js
      auth.js
      redis.js
      mailer.js
    integration/
      auth.test.js
      manga.test.js
    unit/
      errors.test.js
      serializers.test.js
```

Tests live next to the subject for client hooks/components; server integration tests live under `server/test/integration` because they exercise routes.

## Server harness

The current `server/app.js` both creates the app and starts listening. Split it before writing route tests:

- `server/app.js` exports `createApp()` (middleware + routes + error handlers).
- `server/server.js` owns `connectDB`, Redis connection, cron, and `listen`.
- `server/app.js` remains the production entrypoint only if it re-exports the bootstrap; keep one obvious start command.

Harness rules:

- Set test environment variables in `server/test/setup.js` (JWT secrets, client URL, etc.). Never read real `.env` files in tests.
- Start one in-memory MongoDB instance; clear collections between tests.
- Replace Redis with a small in-memory double implementing `get`, `setEx`, `connect`, and `quit`.
- Replace the mailer with a double that records calls and can simulate failure.
- Mock `oauthClient` and any other outbound Google call.
- Do not open a real port; pass the Express app to Supertest.
- Close the DB, Redis double, and any open handles in `afterAll`.

Example smoke test:

```js
import request from "supertest";
import { createApp } from "../../app.js";

it("returns a health response", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/ping");
  expect(res.status).toBe(200);
  expect(res.text).toBe("PONG!");
});
```

## Client harness

- `vitest.config.js` uses `environment: "jsdom"` and the shared setup file.
- `setup.js` imports `@testing-library/jest-dom/vitest`, starts/stops the MSW server, and cleans up after each test.
- `render.jsx` wraps components in the providers they need (QueryClient, Router, Auth) with test-friendly defaults.
- Create a fresh `QueryClient` per test with retries disabled.
- Use MSW handlers for API responses; do not mock `axios` or React Query internals.
- Use `userEvent` for interactions.
- For accessibility tests, use `vitest-axe` and assert no serious/critical violations.

## What to test first

### P0 security (`fix/security-p0`)

| Test                                                              | Expected                                                         |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Unauthenticated `DELETE /auth/deleteUser`                         | `401`                                                            |
| Authenticated user deleting another user                          | `403`                                                            |
| Signup body with `isVerified: true`, `type: "google"`, `googleId` | Those fields are ignored/rejected                                |
| Signup/login/resend/forgot responses                              | No `password`, `refreshToken`, `verificationToken`, `resetToken` |
| Missing/invalid bearer token on a protected route                 | `401`, not `200`                                                 |
| Proxy request to `http://169.254.169.254/...`                     | `400`/`403`, no outbound request                                 |
| Proxy request to `http://localhost/...`                           | `400`/`403`                                                      |
| Proxy request to a non-allowlisted HTTPS host                     | `400`/`403`                                                      |
| Proxy request to an allowlisted HTTPS host                        | Proxied successfully                                             |
| Logout                                                            | Stored refresh token cleared/rotated; old token rejected         |
| Password reset/change                                             | Existing sessions invalidated                                    |

### Server P1 (`fix/server-p1`)

- `search` with missing/empty query returns `400` with a message, not a serialized `Error`.
- `mailer()` with no options rejects with a clear error, not `ReferenceError` about `to`.
- Mailer failure on signup is handled deliberately (logged or returned) without an unhandled rejection.
- Newsletter `subscriptionDate` uses the record creation time, not a fixed timestamp.
- Pagination rejects `limit=0`, negative, and huge values; cursor handling is stable.

### Client P1 (`fix/client-p1`)

- `Read` prefetches covers only after the random-manga response resolves.
- `usePrefetchChapter` tolerates malformed/missing local-storage values.
- `Favourite` shows exactly one of loading, empty, error, or content.
- The favourite "load more" button is disabled while fetching and when there is no next page.
- No phantom dependency import remains.

### Accessibility (`chore/a11y`)

- Key pages have no serious/critical axe violations.
- Buttons and links are keyboard reachable.
- Images have meaningful `alt` text or are explicitly decorative.
- Forms have labels and error messages tied to inputs.

## Coverage policy

- Phase 4 (harness): collect coverage, no global threshold yet.
- Phase 5-9: changed/new files target 80% line coverage; global target 50% lines.
- Phase 13 (strictness): global threshold 70% lines and 60% branches.
- Coverage is a signal, not a goal. Do not add assertion-free tests to raise the number.

## CI gates

```bash
npm --prefix client run lint
npm --prefix client run format:check
npm --prefix client test -- --run
npm --prefix client run build

npm --prefix server run lint
npm --prefix server run format:check
npm --prefix server test -- --run
npm --prefix server run typecheck   # after TS foundation
```

Add `npm audit --audit-level=high` after the lockfiles are stable. Do not fail CI on low-severity advisories without a review.

## Determinism rules

- No real network calls, SMTP, MongoDB, Redis, or Google OAuth.
- Freeze time when asserting dates (`vi.useFakeTimers`).
- Reset the database between tests.
- Use unique emails/usernames per test or clear collections.
- Do not depend on test execution order.
- If a test is flaky, fix or quarantine it with an issue; do not retry forever.
