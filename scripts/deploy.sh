#!/usr/bin/env bash
set -euo pipefail

: "${SITE_URL:?SITE_URL is required}"
: "${GIT_PAGES_PASSWORD:?GIT_PAGES_PASSWORD is required}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="${1:-$ROOT/_site}"

docker run --rm \
  -e GIT_PAGES_PASSWORD \
  -v "$DIST:/site:ro" \
  codeberg.org/git-pages/git-pages-cli:latest \
  "$SITE_URL" \
  --upload-dir /site \
  --server pages.app.timo.wtf \
  --incremental
