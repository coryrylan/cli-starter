# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Minimal starter kit for building CLI applications with Bun and TypeScript. Bun runs TypeScript natively (no compile step for dev) and compiles the CLI into standalone platform-specific binaries for distribution.

## Architecture

- **Entry**: `src/index.ts` (shebang `#!/usr/bin/env bun`) → imports `src/cli.ts`, which defines commands via Yargs
- **Package name**: `cli-starter`. **Bin name**: `ncs` (what users type). Don't conflate the two.
- **Module system**: ES modules (`type: "module"`). Relative imports use `.js` extensions even for `.ts` sources (standard ESM/TS convention).
- **Task runner**: [Wireit](https://github.com/google/wireit) wraps every npm script for dependency tracking and caching — always invoke via `bun run <script>`, not directly.
- **Pre-installed but unused deps**: `@modelcontextprotocol/sdk`, `marked`/`marked-terminal`, `zod` are declared in `package.json` but not yet wired into `src/`. They're ready to use for MCP servers, markdown rendering in the terminal, and schema validation respectively.

## Common Commands

```bash
bun install                  # Install deps
bun start                    # Run the CLI (via wireit: `bun src/index.ts`)
bun src/index.ts <args>      # Run CLI directly with args
bun run lint                 # ESLint (typescript-eslint strict)
bun run format               # Prettier check
bun run format:fix           # Prettier write
bun run test                 # Run all tests with coverage
bun run test:coverage        # Same command; enforces thresholds from bunfig.toml
bun test src/capitalize.test.ts   # Run a single test file (bypass wireit)
bun test -t "pattern"        # Run tests matching a name pattern
bun run build                # Full build (ESM + .d.ts + 5 platform binaries)
bun run ci                   # format + lint + build + test:coverage
bun run ci:nocache           # Clean dist/ then run ci (useful when debugging cache issues)
bun run install:local        # Build + install binary to ~/.local/bin/ncs
bun run uninstall:local      # Remove ~/.local/bin/ncs
```

### Coverage thresholds (bunfig.toml)

- 90% lines, 90% statements, 50% functions
- `dist/**` excluded from coverage

### Build outputs (in `dist/`)

Wireit produces these filenames:

- `index.js` — minified ESM bundle
- `index.d.ts` — type declarations (via `tsconfig.types.json`)
- `ncs-macos-arm64`, `ncs-macos-x64`, `ncs-linux-x64`, `ncs-linux-arm64`, `ncs-windows-x64.exe` — standalone binaries (no Bun required to run)

**Note**: `release.config.js` and `README.md` reference these as `cli-starter-*` — the wireit output names and release-asset paths currently disagree. Pick one when editing either side.

## Releases (semantic-release)

Releases run automatically on push to `main` via `.github/workflows/release.yml` and are **scope-gated**:

- Only commits with scope `(cli)` trigger a release
- `feat(cli): …` → minor, `fix(cli): …` → patch, `<type>(cli)!: …` or breaking footer → major
- `chore(…)` never releases, regardless of scope
- Release notes filter to `(cli)`-scoped commits only
- Tag format: `cli-starter-v<version>` (not plain `v<version>`)
- Publishes to npm (`--access=public --provenance`) and attaches the 5 platform binaries as GitHub release assets

## Commit Conventions

Enforced by commitlint (`@commitlint/config-conventional`):

- **Types**: `chore`, `feat`, `fix`
- **Scopes**: `ci`, `cli`
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
