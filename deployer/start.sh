#!/bin/sh
set -eu

: "${CONTENT_REPOSITORY:?Set CONTENT_REPOSITORY to the GitHub owner/repository}"
: "${CONTENT_GITHUB_TOKEN:?Set CONTENT_GITHUB_TOKEN}"
: "${GITHUB_WEBHOOK_SECRET:?Set GITHUB_WEBHOOK_SECRET}"
: "${GIT_PAGES_PASSWORD:?Set GIT_PAGES_PASSWORD}"
: "${SITE_URL:?Set SITE_URL to the published site URL}"
: "${DISCORD_WEBHOOK_URL:?Set DISCORD_WEBHOOK_URL}"

CONTENT_BRANCH=${CONTENT_BRANCH:-main}
export CONTENT_BRANCH
git check-ref-format --branch "$CONTENT_BRANCH" > /dev/null

/bin/sh /app/deployer/request-build.sh &
exec webhook -hooks /app/deployer/hooks.json -template -verbose -port 9000
