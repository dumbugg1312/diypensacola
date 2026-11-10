(function(){
if(window.__gcArmed)return;window.__gcArmed=1;
try{
var tag=document.querySelector('script[data-goatcounter]');if(!tag)return;
var n=navigator;
if(n.doNotTrack==='1'||window.doNotTrack==='1'||n.msDoNotTrack==='1'||n.globalPrivacyControl)return;
var done=false;
function go(){
var g=window.goatcounter;if(done||!g||!g.count)return;
done=true;
try{if(window.frameElement&&window.frameElement.id==='wpnxframe')g.allow_frame=true;}catch(e){}
var of=g.filter;
if(of)g.filter=function(){try{return of.apply(this,arguments);}catch(e){return false;}};
if(!('visibilityState' in document)||document.visibilityState==='visible')g.count();
else{var f=function(){if(document.visibilityState!=='visible')return;
document.removeEventListener('visibilitychange',f);g.count();};
document.addEventListener('visibilitychange',f);}
}
go();
if(!done)tag.addEventListener('load',go);
}catch(e){}
})();
(function(){
if(document.getElementById('detail'))return;
var cs0=document.currentScript,here0=(cs0&&cs0.src)||'';
var logo=here0?here0.replace(/[^\/]*$/,'logo-hdr.webp'):'logo-hdr.webp';
function swap(t){
if(!t||t.tagName!=='IMG'||t.classList.contains('ph')||t.id==='splbimg')return;
var cur=t.getAttribute('src')||'';
if(!/(^|\/)flyers\//.test(cur))return;
var full=t.getAttribute('data-fullsrc');
if(full&&cur!==full){t.src=full;return;}
t.src=logo;t.alt='';t.classList.add('ph');
var a=t.parentNode;
if(a&&a.tagName==='A'&&a.classList.contains('spflyerlink')){
a.classList.add('ph');a.removeAttribute('href');a.style.pointerEvents='none';
a.setAttribute('aria-hidden','true');a.tabIndex=-1;}
}
document.addEventListener('error',function(e){swap(e.target);},true);
function sweep(){[].forEach.call(document.images,function(i){if(i.complete&&!i.naturalWidth)swap(i);});}
if(document.readyState==='complete')sweep();else window.addEventListener('load',sweep);
})();
(function(){
var ua=navigator.userAgent||'';
var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1&&!/android/i.test(ua));
if(!ios)return;
window.dpIOS=true;
[].slice.call(document.querySelectorAll('a[download]')).forEach(function(a){a.removeAttribute('download');});
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest?e.target.closest('a[href^="https://www.google.com/maps/"]'):null;
if(!a)return;
var m=/[?&](destination|query)=([^&]+)/.exec(a.getAttribute('href')||'');
if(!m)return;
a.setAttribute('href','https://maps.apple.com/?'+(m[1]==='destination'?'daddr':'q')+'='+m[2]);
},true);
})();
(function(){
if(!('serviceWorker' in navigator))return;
var conn=navigator.connection||{};
var cs=document.currentScript,here=(cs&&cs.src)||'';
var swUrl=here?here.replace(/[^\/]*$/,'sw.js'):'sw.js';
if(!navigator.serviceWorker.controller&&(conn.saveData||/(^|-)2g$/.test(conn.effectiveType||'')))return;
function boot(){
navigator.serviceWorker.register(swUrl).then(function(){return navigator.serviceWorker.ready;}).then(function(reg){
var w=reg&&reg.active;if(!w)return;
w.postMessage({type:'cachepage',url:location.href.split('#')[0]});
if(!conn.saveData&&(!conn.effectiveType||conn.effectiveType==='4g')){
setTimeout(function(){try{w.postMessage({type:'precache'});}catch(e){}},3000);
}
}).catch(function(){});
}
if(document.readyState==='complete')boot();else window.addEventListener('load',boot);
})();
(function(){
(function(){var mb=document.querySelector('.modebar');if(!mb)return;
function setMB(){document.documentElement.style.setProperty('--modebar-h',mb.offsetHeight+'px');}
setMB();window.addEventListener('resize',setMB);
if(window.ResizeObserver){try{new ResizeObserver(setMB).observe(mb);}catch(e){}}})();
['dirtools','arctoolbar'].forEach(function(c){var el=document.querySelector('.'+c);if(!el)return;
function set(){document.documentElement.style.setProperty('--'+c+'-h',el.offsetHeight+'px');}
set();window.addEventListener('resize',set);
if(window.ResizeObserver){try{new ResizeObserver(set).observe(el);}catch(e){}}});
(function(){
var els=[].slice.call(document.querySelectorAll('header .tag,.finelinks'));if(!els.length)return;
function fit(){els.forEach(function(el){el.classList.remove('wraps');
if(el.scrollWidth>el.clientWidth+3)el.classList.add('wraps');});}
var rz=0;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(fit,120);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
else window.addEventListener('load',fit);
})();
var _logo=document.querySelector('header .logo'),_leftTilt=true;
if(_logo){
var _lfb=function(){
if(_logo._fb)return;_logo._fb=1;
_logo.src=(_logo.getAttribute('src')||'').replace(/logo-hdr\.webp(\?.*)?$/,'logo.png');
};
_logo.addEventListener('error',_lfb);
if(_logo.complete&&!_logo.naturalWidth)_lfb();
}
if(_logo){
_logo.addEventListener('mouseenter',function(){_logo.classList.remove('tl','tr');_logo.classList.add(_leftTilt?'tl':'tr');_leftTilt=!_leftTilt;});
_logo.addEventListener('mouseleave',function(){_logo.classList.remove('tl','tr');});
}
var _toTop=document.getElementById('totop');
if(_toTop){
var _ttY=0,_ttT=0;
var _onScroll=function(){
var y=window.pageYOffset||document.documentElement.scrollTop||0,on=y>400,d=y-_ttY;
_toTop.classList.toggle('on',on);
if(!on){_toTop.classList.remove('away');}
else if(d>6){_toTop.classList.add('away');}
else if(d<-6){_toTop.classList.remove('away');}
_ttY=y;
if(_ttT)clearTimeout(_ttT);
_ttT=setTimeout(function(){
if(window.matchMedia&&window.matchMedia('(max-width:820px)').matches&&on&&document.activeElement!==_toTop)_toTop.classList.add('away');
},4000);
};
window.addEventListener('scroll',_onScroll,{passive:true}); _onScroll();
_toTop.addEventListener('click',function(e){
e.preventDefault();e.stopPropagation();
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(rm||!('scrollBehavior' in document.documentElement.style))window.scrollTo(0,0);
else window.scrollTo({top:0,behavior:'smooth'});
if(e.detail===0){var t=document.querySelector('.skip')||document.querySelector('header h1 a, header .wordmark a, header .homelink');if(t)t.focus({preventScroll:true});}
});
}
var DCX_PASSCODE='1017';
var canonEl=document.querySelector('link[rel="canonical"]');
var isHome=!!canonEl&&/\/$/.test(canonEl.getAttribute('href')||'');
var logoEl=isHome?document.querySelector('.home,.homelink'):null;
var fab=document.createElement('button');
fab.className='dcx-fab';fab.type='button';fab.textContent='⚑';fab.setAttribute('aria-label','flag an issue');
fab.hidden=true;
var scrim=document.createElement('div');scrim.className='dcx-scrim';scrim.hidden=true;
var panel=document.createElement('div');panel.className='dcx-panel';panel.hidden=true;
panel.innerHTML='<textarea placeholder="what\'s wrong?"></textarea>'
+'<div class="dcx-row dcx-quick">'
+'<button type="button" data-a="quick" data-tag="remove this video">remove video</button>'
+'<button type="button" data-a="quick" data-tag="mark as touring">mark as touring</button>'
+'<button type="button" data-a="quick" data-tag="mark as dj">mark as dj</button>'
+'<button type="button" data-a="quick" data-tag="mark as local">mark as local</button>'
+'</div>'
+'<div class="dcx-row">'
+'<button type="button" data-a="save">save</button>'
+'<button type="button" data-a="cancel">cancel</button>'
+'<button type="button" data-a="toggle-log">log (0)</button>'
+'<button type="button" data-a="copy">copy all</button>'
+'<button type="button" data-a="clear">clear all</button>'
+'</div><div class="dcx-log" hidden></div>';
document.body.appendChild(scrim);document.body.appendChild(panel);document.body.appendChild(fab);
var ta=panel.querySelector('textarea');
var logBox=panel.querySelector('.dcx-log');
var logBtn=panel.querySelector('[data-a="toggle-log"]');
function lsGetRaw(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSetRaw(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsDelRaw(k){try{localStorage.removeItem(k);}catch(e){}}
function flags(){try{var a=JSON.parse(lsGetRaw('diy_flags')||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function saveFlags(a){lsSetRaw('diy_flags',JSON.stringify(a));}
function esc(s){var d=document.createElement('div');d.textContent=String(s);return d.innerHTML;}
function renderLog(){
var a=flags();
logBtn.textContent='log ('+a.length+')';
if(logBox.hidden)return;
var html='';
for(var i=a.length-1;i>=0;i--){var f=a[i];
html+='<div class="dcx-item" data-i="'+i+'"><button type="button" class="dcx-x" data-a="del">×</button>'
+'<div class="dcx-ts">'+esc(f.ts)+' &middot; '+esc(f.title||f.url)+'</div>'
+(f.nowPlaying?'<div class="dcx-np">playing: '+esc(f.nowPlaying.act)+' / '+esc(f.nowPlaying.title)+'</div>':'')
+'<div>'+esc(f.note)+'</div></div>';}
logBox.innerHTML=html;}
function openPanel(){scrim.hidden=false;panel.hidden=false;ta.value='';ta.focus();renderLog();}
function closePanel(){scrim.hidden=true;panel.hidden=true;}
var DCX_TTL=24*60*60*1000;
function unlock(){
fab.hidden=false;lsSetRaw('dcx_unlocked_at',String(Date.now()));
try{document.dispatchEvent(new Event('dcx-unlocked'));}catch(e){}}
var unlockedAt=parseInt(lsGetRaw('dcx_unlocked_at')||'0',10);
if(unlockedAt&&Date.now()-unlockedAt<DCX_TTL)unlock();
else if(unlockedAt){lsDelRaw('dcx_unlocked_at');lsDelRaw('dcx_gh_token');}
if(logoEl){
var pressTimer=null,longPressed=false;
var fire=function(){
longPressed=true;
if(!fab.hidden)return;
var code=window.prompt('passcode:');
if(code===DCX_PASSCODE)unlock();
};
var startPress=function(){
longPressed=false;
if(pressTimer)clearTimeout(pressTimer);
pressTimer=setTimeout(fire,4000);
};
var endPress=function(){if(pressTimer){clearTimeout(pressTimer);pressTimer=null;}};
logoEl.addEventListener('mousedown',startPress);
logoEl.addEventListener('touchstart',startPress,{passive:true});
logoEl.addEventListener('mouseup',endPress);
logoEl.addEventListener('mouseleave',endPress);
logoEl.addEventListener('touchend',endPress);
logoEl.addEventListener('touchmove',endPress,{passive:true});
logoEl.addEventListener('touchcancel',endPress);
logoEl.addEventListener('contextmenu',function(e){e.preventDefault();});
logoEl.addEventListener('click',function(e){
if(longPressed){e.preventDefault();longPressed=false;}});}
function doSave(note){
note=note.trim();if(!note)return;
var entry={ts:new Date().toISOString(),url:location.href,title:document.title,note:note};
if(window.__diyNowPlaying)entry.nowPlaying=window.__diyNowPlaying;
var all=flags();all.push(entry);saveFlags(all);
closePanel();
var old=fab.textContent;fab.textContent='✓';
setTimeout(function(){fab.textContent=old;},900);}
fab.addEventListener('click',function(){
if(fab.textContent==='✓')return;
openPanel();});
scrim.addEventListener('click',closePanel);
panel.addEventListener('click',function(e){
var a=e.target.getAttribute('data-a');
if(!a)return;
if(a==='cancel'){closePanel();return;}
if(a==='save'){doSave(ta.value);return;}
if(a==='quick'){doSave(e.target.getAttribute('data-tag')||'');return;}
if(a==='toggle-log'){logBox.hidden=!logBox.hidden;renderLog();return;}
if(a==='copy'){
var a2=flags(),lines=[];
for(var i=a2.length-1;i>=0;i--){var f=a2[i];
lines.push(f.ts+' / '+f.title+' ('+f.url+')'
+(f.nowPlaying?'\nplaying: '+f.nowPlaying.act+' / '+f.nowPlaying.title+' ('+f.nowPlaying.url+')':'')
+'\n'+f.note);}
var text=lines.join('\n\n'),manual=function(){window.prompt('copy this',text);};
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(null,manual);else manual();
return;}
if(a==='clear'){
if(window.confirm('Clear all flagged issues?')){saveFlags([]);renderLog();}
return;}
if(a==='del'){
var item=e.target.closest('.dcx-item');var idx=parseInt(item.getAttribute('data-i'),10);
var a3=flags();a3.splice(idx,1);saveFlags(a3);renderLog();
return;}});
var _scf=null;
function showClock(at){
var d=at||new Date(),y,mo,da,h,mi;
try{
if(!_scf)_scf=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour12:false,
year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
var o={};_scf.formatToParts(d).forEach(function(p){o[p.type]=p.value;});
y=+o.year;mo=+o.month;da=+o.day;h=(+o.hour)%24;mi=+o.minute;
if(!(y>2000&&mo>0&&da>0&&h>=0&&mi>=0))throw 0;
}catch(e){y=d.getFullYear();mo=d.getMonth()+1;da=d.getDate();h=d.getHours();mi=d.getMinutes();}
var base=Date.UTC(y,mo-1,da-(h<5?1:0));
function ymd(t){var u=new Date(t);return u.getUTCFullYear()+'-'+('0'+(u.getUTCMonth()+1)).slice(-2)+'-'+('0'+u.getUTCDate()).slice(-2);}
function plus(n){return ymd(base+n*864e5);}
var dow=new Date(base).getUTCDay(),toSun=(7-dow)%7;
return {day:ymd(base),min:(h<5?1440:0)+h*60+mi,dow:dow,weekEnd:plus(toSun),nextWeekEnd:plus(toSun+7),
weekendStart:plus(4-((dow+6)%7)),plus:plus,
dayNum:function(s){var p=String(s).split('-');return Math.round(Date.UTC(+p[0],+p[1]-1,+p[2])/864e5);}};
}
var sb=document.querySelector('.sponsorbar[data-until]');
if(sb){
if(showClock().day>sb.getAttribute('data-until')&&sb.parentNode)sb.parentNode.removeChild(sb);
}
function mark(){
var ck=showClock(),day=ck.day;
function flag(){var f=document.createElement('span');f.className='pastflag tonight';f.textContent='tonight';return f;}
[].forEach.call(document.querySelectorAll('li.up[data-d]'),function(li){
var d=li.getAttribute('data-d');
if(d<day){li.classList.remove('up','tonight');var o=li.querySelector('.pastflag.tonight');if(o)o.parentNode.removeChild(o);}
else if(d===day&&!li.classList.contains('tonight')&&!li.classList.contains('off')){
li.classList.add('tonight');var w=li.querySelector('.gwho');if(w)w.insertBefore(flag(),w.firstChild);}
});
[].forEach.call(document.querySelectorAll('.gigledger li.gup'),function(h){
h.style.display=h.parentNode.querySelector('li.up')?'':'none';});
[].forEach.call(document.querySelectorAll('a.pwtile.up[data-d]'),function(a){
if(a.getAttribute('data-d')<day)a.classList.remove('up');});
[].forEach.call(document.querySelectorAll('a.heropost[data-d]'),function(a){
var d=a.getAttribute('data-d'),cap=a.querySelector('.hpcap');
if(d<day){a.classList.remove('up','tonight');
if(cap)cap.textContent=cap.textContent.replace(/^(?:up next|tonight)\s*\u00b7\s*/,'');}
else if(d===day&&!a.classList.contains('tonight')&&!a.classList.contains('off')){a.classList.add('tonight');
if(cap)cap.textContent=cap.textContent.replace(/^up next/,'tonight');}
});
[].forEach.call(document.querySelectorAll('a.nextgig[data-d]'),function(a){
var d=a.getAttribute('data-d'),sm=a.querySelector('small');
if(d<day){a.style.display='none';}
else if(d===day&&!a.classList.contains('tonight')){a.classList.add('tonight');if(sm)sm.textContent='tonight';}
});
}
mark();
document.addEventListener('visibilitychange',function(){if(!document.hidden)mark();});
addEventListener('pageshow',function(e){if(e.persisted)mark();});
})();
(function(){
var bar=document.querySelector('.modebar');
if(!bar||!window.Audio||bar.querySelector('.wpnx'))return;
var STREAM='https://wpnx.org/api/stream',KEY='wpnx';
var home=bar.querySelector('a.modetab'),ROOT=home?home.href:location.href;
var host=null;
try{var fe=window.frameElement;if(fe&&fe.id==='wpnxframe'&&window.parent.__wpnx)host=window.parent.__wpnx;}catch(e){}
var chip=document.createElement('button');
chip.type='button';chip.className='wpnx';
chip.innerHTML='<svg viewBox="0 0 10 10" aria-hidden="true"><path class="wpl" d="M1.5 .5l8 4.5-8 4.5z"/>'
+'<path class="wpz" d="M1.5 .8h2.6v8.4H1.5zM5.9 .8h2.6v8.4H5.9z"/></svg>'
+'<span><span class="wcall">WPNX </span>107.7</span>';
bar.appendChild(chip);
var on=false,wait=false,armed=false,audio=null,loading=false,fails=0,retry=0,armT=0,frame=null,tick=0,title0='';
function paint(){
chip.classList.toggle('on',on&&!wait);
chip.classList.toggle('wait',wait||armed);
chip.setAttribute('aria-pressed',on?'true':'false');
chip.setAttribute('aria-label',(on?'pause':'play')+' WPNX 107.7, free radio pensacola, live');
chip.title=on?'pause WPNX 107.7':'play WPNX 107.7, free radio pensacola, live';
if(frame){try{var w=frame.contentWindow;if(w&&w.__wpnxPaint)w.__wpnxPaint(on,wait);}catch(e){}}
}
function ytface(e){
var a=e.target&&e.target.closest?e.target.closest('a.ytface[data-yt]'):null;
return a&&!(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button);
}
if(host){
window.__wpnxPaint=function(o,w){on=o;wait=w;paint();};
window.__wpnx={stop:function(){host.stop();}};
var s=host.state();on=s[0];wait=s[1];paint();
chip.addEventListener('click',function(){host.toggle();});
document.addEventListener('click',function(e){
if(ytface(e)){host.stop();return;}
var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
if(a&&!a.target&&(a.protocol==='http:'||a.protocol==='https:')&&a.origin!==location.origin)a.target='_top';
},true);
return;
}
function flag(v){try{if(v)sessionStorage.setItem(KEY,String(Date.now()));else sessionStorage.removeItem(KEY);}catch(e){}}
var GEST=['click','keydown','touchend'];
function regest(e){
if(e.target&&chip.contains(e.target)){disarm();return;}
start();
}
function disarm(){
if(!armed)return;armed=false;clearTimeout(armT);
GEST.forEach(function(t){document.removeEventListener(t,regest,true);});
}
function arm(){
if(armed)return;armed=true;
GEST.forEach(function(t){document.addEventListener(t,regest,true);});
armT=setTimeout(function(){disarm();paint();},120000);
}
function again(){
if(!on||retry)return;
if(++fails>3){stop();return;}
wait=true;paint();
retry=setTimeout(function(){retry=0;if(on)start();},1500*fails);
}
function meta(){
var ms=navigator.mediaSession;if(!ms||!window.MediaMetadata)return;
try{
ms.metadata=new MediaMetadata({title:'WPNX 107.7',artist:'Free Radio Pensacola',album:'live',
artwork:[{src:new URL('icon-512.png',ROOT).href,sizes:'512x512',type:'image/png'}]});
ms.setActionHandler('play',start);ms.setActionHandler('pause',stop);
}catch(e){}
}
function start(){
disarm();
if(!audio){
audio=new Audio();audio.preload='none';
audio.addEventListener('playing',function(){loading=false;fails=0;if(on){wait=false;paint();}});
audio.addEventListener('waiting',function(){if(on){wait=true;paint();}});
audio.addEventListener('pause',function(){if(on&&!loading&&!audio.ended)stop();});
audio.addEventListener('error',again);
audio.addEventListener('ended',again);
}
on=true;wait=true;loading=true;paint();
audio.src=STREAM;
var p=audio.play();
if(p&&p.catch)p.catch(function(err){
loading=false;
if(!on)return;
if(err&&err.name==='NotAllowedError'){on=false;wait=false;arm();paint();}
else if(!err||err.name!=='AbortError')again();
});
meta();
}
function stop(){
on=false;wait=false;loading=false;fails=0;clearTimeout(retry);retry=0;disarm();
if(audio){audio.pause();audio.removeAttribute('src');try{audio.load();}catch(e){}}
paint();
}
function toggle(){if(on)stop();else start();}
chip.addEventListener('click',toggle);
window.__wpnx={toggle:toggle,stop:stop,state:function(){return [on,wait];}};
document.addEventListener('click',function(e){if(on&&ytface(e))stop();},true);
function pageLink(a){
if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return false;
if(a.protocol!=='http:'&&a.protocol!=='https:')return false;
var p=a.pathname||'';
if(a.origin!==location.origin||!(p.slice(-1)==='/'||p.slice(-5)==='.html'))return false;
return !(p===location.pathname&&a.search===location.search&&a.hash);
}
function sync(){
if(!frame)return;var u,t;
try{u=frame.contentWindow.location.href;t=frame.contentDocument.title;}catch(e){return;}
if(!u||u==='about:blank')return;
if(u!==location.href){try{history.replaceState({wpnx:1},'',u);}catch(e){}}
if(t&&t!==document.title)document.title=t;
}
function reveal(){
if(!frame||frame.style.visibility!=='hidden')return;
frame.style.visibility='';
document.documentElement.classList.add('wpnxshell');
[].forEach.call(document.body.children,function(el){if(el!==frame)el.inert=true;});
try{frame.contentWindow.focus();}catch(e){}
}
function openShell(url,push){
if(push){try{history.pushState({wpnx:1},'',url);}catch(e){location.href=url;return;}}
title0=title0||document.title;
frame=document.createElement('iframe');
frame.id='wpnxframe';frame.title='diypensacola';
frame.setAttribute('allow','autoplay; fullscreen; encrypted-media; picture-in-picture; web-share; clipboard-write');
frame.setAttribute('allowfullscreen','');
frame.style.visibility='hidden';
frame.addEventListener('load',function(){reveal();sync();paint();});
frame.src=url;
document.body.appendChild(frame);
setTimeout(reveal,4000);
tick=setInterval(sync,500);
}
function closeShell(){
if(!frame)return;
clearInterval(tick);tick=0;
if(frame.parentNode)frame.parentNode.removeChild(frame);
frame=null;
document.documentElement.classList.remove('wpnxshell');
[].forEach.call(document.body.children,function(el){el.inert=false;});
if(title0)document.title=title0;
}
window.addEventListener('click',function(e){
if(!on||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
if(!pageLink(a))return;
e.preventDefault();
if(frame){try{history.replaceState({wpnx:1},'',a.href);}catch(x){}frame.src=a.href;}
else openShell(a.href,true);
});
window.addEventListener('popstate',function(e){
var s=e.state&&e.state.wpnx;
if(s&&!frame)openShell(location.href,false);
else if(!s&&frame)closeShell();
});
try{if(history.state&&history.state.wpnx)history.replaceState(null,'',location.href);}catch(e){}
addEventListener('beforeprint',function(){
if(!frame)return;
try{frame.style.height=frame.contentDocument.documentElement.scrollHeight+'px';}catch(e){}
document.documentElement.classList.add('wpnxprint');});
addEventListener('afterprint',function(){
if(!frame)return;
frame.style.height='';document.documentElement.classList.remove('wpnxprint');});
addEventListener('pagehide',function(){if(on)flag(1);});
addEventListener('pageshow',function(e){if(e.persisted&&on&&audio&&audio.paused)stop();});
var t0=0;
try{t0=+sessionStorage.getItem(KEY)||0;sessionStorage.removeItem(KEY);}catch(e){}
if(t0&&Date.now()-t0<15000)start();
})();
