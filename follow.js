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