import {mkdir,cp,rm,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {prepareSplitPlugins} from './build-split.mjs';
const root=resolve('.');
// Keep contained skill references in sync before copying source/assets.
await rm('dist',{recursive:true,force:true});await rm('release',{recursive:true,force:true});
await mkdir('release',{recursive:true});await mkdir('dist/downloads',{recursive:true});
await cp('app','dist',{recursive:true});await cp('src','dist/src',{recursive:true,filter:src=>!src.endsWith('mcp.mjs')});
await writeFile('dist/README.txt','Due Diligence v0.1\n\nExtract this app ZIP to a folder, then serve that folder with a static HTTP server. For example, if Python is installed:\n\npython3 -m http.server 4173 --bind 127.0.0.1\n\nOpen http://127.0.0.1:4173 in your browser. ES modules and offline caching require HTTP(S), so opening index.html directly as a local file is not supported.\n\nNo account, model API key, or npm dependencies are required for the static app. Downloads are in downloads/. Source code and installation instructions are in due-diligence-source.zip.\n');
const config=JSON.parse(await readFile('app/config.json','utf8'));
for(const key of ['supportUrl','repositoryUrl'])if(config[key]){const u=new URL(config[key]);if(u.protocol!=='https:'||u.username||u.password)throw new Error(`${key} must be a credential-free HTTPS URL`);}
const plugin={
  $schema:'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',name:'diligence-commons',version:'0.1.1',description:'Evidence-led due diligence workflow across 12 domains. Sources, gaps, risks and human decision gates.',license:'MIT',author:{name:'Due Diligence contributors'},
  extensions:{'com.openai':{interface:{displayName:'Due Diligence',shortDescription:'Evidence-led due diligence',longDescription:'A reusable AI skill for scoped due diligence, traceable evidence, contradictions, risks and reviewable decisions. No automated certification or external data access.',developerName:'Due Diligence contributors',capabilities:[],defaultPrompt:'ตรวจสอบเรื่องนี้ด้วยหลักฐาน ระบุความเสี่ยง ข้อมูลที่ยังขาด และเงื่อนไขก่อนตัดสินใจ'}}}
};
if(config.repositoryUrl)plugin.repository=config.repositoryUrl;
await mkdir('release/plugin/skills',{recursive:true});await cp('skills/due-diligence','release/plugin/skills/due-diligence',{recursive:true});
await cp('LICENSE','release/plugin/LICENSE');await writeFile('release/plugin/plugin.json',JSON.stringify(plugin,null,2)+'\n');
await prepareSplitPlugins();
const python = spawnSync('python3',['scripts/package.py',root],{stdio:'inherit'});
if(python.error)throw python.error;if(python.status!==0)throw new Error('Packaging failed');
process.stdout.write('Built dist/ and release/ (app, source, skill and plugin ZIPs).\n');
