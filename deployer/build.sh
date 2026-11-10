#!/bin/sh
set -eu

finish() {
  status=$?
  trap - EXIT
  if [ "$status" -eq 0 ]; then
    message="🚀 Released Blog changes"
  else
    message="😢 Releasing Blog changes failed"
  fi
  message="${message}
Content: ${CONTENT_REPOSITORY} (${CONTENT_BRANCH})"
  if [ -n "${CONTENT_COMMIT:-}" ]; then
    message="${message}
Commit: ${CONTENT_COMMIT}"
  fi
  if ! jq -n --arg content "$message" '{content: $content, allowed_mentions: {parse: []}}' |
    curl --fail --silent --show-error --max-time 10 -o /dev/null \
      -H 'Content-Type: application/json' -d @- "$DISCORD_WEBHOOK_URL"; then
    echo "Failed to send Discord notification" >&2
  fi
  exit "$status"
}
trap finish EXIT

cd /app

export GIT_TERMINAL_PROMPT=0
export GIT_ASKPASS=/app/deployer/git-askpass.sh

export CONTENT_DIR=/app/content
export OUTPUT_DIR=/app/_site

echo "Updating ${CONTENT_REPOSITORY} (${CONTENT_BRANCH})"
if [ -d "$CONTENT_DIR/.git" ]; then
  git -C "$CONTENT_DIR" pull --ff-only origin "$CONTENT_BRANCH"
else
  git clone --depth 1 --single-branch --branch "$CONTENT_BRANCH" \
    "https://github.com/${CONTENT_REPOSITORY}.git" "$CONTENT_DIR"
fi

if [ "${1:-}" = "--fresh" ]; then
  rm -rf "$OUTPUT_DIR" /app/.cache
fi

CONTENT_COMMIT=$(git -C "$CONTENT_DIR" rev-parse HEAD)
export CONTENT_COMMIT
echo "Building content commit $CONTENT_COMMIT"
npm run build

echo "Publishing site"
git-pages-cli "$SITE_URL" --upload-dir "$OUTPUT_DIR" --server pages.app.timo.wtf --incremental
echo "Publish complete"
