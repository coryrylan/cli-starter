# AGENTS.md

This file provides guidance to coding agents working in this `projects/cli` package.

## Project Overview

Minimal starter kit for building CLI applications with Bun and TypeScript. Bun runs TypeScript natively (no compile step for dev) and compiles the CLI into standalone platform-specific binaries for distribution.

## Architecture

- **Entry**: `src/index.ts` (shebang `#!/usr/bin/env bun`) → imports `src/cli.ts`, which defines commands via Yargs
- **Package name**: `cli-starter`. **Example command and binary prefix**: `mycli`. Release tags retain the package name.
- **Module system**: ES modules (`type: "module"`). Relative imports use `.js` extensions even for `.ts` sources (standard ESM/TS convention).
- **Task runner**: [Wireit](https://github.com/google/wireit) wraps every npm script for dependency tracking and caching — always invoke via `bun run <script>`, not directly.
- **Lint**: ESLint runs per-package (`bun run lint`). [Knip](https://knip.dev) is configured at the monorepo root (`knip.config.js`) and runs across all workspaces via `bun run lint:knip` from the repo root.

## Common Commands

Run from `projects/cli/` (or via `bun --filter cli-starter run <script>` from the repo root):

```bash
bun install                  # Install deps (resolves at workspace root)
bun start                    # Run the CLI (via wireit: `bun src/index.ts`)
bun src/index.ts <args>      # Run CLI directly with args
bun run lint                 # ESLint (typescript-eslint strictTypeChecked) for this package
bun run typecheck            # Typecheck source and tests without emitting files
bun run test                 # Run source tests
bun run test:coverage        # Run source tests with enforced coverage thresholds
bun run lint:package         # Build and validate package entrypoints with publint
bun test src/capitalize.test.ts   # Run a single test file (bypass wireit)
bun test -t "pattern"        # Run tests matching a name pattern
bun run build                # Full build (ESM + .d.ts + 5 platform binaries)
bun run ci                   # lint + typecheck + build + source, artifact, and package checks
bun run ci:nocache           # Clean dist/ then run ci (useful when debugging cache issues)
bun run install:local        # Build + install binary to ~/.local/bin/mycli
bun run uninstall:local      # Remove ~/.local/bin/mycli
```

### Coverage thresholds (bunfig.toml)

- 90% lines and functions
- `dist/**` excluded from coverage
- The command and artifact tests validate CLI subprocess behavior; Bun's coverage report measures the imported logic modules.

### Build outputs (in `dist/`)

- `index.js` — minified ESM bundle
- `index.d.ts` — type declarations (via `tsconfig.types.json`)
- `mycli-macos-arm64`, `mycli-macos-x64`, `mycli-linux-x64`, `mycli-linux-arm64`, `mycli-windows-x64.exe` — standalone binaries (no Bun required to run)

## Releases (semantic-release)

Releases run automatically on push to `main` via `.github/workflows/release.yml` and are **scope-gated**:

- Only commits with scope `(cli)` trigger a release
- `feat(cli): …` → minor, `fix(cli): …` → patch, `<type>(cli)!: …` or breaking footer → major
- `chore(…)` never releases, regardless of scope
- Release notes filter to `(cli)`-scoped commits only
- Tag format: `cli-starter-v<version>` (not plain `v<version>`)
- Publishes to npm (`--access=public --provenance`) and attaches the 5 platform binaries as GitHub release assets
- The release config lives at the monorepo root (`/release.config.js`); this package's `release.config.js` is a one-line re-export.

## Commit Conventions

Enforced by commitlint (`@commitlint/config-conventional`) at the monorepo root:

- **Types**: `chore`, `feat`, `fix`
- **Scopes**: `ci`, `cli`, `docs`
- Subject: lower-case, no trailing period, max 100 chars

## Adding a new CLI command

Add to `src/cli.ts` using the Yargs builder pattern already there:

```typescript
cli.command(
  'name [arg]',
  'description',
  yargs => yargs.positional('arg', { type: 'string', describe: '...' }).option('flag', { alias: 'f', type: 'boolean' }),
  argv => {
    /* implementation */
  }
);
```

The default command (`'$0'`) prints help via `cli.getHelp()` — keep it last-wins-safe when adding commands.
