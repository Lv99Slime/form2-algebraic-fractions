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
  const sequenceSteps=new WeakMap();
  let pageChanged=false;
  const observer=new MutationObserver(records=>{
    if(frame)cancelAnimationFrame(frame);
    pageChanged=pageChanged||records.some(r=>r.target===slide);
    frame=requestAnimationFrame(()=>{
      frame=0;
      if(pageChanged){
        pageChanged=false;
        play(slide.querySelector('.slide-info'),{opacity:0,transform:'translateX(-14px)'},380);
        play(slide.querySelector('.slide-visual'),{opacity:0,transform:'translateY(16px)'},460);
      }
      const sequence=slide.querySelector('#sequence');
      if(sequence){
        const step=Number(sequence.dataset.step||0),old=sequenceSteps.get(sequence);
        sequenceSteps.set(sequence,step);
        // MathJax DOM mutations do not replay settled steps. Only the new step enters.
        if(step>0&&step!==old){
          const rows=sequence.querySelectorAll('.calculation-stack .math-line');
          if(rows.length)play(rows[rows.length-1],{opacity:0,transform:'translateX(-18px)'},460);
          else{
            play(sequence.querySelector('.factor-fraction,.decomposition,.term-comparison,.decision,.sign-table,.answer,.math-line'),{opacity:0,transform:'translateY(12px) scale(.985)'},480);
          }
        }
      }
      if(records.some(r=>r.target instanceof Element&&r.target.classList.contains('selected-source')))
        play(slide.querySelector('.selected-source'),{opacity:0,transform:'translateX(-12px)'},300);
    });
  });
  observer.observe(slide,{childList:true,subtree:true});
  sync();
  play(slide.querySelector('.slide-info'),{opacity:0,transform:'translateY(8px)'},320);
  play(slide.querySelector('.slide-visual'),{opacity:0,transform:'translateY(12px)'},420);
})();
