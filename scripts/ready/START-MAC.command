#!/bin/sh
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  node launch.mjs
elif command -v python3 >/dev/null 2>&1; then
  python3 launch.py
else
  echo 'Install Node.js 20+ from https://nodejs.org or Python 3.10+ from https://python.org then retry.'
fi
printf '\nPress Enter to close.'
read -r close_key
