const CACHE='due-diligence-v0.1.1';
const ASSETS=['./','./index.html','./style.css','./app.mjs','./icon.svg','./manifest.webmanifest','./config.json','./src/catalog.mjs','./src/engine.mjs'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('due-diligence-')&&k!==CACHE).map(k=>caches.delete(k)))));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(r=>r||Response.error())));});
