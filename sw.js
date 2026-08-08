var CACHE='diypensacola-8a55d34d361f';
// CORE is the app shell (always precached). PRECACHE is this build's fonts plus
// the flyers for tonight + this week, injected by build.py so someone who opens
// the site fresh at a venue with no signal still sees this week's flyers instead
// of logo placeholders. The versioned CACHE name means an old week's flyers evict
// themselves on the next deploy. Both lists are added best-effort at install.
var CORE=['./','index.html','offline.html','style.css','logo.png','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
var PRECACHE=["flyers/2026-08-08_handlebar_caca-del-diablo.jpg", "flyers/thumbs/2026-08-08_handlebar_caca-del-diablo.webp", "flyers/2026-08-08_bettys_galactic-engineers.jpg", "flyers/thumbs/2026-08-08_bettys_galactic-engineers.webp", "flyers/thumbs/2026-08-09_handlebar_raq-baby.webp", "flyers/thumbs/2026-08-10_handlebar_visitant.webp", "flyers/thumbs/2026-08-10_undergrowth_zine-workshop-309-punk-project.webp", "flyers/thumbs/2026-08-11_jitterbug_zine-workshop-309-punk-project.webp", "flyers/thumbs/2026-08-12_the-den_mongo.webp", "flyers/thumbs/2026-08-13_handlebar_steve-forbert.webp", "flyers/thumbs/2026-08-13_odd-colony_zine-workshop-309-punk-project.webp", "flyers/thumbs/2026-08-14_handlebar_katie-dineen.webp", "flyers/thumbs/flyer_2026-08-15_handlebar_heroes-for-ghosts.webp", "flyers/thumbs/2026-08-16_handlebar_bounty.webp"];
CORE=CORE.concat(PRECACHE);
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
  // overrides.json is the live "this show just fell through" channel, published
  // straight to the repo from a phone. It MUST be network-first or a cached copy
  // would keep showing a cancelled show as on, which is the exact failure the
  // file exists to prevent. Falls back to cache only when genuinely offline.
  if(/overrides\.json$/.test(url.pathname)){
    e.respondWith(fetch(req).then(function(res){
      var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}); return res;
    }).catch(function(){return caches.match(req);}));
    return;
  }
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
