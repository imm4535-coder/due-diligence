import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
for(const dir of ['src','app','scripts','tests'])for(const file of await readdir(dir))if(/\.(mjs|js)$/.test(file)){const check=spawnSync(process.execPath,['--check',`${dir}/${file}`],{encoding:'utf8'});assert.equal(check.status,0,check.stderr);}
const skill=await readFile('skills/due-diligence/SKILL.md','utf8');assert.ok(skill.startsWith('---\nname: due-diligence\ndescription: '));assert.ok(Buffer.byteLength(skill)<1048576);
for(const ref of ['references/domains.md','references/report-template.md','references/evidence-rules.md']){assert.ok(skill.includes(ref));assert.ok((await readFile('skills/due-diligence/'+ref,'utf8')).length);}
const config=JSON.parse(await readFile('app/config.json','utf8'));assert.equal(typeof config.supportUrl,'string');
const html=await readFile('app/index.html','utf8');for(const file of ['app.mjs','style.css','icon.svg','manifest.webmanifest'])assert.ok(html.includes(file));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate HTML ids');
console.log('Syntax, skill references, configuration and HTML structure checks passed.');
