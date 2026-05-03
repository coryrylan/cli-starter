# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bun workspaces monorepo. Packages live under `projects/`.

- `projects/cli/` — `cli-starter` CLI app (bin: `ncs`). See [`projects/cli/CLAUDE.md`](./projects/cli/CLAUDE.md) for package-specific guidance.
- `projects/docs/` — `@cli-starter/docs` placeholder for a future documentation site.

## Tooling split

- **Root**: prettier, commitlint, husky, semantic-release config, monorepo orchestration via wireit. Catalog dev deps shared via Bun's workspaces `catalog`.
- **Per-package**: ESLint, TypeScript, bunfig, source code, build outputs, install scripts. Each package has its own wireit graph.

## Common commands (run at root)

```bash
bun install          # install deps for all workspaces
bun run ci           # format + per-package ci
bun run format       # prettier check across all packages
bun run format:fix   # prettier write
bun run release      # semantic-release per package (CI only)
```

To run package-scoped scripts from root use `bun --filter <name> run <script>`, e.g. `bun --filter cli-starter run build`.

## Releases

- Single root `release.config.js` reads CWD's `package.json` to scope releases. Per-package `release.config.js` is a 1-line re-export.
- Currently only `cli-starter` (`projects/cli`) is wired into the release pipeline. `@cli-starter/docs` is intentionally not released.
- Tag format: `<package-name>-v<version>` (e.g. `cli-starter-v1.2.3`).
- Scope-gated: only commits with the package's scope trigger that package's release. `cli-starter` uses scope `cli`.

## Commit Conventions

Enforced by commitlint (`@commitlint/config-conventional`):

- **Types**: `chore`, `feat`, `fix`
- **Scopes**: `ci`, `cli`, `docs`
- Subject: lower-case, no trailing period, max 100 chars

## Catalog dependencies

Shared dev deps (`@types/bun`, `@eslint/js`, `eslint`, `typescript`, `typescript-eslint`) are declared once at the root under `workspaces.catalog` with **exact** versions and referenced as `"catalog:"` in package `devDependencies`. New catalog entries must use exact versions (no `^`/`~`).
