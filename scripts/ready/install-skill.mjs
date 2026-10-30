#!/usr/bin/env node
import {access,cp,mkdir,lstat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2);
const host=args[0]||'codex';
if(!['codex','claude'].includes(host)){console.error('Usage: node install-skill.mjs codex|claude [absolute-target-parent]');process.exit(1);}
const root=dirname(fileURLToPath(import.meta.url));
const source=resolve(root,'skills/due-diligence');
const parent=args[1]?resolve(args[1]):resolve(homedir(),host==='claude'?'.claude/skills':'.agents/skills');
const dest=resolve(parent,'due-diligence');
try{
  await access(resolve(source,'SKILL.md'));
  try{await lstat(dest);console.error(`Already exists: ${dest}\nNothing was overwritten. Back up and remove it yourself to reinstall.`);process.exit(2);}catch(e){if(e.code!=='ENOENT')throw e;}
  await mkdir(parent,{recursive:true});
  await cp(source,dest,{recursive:true,errorOnExist:true,force:false});
  console.log(`Installed Due Diligence for ${host}: ${dest}\nReload your AI host. Try: Use the due-diligence skill to review this case.\nTo uninstall, remove only this due-diligence folder.`);
}catch(e){console.error('Installation failed:',e.message);process.exitCode=1;}
