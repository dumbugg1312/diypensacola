document.documentElement.classList.add('js');
// long timelines: rows past the cap are folded (.js gates the CSS, so no script
// means every row shows); "show all" and any year chip unfold them.
(function(){
  var sec=document.getElementById('shows');if(!sec)return;
  var btn=sec.querySelector('.showall');
  function all(){sec.classList.add('all');if(btn)btn.hidden=true;}
  if(btn){btn.hidden=false;btn.addEventListener('click',all);}
  var yj=sec.querySelector('.yearjump');
  // unfold FIRST, then scroll: the plain anchor jump measured the target's
  // position while its year was still hidden and landed a screen short.
  // Instant, not smooth: the page's smooth scroll gets cancelled by the
  // layout shift of 600 rows unfolding and never arrives.
  if(yj)yj.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var t=document.getElementById(a.getAttribute('href').slice(1));if(!t)return;
    e.preventDefault();all();t.scrollIntoView({behavior:'instant'});history.replaceState(null,'',a.getAttribute('href'));
  });
  if(location.hash&&/^#y\d{4}$/.test(location.hash))all();
})();
(function(){
  var b=document.getElementById('followbtn');if(!b)return;
  var type=b.getAttribute('data-ftype'),slug=b.getAttribute('data-fslug');
  var key=type==='venue'?'dpc_follow_venues':'dpc_follow_bands';
  function get(){try{return JSON.parse(localStorage.getItem(key)||'[]');}catch(e){return [];}}
  function set(a){try{localStorage.setItem(key,JSON.stringify(a));}catch(e){}}
  function following(){return get().indexOf(slug)>-1;}
  function render(){var f=following();b.classList.toggle('on',f);b.setAttribute('aria-pressed',f?'true':'false');b.textContent=f?'following ✓':(type==='venue'?'follow this venue':'follow this band');}
  b.addEventListener('click',function(){var a=get(),i=a.indexOf(slug);if(i>-1)a.splice(i,1);else a.push(slug);set(a);render();});
  render();
})();
// wall toggle on the act/venue timeline: list is the default and the page
// without script; the choice persists under the same key the homepage uses.
(function(){
  var b=document.getElementById('actwallbtn'),sec=document.getElementById('shows');if(!b||!sec)return;
  function setWall(on){sec.classList.toggle('wall',on);b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');b.title=on?'back to the list':'toggle the flyer wall view';}
  b.hidden=false;
  var pref=false;try{pref=localStorage.getItem('dpc_wall')==='1';}catch(e){}
  // a link straight to a year (#y2019) means the list: its target row doesn't
  // exist on the wall, so honoring a saved wall preference would land nowhere
  if(/^#y\d{4}$/.test(location.hash))pref=false;
  setWall(pref);
  b.addEventListener('click',function(){var on=!sec.classList.contains('wall');setWall(on);try{localStorage.setItem('dpc_wall',on?'1':'0');}catch(e){}});
})();
// flyer-morph tagging for the act/venue pages this script rides on: leaving a
// poster tile (or the taped-up hero, or a timeline thumb) for its show page
// tags that image so the cross-document view transition in style.css morphs
// it into .spflyer.
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