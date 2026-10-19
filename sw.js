var CACHE='diypensacola-143ed671f5b1';
var FONTS='diypensacola-fonts';
var SHELL=["./", "offline.html", "style.css", "logo-hdr.webp", "favicon-48.png", "manifest.webmanifest", "flag.js"];
var PRECACHE=["flyers/thumbs/2026-10-20_handlebar_the-convalescence.webp", "flyers/thumbs/2026-10-21_handlebar_felicity.webp", "flyers/thumbs/2026-10-22_downtown-music-hall_party-cannon.webp", "flyers/thumbs/2026-10-22_309_wintergreen-oil-photo-transfer-workshop.webp", "flyers/thumbs/2026-10-22_bettys_sludge-incorporated.webp", "flyers/thumbs/2026-10-22_the-handlebar_fenix-tx.webp", "flyers/thumbs/2026-10-23_the-den_dirty-crumbums.webp", "flyers/thumbs/2026-10-23_handlebar_murder-on-the-dance-floor-drag-show.webp", "flyers/thumbs/2026-10-23_bettys_the-earthly-delights-sideshow.webp", "flyers/thumbs/2026-10-24_handlebar_terrifying-tribute-show-26.webp"];
var NAV_WAIT=3000;
var ASSET_WAIT=1500;
var slowAt=0;
function pathKey(url){
return new Request(url.origin+url.pathname.replace(/index\.html$/,''));
}
function getOk(u,mode){
return fetch(new Request(u,{cache:mode||'reload'})).then(function(r){
if(!r.ok){r.arrayBuffer().then(null,function(){});throw new Error(r.status+' '+u);}
return r;
});
}
function putOne(c,u,mode){return getOk(u,mode).then(function(r){return c.put(u,r);});}
self.addEventListener('install',function(e){
self.skipWaiting();
var mode=(self.registration&&self.registration.active)?'reload':'default';
e.waitUntil(caches.open(CACHE).then(function(c){
return Promise.all(SHELL.map(function(u){return putOne(c,u,mode);}));
}));
});
self.addEventListener('activate',function(e){
e.waitUntil(caches.keys().then(function(keys){
return Promise.all(keys.map(function(k){if(k!==CACHE&&k!==FONTS){return caches.delete(k);}}));
}).then(function(){return self.clients.claim();}));
});
self.addEventListener('message',function(e){
var d=e.data||{};
if(d.type==='precache'){e.waitUntil(warm());}
else if(d.type==='cachepage'&&typeof d.url==='string'){e.waitUntil(savePage(d.url));}
});
function warm(){
return caches.open(CACHE).then(function(c){
return PRECACHE.reduce(function(chain,u){
return chain.then(function(){
return c.match(u).then(function(m){return m||putOne(c,u,'default');});
}).then(null,function(){});
},Promise.resolve());
});
}
function savePage(href){
var u=new URL(href,self.location.href);
if(u.origin!==self.location.origin)return Promise.resolve();
var key=pathKey(u);
return caches.open(CACHE).then(function(c){
return c.match(key).then(function(have){
if(have)return;
return fetch(u.href).then(function(res){
if(!res.ok||res.type!=='basic')return;
var copy=res.clone();
return c.put(key,res).then(function(){return copy.text();}).then(function(html){
var re=/(?:src|href)=["']([^"'?#]+\.(?:js|css))["']/g,m,need=[];
while((m=re.exec(html))){
var a=new URL(m[1],u.href);
if(a.origin===self.location.origin&&need.indexOf(a.href)<0)need.push(a.href);
}
return Promise.all(need.map(function(a){
return c.match(a).then(function(h){return h||putOne(c,a,'default');}).then(null,function(){});
}));
});
});
});
}).then(null,function(){});
}
function keep(key,res){
if(res&&res.ok&&(res.type==='basic'||res.type==='default')){
var copy=res.clone(); caches.open(CACHE).then(function(c){return c.put(key,copy);}).then(null,function(){});
}
return res;
}
function saved(key){return caches.match(key,{ignoreSearch:true});}
function latest(e,req,key,fallback){
var nav=req.mode==='navigate';
var wait=nav?NAV_WAIT:(Date.now()-slowAt<30000?0:ASSET_WAIT);
var net=(nav?fetch(req):fetch(req,{cache:'no-cache'})).then(function(res){return keep(key,res);});
e.waitUntil(net.then(null,function(){}));
return new Promise(function(resolve){
var done=false,t=setTimeout(function(){
saved(key).then(function(m){if(m){if(nav)slowAt=Date.now();fin(m);}});
},wait);
function fin(v){if(!done){done=true;clearTimeout(t);resolve(v);}}
net.then(fin,function(){
saved(key).then(function(m){fin(m||(fallback?fallback():undefined));});
});
});
}
function offlineCard(){return caches.match('offline.html');}
self.addEventListener('fetch',function(e){
var req=e.request; if(req.method!=='GET'){return;}
var url=new URL(req.url);
if(url.hostname==='fonts.gstatic.com'){
e.respondWith(caches.open(FONTS).then(function(c){
return c.match(req).then(function(m){
return m||fetch(req).then(function(res){
if(res&&res.ok)c.put(req,res.clone()).then(null,function(){});
return res;
});
});
}));
return;
}
if(url.origin!==self.location.origin){return;}
if(/overrides\.json$/.test(url.pathname)){
var ok=pathKey(url);
e.respondWith(fetch(req).then(function(res){return keep(ok,res);})
.then(null,function(){return saved(ok);}));
return;
}
if(req.mode==='navigate'){
if(/\.(ics|json|txt|xml)$/i.test(url.pathname))return;
var key=pathKey(url);
e.respondWith(latest(e,req,key,function(){
return offlineCard();
}));
return;
}
if(/\.(css|js|json|ics)$/.test(url.pathname)){
e.respondWith(latest(e,req,req.url));
return;
}
e.respondWith(caches.match(req).then(function(m){
return m||fetch(req).then(function(res){return keep(req,res);});
}));
});
