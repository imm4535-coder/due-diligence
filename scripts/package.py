"""Build reviewed, secret-free distribution archives with relative paths only."""
from pathlib import Path
import sys, zipfile, hashlib, json
root = Path(sys.argv[1]).resolve()
out = root / 'release'
def archive(dest, pairs):
    with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
        for path, name in sorted(pairs, key=lambda p:p[1]):
            if path.is_symlink(): raise RuntimeError(f'Symlinks not allowed: {path}')
            if path.is_file(): z.write(path, name)
    with zipfile.ZipFile(dest) as z:
        assert z.testzip() is None
        for name in z.namelist():
            assert not name.startswith('/') and '..' not in Path(name).parts
            assert not any(x in Path(name).parts for x in ['.git', 'node_modules', '.env', 'cases'])
archive(out/'due-diligence-skill.zip', [(p, 'due-diligence/'+p.relative_to(root/'skills/due-diligence').as_posix()) for p in (root/'skills/due-diligence').rglob('*') if p.is_file()])
archive(out/'due-diligence-plugin.zip', [(p,p.relative_to(out/'plugin').as_posix()) for p in (out/'plugin').rglob('*') if p.is_file()])
excluded={'.git','dist','release','node_modules','cases','coverage','__pycache__'}
source=[p for p in root.rglob('*') if p.is_file() and not (excluded & set(p.relative_to(root).parts)) and not p.name.startswith('.env') and not p.name.endswith(('.log','.pyc'))]
archive(out/'due-diligence-source.zip', [(p,'due-diligence/'+p.relative_to(root).as_posix()) for p in source])
for path in out.glob('*.zip'):
    (root/'dist/downloads'/path.name).write_bytes(path.read_bytes())
archive(out/'due-diligence-app.zip', [(p,p.relative_to(root/'dist').as_posix()) for p in (root/'dist').rglob('*') if p.is_file()])
ready=[]
ready += [(p,'due-diligence/'+p.relative_to(root/'scripts/ready').as_posix()) for p in (root/'scripts/ready').rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix!='.pyc']
ready += [(p,'due-diligence/app/'+p.relative_to(root/'dist').as_posix()) for p in (root/'dist').rglob('*') if p.is_file()]
ready += [(p,'due-diligence/skills/'+p.relative_to(root/'skills').as_posix()) for p in (root/'skills').rglob('*') if p.is_file()]
ready += [(p,'due-diligence/src/'+p.relative_to(root/'src').as_posix()) for p in (root/'src').rglob('*') if p.is_file()]
ready += [(root/'LICENSE','due-diligence/LICENSE')]
for name in ['due-diligence-skill.zip','due-diligence-plugin.zip']:
    ready.append((out/name,'due-diligence/'+name))
archive(out/'due-diligence-ready-to-install.zip',ready)
checksums=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in sorted(out.glob('*.zip')))
(out/'SHA256SUMS.txt').write_text(checksums)
print(checksums, end='')
