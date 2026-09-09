(function(){
  // ---- masthead + footer behaviour, site-wide ----
  // These two used to live in main.js and so ran on the homepage only, back when
  // the homepage was the only page with a big logo or a long scroll. Every page
  // now carries the same masthead and the same footer, so they belong in the one
  // script every page already loads.
  //
  // logo flips which way it tilts on each hover
  var _logo=document.querySelector('header .logo'),_leftTilt=true;
  if(_logo){
    _logo.addEventListener('mouseenter',function(){_logo.classList.remove('tl','tr');_logo.classList.add(_leftTilt?'tl':'tr');_leftTilt=!_leftTilt;});
    _logo.addEventListener('mouseleave',function(){_logo.classList.remove('tl','tr');});
  }
  // back-to-top: reveal after scrolling past the header, scroll-to-top on click
  // (uses scrollTo, not a #top link, so the current view/hash is preserved).
  var _toTop=document.getElementById('totop');
  if(_toTop){
    // class 'on' (not 'show') on purpose: '.show' is the card selector the global
    // click/keydown handlers use, so reusing it would make this button open a card.
    var _onScroll=function(){_toTop.classList.toggle('on',(window.pageYOffset||document.documentElement.scrollTop||0)>400);};
    window.addEventListener('scroll',_onScroll,{passive:true}); _onScroll();
    _toTop.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(rm||!('scrollBehavior' in document.documentElement.style))window.scrollTo(0,0);
      else window.scrollTo({top:0,behavior:'smooth'});
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

  // Every localStorage touch here is wrapped. index.html serves MAIN_JS,
  // OWNER_JS and FLAG_JS as ONE inline <script>, so a throw anywhere in the
  // second or third block kills what follows it -- and in a browser with site
  // data blocked (Safari private mode, a locked-down phone) a bare
  // localStorage.getItem throws rather than returning null. Reads already had
  // this; the writes and the top-level reads below did not.
  function lsGetRaw(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function lsSetRaw(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  function lsDelRaw(k){try{localStorage.removeItem(k);}catch(e){}}
  function flags(){try{return JSON.parse(lsGetRaw('diy_flags')||'[]');}catch(e){return [];}}
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
  else if(unlockedAt){lsDelRaw('dcx_unlocked_at');}   // expired: long-press the logo again

  if(logoEl){
    // Long-press the masthead logo to reveal the owner tools.
    // MOBILE: the logo is an <a> wrapping an <img>, so iOS pops its native
    // callout ("Save Image"/share) on a long press and SWALLOWS the click that
    // follows. Waiting for a click therefore never unlocked on a phone. So the
    // prompt is fired from the hold timer itself, and the click that may or may
    // not arrive afterwards is only used to cancel the link navigation. The
    // callout is suppressed in CSS (-webkit-touch-callout on .homelink/.home).
    var pressTimer=null,longPressed=false;
    var fire=function(){
      longPressed=true;
      if(!fab.hidden)return;              // already unlocked
      var code=window.prompt('passcode:');
      if(code===DCX_PASSCODE)unlock();
    };
    var startPress=function(){
      longPressed=false;
      if(pressTimer)clearTimeout(pressTimer);
      pressTimer=setTimeout(fire,4000);   // deliberately long: nobody finds this by accident
    };
    var endPress=function(){if(pressTimer){clearTimeout(pressTimer);pressTimer=null;}};
    logoEl.addEventListener('mousedown',startPress);
    logoEl.addEventListener('touchstart',startPress,{passive:true});
    logoEl.addEventListener('mouseup',endPress);
    logoEl.addEventListener('mouseleave',endPress);
    logoEl.addEventListener('touchend',endPress);
    logoEl.addEventListener('touchmove',endPress,{passive:true});   // scrolling cancels
    logoEl.addEventListener('touchcancel',endPress);
    logoEl.addEventListener('contextmenu',function(e){e.preventDefault();});
    logoEl.addEventListener('click',function(e){
      // a completed long press must not also follow the link back to the homepage
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
  // ---- sponsor bar expiry ----
  // The build already refuses to emit a bar outside its date window, but a
  // static site keeps serving whatever was last pushed, so a sponsorship that
  // ended would stay up until somebody happened to rebuild. This is the second
  // half of the timer: the bar carries its own last-served date and removes
  // itself once the visitor's clock is past it. Lives in flag.js because that
  // is the one script every masthead page already loads.
  // Compared as YYYY-MM-DD strings in LOCAL time (no Date parsing, which would
  // read a bare date as UTC and drop the bar a few hours early west of GMT).
  var sb=document.querySelector('.sponsorbar[data-until]');
  if(sb){
    var n=new Date(),p=function(v){return (v<10?'0':'')+v;};
    var td=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate());
    if(td>sb.getAttribute('data-until')&&sb.parentNode)sb.parentNode.removeChild(sb);
  }
})();