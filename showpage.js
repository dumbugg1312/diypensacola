(function(){
document.documentElement.classList.add('js');
var OV=window.__dpov||(window.__dpov=(function(){
var n=0,cur=0,stack=[],hooks=[];
function mark(){var s=null;try{s=history.state;}catch(e){}return (s&&s.dpov)||0;}
if(mark()){try{history.replaceState(null,'',location.href);}catch(e){}}
window.addEventListener('popstate',function(){
var was=cur,now=mark();cur=now;
while(stack.length&&stack[stack.length-1].id>now){try{stack.pop().close();}catch(e){}}
if(was>now)hooks.forEach(function(f){try{f();}catch(e){}});
});
return {
push:function(close){
var id=n+1;
try{history.pushState({dpov:id},'',location.href);}catch(e){return 0;}
n=id;cur=id;stack.push({id:id,close:close});return id;},
pop:function(id){
if(!id)return;
for(var i=stack.length-1;i>=0;i--)if(stack[i].id===id){stack.splice(i,1);break;}
if(cur===id){try{history.back();}catch(e){}}},
after:function(f){hooks.push(f);}
};
})());
var lb=document.getElementById('splb'),img=document.getElementById('splbimg'),
link=document.getElementById('spflyerlink'),x=document.getElementById('splbx'),ret=null;
function inert(on){[].slice.call(document.body.children).forEach(function(el){if(on&&el!==lb)el.setAttribute('inert','');else el.removeAttribute('inert');});
document.documentElement.classList.toggle('modal-open',!!on);}
var lbOv=0;
function openLb(src){ret=link;img.src=src;lb.classList.add('open');inert(true);if(x)x.focus();
if(!lbOv)lbOv=OV.push(closeLb);
try{if(window.matchMedia&&matchMedia('(pointer: coarse)').matches&&localStorage.getItem('dpc_lbhint')!=='1'){localStorage.setItem('dpc_lbhint','1');lb.classList.add('hint');}}catch(e){}}
function closeLb(){inert(false);lb.classList.remove('open','zoomed','hint');img.src='';if(ret&&ret.focus)ret.focus({preventScroll:true});ret=null;
var o=lbOv;lbOv=0;OV.pop(o);}
function lbZoom(e){
var r=img.getBoundingClientRect(),fx=r.width?(e.clientX-r.left)/r.width:.5,fy=r.height?(e.clientY-r.top)/r.height:.5;
var on=lb.classList.toggle('zoomed');lb.classList.remove('hint');
if(on){lb.scrollLeft=Math.max(0,(lb.scrollWidth-lb.clientWidth)*fx);lb.scrollTop=Math.max(0,(lb.scrollHeight-lb.clientHeight)*fy);}}
if(link&&lb){
link.addEventListener('click',function(e){
if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
e.preventDefault();openLb(link.getAttribute('href'));
});
lb.addEventListener('click',function(e){
if(e.target===img&&window.matchMedia&&matchMedia('(pointer: coarse)').matches&&!matchMedia('(hover:hover) and (pointer:fine)').matches){e.preventDefault();lbZoom(e);return;}
if(e.target===lb||e.target===x||(e.target===img&&window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches)){e.preventDefault();closeLb();}});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;
if(e.key==='Escape')closeLb();else if(e.key==='Tab'){e.preventDefault();if(x)x.focus();}});
}
(function(){
var b=document.getElementById('spsave');if(!b)return;
var lk=document.getElementById('spsavedlink');
var id=b.getAttribute('data-sid'),K='dpc_going';
try{localStorage.setItem('dpc_t','1');localStorage.removeItem('dpc_t');}catch(e){b.hidden=true;return;}
function get(){try{var a=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function set(a){try{localStorage.setItem(K,JSON.stringify(a));return true;}catch(e){return false;}}
function render(){var on=get().indexOf(id)>-1;
b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
b.textContent=on?'saved \u2713':'save this show';
if(lk)lk.hidden=!on;}
b.addEventListener('click',function(){
var a=get(),i=a.indexOf(id);
if(i>-1)a.splice(i,1);else a.push(id);
if(!set(a)){b.textContent='can\u2019t save in this browser';setTimeout(render,2400);return;}
render();});
render();
window.addEventListener('pageshow',function(e){if(e.persisted)render();});
window.addEventListener('storage',function(e){if(!e.key||e.key===K)render();});
})();
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
(function(){
var card=document.querySelector('.spcard[data-d]');if(!card)return;
var d=card.getAttribute('data-d'),day=showClock().day,dt=card.querySelector('.date'),off=card.classList.contains('off');
function flag(cls,txt){if(!dt)return;var f=document.createElement('span');f.className='pastflag'+(cls?' '+cls:'');f.textContent=txt;dt.appendChild(f);}
if(d===day){if(!off)flag('tonight','tonight');return;}
if(d>day)return;
var sv=document.getElementById('spsave'),c=document.querySelector('link[rel="canonical"]'),
m=/\/s\/([^\/]+)\.html$/.exec((c?c.getAttribute('href'):location.pathname)||''),
sid=(sv&&sv.getAttribute('data-sid'))||(m&&m[1])||'';
[].forEach.call(card.querySelectorAll('#spsave,#spsavedlink,.spgoing,a[download]'),function(n){n.parentNode.removeChild(n);});
flag('','from the archive');
var fx=card.querySelector('.spfix');if(fx)fx.hidden=false;
var acts=card.querySelector('.dactions');if(!acts)return;
function btn(tag,id,cls,txt){var e=document.createElement(tag);if(id)e.id=id;e.className='dbtn'+(cls?' '+cls:'');e.textContent=txt;return e;}
if(!off&&sid){
var wb=btn('button','spwent','wenttoggle','i was there');wb.type='button';wb.setAttribute('data-sid',sid);wb.setAttribute('aria-pressed','false');wb.hidden=true;
var wl=btn('a','spwentlink','wentlink','your shows \u2192');wl.href='../mine.html';wl.hidden=true;
acts.appendChild(wb);acts.appendChild(wl);
}
var ar=btn('a','','','the archive');ar.href='../archive.html';acts.appendChild(ar);
})();
(function(){
var b=document.getElementById('spwent'),lk=document.getElementById('spwentlink');
if(!b)return;
var id=b.getAttribute('data-sid'),K='dpc_went';
try{localStorage.setItem('dpc_t','1');localStorage.removeItem('dpc_t');}catch(e){return;}
function get(){try{var a=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function set(a){try{localStorage.setItem(K,JSON.stringify(a));}catch(e){}}
function render(){var a=get(),on=a.indexOf(id)>-1;
b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
b.textContent=on?'you were there ✓':'i was there';
if(lk)lk.hidden=!a.length;}
b.addEventListener('click',function(){
var a=get(),i=a.indexOf(id);
if(i>-1)a.splice(i,1);else a.push(id);
set(a);render();});
b.hidden=false;render();
window.addEventListener('pageshow',function(e){if(e.persisted)render();});
window.addEventListener('storage',function(e){if(!e.key||e.key===K)render();});
})();
[].forEach.call(document.querySelectorAll('.dcap.dcaplong'),function(p,i){
p.classList.add('clamp');
if(p.scrollHeight<=p.clientHeight+2){p.classList.remove('clamp');return;}
if(!p.id)p.id='spcap'+i;
var b=document.createElement('button');b.type='button';b.className='dcapmore';
b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',p.id);b.textContent='read more';
b.addEventListener('click',function(){
var open=p.classList.toggle('clamp')===false;
b.setAttribute('aria-expanded',open?'true':'false');b.textContent=open?'show less':'read more';
});
p.parentNode.insertBefore(b,p.nextSibling);
});
[].forEach.call(document.querySelectorAll('button.copylink'),function(b){
if(!navigator.clipboard)return;
var u=b.getAttribute('data-copy'),t=b.textContent;
b.hidden=false;
b.addEventListener('click',function(){
navigator.clipboard.writeText(u).then(function(){
b.textContent='copied ✓';setTimeout(function(){b.textContent=t;},2200);
},function(){});
});
});
(function(){
var c=document.querySelector('link[rel="canonical"]');
var m=/\/s\/([^\/]+)\.html$/.exec((c?c.getAttribute('href'):location.pathname)||'');
if(!m)return;
var card=document.querySelector('.spcard');
if(!card)return;
if(!card.hasAttribute('data-d'))return;
var LEAD={cancelled:'CANCELLED: ',postponed:'POSTPONED: '};
function gone(sel){[].forEach.call(card.querySelectorAll(sel),function(n){n.parentNode.removeChild(n);});}
function apply(st){
var cur=card.getAttribute('data-state')||(card.querySelector('.dmaybe')?'maybe':'');
if(cur===st)return;
var d=card.querySelector('.date'),info=card.querySelector('.spinfo'),h=card.querySelector('h1');
var dl=card.querySelector('.spgoing a,.spfix a[href]'),dhref=dl?dl.getAttribute('href'):'';
gone('.pastflag.off,.pastflag.maybe,.drow.dcancel,.drow.dnewdate,.spstatus');
document.title=document.title.replace(/^(?:CANCELLED|POSTPONED|POSSIBLY POSTPONED): /,'');
if(!st){card.classList.remove('off');card.removeAttribute('data-state');return;}
card.classList.add('off');card.setAttribute('data-state',st);
document.title=LEAD[st]+document.title;
if(d){var s=document.createElement('span');s.className='pastflag off';s.textContent=st;d.appendChild(s);}
var sn=document.createElement('div');sn.className='spstatus';sn.textContent='╳ this show was '+st;
card.insertBefore(sn,card.firstChild);
if(info&&h){
var row=document.createElement('div');row.className='drow dcancel';
row.textContent='╳ this show was '+st;
var chips=card.querySelector('.actchips:not(.late)');
info.insertBefore(row,(chips||h).nextSibling);
if(st==='postponed'){
var nd=document.createElement('div');nd.className='drow dnewdate';
nd.appendChild(document.createTextNode('new date: not announced yet, watch the '));
if(dhref){var a=document.createElement('a');a.href=dhref;a.target='_blank';a.rel='noopener';a.textContent='discord';nd.appendChild(a);}
else nd.appendChild(document.createTextNode('discord'));
info.insertBefore(nd,row.nextSibling);
}
}
gone('#spsave,#spsavedlink,.spgoing,a[download],#spdir');
var fx=card.querySelector('.spfix');if(fx)fx.hidden=false;
}
var SRC=['https://raw.githubusercontent.com/dumbugg1312/diypensacola/main/overrides.json',
'../overrides.json'];
function pull(i){
if(i>=SRC.length)return;
var ctl=window.AbortController?new AbortController():null;
if(ctl)setTimeout(function(){try{ctl.abort();}catch(e){}},4000);
fetch(SRC[i]+'?t='+Date.now(),
ctl?{cache:'no-store',priority:'low',signal:ctl.signal}:{cache:'no-store',priority:'low'})
.then(function(r){return r.ok?r.json():null;})
.then(function(o){
if(!o||!o.shows){pull(i+1);return;}
var rec=o.shows[m[1]];
if(!rec)return;
var st=rec.status;
if(st!=='cancelled'&&st!=='postponed')st='';
apply(st);
}).catch(function(){pull(i+1);});
}
if(document.readyState==='complete')pull(0);
else window.addEventListener('load',function(){pull(0);});
})();
var sh=document.getElementById('spshare');
if(sh){
var canon=document.querySelector('link[rel="canonical"]');
var url=canon?canon.getAttribute('href'):location.href;
var shLab=sh.textContent;
function done(){sh.textContent='link copied';setTimeout(function(){sh.textContent=shLab;},1600);}
function manual(){window.prompt('copy this link',url);}
function copy(){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,manual);}else{manual();}}
sh.addEventListener('click',function(){
var title=document.title.replace(/ · DIYPensacola$/,'');
if(navigator.share&&window.matchMedia&&matchMedia('(pointer:coarse)').matches){navigator.share({title:title,url:url}).then(function(){},function(err){if(!(err&&err.name==='AbortError'))copy();});}
else{copy();}
});
}
})();
