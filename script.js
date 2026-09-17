const copy={
  cs:{navAria:'Hlavní navigace',topAria:'Kamil Hortík — nahoru',languageAria:'Jazyk',navWork:'Projekty',navContact:'Kontakt',heroLine1:'KAMIL',heroLine2b:'HORTÍK',laseroDesc:'AI pracovní prostor pro laserové gravírování. Doporučí nastavení podle stroje a materiálu a připraví fotografie pro výrobu.',nacasDesc:'Fakturace pro malé firmy v Česku a na Slovensku. Vytváří profesionální PDF, QR platby a přehled stavu úhrad.',subsentryDesc:'Soukromý přehled opakovaných plateb bez připojení banky. Ukáže měsíční i roční náklady a pomůže rozhodnout, co si ponechat.',openLasero:'Otevřít Lasero',openNacas:'Otevřít Načas',openSubsentry:'Otevřít SubSentry',laseroAlt:'Landing page projektu Lasero',nacasAlt:'Landing page projektu Načas',subsentryAlt:'Landing page projektu SubSentry',contactTitle:'Napište mi.',cursorView:'Otevřít'},
  en:{navAria:'Primary navigation',topAria:'Kamil Hortík — back to top',languageAria:'Language',navWork:'Work',navContact:'Contact',heroLine1:'KAMIL',heroLine2b:'HORTÍK',laseroDesc:'An AI workspace for laser engraving. It recommends settings for each machine and material and prepares photos for production.',nacasDesc:'Invoicing for small businesses in Czechia and Slovakia. It creates professional PDFs, QR payments and a clear payment-status overview.',subsentryDesc:'A private overview of recurring payments with no bank connection. It shows monthly and yearly costs so you can decide what stays.',openLasero:'Open Lasero',openNacas:'Open Načas',openSubsentry:'Open SubSentry',laseroAlt:'Lasero project landing page',nacasAlt:'Načas project landing page',subsentryAlt:'SubSentry project landing page',contactTitle:'Get in touch.',cursorView:'View'}
};

Object.assign(copy.cs,{topAria:'Kamil Hortík — nahoru',heroLine2b:'HORTÍK',heroCopy:'AI produkty. Od návrhu po kód.',workTitle:'Projekty',availableLong:'Otevřený AI spolupráci',contactTitle:'Napište mi.'});
Object.assign(copy.en,{topAria:'Kamil Hortík — back to top',heroLine2b:'HORTÍK',heroCopy:'AI products. From design to code.',workTitle:'Projects',availableLong:'Open to AI opportunities',contactTitle:'Get in touch.'});

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.getElementById('header');
const progress=document.querySelector('.scroll-progress');
const hero=document.querySelector('.hero');
const portrait=document.querySelector('.hero-portrait');
const cursor=document.querySelector('.cursor');
const languageControl=document.querySelector('.languages');
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

function applyLanguage(lang){
  const dict=copy[lang];
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{if(dict[el.dataset.i18n])el.textContent=dict[el.dataset.i18n]});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{if(dict[el.dataset.i18nAria])el.setAttribute('aria-label',dict[el.dataset.i18nAria])});
  document.querySelectorAll('[data-i18n-alt]').forEach(el=>{if(dict[el.dataset.i18nAlt])el.setAttribute('alt',dict[el.dataset.i18nAlt])});
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.lang===lang)));
  languageControl.dataset.active=lang;
  document.querySelector('meta[name="description"]').content=lang==='cs'?'Nezávislý AI produktový tvůrce — strategie, design a vývoj.':'Independent AI product builder — strategy, design and engineering.';
  document.getElementById('hero-title').setAttribute('aria-label','Kamil Hortík Portfolio');
  localStorage.setItem('rz-language',lang);
}

function setLanguage(lang){
  if(!reduceMotion&&document.startViewTransition){document.startViewTransition(()=>applyLanguage(lang))}else{applyLanguage(lang)}
}
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
applyLanguage(localStorage.getItem('rz-language')==='en'?'en':'cs');

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -8%'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

let scrollQueued=false;
function onScroll(){
  if(scrollQueued)return;
  scrollQueued=true;
  requestAnimationFrame(()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;
    header.classList.toggle('scrolled',scrollY>24);
    if(!reduceMotion){
      const heroShift=Math.min(scrollY*.12,90);
      portrait.style.setProperty('--portrait-y',`${heroShift}px`);
      document.querySelectorAll('.project-visual').forEach(card=>{
        const rect=card.getBoundingClientRect();
        const phase=Math.max(-1,Math.min(1,(innerHeight/2-(rect.top+rect.height/2))/innerHeight));
        card.style.setProperty('--image-y',`${-40+phase*28}px`);
      });
    }
    scrollQueued=false;
  });
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

if(!reduceMotion&&matchMedia('(pointer:fine)').matches){
  addEventListener('pointermove',event=>{
    cursor.style.setProperty('--cx',`${event.clientX}px`);cursor.style.setProperty('--cy',`${event.clientY}px`);
  },{passive:true});
  const resetSpatial=()=>{
    hero.classList.remove('is-spatial');
    portrait.style.setProperty('--depth-x','0px');portrait.style.setProperty('--depth-y','0px');
    portrait.style.setProperty('--depth-bg-x','0px');portrait.style.setProperty('--depth-bg-y','0px');
    portrait.style.setProperty('--portrait-rx','0deg');portrait.style.setProperty('--portrait-ry','0deg');
  };
  hero.addEventListener('pointerenter',()=>hero.classList.add('is-spatial'));
  hero.addEventListener('pointermove',event=>{
    const rect=hero.getBoundingClientRect();
    const nx=Math.max(-1,Math.min(1,((event.clientX-rect.left)/rect.width-.5)*2));
    const ny=Math.max(-1,Math.min(1,((event.clientY-rect.top)/rect.height-.5)*2));
    portrait.style.setProperty('--depth-x',`${nx*11}px`);portrait.style.setProperty('--depth-y',`${ny*7}px`);
    portrait.style.setProperty('--depth-bg-x',`${nx*-7}px`);portrait.style.setProperty('--depth-bg-y',`${ny*-4}px`);
    portrait.style.setProperty('--portrait-rx',`${ny*-1.6}deg`);portrait.style.setProperty('--portrait-ry',`${nx*2.2}deg`);
  },{passive:true});
  hero.addEventListener('pointerleave',resetSpatial);
  document.querySelectorAll('.cursor-target').forEach(el=>{
    el.addEventListener('pointerenter',()=>cursor.classList.add('active'));
    el.addEventListener('pointerleave',()=>{cursor.classList.remove('active');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
    el.addEventListener('pointermove',event=>{const r=el.getBoundingClientRect();el.style.setProperty('--rx',`${((event.clientY-r.top)/r.height-.5)*-2.2}deg`);el.style.setProperty('--ry',`${((event.clientX-r.left)/r.width-.5)*2.2}deg`)});
  });
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',event=>{const r=el.getBoundingClientRect();el.style.transform=`translate3d(${(event.clientX-r.left-r.width/2)*.16}px,${(event.clientY-r.top-r.height/2)*.16}px,0)`});
    el.addEventListener('pointerleave',()=>el.style.transform='translate3d(0,0,0)');
  });
}

if(!reduceMotion&&matchMedia('(pointer:fine)').matches){
  const panels=[...document.querySelectorAll('.snap-panel')];
  let springFrame=0,lastWheel=0,targetIndex=0;
  const nearestPanel=()=>panels.reduce((best,panel,index)=>Math.abs(panel.offsetTop-scrollY)<Math.abs(panels[best].offsetTop-scrollY)?index:best,0);
  function springTo(index){
    targetIndex=Math.max(0,Math.min(panels.length-1,index));
    cancelAnimationFrame(springFrame);
    const root=document.documentElement,target=panels[targetIndex].offsetTop;
    let position=scrollY,velocity=0,last=performance.now();
    root.style.scrollSnapType='none';root.style.scrollBehavior='auto';
    function step(now){
      const dt=Math.min((now-last)/1000,.032);last=now;
      const acceleration=(target-position)*115-velocity*16;
      velocity+=acceleration*dt;position+=velocity*dt;
      scrollTo(0,position);
      if(Math.abs(target-position)<.45&&Math.abs(velocity)<2){
        scrollTo(0,target);root.style.scrollSnapType='';root.style.scrollBehavior='';springFrame=0;return;
      }
      springFrame=requestAnimationFrame(step);
    }
    springFrame=requestAnimationFrame(step);
  }
  addEventListener('wheel',event=>{
    if(event.ctrlKey||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
    event.preventDefault();
    const now=performance.now();if(Math.abs(event.deltaY)<8||now-lastWheel<620)return;
    lastWheel=now;const base=springFrame?targetIndex:nearestPanel();springTo(base+(event.deltaY>0?1:-1));
  },{passive:false});
  addEventListener('keydown',event=>{
    const next=['ArrowDown','PageDown',' '].includes(event.key),previous=['ArrowUp','PageUp'].includes(event.key);
    if(!next&&!previous)return;event.preventDefault();springTo(nearestPanel()+(next?1:-1));
  });
}

addEventListener('load',()=>setTimeout(()=>{document.body.classList.remove('loading');document.body.classList.add('loaded')},220));
setTimeout(()=>{document.body.classList.remove('loading');document.body.classList.add('loaded')},1800);
