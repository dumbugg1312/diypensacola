var CACHE='diypensacola-5313227760ff';
// CORE is the app shell (always precached). PRECACHE is this build's fonts plus
// the flyers for tonight + this week, injected by build.py so someone who opens
// the site fresh at a venue with no signal still sees this week's flyers instead
// of logo placeholders. The versioned CACHE name means an old week's flyers evict
// themselves on the next deploy. Both lists are added best-effort at install.
var CORE=['./','index.html','offline.html','style.css','logo.png','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
var PRECACHE=["flyers/2026-09-11_handlebar_geordie-greep.jpg", "flyers/thumbs/2026-09-11_handlebar_geordie-greep.webp", "flyers/2026-09-11_309_we-cant-help-it-if-were-from-florida.jpg", "flyers/thumbs/2026-09-11_309_we-cant-help-it-if-were-from-florida.webp", "flyers/2026-09-11_bettys_the-unnaturals.jpg", "flyers/thumbs/2026-09-11_bettys_the-unnaturals.webp", "flyers/thumbs/2026-09-12_the-handlebar_nvsn.webp", "flyers/thumbs/2026-09-12_bettys_sapphic-saturday.webp", "flyers/thumbs/2026-09-12_the-hoa_other.webp", "flyers/thumbs/2026-09-13_handlebar_jazz-night.webp", "flyers/thumbs/flyer_2026-09-14_handlebar_archers.webp", "flyers/thumbs/2026-09-15_handlebar_the-holdup.webp", "flyers/thumbs/2026-09-17_handlebar_brett-patterson.webp", "flyers/thumbs/2026-09-18_handlebar_glitterer.webp", "flyers/thumbs/2026-09-19_handlebar_house-of-heavy.webp", "flyers/thumbs/2026-09-19_the-den_bastardson.webp", "flyers/thumbs/2026-09-19_handlebar_twilight-drag-show.webp", "flyers/thumbs/2026-09-20_309_views-from-the-ground.webp", "flyers/thumbs/2026-09-20_handlebar_tip-n-treat-drag-show.webp", "flyers/thumbs/2026-09-20_309_witness.webp"];
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
  // Never cache a response that isn't a real one. A 404 or a 5xx from a wedged
  // Pages deploy used to be written into the cache and then served back as the
  // OFFLINE copy, so one bad minute poisoned the fallback until the next deploy
  // bumped CACHE. keep() is the single gate; every put below goes through it.
  function keep(req,res){
    if(res&&res.ok&&(res.type==='basic'||res.type==='default')){
      var copy=res.clone(); caches.open(CACHE).then(function(c){c.put(req,copy);}).catch(function(){});
    }
    return res;
  }
  if(/overrides\.json$/.test(url.pathname)){
    e.respondWith(fetch(req).then(function(res){return keep(req,res);})
      .catch(function(){return caches.match(req);}));
    return;
  }
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(function(res){return keep(req,res);})
      .catch(function(){return caches.match(req).then(function(m){
      if(m)return m;
      // the homepage itself falls back to its cached copy; any other uncached
      // page gets the self-contained offline card (index's relative asset paths
      // would break when served under a subdirectory URL).
      //
      // caches.match() returns a PROMISE, and a promise is always truthy, so the
      // old `caches.match('index.html')||caches.match('./')` never once reached
      // its right-hand side: with index.html not in the cache the whole offline
      // fallback resolved to undefined and the browser showed its own network
      // error instead of the offline card. Chain it, don't or it.
      if(/(^|\/)($|index\.html$)/.test(url.pathname)){
        return caches.match('index.html').then(function(h){
          return h||caches.match('./').then(function(r){return r||caches.match('offline.html');});
        });
      }
      return caches.match('offline.html');
    });}));
    return;
  }
  e.respondWith(caches.match(req).then(function(m){
    return m||fetch(req).then(function(res){return keep(req,res);}).catch(function(){return m;});
  }));
});
