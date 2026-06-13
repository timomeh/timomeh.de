#!/usr/bin/env sh
set -e

cleanup() {
  docker compose --profile dev down
}

trap cleanup EXIT INT TERM

docker compose --profile dev up -d
pnpm dev:app
