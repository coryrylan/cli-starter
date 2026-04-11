# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal starter kit for building CLI applications with Bun and TypeScript. Bun provides native TypeScript support, so no compilation step is needed for development. For distribution, Bun compiles the CLI into platform-specific single-file executables.

## Key Architecture

- **Entry Point**: `src/index.ts` → imports `src/cli.ts` which defines commands using Yargs
- **CLI Binary**: Exposed as `bun-cli-starter` command; script name is `ncs`
- **Module System**: ES modules (`type: "module"`)
- **TypeScript**: Native support via Bun runtime (no flags needed)
- **Build**: Wireit orchestrates multi-platform builds (macOS arm64/x64, Linux arm64/x64, Windows x64) plus ESM bundle and type declarations
- **Task Runner**: [Wireit](https://github.com/nicolo-ribaudo/wireit) manages all scripts with dependency tracking and caching
- **Dependencies**: yargs (CLI parsing), @modelcontextprotocol/sdk, marked/marked-terminal (markdown rendering), zod (schema validation)

## Common Commands

### Development

```bash
bun install          # Install dependencies
bun start            # Run the CLI directly (via wireit)
bun src/index.ts     # Run the CLI directly
```

### Testing

```bash
bun run test              # Run tests with coverage
bun run test:coverage     # Run tests with coverage thresholds (90% lines/statements, 50% functions)
```

### Linting & Formatting

```bash
bun run lint         # ESLint (typescript-eslint strict config)
bun run format       # Prettier check
bun run format:fix   # Prettier auto-fix
```

### Building

```bash
bun run build        # Full build: ESM bundle + type declarations + all platform binaries
```

Build outputs in `dist/`:

- `index.js` — ESM bundle
- `index.d.ts` — TypeScript declarations
- `bun-cli-starter-macos-arm64`, `bun-cli-starter-macos-x64` — macOS binaries
- `bun-cli-starter-linux-x64`, `bun-cli-starter-linux-arm64` — Linux binaries
- `bun-cli-starter-windows-x64.exe` — Windows binary

### CI & Release

```bash
bun run ci           # Runs lint + build + test:coverage
bun run install:local    # Build and install binary to ~/.local/bin
bun run uninstall:local  # Remove locally installed binary
```

- CI runs on PRs via GitHub Actions (`.github/workflows/pull-request.yml`)
- Releases are automated via semantic-release on push to `main` (`.github/workflows/release.yml`)

## Commit Conventions

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:

- **Types**: `chore`, `feat`, `fix`
- **Scopes**: `ci`, `cli`
- Subject must be lower-case, no period, max 100 chars

## Adding New Commands

Modify `src/cli.ts` to add new CLI commands:

```typescript
cli.command(
  'command-name [args]',
  'description',
  yargs => {
    return yargs.positional('args', { describe: 'argument description' });
  },
  argv => {
    // command implementation
  }
);
```

## Important Notes

- Bun natively supports TypeScript — no experimental flags or build steps needed for development
- Compiled executables are standalone binaries that do not require Bun to be installed
- All scripts use Wireit for caching and dependency management — run them via `bun run <script>`
