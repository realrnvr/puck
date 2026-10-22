# Baseline audit

- Repository: `realrnvr/puck`
- Baseline commit: `a1721aa` (`main`)
- Audit branch: `audit/phase-0-baseline`
- Audit date: 2026-10-22
- Scope: `client/` (React + Vite) and `server/` (Express + Mongoose)

## Stack

| Area     | Technology                                                            |
| -------- | --------------------------------------------------------------------- |
| Client   | React 18.3, Vite 8, React Router 7, TanStack Query 5, Axios, Zod, CSS |
| Server   | Node.js 22, Express 4.21, Mongoose 8.6, Redis 4.7, JWT, Nodemailer    |
| Language | JavaScript / JSX (no TypeScript source yet)                           |
| Tests    | None                                                                  |
| CI       | None                                                                  |

## Size

| Metric                 | Value                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JS/JSX source lines    | 9,453                                                                                                                                                                        |
| Client JS/JSX files    | 139                                                                                                                                                                          |
| Client CSS files       | 66                                                                                                                                                                           |
| Server JS files        | 37                                                                                                                                                                           |
| Largest reviewed files | `client/src/pages/manga/Manga.jsx` (346), `client/src/services/provider/RouterProviderBase.jsx` (296), `server/controller/auth.js` (489), `server/controller/manga.js` (441) |

## Baseline checks

| Check            | Command                      | Result                                                |
| ---------------- | ---------------------------- | ----------------------------------------------------- |
| Client build     | `cd client && npm run build` | Pass                                                  |
| Client lint      | `cd client && npm run lint`  | Pass                                                  |
| Server lint      | n/a                          | No lint script or config                              |
| Server tests     | n/a                          | No test script or test files                          |
| Client tests     | n/a                          | No test script or test files                          |
| Dependency audit | `npm audit` in both packages | 0 vulnerabilities at baseline                         |
| CI               | `.github/workflows`          | Missing                                               |
| Formatting       | Prettier / EditorConfig      | Missing                                               |
| Type checking    | `tsc --noEmit`               | Missing; TypeScript dependencies exist but are unused |
| Root docs        | `README.md`                  | Missing                                               |

## Findings

Severity: **P0** = security or data-loss risk, **P1** = correctness or reliability, **P2** = standards/maintainability.

### Security

| ID     | Severity | Location                                       | Finding                                                                                                                                                                      |
| ------ | -------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-01 | P0       | `server/router/auth.js:41`                     | `DELETE /api/v1/auth/deleteUser` is public and takes an arbitrary `userId` from the body. Anyone can delete any account.                                                     |
| SEC-02 | P0       | `server/controller/auth.js:45,115,143,328,386` | Several endpoints return the full Mongoose user document, including `password`, `refreshToken`, `verificationToken`, and `resetToken`.                                       |
| SEC-03 | P0       | `server/controller/auth.js:29`                 | `User.create({ ...req.body })` allows mass assignment of `isVerified`, `type`, `googleId`, tokens, etc.                                                                      |
| SEC-04 | P0       | `server/controller/manga.js:323-349`           | `proxyChapterImage` fetches an arbitrary decoded `baseUrl` and streams the response. This is an SSRF primitive (internal services, metadata endpoints, file/redirect abuse). |
| SEC-05 | P0       | `server/middleware/authorization.js:6,11,22`   | Authentication failures return HTTP 200 with `{ statusCode: 403 }`. Clients and proxies cannot enforce auth correctly.                                                       |
| SEC-06 | P0       | `server/controller/auth.js:283-299`            | Logout only clears the cookie; it does not revoke or rotate the stored refresh token or Google token. Password reset/change does not revoke existing sessions.               |
| SEC-07 | P1       | `server/models/auth.js:23-51`                  | Sensitive fields are not `select: false` and are easy to leak by accident.                                                                                                   |
| SEC-08 | P1       | `server/app.js:31-36`                          | Cookie/CORS/security headers are minimal; no Helmet, no explicit cookie policy, no production secret validation.                                                             |
| SEC-09 | P0       | `server/controller/auth.js:146-176`            | `loginGoogleAuthTwo` is public and sets a password for any verified email without proving ownership of the Google account. This is an account-takeover path.                 |

### Correctness and reliability

| ID     | Severity | Location                                                           | Finding                                                                                                                                             |
| ------ | -------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| COR-01 | P1       | `server/controller/manga.js:351-358`                               | `search` returns an `Error` object instead of throwing `BadRequestError`, producing a misleading response.                                          |
| COR-02 | P1       | `server/services/mailer.js:13`                                     | Default parameter `options = { to, subject, html }` references undefined identifiers; calling `mailer()` without arguments throws `ReferenceError`. |
| COR-03 | P1       | `server/controller/auth.js:35`, `server/services/newsletter.js:28` | Mailer promises are not awaited, so failures are unhandled and the API can report success before delivery.                                          |
| COR-04 | P1       | `server/models/newsletter.js:23`                                   | `default: Date.now()` is evaluated once at schema definition; all records share the same default timestamp.                                         |
| COR-05 | P1       | `client/src/pages/read/Read.jsx:19`                                | `fetchRandomManga` is not awaited before reading `response.data`, so cover prefetching can fail.                                                    |
| COR-06 | P1       | `client/src/hooks/usePrefetchChapter.js:10`                        | `JSON.parse(localStorage.getItem(...))` runs during render and throws on malformed data.                                                            |
| COR-07 | P1       | `client/src/pages/favourite/Favourite.jsx:2`                       | Imports `framer-motion`, which is only a transitive dependency of `motion`; this is a phantom dependency.                                           |
| COR-08 | P1       | `client/src/pages/favourite/Favourite.jsx:45-104`                  | Skeleton/loading conditions rely on `pageParams` and can show skeletons indefinitely or hide content incorrectly.                                   |
| COR-09 | P2       | `server/controller/client.js:17-41`                                | Cursor pagination does not validate `limit`/`cursor`, and `hasMore` filtering is fragile.                                                           |

### Standards and maintainability

| ID     | Severity | Location                                              | Finding                                                                                                                              |
| ------ | -------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| QUA-01 | P2       | `client/src/services/provider/RouterProviderBase.jsx` | 296-line route configuration with mixed lazy/eager imports.                                                                          |
| QUA-02 | P2       | `client/src/pages/manga/Manga.jsx`                    | 346-line page with repeated deep data chains and mixed responsibilities.                                                             |
| QUA-03 | P2       | Server controllers/routes                             | Naming drift: `Allfavourites`, `UnauthorziedError`, `loginAuthOne`, `loginGoogleAuthTwo`, `deleteUser`, singular/plural route nouns. |
| QUA-04 | P2       | `server/package.json`                                 | License is `ISC` while the repository is Apache-2.0.                                                                                 |
| QUA-05 | P2       | Both packages                                         | No tests, no CI, no server lint, no formatting, no commit/PR conventions.                                                            |
| QUA-06 | P2       | Client lint config                                    | No accessibility or security rules; `react/jsx-no-target-blank` disabled.                                                            |
| QUA-07 | P2       | Both packages                                         | Unused TypeScript dependencies and no migration plan.                                                                                |

## Constraints

- No secrets are committed. Local `.env*` files are gitignored and must stay out of PRs.
- Existing API response shapes are consumed by the client; breaking contract changes need a coordinated client/server PR.
- The client build currently passes; changes must keep `npm run build` green.
- The server has no test harness yet; P0 fixes should land after a minimal harness exists.

## Next checkpoint

See `docs/audit/PLAN.md` for the PR sequence and `docs/CODING_STANDARDS.md`, `docs/TESTING.md`, and `docs/TS_MIGRATION.md` for the target standards.
