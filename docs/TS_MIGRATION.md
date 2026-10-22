# TypeScript migration strategy

## Goal

Move the client and server from JavaScript/JSX to TypeScript without a big-bang rewrite, while keeping the app shippable at every step.

## Non-goals

- Rewriting the architecture at the same time.
- Changing public API URLs or response shapes as part of the migration.
- Replacing React, Express, Mongoose, or TanStack Query.
- Chasing 100% type coverage before behavior is tested.

## Principles

1. **Strangler pattern.** JavaScript and TypeScript coexist. Convert leaf modules first and move upward.
2. **Strict for new code.** New `.ts`/`.tsx` files are strict from day one; existing JS stays unchecked until converted.
3. **No behavior changes in migration PRs.** A conversion commit should be reviewable as "types only" plus imports.
4. **Tests before conversion.** A module with tests is safe to convert; a module without tests gets characterization tests first.
5. **One folder per commit.** Each conversion step must build, typecheck, and pass tests.
6. **Types at the boundary.** Use Zod to validate runtime input and infer static types; do not trust `req.body` or API responses.

## Phase 10 — Foundation (no source conversion)

### Client

Add `client/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```

Add `client/tsconfig.node.json` for `vite.config.ts` and `client/src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_RANDOM_MANGA_LIMIT?: string;
  readonly VITE_MANGAS_LIMIT?: string;
  readonly VITE_ALL_FAVOURITE_LIMIT?: string;
  // Add every VITE_* variable used by the client.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Add scripts: `typecheck: "tsc --noEmit"`.

### Server

Add dev dependencies: `typescript`, `tsx`, `@types/node`.

Add `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "allowJs": true,
    "checkJs": false,
    "outDir": "dist",
    "rootDir": ".",
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true
  },
  "include": ["**/*.ts", "**/*.js"],
  "exclude": ["node_modules", "dist", "test"]
}
```

Add scripts:

```json
{
  "dev": "tsx watch server.ts",
  "typecheck": "tsc --noEmit",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Keep `app.js` as the entrypoint until the server split lands, then rename to `app.ts`/`server.ts`.

### CI

Add `npm --prefix client run typecheck` and `npm --prefix server run typecheck` to CI. They must pass with `allowJs`/`checkJs: false` before conversion starts.

## Phase 11 — Server conversion

Order (leaf-first):

1. `server/errors/*` — typed error classes.
2. `server/helper/*` and `server/utils/*` — pure functions.
3. `server/config/*` — env validation and Redis/client types.
4. `server/models/*` — schema interfaces, model methods, `HydratedDocument`.
5. `server/middleware/*` — `RequestHandler`, `AuthRequest`.
6. `server/services/*` — mailer options, axios response types.
7. `server/controller/*` — `Request<Params, ResBody, ReqBody, Query>`.
8. `server/router/*` — `Router`.
9. `server/app.js` -> `app.ts`; extract `server.ts` bootstrap.
10. `server/populate.js`, `server/caseManga.js` — convert or delete if unused.

### Patterns

**Typed errors**

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}
```

**Authenticated request**

```ts
import type { Request } from "express";

export interface AuthUser {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}
```

Use `AuthRequest` in controllers behind the `auth` middleware; do not assert `req.user!` in every handler.

**Mongoose model**

```ts
import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export interface User {
  username: string;
  email: string;
  password?: string;
  // ...
}

export interface UserMethods {
  verifyPassword(password: string): Promise<boolean>;
  createAccessToken(): string;
}

export type UserDocument = HydratedDocument<User, UserMethods>;
export type UserModel = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModel, UserMethods>({ /* ... */ });
export const User = model<User, UserModel>("User", userSchema);
```

**JWT payload**

```ts
interface AccessTokenPayload {
  userId: string;
  email: string;
}

const payload = jwt.verify(token, secret) as AccessTokenPayload;
```

Do not use `as` without a runtime shape check for untrusted tokens; for internally signed tokens, validate `userId`/`email` presence before use.

**Request validation**

```ts
const SignupBody = z.object({
  username: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string().min(8).optional(),
});

type SignupBody = z.infer<typeof SignupBody>;

export const signup: RequestHandler<{}, unknown, SignupBody> = async (req, res) => {
  const body = SignupBody.parse(req.body);
  // ...
};
```

## Phase 12 — Client conversion

Order:

1. `src/types/` — API contracts, user, manga, chapter, error shapes.
2. `src/services/api/axios.ts` — typed Axios instance.
3. `src/helper/` and `src/utils/` — pure helpers.
4. `src/hooks/` — typed hook inputs/outputs.
5. `src/services/query/` — typed query functions and keys.
6. `src/services/mutation/` — typed mutations.
7. `src/components/ui/` — props and events.
8. `src/pages/` — page components and route params.
9. `src/services/provider/` — QueryClient, Auth, Router providers.
10. `src/main.tsx` and `src/routes/`.

### Patterns

**API types from Zod**

```ts
export const MangaSchema = z.object({
  mangaId: z.string(),
  title: z.string(),
  authorId: z.string().optional(),
});

export type Manga = z.infer<typeof MangaSchema>;
```

**TanStack Query**

```ts
useQuery<MangaResponse, ApiError>({
  queryKey: mangaKeys.random(limit),
  queryFn: () => fetchRandomManga(limit),
});
```

Prefer query-key factories over ad-hoc arrays:

```ts
export const mangaKeys = {
  all: ["manga"] as const,
  random: (limit: number) => [...mangaKeys.all, "random", { limit }] as const,
  cover: (mangaId: string, volume: string, width: number) =>
    [...mangaKeys.all, "cover", { mangaId, volume, width }] as const,
};
```

**Component props**

```tsx
interface MangaCardProps {
  title: string;
  mangaId: string;
  authorId?: string;
}

export function MangaCard({ title, mangaId, authorId }: MangaCardProps) {
  // ...
}
```

Remove the corresponding `propTypes` block when a component is converted.

**Environment**

Use the `ImportMetaEnv` declaration; do not cast `import.meta.env` at call sites.

## Phase 13 — Strictness

Enable one flag at a time, with a commit and test run for each:

1. `checkJs: true` — fix or convert remaining JS.
2. `noUncheckedIndexedAccess: true`.
3. `exactOptionalPropertyTypes: true`.
4. `noImplicitOverride: true`.
5. `verbatimModuleSyntax: true` (if not already on).
6. Remove `allowJs` and `checkJs` once no JS source remains.
7. Remove `prop-types` and unused `@types/*` packages.
8. Add `@typescript-eslint` recommended rules.

Expected friction:

- `noUncheckedIndexedAccess` will flag array/object access in pagination, image lists, and route params. Fix with guards, not `!`.
- `exactOptionalPropertyTypes` will flag optional props passed as `undefined`. Prefer `prop?: T` only when omission is meaningful; otherwise `prop: T | undefined`.
- Express `req.query` is `ParsedQs`; validate with Zod before use.
- Mongoose document types are not plain objects; map to DTOs before sending responses.

## Shared contracts

The client and server currently define overlapping shapes independently. Do not duplicate them long-term.

Options:

1. **Start local:** `client/src/types` and `server/types` with matching Zod schemas, until the P0/P1 work is done.
2. **Introduce a shared package when duplication grows:** `packages/contracts` with Zod schemas and inferred types, consumed by both packages.
3. **Use npm workspaces** for the shared package and root scripts. This changes lockfile layout, so do it as its own PR (`chore/workspaces`), not inside a feature PR.

Recommended shared contracts:

- `UserSummary` (never includes secrets)
- `AuthResponse`
- `ApiError`
- `MangaSummary`, `MangaDetails`, `ChapterSummary`, `ChapterImage`
- `Favourite`
- `NewsletterSubscriber`

## Verification per conversion PR

```bash
npm --prefix client run typecheck
npm --prefix client test -- --run
npm --prefix client run build

npm --prefix server run typecheck
npm --prefix server test -- --run
npm --prefix server run build
```

Review checklist:

- [ ] No `any` introduced.
- [ ] No `@ts-ignore` / `@ts-expect-error` without a comment and an issue.
- [ ] No behavior changes beyond types/imports.
- [ ] Tests added for previously untested converted modules.
- [ ] Runtime validation at HTTP and environment boundaries.
- [ ] `git diff` is reviewable folder-by-folder.

## Rollback

- Keep each folder conversion as one commit; revert that commit if a regression appears.
- Keep `.js` files until all imports are updated. Do not delete the last working version in the same commit that introduces its replacement.
- If a strictness flag causes a large cascade, revert the flag and schedule the cleanup separately.

## Skills

- `typescript-advanced-types` for generics, discriminated unions, and utility types.
- `typescript-react-reviewer` for React/TS anti-pattern review.
- `vitest` and `tdd` for the test harness and red-green-refactor loop.
- `nodejs-backend-patterns` for Express/Mongoose typing patterns.
