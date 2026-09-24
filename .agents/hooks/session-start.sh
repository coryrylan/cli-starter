#!/usr/bin/env bash
set -e
bun i --frozen-lockfile && bun run ci
