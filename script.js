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
    gsap.fromTo(media,{scale:.965,y:28},{scale:1.015,y:-16,ease:'none',scrollTrigger:{trigger:project,start:'top bottom',end:'bottom top',scrub:.7,invalidateOnRefresh:true}});
    if(info){
      gsap.fromTo(info,{y:18,opacity:.62},{y:-10,opacity:1,ease:'none',scrollTrigger:{trigger:project,start:'top 82%',end:'center center',scrub:.55,invalidateOnRefresh:true}});
    }
    ScrollTrigger.create({trigger:project,start:'top 62%',end:'bottom 38%',onEnter:()=>project.classList.add('is-active'),onEnterBack:()=>project.classList.add('is-active'),onLeave:()=>project.classList.remove('is-active'),onLeaveBack:()=>project.classList.remove('is-active')});
  });
  const projects=gsap.utils.toArray('.project');
  let settleTimer;
  let settleTween;
  const settleOnProject=()=>{
    if(settleTween?.isActive())return;
    const currentY=window.scrollY;
    const target=projects.reduce((closest,project)=>{
      const top=project.getBoundingClientRect().top+window.scrollY;
      return Math.abs(top-currentY)<Math.abs(closest-currentY)?top:closest;
    },projects[0]?.getBoundingClientRect().top+window.scrollY||0);
    if(Math.abs(target-currentY)<10)return;
    settleTween=gsap.to(window,{duration:.82,scrollTo:{y:target,autoKill:true},ease:'power3.out',overwrite:'auto',onComplete:()=>{settleTween=null},onInterrupt:()=>{settleTween=null}});
  };
  const queueProjectSettle=()=>{
    clearTimeout(settleTimer);
    settleTimer=setTimeout(settleOnProject,150);
  };
  window.addEventListener('scroll',queueProjectSettle,{passive:true});
  window.addEventListener('wheel',queueProjectSettle,{passive:true});
  window.addEventListener('touchend',queueProjectSettle,{passive:true});
  gsap.fromTo('.section-intro',{y:34,opacity:.45},{y:0,opacity:1,ease:motionEase,duration:.8,scrollTrigger:{trigger:'.section-intro',start:'top 82%',toggleActions:'play none none reverse'}});
  ScrollTrigger.refresh();
};
if(document.fonts?.ready){document.fonts.ready.then(initScrollMotion)}else{initScrollMotion()}
