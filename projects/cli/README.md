# cli-starter

![CI Build](https://github.com/coryrylan/cli-starter/actions/workflows/pull-request.yml/badge.svg)

Minimal starter kit for building CLI applications with Bun and TypeScript.

## Getting Started

Clone the repo and install dependencies:

```bash
bun install
```

Run the CLI directly:

```bash
bun start
```

## Commands

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `bun start`               | Run the CLI via Bun                                             |
| `bun run build`           | Build ESM bundle, type declarations, and platform binaries      |
| `bun run test`            | Run tests (no coverage)                                         |
| `bun run test:coverage`   | Run tests with coverage; enforces thresholds from `bunfig.toml` |
| `bun run lint`            | Lint this package with ESLint (typescript-eslint strict)        |
| `bun run format`          | Check formatting with Prettier                                  |
| `bun run format:fix`      | Auto-fix formatting                                             |
| `bun run ci`              | Run lint + build + test:coverage (used in CI)                   |
| `bun run install:local`   | Build and install binary to `~/.local/bin`                      |
| `bun run uninstall:local` | Remove locally installed binary                                 |

> Knip (unused files / deps / exports) is configured at the monorepo root and runs across all workspaces. From the repo root, run `bun run lint:knip`.

## CLI Usage

```bash
ncs --version
ncs greet "world"
ncs greet "world" --capitalize
```

## Build Targets

The build produces platform-specific standalone binaries in `dist/`:

- `cli-starter-macos-arm64`
- `cli-starter-macos-x64`
- `cli-starter-linux-x64`
- `cli-starter-linux-arm64`
- `cli-starter-windows-x64.exe`

## License

MIT
