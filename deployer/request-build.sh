#!/bin/sh
set -eu

exec flock -x /tmp/blog-build.lock /bin/sh /app/deployer/build.sh "$@"
