#!/bin/sh
set -eu

exec /bin/sh /app/deployer/request-build.sh --fresh
