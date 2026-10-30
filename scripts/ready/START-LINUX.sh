#!/bin/sh
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  exec node launch.mjs
elif command -v python3 >/dev/null 2>&1; then
  exec python3 launch.py
else
  echo 'Install Node.js 20+ or Python 3.10+ then retry.'
  exit 1
fi
