const state={lang:'cs'};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const translations=()=>document.querySelectorAll('[data-cs][data-en]');
const labelTargets=()=>document.querySelectorAll('[data-cs-label][data-en-label]');
const altTargets=()=>document.querySelectorAll('[data-cs-alt][data-en-alt]');
document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',()=>{state.lang=button.dataset.lang;document.documentElement.lang=state.lang;document.querySelectorAll('.lang').forEach(item=>{const active=item.dataset.lang===state.lang;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',active)});translations().forEach(item=>{item.innerHTML=item.dataset[state.lang]});labelTargets().forEach(item=>{item.setAttribute('aria-label',item.dataset[state.lang+'Label'])});altTargets().forEach(item=>{item.alt=item.dataset[state.lang+'Alt']});window.dispatchEvent(new CustomEvent('portfolio:language',{detail:{lang:state.lang}}));if(activeSceneId&&sceneAnnouncer&&sceneNames[activeSceneId])sceneAnnouncer.textContent=sceneNames[activeSceneId][state.lang]}));
const header=document.querySelector('[data-header]');let lastY=window.scrollY;window.addEventListener('scroll',()=>{const y=window.scrollY;header.style.transform=y>lastY&&y>90?'translateY(-110%)':'translateY(0)';header.style.transition='transform .45s cubic-bezier(.16,1,.3,1)';lastY=y},{passive:true});
const navToggle=document.querySelector('.nav-toggle');if(navToggle){const closeNav=()=>{header.classList.remove('nav-open');navToggle.setAttribute('aria-expanded','false')};navToggle.addEventListener('click',()=>{const open=header.classList.toggle('nav-open');navToggle.setAttribute('aria-expanded',String(open))});document.querySelectorAll('#primary-nav a').forEach(link=>link.addEventListener('click',closeNav))}
const dialog=document.querySelector('.project-dialog');const dialogImage=dialog.querySelector('.dialog-image');const dialogTitle=dialog.querySelector('#dialog-title');const dialogLink=dialog.querySelector('.dialog-link');let lastTrigger=null;
document.querySelectorAll('.project-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{lastTrigger=trigger;dialogImage.src=trigger.dataset.full;dialogImage.alt=trigger.dataset.title;dialogTitle.textContent=trigger.dataset.title;dialogLink.href=trigger.dataset.link;trigger.setAttribute('aria-expanded','true');dialog.showModal();document.body.classList.add('dialog-open')}));
const closeDialog=()=>{if(!dialog.open)return;dialog.close();document.body.classList.remove('dialog-open');lastTrigger?.setAttribute('aria-expanded','false');lastTrigger?.focus()};dialog.querySelector('.dialog-close').addEventListener('click',closeDialog);dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});dialog.addEventListener('cancel',closeDialog);
const footerObserver=new IntersectionObserver(([entry])=>header.classList.toggle('on-dark',entry.isIntersecting),{threshold:.12});footerObserver.observe(document.querySelector('.contact'));

const sceneNames={work:{cs:'Práce',en:'Work'},about:{cs:'O mně',en:'About'},contact:{cs:'Kontakt',en:'Contact'}};
const sceneAnnouncer=document.getElementById('scene-announcer');
const observedScenes=['work','about','contact'].map(id=>document.getElementById(id)).filter(Boolean);
const sceneRatios=new Map(observedScenes.map(section=>[section.id,0]));
let activeSceneId=null;
const setActiveScene=id=>{
  if(id===activeSceneId)return;
  activeSceneId=id;
  document.documentElement.dataset.scene=id||'intro';
  document.querySelectorAll('#primary-nav a').forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${id}`));
  if(sceneAnnouncer&&id&&sceneNames[id])sceneAnnouncer.textContent=sceneNames[id][state.lang];
};
if(observedScenes.length){
  const sectionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>sceneRatios.set(entry.target.id,entry.isIntersecting?entry.intersectionRatio:0));
    let bestId=null,bestRatio=0;
    sceneRatios.forEach((ratio,id)=>{if(ratio>bestRatio){bestRatio=ratio;bestId=id}});
    setActiveScene(bestId);
  },{threshold:[0,.5,1]});
  observedScenes.forEach(section=>sectionObserver.observe(section));
}

const progressFill=document.querySelector('.scene-progress-fill');
if(progressFill){
  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    progressFill.style.transform=`scaleX(${ratio})`;
  };
  window.addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();
}

const lineReveal=(container,opts={})=>{
  if(!container)return gsap.timeline();
  const lines=container.querySelectorAll('.line');
  if(!lines.length)return gsap.timeline();
  gsap.set(lines,{yPercent:110,opacity:0});
  return gsap.to(lines,{yPercent:0,opacity:1,duration:opts.duration||1,ease:'power3.out',stagger:opts.stagger||.12});
};

const fadeUp=(targets,opts={})=>{
  const list=(Array.isArray(targets)?targets:[targets]).filter(Boolean);
  if(!list.length)return gsap.timeline();
  gsap.set(list,{y:opts.y??26,opacity:0});
  return gsap.to(list,{y:0,opacity:1,duration:opts.duration||.8,ease:'power3.out',stagger:opts.stagger||0});
};

const initIntro=()=>{
  const heroMeta=document.querySelector('.hero-meta');
  const eyebrow=document.querySelector('.hero-copy .eyebrow');
  const heroTitle=document.querySelector('#hero-title');
  const heroNote=document.querySelector('.hero-note');
  const heroPortrait=document.querySelector('.hero-portrait');
  const heroRule=document.querySelector('.hero-rule');
  if(heroRule)gsap.set(heroRule,{scaleX:0,transformOrigin:'left center'});
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.add(fadeUp([heroMeta,eyebrow],{y:14,duration:.7,stagger:.08}))
    .add(lineReveal(heroTitle,{duration:1,stagger:.1}),'-=0.4')
    .add(fadeUp(heroNote,{y:22,duration:.8}),'-=0.55')
    .add(fadeUp(heroPortrait,{y:28,duration:.9}),'-=0.7');
  if(heroRule)tl.to(heroRule,{scaleX:1,duration:1,ease:'expo.inOut'},'-=0.6');
};

const revealOnEnter=(trigger,targets,opts={})=>{
  const list=(Array.isArray(targets)?targets:[targets]).filter(Boolean);
  if(!trigger||!list.length)return;
  gsap.set(list,{y:26,opacity:0});
  ScrollTrigger.create({
    trigger,
    start:opts.start||'top 75%',
    onEnter:()=>gsap.to(list,{y:0,opacity:1,duration:.75,ease:'power3.out',stagger:.1}),
    onLeaveBack:opts.noReverse?undefined:()=>gsap.to(list,{y:26,opacity:0,duration:.4,ease:'power2.in',stagger:.05})
  });
};

const initSceneReveals=()=>{
  const workIntro=document.querySelector('.section-intro');
  if(workIntro)revealOnEnter(workIntro,[workIntro.querySelector('.eyebrow'),workIntro.querySelector('h2'),workIntro.querySelector('.section-lede')],{start:'top 78%'});
  document.querySelectorAll('.project').forEach(project=>{
    revealOnEnter(project,[project.querySelector('.project-heading'),project.querySelector('.project-meta')]);
  });
  const about=document.querySelector('.about');
  if(about)revealOnEnter(about,[about.querySelector('.eyebrow'),about.querySelector('.about-grid h2'),about.querySelector('.about-lede'),about.querySelector('.about-grid > div > p:last-child')]);
  const contact=document.querySelector('.contact');
  if(contact)revealOnEnter(contact,[contact.querySelector('.contact-top'),contact.querySelector('.contact-kicker'),contact.querySelector('.contact-cta'),contact.querySelector('.contact-bottom')],{start:'top 80%',noReverse:true});
};

const initCursor=()=>{
  const cursor=document.querySelector('.cursor-dot');
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if(!cursor||!finePointer)return;
  const pos={x:-100,y:-100,tx:-100,ty:-100};
  const render=()=>{
    pos.x+=(pos.tx-pos.x)*.2;
    pos.y+=(pos.ty-pos.y)*.2;
    cursor.style.transform=`translate3d(${pos.x}px,${pos.y}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(render);
  };
  window.addEventListener('pointermove',event=>{
    if(event.pointerType&&event.pointerType!=='mouse')return;
    pos.tx=event.clientX;pos.ty=event.clientY;
    document.body.classList.add('cursor-ready');
  },{passive:true});
  document.addEventListener('pointerover',event=>{
    if(event.pointerType&&event.pointerType!=='mouse')return;
    document.body.classList.toggle('cursor-view',Boolean(event.target.closest('.project-trigger')));
  },{passive:true});
  document.addEventListener('pointerout',event=>{
    if(event.pointerType&&event.pointerType!=='mouse')return;
    const next=event.relatedTarget;
    document.body.classList.toggle('cursor-view',next instanceof Element&&Boolean(next.closest('.project-trigger')));
  },{passive:true});
  document.documentElement.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-ready','cursor-view'));
  requestAnimationFrame(render);
};

const initScrollMotion=()=>{
  if(reduceMotion||!window.gsap||!window.ScrollTrigger||!window.ScrollToPlugin)return;
  gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
  document.documentElement.classList.add('gsap-ready');
  initIntro();
  initSceneReveals();
  initCursor();
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
    const duration=Math.min(3.1,Math.max(2.3,distance/540));
    isNavigating=true;
    document.documentElement.classList.add('is-scrolling');
    gsap.killTweensOf(window);
    gsap.to(window,{duration,scrollTo:{y:targetY,autoKill:false},ease:'expo.inOut',overwrite:true,onComplete:()=>{isNavigating=false;document.documentElement.classList.remove('is-scrolling')},onInterrupt:()=>{isNavigating=false;document.documentElement.classList.remove('is-scrolling')}});
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
  ScrollTrigger.refresh();
};
if(document.fonts?.ready){document.fonts.ready.then(initScrollMotion)}else{initScrollMotion()}
