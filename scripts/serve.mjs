import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.zip':'application/zip'};
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    let path=resolve(root,'.'+decodeURIComponent(url.pathname));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const content=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",'Cache-Control':'no-cache'});res.end(content);
  }catch{res.writeHead(404);res.end('Not found. Run npm run build first.');}
}).listen(port,'127.0.0.1',()=>process.stdout.write(`Diligence Commons: http://127.0.0.1:${port}\n`));
