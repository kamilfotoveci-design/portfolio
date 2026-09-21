const state={lang:'cs'};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const translations=()=>document.querySelectorAll('[data-cs][data-en]');
document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',()=>{state.lang=button.dataset.lang;document.documentElement.lang=state.lang;document.querySelectorAll('.lang').forEach(item=>{const active=item.dataset.lang===state.lang;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',active)});translations().forEach(item=>{item.innerHTML=item.dataset[state.lang]})}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:reduceMotion?0:700,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});observer.unobserve(entry.target)}}),{threshold:.15});
document.querySelectorAll('.section-intro,.project,.about-grid,.contact-link').forEach(element=>observer.observe(element));
const header=document.querySelector('[data-header]');let lastY=window.scrollY;window.addEventListener('scroll',()=>{const y=window.scrollY;header.style.transform=y>lastY&&y>90?'translateY(-110%)':'translateY(0)';header.style.transition='transform .45s cubic-bezier(.16,1,.3,1)';lastY=y},{passive:true});
const dialog=document.querySelector('.project-dialog');const dialogImage=dialog.querySelector('.dialog-image');const dialogTitle=dialog.querySelector('#dialog-title');const dialogLink=dialog.querySelector('.dialog-link');let lastTrigger=null;
document.querySelectorAll('.project-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{lastTrigger=trigger;dialogImage.src=trigger.dataset.full;dialogImage.alt=trigger.dataset.title;dialogTitle.textContent=trigger.dataset.title;dialogLink.href=trigger.dataset.link;trigger.setAttribute('aria-expanded','true');dialog.showModal();document.body.classList.add('dialog-open')}));
const closeDialog=()=>{if(!dialog.open)return;dialog.close();document.body.classList.remove('dialog-open');lastTrigger?.setAttribute('aria-expanded','false');lastTrigger?.focus()};dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});dialog.addEventListener('cancel',closeDialog);
const footerObserver=new IntersectionObserver(([entry])=>header.classList.toggle('on-dark',entry.isIntersecting),{threshold:.12});footerObserver.observe(document.querySelector('.contact'));

const initScrollMotion=()=>{
  if(reduceMotion||!window.gsap||!window.ScrollTrigger||!window.ScrollToPlugin)return;
  gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
  document.documentElement.classList.add('gsap-ready');
  const motionEase='power2.out';
  const hero=document.querySelector('.hero');
  if(hero){
    const heroTimeline=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.8,invalidateOnRefresh:true}});
    heroTimeline.to('.hero-copy',{y:-72,scale:.9,opacity:.42,ease:'none',duration:1},0)
      .to('.hero-portrait',{y:-34,scale:.94,opacity:.72,ease:'none',duration:1},0)
      .to('.hero-meta',{y:-24,opacity:.2,ease:'none',duration:.7},0);
  }
  gsap.utils.toArray('.project').forEach(project=>{
    const media=project.querySelector('.project-media');
    const info=project.querySelector('.project-info,.project-info--top');
    if(!media)return;
    gsap.fromTo(media,{y:20},{y:-12,ease:'none',scrollTrigger:{trigger:project,start:'top bottom',end:'bottom top',scrub:1.05,invalidateOnRefresh:true}});
    if(info){
      gsap.fromTo(info,{y:18,opacity:.62},{y:-10,opacity:1,ease:'none',scrollTrigger:{trigger:project,start:'top 82%',end:'center center',scrub:.55,invalidateOnRefresh:true}});
    }
    ScrollTrigger.create({trigger:project,start:'top 62%',end:'bottom 38%',onEnter:()=>project.classList.add('is-active'),onEnterBack:()=>project.classList.add('is-active'),onLeave:()=>project.classList.remove('is-active'),onLeaveBack:()=>project.classList.remove('is-active')});
  });
  gsap.utils.toArray('.project-media-footer,.about-grid,.contact-link').forEach(element=>{
    gsap.fromTo(element,{y:26,opacity:.5},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:element,start:'top 88%',end:'top 58%',scrub:.55,invalidateOnRefresh:true}});
  });
  gsap.utils.toArray('.project,.about,.contact').forEach(scene=>{
    gsap.fromTo(scene,{clipPath:'inset(4% 0 4%)'},{clipPath:'inset(0% 0 0%)',ease:'none',scrollTrigger:{trigger:scene,start:'top bottom',end:'top 48%',scrub:.7,invalidateOnRefresh:true}});
  });
  const scenes=gsap.utils.toArray('.hero,.project,.about,.contact');
  let isNavigating=false;
  let wheelIntent=0;
  let touchStartY=null;
  let lastScrollY=window.scrollY;
  let scrollSettleTimer;
  const sceneTop=scene=>scene.getBoundingClientRect().top+window.scrollY;
  const nearestSceneIndex=()=>scenes.reduce((closest,scene,index)=>Math.abs(sceneTop(scene)-window.scrollY)<Math.abs(sceneTop(scenes[closest])-window.scrollY)?index:closest,0);
  const navigateScene=direction=>{
    if(isNavigating)return;
    const currentIndex=nearestSceneIndex();
    const nextIndex=Math.min(scenes.length-1,Math.max(0,currentIndex+direction));
    if(nextIndex===currentIndex)return;
    const targetY=sceneTop(scenes[nextIndex]);
    const distance=Math.abs(targetY-window.scrollY);
    const duration=Math.min(2.35,Math.max(1.7,distance/650));
    isNavigating=true;
    document.documentElement.classList.add('is-scrolling');
    gsap.killTweensOf(window);
    gsap.to(window,{duration,scrollTo:{y:targetY,autoKill:false},ease:'power4.inOut',overwrite:true,onComplete:()=>{isNavigating=false;document.documentElement.classList.remove('is-scrolling')},onInterrupt:()=>{isNavigating=false;document.documentElement.classList.remove('is-scrolling')}});
  };
  const handleWheel=event=>{
    if(event.ctrlKey)return;
    event.preventDefault();
    if(isNavigating)return;
    wheelIntent+=event.deltaY;
    if(Math.abs(wheelIntent)<8)return;
    const direction=wheelIntent>0?1:-1;
    wheelIntent=0;
    navigateScene(direction);
  };
  const handleKeydown=event=>{
    if(isNavigating||event.target.closest('input,textarea,select,dialog'))return;
    const next=['ArrowDown','PageDown',' '].includes(event.key);
    const previous=['ArrowUp','PageUp'].includes(event.key);
    if(!next&&!previous)return;
    event.preventDefault();
    navigateScene(next?1:-1);
  };
  const handleTouchStart=event=>{touchStartY=event.touches[0]?.clientY??null};
  const handleTouchMove=event=>{if(touchStartY!==null)event.preventDefault()};
  const handleTouchEnd=event=>{
    if(touchStartY===null)return;
    const endY=event.changedTouches[0]?.clientY??touchStartY;
    const delta=touchStartY-endY;
    touchStartY=null;
    if(Math.abs(delta)>24)navigateScene(delta>0?1:-1);
  };
  const handleScrollbarSettle=()=>{
    const direction=window.scrollY>=lastScrollY?1:-1;
    lastScrollY=window.scrollY;
    if(isNavigating)return;
    clearTimeout(scrollSettleTimer);
    scrollSettleTimer=setTimeout(()=>navigateScene(direction),160);
  };
  window.addEventListener('wheel',handleWheel,{passive:false});
  window.addEventListener('keydown',handleKeydown);
  window.addEventListener('scroll',handleScrollbarSettle,{passive:true});
  window.addEventListener('touchstart',handleTouchStart,{passive:true});
  window.addEventListener('touchmove',handleTouchMove,{passive:false});
  window.addEventListener('touchend',handleTouchEnd,{passive:true});
  gsap.fromTo('.section-intro',{y:34,opacity:.45},{y:0,opacity:1,ease:motionEase,duration:.8,scrollTrigger:{trigger:'.section-intro',start:'top 82%',toggleActions:'play none none reverse'}});
  ScrollTrigger.refresh();
};
if(document.fonts?.ready){document.fonts.ready.then(initScrollMotion)}else{initScrollMotion()}
