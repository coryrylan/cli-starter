# cli-starter

![CI Build](https://github.com/coryrylan/cli-starter/actions/workflows/pull-request.yml/badge.svg)

Build cross-platform CLI applications with Bun and TypeScript. `bun run build` compiles standalone binaries for macOS, Linux, and Windows with the runtime included. Users can run those binaries without installing Bun or Node.js.

## Install

The npm package is not published yet. Until the first release, clone the repository and run it from source with Bun:

```bash
bun install
bun --filter cli-starter run start
```

After publication, install the package with Bun (`bun add -g cli-starter`) or npm (`npm install -g cli-starter`). The npm-installed `mycli` command requires Bun on your PATH. To run without a runtime, download a standalone binary from [GitHub Releases](https://github.com/coryrylan/cli-starter/releases) or run `bun --filter cli-starter run install:local` from a clone (Bun is needed to build it, not to run it).

## Commands

| Command                   | Description                                                     |
| ------------------------- | --------------------------------------------------------------- |
| `bun start`               | Run the CLI via Bun                                             |
| `bun run build`           | Build ESM bundle, type declarations, and platform binaries      |
| `bun run test`            | Run tests (no coverage)                                         |
| `bun run test:coverage`   | Run tests with coverage; enforces thresholds from `bunfig.toml` |
| `bun run typecheck`       | Typecheck source and tests                                      |
| `bun run lint`            | Lint with type-checked ESLint rules                             |
| `bun run lint:package`    | Validate built package entrypoints with publint                 |
| `bun run ci`              | Run lint, typecheck, build, tests, and package checks           |
| `bun run install:local`   | Build and install binary to `~/.local/bin`                      |
| `bun run uninstall:local` | Remove locally installed binary                                 |

> Knip and dependency version checks run at the monorepo root. Run `bun run lint:knip`.

The coverage percentage measures imported logic modules. Command contract and artifact tests cover the CLI as a subprocess.

## CLI Usage

```bash
mycli --version
mycli greet "world"
mycli greet "world" --capitalize
```

## Build Targets

The build produces platform-specific standalone binaries in `dist/`. Each bundles the runtime and runs without Bun or Node.js:

- `mycli-macos-arm64`
- `mycli-macos-x64`
- `mycli-linux-x64`
- `mycli-linux-arm64`
- `mycli-windows-x64.exe`

## Rename the example

Search for `mycli` across the repo and replace it with your command name. This updates the npm executable, CLI help, installer, standalone binaries, and GitHub release assets. The package and release tag still use `cli-starter`; rename those separately for your project.

## License

MIT
