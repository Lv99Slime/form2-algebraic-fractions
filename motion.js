/* Optional presentation motion; it never clicks controls or advances teaching content. */
(function () {
  'use strict';
  const slide=document.getElementById('slide');
  const toggle=document.getElementById('motionToggle');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=!reduced.matches,frame=0;
  const toolsToggle=document.getElementById('toolsToggle');
  toolsToggle.addEventListener('click',()=>{const open=document.body.classList.toggle('tools-open');toolsToggle.setAttribute('aria-pressed',String(open));});
  try { if(sessionStorage.getItem('algebraic-fractions-motion')==='off')enabled=false; } catch (_) { /* Storage is optional. */ }
  function sync(){
    document.documentElement.classList.toggle('motion-off',!enabled);
    toggle.textContent=enabled?'Motion: on':'Motion: off';
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.disabled=reduced.matches;
    toggle.title=reduced.matches?'Motion disabled by your device preference':'Toggle motion';
    if(!enabled){slide.getAnimations({subtree:true}).forEach(a=>a.cancel());slide.style.removeProperty('--drift-x');slide.style.removeProperty('--drift-y');}
  }
  function play(el,from,duration=400){
    if(!el||!enabled||reduced.matches)return;
    el.getAnimations().forEach(a=>a.cancel());
    el.animate([from,{opacity:1,transform:'none',clipPath:'inset(0 0 0 0)'}],{duration,easing:'cubic-bezier(.2,.7,.2,1)',fill:'none'});
  }
  toggle.addEventListener('click',()=>{enabled=!enabled;sync();try{sessionStorage.setItem('algebraic-fractions-motion',enabled?'on':'off');}catch(_){}});
  reduced.addEventListener('change',()=>{if(reduced.matches)enabled=false;sync();});
  const observer=new MutationObserver(records=>{
    if(frame)cancelAnimationFrame(frame);
    const newPage=records.some(r=>r.target===slide);
    const changed=new Set(records.filter(r=>r.target instanceof Element).map(r=>r.target));
    frame=requestAnimationFrame(()=>{
      frame=0;
      if(newPage){play(slide.querySelector('.slide-info'),{opacity:0,transform:'translateY(8px)'},320);play(slide.querySelector('.slide-visual'),{opacity:0,transform:'translateY(12px)'},420);return;}
      changed.forEach(el=>{
        if(el.id==='rootSteps')play(el.lastElementChild,{opacity:0,transform:'translateX(-8px)',clipPath:'inset(0 100% 0 0)'},480);
        else if(['relationship','sequence','feedback','working','result'].includes(el.id))play(el,{opacity:0,transform:'translateY(6px)'},320);
      });
    });
  });
  observer.observe(slide,{childList:true,subtree:true});
  sync();
  play(slide.querySelector('.slide-info'),{opacity:0,transform:'translateY(8px)'},320);
  play(slide.querySelector('.slide-visual'),{opacity:0,transform:'translateY(12px)'},420);
})();
