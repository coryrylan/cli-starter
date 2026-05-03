# cli-starter

![CI Build](https://github.com/coryrylan/cli-starter/actions/workflows/pull-request.yml/badge.svg)

Bun workspaces monorepo for the `cli-starter` CLI and supporting docs.

## Packages

- [`projects/cli`](./projects/cli) — `cli-starter` CLI (bin: `ncs`).
- [`projects/docs`](./projects/docs) — documentation site placeholder.

## Common commands

```bash
bun install          # install deps for all workspaces
bun run ci           # format + per-package ci (lint + build + test:coverage)
bun run format       # prettier check across the monorepo
bun run format:fix   # prettier write
```

See per-package `README.md` files for package-specific commands and details.

## License

MIT
