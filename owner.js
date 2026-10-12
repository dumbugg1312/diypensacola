(function(){
var REPO='dumbugg1312/diypensacola', BRANCH='main', FILE='overrides.json';
var TTL=24*60*60*1000, TKEY='dcx_gh_token';
function lsGetRaw(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function unlocked(){
var t=parseInt(lsGetRaw('dcx_unlocked_at')||'0',10);
return !!t&&(Date.now()-t)<TTL;
}
var booted=false;
if(!unlocked()){document.addEventListener('dcx-unlocked',function(){if(!booted){booted=true;boot();}});return;}
booted=true;boot();
function boot(){
function token(){return lsGetRaw(TKEY)||'';}
function b64(s){return btoa(unescape(encodeURIComponent(s)));}
function unb64(s){try{return decodeURIComponent(escape(atob(s.replace(/\s/g,''))));}catch(e){return '';}}
function api(path,opts){
opts=opts||{};opts.headers=opts.headers||{};
opts.headers['Authorization']='Bearer '+token();
opts.headers['Accept']='application/vnd.github+json';
return fetch('https://api.github.com/repos/'+REPO+'/contents/'+path,opts).then(function(r){
if(r.status===401){try{localStorage.removeItem(TKEY);}catch(e){}}
return r;});
}
function readOverrides(){
return api(FILE+'?ref='+BRANCH+'&t='+Date.now(),{cache:'no-store'}).then(function(r){
if(r.status===404)return {json:{shows:{}},sha:null};
if(r.status===401)throw new Error('GitHub rejected the token, so it was forgotten. paste a new one');
if(!r.ok)throw new Error('read failed ('+r.status+')');
return r.json().then(function(d){
var parsed={shows:{}};
try{parsed=JSON.parse(unb64(d.content))||{shows:{}};}catch(e){}
if(!parsed.shows)parsed.shows={};
return {json:parsed,sha:d.sha};
});
});
}
function publish(id,status,label,say){
if(!token()){say('no token, nothing was published','err');return Promise.resolve(false);}
say('reading…','busy');
return readOverrides().then(function(cur){
cur.json.shows[id]={status:status||'on'};
cur.json.updated=new Date().toISOString();
var body={message:(status||'back on')+': '+label,
content:b64(JSON.stringify(cur.json,null,2)+'\n'),
branch:BRANCH};
if(cur.sha)body.sha=cur.sha;
say('publishing…','busy');
return api(FILE,{method:'PUT',body:JSON.stringify(body)}).then(function(r){
if(!r.ok)return r.text().then(function(t){throw new Error('publish failed ('+r.status+') '+t.slice(0,120));});
say(status?'✓ published, live in about a minute'
:'✓ back on, live in about a minute. a page built as cancelled gets its save and calendar buttons back on the next rebuild','ok');
return true;
});
}).catch(function(e){say('╳ '+String(e.message||e),'err');return false;});
}
function bar(id,label,curState,onDone){
var wrap=document.createElement('div');
wrap.className='dcx-owner';
wrap.innerHTML='<span class="dcx-olab">owner</span>'
+'<button type="button" data-o="cancelled">cancel show</button>'
+'<button type="button" data-o="postponed">postpone</button>'
+'<button type="button" data-o="">back on</button>'
+'<button type="button" data-o="tok">'+(token()?'forget token':'connect token')+'</button>'
+'<span class="dcx-osay"></span>';
var say=function(m,lvl){
var n=wrap.querySelector('.dcx-osay');
n.textContent=m;n.className='dcx-osay'+(lvl?' dcx-'+lvl:'');
};
if(curState)say('currently '+curState);
function askToken(){
var t=window.prompt('paste a GitHub fine-grained token\n(repo: '+REPO+', contents: write, set an expiry)');
t=(t||'').trim();
if(!t){say('╳ no token, nothing was published','err');return false;}
try{localStorage.setItem(TKEY,t);}catch(e){
say('\u2573 this browser is blocking storage, token not saved','err');return false;}
var tb=wrap.querySelector('button[data-o="tok"]');if(tb)tb.textContent='forget token';
say('token saved on this device','ok');
return true;
}
wrap.addEventListener('click',function(e){
var b=e.target.closest('button[data-o]');if(!b)return;
e.preventDefault();e.stopPropagation();
var v=b.getAttribute('data-o');
if(v==='tok'){
if(token()){try{localStorage.removeItem(TKEY);}catch(e){}b.textContent='connect token';say('token forgotten','err');}
else{askToken();}
return;
}
if(v&&!window.confirm('mark this show '+v+' for everyone?\n\n'+label))return;
if(!v&&!window.confirm('put this show back on for everyone?\n\n'+label))return;
if(!token()&&!askToken())return;
publish(id,v,label,say).then(function(ok){if(ok&&onDone)onDone(v);});
});
return wrap;
}
var canon=document.querySelector('link[rel="canonical"]');
var href=canon?canon.getAttribute('href'):location.pathname;
var m=/\/s\/([^\/]+)\.html$/.exec(href||'');
if(m){
var acts=document.querySelector('.spcard .dactions');
if(acts){
var lab=(document.querySelector('.spcard h1')||{}).textContent||m[1];
var st=document.querySelector('.spcard.off')?'cancelled/postponed':'';
acts.parentNode.insertBefore(bar(m[1],lab,st,function(){location.reload();}),acts.nextSibling);
}
return;
}
var dt=document.getElementById('detail');
if(!dt)return;
var info=dt.querySelector('.dinfo');if(!info)return;
var slot=document.createElement('div');info.appendChild(slot);
function sync(){
var id=dt.getAttribute('data-id')||'';
slot.innerHTML='';
if(!dt.classList.contains('open')||!id)return;
var card=document.querySelector('#list .show[data-id="'+id.replace(/["\\]/g,'')+'"]');
var lab=(dt.getAttribute('data-sharelineup')||id)+' ('+(dt.getAttribute('data-sharewhen')||'')+')';
var cur=card?(card.getAttribute('data-state')||''):'';
slot.appendChild(bar(id,lab,cur,function(v){
if(card&&window.DPC_APPLY_OVERRIDES){
var o={shows:{}};o.shows[id]={status:v};window.DPC_APPLY_OVERRIDES(o);
}
}));
}
new MutationObserver(sync).observe(dt,{attributes:true,attributeFilter:['class','data-id']});
}
})();
