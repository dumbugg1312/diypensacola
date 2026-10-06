var CACHE='diypensacola-85dd8dfbd4df';
// CORE is the app shell (always precached). PRECACHE is this build's fonts plus
// the flyers for tonight + this week, injected by build.py so someone who opens
// the site fresh at a venue with no signal still sees this week's flyers instead
// of logo placeholders. The versioned CACHE name means an old week's flyers evict
// themselves on the next deploy. Both lists are added best-effort at install.
var CORE=['./','index.html','offline.html','style.css','logo.png','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
var PRECACHE=["flyers/thumbs/2026-10-06_handlebar_xasthur.webp", "flyers/thumbs/2026-10-07_handlebar_belmont.webp", "flyers/thumbs/2026-10-08_handlebar_forsaken-profits.webp", "flyers/thumbs/2026-10-08_bettys_gong-slayer.webp", "flyers/thumbs/2026-10-09_bettys_punk-or-treat-iii.webp", "flyers/thumbs/2026-10-09_handlebar_graham-barham.webp", "flyers/thumbs/flyer_2026-10-10_handlebar_silent-theory.webp", "flyers/thumbs/2026-10-12_handlebar_carry-the-torch.webp", "flyers/thumbs/2026-10-14_309_october-air-closing-exhibition.webp", "flyers/thumbs/2026-10-15_bettys_lesion.webp", "flyers/thumbs/2026-10-16_309_rent-strike.webp", "flyers/thumbs/2026-10-16_bettys_dog-smiles.webp", "flyers/thumbs/2026-10-16_handlebar_big-time-maca.webp", "flyers/thumbs/2026-10-18_handlebar_fight-night-drag-show.webp", "flyers/thumbs/2026-10-18_handlebar_robert-taylor-smith.webp"];
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
