# Remediation and TypeScript migration plan

- Owner: `realrnvr`
- Baseline: `docs/audit/BASELINE.md` (`a1721aa`)
- Working branch for this document: `audit/phase-0-baseline`
- Strategy: one branch and one focused PR per chunk; tests ship with the behavior change; refactors and behavior changes do not share a PR.

## Rules of engagement

1. **Small PRs.** Target fewer than 400 changed source lines per PR (lockfiles and generated files excluded). Split by concern, not by file count.
2. **Test first for fixes.** Every P0/P1 bug gets a failing test before the fix, then the fix, then a green suite.
3. **No mixed refactors.** Rename/move work is separate from behavior work.
4. **No direct pushes to `main`.** Open a PR, wait for CI, squash-merge.
5. **No secrets.** Never commit `.env*`, tokens, keys, or production URLs with credentials.
6. **Reversible changes.** Each PR states its rollback path. Schema changes require a migration note.
7. **TypeScript migration is incremental.** JavaScript and TypeScript coexist until the final strictness PR.

## PR sequence

### PR 1 — Phase 0 baseline and standards

- Branch: `audit/phase-0-baseline`
- Scope:
  - `docs/audit/BASELINE.md`
  - `docs/audit/PLAN.md`
  - `docs/CODING_STANDARDS.md`
  - `docs/TESTING.md`
  - `docs/TS_MIGRATION.md`
  - `docs/AGENT_SKILLS.md` and `skills-lock.json` (`.agents/` is generated and ignored)
- Tests: not applicable (documentation and tooling metadata only).
- Acceptance:
  - `git diff --stat` contains no runtime source changes.
  - Client build and lint still pass.
  - Plan, standards, testing, and TS migration docs are linked and internally consistent.
- Rollback: revert this PR; no runtime impact.

### PR 2 — Quality tooling baseline

- Branch: `chore/quality-tooling`
- Scope:
  - Root `.editorconfig`, `.prettierrc.json`, `.prettierignore`
  - `client` and `server` lint scripts/configs
  - `eslint-plugin-jsx-a11y` and `eslint-plugin-n` (warnings first; errors after cleanup)
  - Root `package.json` scripts (`lint`, `test`, `build`, `format:check`) using `npm --prefix`
  - `.github/workflows/ci.yml` with client and server jobs on Node 22
  - `.github/pull_request_template.md`
- Tests: no app tests yet; CI must run existing lint/build and fail on regressions.
- Acceptance:
  - `npm run lint` passes both packages.
  - `npm run build` passes.
  - CI is green on the PR.
- Rollback: revert tooling config; no runtime impact.

### PR 3 — Formatting baseline

- Branch: `style/format-baseline`
- Scope: run Prettier across source and docs; no logic edits.
- Tests: build, lint, and (once available) test suite unchanged.
- Acceptance: `npm run format:check` passes; diff is mechanical.
- Rollback: revert the formatting commit.
- Note: kept separate so review noise does not hide logic changes.

### PR 4 — Test harness

- Branch: `test/harness`
- Scope:
  - Client: Vitest + jsdom + Testing Library + jest-dom + MSW; `client/vitest.config.js`, `client/src/test/setup.js`, one smoke test.
  - Server: Vitest + Supertest + `mongodb-memory-server`; `server/vitest.config.js`, `server/test/setup.js`, one health-route test.
  - Redis test double and mailer test double (no real network).
  - Coverage scripts (`test:coverage`).
- Tests: harness smoke tests prove the setup works.
- Acceptance:
  - `npm --prefix client test -- --run` and `npm --prefix server test -- --run` pass locally and in CI.
  - Tests do not require local MongoDB, Redis, SMTP, or Google credentials.
- Rollback: remove test configs and dev dependencies.

### PR 5a — Auth and session security P0

- Branch: `fix/auth-p0`
- Scope:
  - SEC-01: require auth for `deleteUser`; delete only `req.user.userId`.
  - SEC-02/SEC-07: add a public user serializer; stop returning user documents; `select: false` for passwords and tokens.
  - SEC-03: whitelist signup fields with Zod; reject unknown fields.
  - SEC-05: return real HTTP 401 from auth middleware; update the client interceptor.
  - SEC-06: add `tokenVersion`; revoke refresh tokens on logout, password change, and password reset.
  - SEC-09: require auth for `loginGoogleAuthTwo`, bind it to `req.user.userId`, and stop `loginAuthOne` from sending Google users to the unauthenticated page.
  - Add Helmet, environment-aware cookie options, and startup validation for required secrets.
- Tests:
  - `DELETE /auth/deleteUser` unauthenticated -> 401; authenticated user deletes only self.
  - Signup with `isVerified: true`/`type: "google"` is rejected and does not persist.
  - Login/signup/forgot/resend responses never contain `password`, `refreshToken`, `verificationToken`, or `resetToken`.
  - Auth middleware returns 401 for missing/invalid tokens.
  - Logout, password change, and password reset invalidate the old refresh token.
  - `loginGoogleAuthTwo` rejects unauthenticated callers and non-Google accounts.
  - Helmet header present; cookie is `HttpOnly`, `SameSite=Strict`, and not `Secure` outside production.
- Acceptance: all P0 tests fail before the fix and pass after; no secrets in responses.
- Rollback: revert by commit.

### PR 5b — Proxy SSRF P0

- Branch: `fix/proxy-ssrf`
- Scope:
  - SEC-04: allowlist MangaDex/MangaDex@Home hosts, require HTTPS, reject credentials/private/loopback/link-local hosts and non-standard ports.
  - Validate chapter image quality/hash/filename, cap redirects, response size, and time, validate redirect targets, and allow only raster image content types.
- Tests:
  - Reject `http://169.254.169.254`, `localhost`, non-allowlisted hosts, lookalikes, and credentialed URLs without calling the upstream.
  - Reject invalid redirect targets inside `beforeRedirect`.
  - Accept an allowlisted HTTPS host and stream a raster image.
  - Reject oversized responses, non-image responses, and SVG.
- Rollback: revert the proxy change; no schema changes.

### PR 6 — Server correctness P1

- Branch: `fix/server-p1`
- Scope:
  - COR-01: throw `BadRequestError` from `search`; validate `query`.
  - COR-02/COR-03: fix mailer default parameter; await mailer calls; surface delivery errors deliberately.
  - COR-04: `default: Date.now` (function reference).
  - COR-09: validate pagination limits/cursors; fix `hasMore`.
  - Normalize error handler output and `notFound` response.
- Tests: unit/integration coverage for each case, including empty search and mailer failure.
- Acceptance: tests pass; no unhandled promise rejections in test output.
- Rollback: revert by commit.

### PR 7 — Client correctness P1

- Branch: `fix/client-p1`
- Scope:
  - COR-05: await `fetchRandomManga` and guard response shape.
  - COR-06: safe local-storage parsing in `usePrefetchChapter`; move reads out of render.
  - COR-07: replace phantom `framer-motion` import with `motion/react` or declare the dependency.
  - COR-08: simplify Favourite loading/empty/error/skeleton states.
  - Fix any `Verified`/toast flow issues found during tests.
- Tests:
  - RTL tests for loading, empty, error, and success states.
  - Hook test for malformed local-storage JSON.
  - Mocked network via MSW.
- Acceptance: tests pass; no console errors; build passes.
- Rollback: revert by component/commit.

### PR 8a — Naming consistency

- Branch: `refactor/naming`
- Scope:
  - Rename `UnauthorziedError` -> `UnauthorizedError` and `Allfavourites` -> `allFavourites`.
  - Rename the `ProcessGaurd`/`AuthRedirectGaurd` components and files.
  - Rename server route modules to the `*.routes.js` convention.
- Tests: existing suites must stay green.
- Acceptance: no behavior changes; no remaining misspelled identifiers or stale route imports.
- Rollback: revert by commit; the renames are isolated.

### PR 8b — Route structure

- Branch: `refactor/routes`
- Scope:
  - Split `RouterProviderBase.jsx` into route groups.
  - Normalize lazy loading and Suspense fallbacks through shared helpers.
- Tests: route definition tests confirm paths, guards, and loaders stay stable.
- Acceptance: no behavior changes; every existing URL still resolves.
- Rollback: revert route-group extraction; restore the single router definition.

### PR 8c — Manga page structure

- Branch: `refactor/manga-page`
- Scope:
  - Extract data-shaping helpers out of `Manga.jsx`.
  - Split oversized sections into focused components.
- Tests: characterization tests for extracted helpers before moving code; existing page behavior stays green.
- Acceptance: no behavior changes; smaller, testable units.
- Rollback: revert by component/helper commit.

### PR 9 — Accessibility and UI quality

- Branch: `chore/a11y`
- Scope: run the web-design/accessibility review; fix labels, focus order, keyboard traps, alt text, color contrast, and reduced-motion behavior.
- Tests: `vitest-axe` on key pages/components; manual keyboard check.
- Acceptance: no serious/critical axe violations on covered pages; keyboard-only navigation works.
- Rollback: per-component commits.

### PR 10 — TypeScript foundation

- Branch: `chore/ts-foundation`
- Scope:
  - Client `tsconfig.json` / `tsconfig.node.json`, `src/vite-env.d.ts`.
  - Server `tsconfig.json`, `typecheck` script, `tsx` dev runner.
  - `allowJs: true`, `checkJs: false`, `strict: true` for new TS files.
  - CI typecheck job.
- Tests: existing suites must pass; typecheck must pass.
- Acceptance: no runtime changes; `npm run typecheck` green; build green.
- Rollback: remove configs and script.

### PR 11 — Server TypeScript conversion

- Branch: `refactor/server-ts`
- Split into leaf-first sub-PRs so each conversion can be reviewed and reverted independently:
  - 11a: `errors`, `helper`, and `utils`.
  - 11b: `config`, `models`, and `connectDB`.
  - 11c: `middleware` and `services`.
  - 11d: `client` and `newsletter` controllers.
  - 11e: `manga` controller.
  - 11f: `auth` controller.
  - 11g: `router` and `app.ts`.
- Conversion order (leaf-first): `errors` -> `helper` -> `utils` -> `config` -> `models` -> `middleware` -> `services` -> `controller` -> `router` -> `app.ts`.
- Scope:
  - Express request/response generics, `AuthRequest` with `req.user`.
  - Mongoose `HydratedDocument`/model interfaces and method signatures.
  - JWT payload types; Zod schemas at boundaries.
  - Replace `console.log` with a small logger.
- Tests: run server suite after each folder; add type-level tests where useful.
- Acceptance: server runs from `tsx` in dev and `tsc` build in production; no `any` in new code.
- Rollback: folder-by-folder commits, each independently revertible.

### PR 12 — Client TypeScript conversion

- Branch: `refactor/client-ts`
- Conversion order: `services/api` -> `helper` -> `types` -> `hooks` -> `services/query` -> `components/ui` -> `pages` -> `services/provider` -> `main.tsx`.
- Scope:
  - API response types derived from Zod schemas.
  - TanStack Query generics and typed query keys.
  - React props and event types; remove `prop-types` as components convert.
  - `import.meta.env` typing.
- Tests: RTL suite stays green; add type tests for API contracts.
- Acceptance: client builds with TS; no `any` in converted files; `prop-types` removed when unused.
- Rollback: file/folder commits.

### PR 13 — Strictness and cleanup

- Branch: `chore/ts-strict`
- Scope:
  - Enable `checkJs`, then convert or exclude remaining JS.
  - Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`.
  - Remove unused TypeScript type packages and `prop-types`.
  - Add `eslint` TypeScript rules and `@typescript-eslint`.
- Tests: full suite + typecheck + build.
- Acceptance: no `allowJs`/`checkJs` escape hatches for source; strict checks green.
- Rollback: strictness flags can be reverted one at a time.

### PR 14 — Final audit and docs

- Branch: `chore/final-audit`
- Scope:
  - Re-run the baseline checks; update `BASELINE.md` with before/after evidence.
  - Add root `README.md`, deployment notes, and license consistency.
  - Document API contracts and testing commands.
- Tests: full CI.
- Acceptance: all P0/P1 items closed or explicitly deferred with an owner and reason.

## Dependency order

```text
PR1 baseline
  -> PR2 tooling -> PR3 formatting
  -> PR4 test harness
       -> PR5a auth P0
            -> PR5b proxy SSRF
       -> PR6 server P1
       -> PR7 client P1
            -> PR8 structure/naming
            -> PR9 a11y
                 -> PR10 TS foundation
                      -> PR11 server TS
                      -> PR12 client TS
                           -> PR13 strictness
                                -> PR14 final audit
```

PRs 6 and 7 can run in parallel after PR4. PRs 11 and 12 can run in parallel after PR10.

## Test matrix

| Layer                | Tool                                       | Scope                                          |
| -------------------- | ------------------------------------------ | ---------------------------------------------- |
| Server unit          | Vitest                                     | Errors, serializers, validators, token helpers |
| Server integration   | Vitest + Supertest + mongodb-memory-server | Routes, auth, status codes, DB behavior        |
| Client unit          | Vitest + RTL                               | Hooks, components, state transitions           |
| Client integration   | Vitest + RTL + MSW                         | Page data flows, loading/error/empty states    |
| Accessibility        | vitest-axe                                 | Key pages and interactive components           |
| E2E smoke (optional) | Playwright                                 | Login, browse, favourite, read chapter         |
| Static               | ESLint + Prettier + `tsc --noEmit`         | Every PR                                       |

## Definition of done

- [ ] Tests added or updated and passing.
- [ ] `lint`, `format:check`, `typecheck` (when enabled), and `build` pass.
- [ ] No new secrets, credentials, or production data in the diff.
- [ ] API changes documented and client updated in the same PR.
- [ ] PR description includes risk, rollback, and test evidence.
- [ ] No unrelated refactors.

## Skills used

Project-scoped skills installed for this work (restore instructions in `docs/AGENT_SKILLS.md`):

| Skill                           | Use                                           |
| ------------------------------- | --------------------------------------------- |
| `vercel-react-best-practices`   | React performance and data-fetching review    |
| `web-design-guidelines`         | UI/accessibility review                       |
| `security-best-practices`       | P0 security review and fixes                  |
| `nodejs-backend-patterns`       | Express/Mongoose structure and error handling |
| `improve-codebase-architecture` | Oversized module split plan                   |
| `tdd`                           | Red-green-refactor workflow                   |
| `vitest`                        | Test harness and mocking patterns             |
| `typescript-advanced-types`     | Type-level design during migration            |
| `typescript-react-reviewer`     | React/TS review gates                         |
| `webapp-testing`                | Optional Playwright smoke checks              |

## Tracking

| PR  | Branch                                 | Status      |
| --- | -------------------------------------- | ----------- |
| 1   | `audit/phase-0-baseline`               | Done        |
| 2   | `chore/quality-tooling`                | Done        |
| 3   | `style/format-baseline`                | Done        |
| 4   | `test/harness`                         | Done        |
| 5a  | `fix/auth-p0`                          | Done        |
| 5b  | `fix/proxy-ssrf`                       | Done        |
| 6   | `fix/server-p1`                        | Done        |
| 7   | `fix/client-p1`                        | Done        |
| 8a  | `refactor/naming`                      | Done        |
| 8b  | `refactor/routes`                      | Done        |
| 8c  | `refactor/manga-page`                  | Done        |
| 9   | `chore/a11y`                           | Done        |
| 10  | `chore/ts-foundation`                  | Done        |
| 11a | `refactor/server-ts-leaves`            | Done        |
| 11b | `refactor/server-ts-config`            | Done        |
| 11c | `refactor/server-ts-services`          | Done        |
| 11d | `refactor/server-ts-client-controller` | In progress |
| 11e | `refactor/server-ts-manga-controller`  | Planned     |
| 11f | `refactor/server-ts-auth-controller`   | Planned     |
| 11g | `refactor/server-ts-app`               | Planned     |
| 12  | `refactor/client-ts`                   | Planned     |
| 13  | `chore/ts-strict`                      | Planned     |
| 14  | `chore/final-audit`                    | Planned     |
