# Agent skills

The repository uses project-scoped agent skills to keep reviews and migrations consistent. The downloaded skill contents live in `.agents/skills/` and are **not committed**; `skills-lock.json` pins the exact sources and hashes.

## Restore

From the repository root:

```bash
npx skills experimental_install
```

Or install the same set explicitly:

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -a opencode -y --copy
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a opencode -y --copy
npx skills add openai/skills --skill security-best-practices -a opencode -y --copy
npx skills add wshobson/agents --skill nodejs-backend-patterns -a opencode -y --copy
npx skills add mattpocock/skills --skill improve-codebase-architecture -a opencode -y --copy
npx skills add mattpocock/skills --skill tdd -a opencode -y --copy
npx skills add antfu/skills --skill vitest -a opencode -y --copy
npx skills add wshobson/agents --skill typescript-advanced-types -a opencode -y --copy
npx skills add dotneet/claude-code-marketplace --skill typescript-react-reviewer -a opencode -y --copy
npx skills add anthropics/skills --skill webapp-testing -a opencode -y --copy
```

List what is installed:

```bash
npx skills list
```

## When to use each skill

| Skill | Use |
| --- | --- |
| `vercel-react-best-practices` | React rendering, data fetching, bundle and performance review |
| `web-design-guidelines` | UI, UX, and accessibility review |
| `security-best-practices` | Auth, input handling, secrets, and OWASP-style review |
| `nodejs-backend-patterns` | Express middleware, errors, API design, Mongoose usage |
| `improve-codebase-architecture` | Splitting oversized modules and improving boundaries |
| `tdd` | Red-green-refactor loop for bug fixes |
| `vitest` | Test harness, mocking, coverage, and test organization |
| `typescript-advanced-types` | Generics, discriminated unions, and type-safe APIs |
| `typescript-react-reviewer` | React + TypeScript anti-pattern review |
| `webapp-testing` | Optional Playwright smoke checks against a local app |

## Rules

- Review a skill before installing or running it; skills execute with full agent permissions.
- Do not commit `.agents/` or generated agent links. Update `skills-lock.json` when the set changes.
- Do not add a skill that duplicates an existing one without a concrete gap.
- Security-sensitive skills are advisory; the review and tests in `docs/audit/PLAN.md` remain the source of truth.
