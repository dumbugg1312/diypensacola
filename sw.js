var CACHE='diypensacola-9b47e8733311';
var FONTS='diypensacola-fonts';
var SHELL=["./", "offline.html", "style.css", "logo-hdr.webp", "favicon-48.png", "manifest.webmanifest", "flag.js"];
var PRECACHE=["flyers/thumbs/2026-11-11_wpnx-107-7-fm_7-7-pnx.webp", "flyers/thumbs/2026-11-11_309_fuckin-nothin.webp", "flyers/thumbs/2026-11-12_handlebar_gnarled.webp", "flyers/thumbs/2026-11-13_pacific-kava-bar_renee-arozqueta.webp", "flyers/thumbs/2026-11-13_bettys_bettys-fest-2-night-1.webp", "flyers/thumbs/2026-11-14_309_night-on-the-tracks-the-art-of-protest.webp", "flyers/thumbs/2026-11-14_bettys_bettys-fest-2-night-2.webp", "flyers/thumbs/2026-11-14_handlebar_chrissy-chlapecka.webp", "flyers/thumbs/2026-11-15_handlebar_i-set-my-friends-on-fire.webp", "flyers/thumbs/2026-11-17_handlebar_little-image.webp", "flyers/thumbs/2026-11-18_handlebar_wayne-hancock.webp"];
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
