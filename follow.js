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
// flyer-morph tagging for the act/venue pages this script rides on: leaving a
// poster tile (or the taped-up hero) for its show page tags that image so the
// cross-document view transition in style.css morphs it into .spflyer.
(function(){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a.pwtile,a.heropost'):null;
    if(!a)return;
    var im=a.querySelector('img');
    if(im)im.style.viewTransitionName='flyer';
  },true);
  addEventListener('pageshow',function(){
    var im=document.querySelector('a.pwtile img[style*="view-transition-name"],a.heropost img[style*="view-transition-name"]');
    if(im)im.style.viewTransitionName='';
  });
})();