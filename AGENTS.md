# Agent workflow

## Scope

- The codebase stays JavaScript/JSX. Do not start or resume a TypeScript migration.
- Do not perform security remediation unless explicitly requested.
- Keep existing security fixes in place; do not intentionally reintroduce vulnerabilities.

## Git

- Never commit or push directly to `main`.
- Do all work on a `work/*` branch and push only that branch.
- Do not merge a branch or open a merge until the user explicitly says to merge.
- When the user says to merge, use a squash merge and delete the remote branch.
- After a merge, switch to `main`, pull, and create a fresh `work/*` branch for the next task.
- Keep commits small and use Conventional Commit messages.
- Run the relevant tests, lint, and build before asking for a merge.

## Deployments

- Do not deploy to Vercel or run `vercel --prod`.
- Do not push to `main` just to trigger a production deployment.
- Vercel automatic preview builds are disabled for `work/*` branches through the
  `commandForIgnoringBuildStep` project setting on both `puck-client` and `puck-server`.
- Ask before creating any preview deployment.
