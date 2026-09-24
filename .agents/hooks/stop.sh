#!/usr/bin/env bash
if bun run format:fix && bun run ci; then
  echo "all checks pass"
else
  exit 2
fi
