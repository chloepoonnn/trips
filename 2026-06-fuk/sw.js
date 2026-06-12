// 離線 cache：network-first，斷網 fallback 上次 cache（日本街頭訊號弱用）
const C='fuk-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r.ok&&(e.request.url.startsWith(self.location.origin)||e.request.url.includes('cartocdn')||e.request.url.includes('cdnjs'))){
        const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl));
      }
      return r;
    }).catch(()=>caches.match(e.request))
  );
});
