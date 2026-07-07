var CACHE='diypensacola-c6bb8a2780c2';
var CORE=['./','index.html','offline.html','logo.png','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){});}));
  }));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){if(k!==CACHE){return caches.delete(k);}}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var req=e.request; if(req.method!=='GET'){return;}
  var url=new URL(req.url); if(url.origin!==location.origin){return;}
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(function(res){
      var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}); return res;
    }).catch(function(){return caches.match(req).then(function(m){
      if(m)return m;
      // the homepage itself falls back to its cached copy; any other uncached
      // page gets the self-contained offline card (index's relative asset paths
      // would break when served under a subdirectory URL).
      if(/(^|\/)($|index\.html$)/.test(url.pathname))return caches.match('index.html')||caches.match('./');
      return caches.match('offline.html');
    });}));
    return;
  }
  e.respondWith(caches.match(req).then(function(m){
    return m||fetch(req).then(function(res){
      var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}); return res;
    }).catch(function(){return m;});
  }));
});
