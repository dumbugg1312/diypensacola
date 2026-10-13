document.documentElement.classList.add('js');
(function(){
[].forEach.call(document.querySelectorAll('a.ytface[data-yt]'),function(a){
a.addEventListener('click',function(e){
if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
e.preventDefault();
var wrap=a.parentNode,f=document.createElement('iframe');
f.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(a.getAttribute('data-yt'))+'?autoplay=1';
f.title=a.getAttribute('data-ytitle')||'video';
f.setAttribute('referrerpolicy','origin');
f.setAttribute('allow','autoplay; encrypted-media; fullscreen; picture-in-picture');
wrap.appendChild(f);
wrap.removeChild(a);
try{f.focus();}catch(err){}
});
});
})();
(function(){
var sec=document.getElementById('shows');if(!sec)return;
var btn=sec.querySelector('.showall');
function all(){sec.classList.add('all');if(btn)btn.hidden=true;}
if(btn){btn.hidden=false;btn.addEventListener('click',function(){
var f=sec.querySelector('.gigledger li.more:not(.gyear) .gdate a');all();if(f)f.focus({preventScroll:true});});}
var yj=sec.querySelector('.yearjump');
if(yj)yj.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a');if(!a)return;
var t=document.getElementById(a.getAttribute('href').slice(1));if(!t)return;
e.preventDefault();all();t.scrollIntoView({behavior:'instant'});history.replaceState(null,'',a.getAttribute('href'));
if(!t.hasAttribute('tabindex'))t.setAttribute('tabindex','-1');t.focus({preventScroll:true});
});
if(location.hash&&/^#y\d{4}$/.test(location.hash)){all();
var t0=document.getElementById(location.hash.slice(1));
if(t0){var de=document.documentElement;de.style.scrollBehavior='auto';t0.scrollIntoView();
addEventListener('load',function(){setTimeout(function(){de.style.scrollBehavior='';},0);},{once:true});}}
})();
(function(){
var b=document.getElementById('followbtn');if(!b)return;
var type=b.getAttribute('data-ftype'),slug=b.getAttribute('data-fslug');
var key=type==='venue'?'dpc_follow_venues':'dpc_follow_bands';
function get(){try{var a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function set(a){try{localStorage.setItem(key,JSON.stringify(a));return true;}catch(e){return false;}}
function following(){return get().indexOf(slug)>-1;}
function longLabel(){return b.getAttribute('data-flabel')||(type==='venue'?'follow this venue':'follow this band');}
function render(){var f=following();b.classList.toggle('on',f);b.setAttribute('aria-pressed',f?'true':'false');b.textContent=f?'following ✓':longLabel();}
var pinT=0;
function pin(){
b.style.minHeight='';
var t=b.textContent;b.textContent=longLabel();
var h=b.offsetHeight;b.textContent=t;
if(h)b.style.minHeight=h+'px';}
pin();
window.addEventListener('resize',function(){if(pinT)clearTimeout(pinT);pinT=setTimeout(pin,150);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(pin);
var hint=null;
function say(t,link){
if(!t){if(hint&&hint.parentNode)hint.parentNode.removeChild(hint);hint=null;return;}
if(!hint){hint=document.createElement('p');hint.className='subalts followhint';hint.setAttribute('role','status');
(b.parentNode||document.body).appendChild(hint);}
hint.textContent=t;
if(link){hint.appendChild(document.createTextNode(' '));var a=document.createElement('a');a.href='../mine.html';a.textContent='your shows';hint.appendChild(a);hint.appendChild(document.createTextNode('.'));}}
var ua=navigator.userAgent||'';
var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1&&!/android/i.test(ua));
var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
var ITP=(ios&&!standalone)?' safari on iphone clears this after about a week away. add the site to your home screen to keep it.':'';
var DIM='saved on this device. no account.'+ITP;
b.addEventListener('click',function(){
var a=get(),i=a.indexOf(slug);if(i>-1)a.splice(i,1);else a.push(slug);
if(!set(a)){render();say('couldn\u2019t follow: this browser is blocking storage (a private window does that).');return;}
render();
if(i>-1){say(DIM);return;}
say('following. '+(type==='venue'?'shows here':'their shows')+' get a \u201cfollowing\u201d stamp on the calendar, and new ones are flagged at the top of the homepage. saved on this device, no account, no alerts.'+ITP+' all of it is on',true);});
render();say(DIM);
window.addEventListener('pageshow',function(e){if(e.persisted)render();});
window.addEventListener('storage',function(e){if(!e.key||e.key===key)render();});
})();
(function(){
var b=document.getElementById('actwallbtn'),sec=document.getElementById('shows');if(!b||!sec)return;
function setWall(on){sec.classList.toggle('wall',on);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');b.title=on?'back to the list':'toggle the flyer wall view';}
b.hidden=false;
var pref=false;try{pref=localStorage.getItem('dpc_wall_page')==='1';}catch(e){}
if(/^#y\d{4}$/.test(location.hash))pref=false;
setWall(pref);
b.addEventListener('click',function(){var on=!sec.classList.contains('wall');setWall(on);try{localStorage.setItem('dpc_wall_page',on?'1':'0');}catch(e){}});
})();
(function(){
var els=[].slice.call(document.querySelectorAll('li[data-sid],a[data-sid]'));
if(!els.length)return;
function mk(st){var s=document.createElement('span');s.className='stamp s-'+st;s.textContent=st;return s;}
function apply(o){
els.forEach(function(el){
var rec=o.shows[el.getAttribute('data-sid')];if(!rec)return;
var st=rec.status;if(st!=='cancelled'&&st!=='postponed')st='';
var cl=el.classList;
if(cl.contains('nextgig')){if(st&&el.parentNode)el.parentNode.removeChild(el);return;}
var host=cl.contains('pwtile')?el:el.querySelector('.gwho');
var old=host?host.querySelector('.stamp.s-cancelled,.stamp.s-postponed'):null;
if(old)old.parentNode.removeChild(old);
cl.toggle('off',!!st);
if(st){cl.remove('tonight');var tf=el.querySelector('.pastflag.tonight');if(tf)tf.parentNode.removeChild(tf);}
if(st&&host)host.appendChild(mk(st));
if(st&&cl.contains('heropost')){var cap=el.querySelector('.hpcap');if(cap)cap.textContent=cap.textContent.replace(/^(?:up next|tonight)/,st);}
});
}
var SRC=['https://raw.githubusercontent.com/dumbugg1312/diypensacola/main/overrides.json','../overrides.json'];
function pull(i){
if(i>=SRC.length)return;
var ctl=window.AbortController?new AbortController():null;
if(ctl)setTimeout(function(){try{ctl.abort();}catch(e){}},4000);
fetch(SRC[i]+'?t='+Date.now(),ctl?{cache:'no-store',priority:'low',signal:ctl.signal}:{cache:'no-store',priority:'low'})
.then(function(r){return r.ok?r.json():null;})
.then(function(o){if(o&&o.shows)apply(o);else pull(i+1);})
.catch(function(){pull(i+1);});
}
if(document.readyState==='complete')pull(0);
else window.addEventListener('load',function(){pull(0);});
})();
(function(){
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest?e.target.closest('a.pwtile,a.heropost,a.gthumb'):null;
if(!a)return;
var im=a.querySelector('img');
if(im)im.style.viewTransitionName='flyer';
},true);
addEventListener('pageshow',function(){
var im=document.querySelector('a.pwtile img[style*="view-transition-name"],a.heropost img[style*="view-transition-name"],a.gthumb img[style*="view-transition-name"]');
if(im)im.style.viewTransitionName='';
});
})();
