#!/bin/sh
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  node install-skill.mjs claude
else
  echo 'Install Node.js 20+ from https://nodejs.org or copy skills/due-diligence into ~/.claude/skills manually.'
fi
printf '\nPress Enter to close.'
read -r close_key
