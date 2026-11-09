#!/bin/sh
set -eu

workdir=$(mktemp -d "${TMPDIR:-/tmp}/blog-build.XXXXXXXX")
trap 'rm -rf "$workdir"' EXIT

export GIT_TERMINAL_PROMPT=0
export GIT_ASKPASS=/app/deployer/git-askpass.sh

# Fetch the repo, using a separate Git object cache
echo "Fetching ${CONTENT_REPOSITORY} (${CONTENT_BRANCH})"
content_cache="${TMPDIR:-/tmp}/blog-content.git"
git init --bare --quiet "$content_cache"
git --git-dir="$content_cache" fetch --quiet --depth 1 \
  "https://github.com/${CONTENT_REPOSITORY}.git" \
  "+refs/heads/${CONTENT_BRANCH}:refs/heads/${CONTENT_BRANCH}"
git clone --quiet --shared --single-branch --branch "$CONTENT_BRANCH" \
  "$content_cache" "$workdir/content"

export CONTENT_DIR="$workdir/content"
export OUTPUT_DIR="$workdir/site"

# Cache built images to speed up builds.
# This will cause that deleted source images will still exist and be available.
# To get rid of unused old images, run in the container:
# /bin/sh /app/deployer/request-build.sh --fresh
image_cache="${TMPDIR:-/tmp}/blog-image-cache"
if [ "${1:-}" != "--fresh" ] && [ -d "$image_cache" ]; then
  mkdir -p "$OUTPUT_DIR"
  cp -a "$image_cache" "$OUTPUT_DIR/img"
fi

echo "Building content commit $(git -C "$CONTENT_DIR" rev-parse HEAD)"
npm run build

if [ "${1:-}" = "--fresh" ]; then
  rm -rf "$image_cache"
fi
if [ -d "$OUTPUT_DIR/img" ]; then
  mkdir -p "$image_cache"
  cp -a "$OUTPUT_DIR/img/." "$image_cache/"
fi

echo "Publishing site"
git-pages-cli "$SITE_URL" --upload-dir "$OUTPUT_DIR" --server pages.app.timo.wtf --incremental
echo "Publish complete"
