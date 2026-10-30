#!/usr/bin/env python3
"""Install only the self-contained skill. Never overwrite an existing skill."""
from pathlib import Path
import argparse, shutil
parser=argparse.ArgumentParser(description='Install Due Diligence skill for a compatible AI host')
parser.add_argument('--target', type=Path, default=Path.home()/'.agents/skills', help='Host skill parent directory; default ~/.agents/skills')
parser.add_argument('--dry-run', action='store_true')
args=parser.parse_args()
source=Path(__file__).resolve().parent.parent/'skills/due-diligence'
dest=args.target.expanduser().resolve()/'due-diligence'
if dest.exists(): parser.error(f'Refusing to overwrite {dest}. Back up/remove explicitly first.')
if args.dry_run: print(f'Would copy {source} to {dest}')
else:
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copytree(source,dest)
    print(f'Installed {dest}. Restart or reload your AI host and test the skill.')
