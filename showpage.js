(function(){
  var lb=document.getElementById('splb'),img=document.getElementById('splbimg'),
      link=document.getElementById('spflyerlink'),x=document.getElementById('splbx'),ret=null;
  function openLb(src){ret=document.activeElement;img.src=src;lb.classList.add('open');if(x)x.focus();}
  function closeLb(){lb.classList.remove('open');img.src='';if(ret&&ret.focus)ret.focus();ret=null;}
  if(link&&lb){
    link.addEventListener('click',function(e){
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return; // let power users open in a tab
      e.preventDefault();openLb(link.getAttribute('href'));
    });
    lb.addEventListener('click',function(e){if(e.target===lb||e.target===x){e.preventDefault();closeLb();}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb.classList.contains('open'))closeLb();});
  }
  // live overrides: a cancellation published from a phone (overrides.json, see
  // OWNER_JS) applies here too, so the permalink people got texted tells the truth
  // before any rebuild. Only ADDS a cancellation; the built page already reflects
  // anything baked in at build time.
  (function(){
    var c=document.querySelector('link[rel="canonical"]');
    var m=/\/s\/([^\/]+)\.html$/.exec((c?c.getAttribute('href'):location.pathname)||'');
    if(!m)return;
    var card=document.querySelector('.spcard');
    if(!card||card.classList.contains('off'))return;
    var ctl=window.AbortController?new AbortController():null;
    if(ctl)setTimeout(function(){try{ctl.abort();}catch(e){}},4000);
    fetch('../overrides.json?t='+Date.now(),
          ctl?{cache:'no-store',signal:ctl.signal}:{cache:'no-store'})
      .then(function(r){return r.ok?r.json():null;})
      .then(function(o){
        var st=o&&o.shows&&o.shows[m[1]]&&o.shows[m[1]].status;
        if(st!=='cancelled'&&st!=='postponed')return;
        card.classList.add('off');
        var d=card.querySelector('.date');
        if(d){var s=document.createElement('span');s.className='pastflag off';s.textContent=st;d.appendChild(s);}
        var info=card.querySelector('.spinfo'),h=card.querySelector('h1');
        if(info&&h){
          var row=document.createElement('div');row.className='drow dcancel';
          row.textContent='╳ this show was '+st;
          info.insertBefore(row,h.nextSibling);
        }
        var cal=card.querySelector('a[download]');
        if(st==='cancelled'&&cal)cal.remove();
      }).catch(function(){});
  })();

  var sh=document.getElementById('spshare');
  if(sh){
    var canon=document.querySelector('link[rel="canonical"]');
    var url=canon?canon.getAttribute('href'):location.href;
    var title=document.title.replace(/ · DIYPensacola$/,'');
    function done(){sh.textContent='link copied';setTimeout(function(){sh.textContent='share this flyer';},1600);}
    function copy(){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,done);}else{window.prompt('copy this link',url);}}
    sh.addEventListener('click',function(){
      if(navigator.share){navigator.share({title:title,url:url}).then(function(){},function(err){if(!(err&&err.name==='AbortError'))copy();});}
      else{copy();}
    });
  }
})();