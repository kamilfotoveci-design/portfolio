const state={lang:'cs'};
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const translations=()=>document.querySelectorAll('[data-cs][data-en]');
document.querySelectorAll('.lang').forEach(button=>button.addEventListener('click',()=>{state.lang=button.dataset.lang;document.documentElement.lang=state.lang;document.querySelectorAll('.lang').forEach(item=>{const active=item.dataset.lang===state.lang;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',active)});translations().forEach(item=>{item.innerHTML=item.dataset[state.lang]})}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:reduceMotion?0:700,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});observer.unobserve(entry.target)}}),{threshold:.15});
document.querySelectorAll('.section-intro,.project,.about-grid,.contact-link').forEach(element=>observer.observe(element));
const header=document.querySelector('[data-header]');let lastY=window.scrollY;window.addEventListener('scroll',()=>{const y=window.scrollY;header.style.transform=y>lastY&&y>90?'translateY(-110%)':'translateY(0)';header.style.transition='transform .45s cubic-bezier(.16,1,.3,1)';lastY=y},{passive:true});
