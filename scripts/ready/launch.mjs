#!/usr/bin/env node
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'app');
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.zip':'application/zip'};
const server=createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let path=resolve(root,'.'+decodeURIComponent(url.pathname));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const content=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(content);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.on('error',e=>{console.error('Cannot start local app:',e.message);process.exitCode=1;});
// Stable origin preserves browser saves. Stop rather than changing ports silently.
server.listen(4173,'127.0.0.1',()=>{
  const url='http://127.0.0.1:4173';
  console.log(`Due Diligence is running: ${url}\nKeep this window open. Press Ctrl+C to stop.\nCases are saved in your browser, not this folder. Export JSON to back up.`);
  if(process.argv.includes('--no-browser'))return;
  const command=process.platform==='win32'?['cmd',['/c','start','',url]]:process.platform==='darwin'?['open',[url]]:['xdg-open',[url]];
  const child=spawn(command[0],command[1],{stdio:'ignore',detached:true});
  child.on('error',()=>console.log('Open the URL above in your browser.'));child.unref();
});
