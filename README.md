# cli-starter

![CI Build](https://github.com/coryrylan/cli-starter/actions/workflows/pull-request.yml/badge.svg)

Build cross-platform, standalone CLI binaries with Bun and TypeScript. The compiled binaries include the runtime, so users don't need Bun or Node.js to run them. Bun is required to develop and build the CLI.

This repository is a Bun workspaces monorepo for the `cli-starter` package and supporting docs. Its example executable is `mycli`; search for `mycli` to rename the command and platform binaries for your project.

## Packages

- [`projects/cli`](./projects/cli) — `cli-starter` package (command: `mycli`).
- [`projects/docs`](./projects/docs) — documentation site placeholder.

## Common commands

```bash
bun install          # install deps for all workspaces
bun run ci           # format + static analysis + package CI
bun run format       # prettier check across the monorepo
bun run format:fix   # prettier write
```

See per-package `README.md` files for package-specific commands and details.

## License

MIT
