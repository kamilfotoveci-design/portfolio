const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const readLanguage = () => {
  try { return localStorage.getItem('portfolio-lang') === 'en' ? 'en' : 'cs'; }
  catch { return document.documentElement.lang === 'en' ? 'en' : 'cs'; }
};

let language = readLanguage();
const translate = () => {
  document.documentElement.lang = language;
  document.querySelectorAll('.lang').forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-cs][data-en]').forEach(element => {
    element.innerHTML = element.dataset[language];
  });
  document.querySelectorAll('[data-cs-label][data-en-label]').forEach(element => {
    element.setAttribute('aria-label', element.dataset[`${language}Label`]);
  });
  document.querySelectorAll('[data-cs-alt][data-en-alt]').forEach(element => {
    element.alt = element.dataset[`${language}Alt`];
  });

  const contact = document.querySelector('.contact-cta');
  if (contact) {
    contact.href = language === 'en'
      ? 'mailto:kami.hortik@gmail.com?subject=New%20project%20%E2%80%94%20Kamil%20Hort%C3%ADk&body=Hi%20Kamil,%0A%0AProject:%0A%0AWhat%20I%20need:%0A%0ATimeline:%0A%0ABudget:%0A%0AReferences:%0A'
      : 'mailto:kami.hortik@gmail.com?subject=Nov%C3%BD%20projekt%20%E2%80%94%20Kamil%20Hort%C3%ADk&body=Ahoj%20Kamile,%0A%0AProjekt:%0A%0ACo%20pot%C5%99ebuji:%0A%0ATerm%C3%ADn:%0A%0ARozpo%C4%8Det:%0A%0AReference:%0A';
  }

  const currentScene = document.documentElement.dataset.scene;
  const announcer = document.getElementById('scene-announcer');
  const sceneNames = {
    work: { cs: 'Práce', en: 'Work' },
    about: { cs: 'O mně', en: 'About' },
    contact: { cs: 'Kontakt', en: 'Contact' }
  };
  if (announcer && sceneNames[currentScene]) announcer.textContent = sceneNames[currentScene][language];
  window.dispatchEvent(new CustomEvent('portfolio:language', { detail: { lang: language } }));
};

document.querySelectorAll('.lang').forEach(button => {
  button.addEventListener('click', () => {
    language = button.dataset.lang === 'en' ? 'en' : 'cs';
    try { localStorage.setItem('portfolio-lang', language); } catch { /* Storage can be disabled. */ }
    translate();
  });
});
translate();

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('.nav-toggle');
const closeNav = () => {
  header?.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

navToggle?.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#primary-nav a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });

let previousScroll = window.scrollY;
let scrollFrame = 0;
const updateHeader = () => {
  scrollFrame = 0;
  if (!header || reduceMotion.matches || header.classList.contains('nav-open')) return;
  const currentScroll = window.scrollY;
  const movingDown = currentScroll > previousScroll;
  header.classList.toggle('is-hidden', movingDown && currentScroll > 140);
  previousScroll = currentScroll;
};
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
}, { passive: true });

const dialog = document.querySelector('.project-dialog');
if (dialog) {
  const image = dialog.querySelector('.dialog-image');
  const title = dialog.querySelector('#dialog-title');
  const link = dialog.querySelector('.dialog-link');
  let lastTrigger = null;

  document.querySelectorAll('.project-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      lastTrigger = trigger;
      image.src = trigger.dataset.full;
      image.alt = trigger.dataset.title;
      title.textContent = trigger.dataset.title;
      link.href = trigger.dataset.link;
      trigger.setAttribute('aria-expanded', 'true');
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });

  const closeDialog = () => {
    if (!dialog.open) return;
    dialog.close();
    document.body.classList.remove('dialog-open');
    lastTrigger?.setAttribute('aria-expanded', 'false');
    lastTrigger?.focus();
  };
  dialog.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('cancel', closeDialog);
}

const progressFill = document.querySelector('.scene-progress-fill');
if (progressFill) {
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progressFill.style.transform = `scaleX(${progress})`;
  };
  window.addEventListener('scroll', () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();
}

const scenes = [...document.querySelectorAll('#work, #about, #contact')];
const sceneRatios = new Map(scenes.map(scene => [scene.id, 0]));
if (scenes.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => sceneRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
    const activeScene = [...sceneRatios.entries()].sort((a, b) => b[1] - a[1])[0];
    const scene = activeScene?.[1] > 0.12 ? activeScene[0] : 'intro';
    document.documentElement.dataset.scene = scene;
    document.querySelectorAll('#primary-nav a').forEach(link => {
      if (link.hash) {
        const active = link.hash === `#${scene}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    });
    header?.classList.toggle('on-dark', scene === 'contact');
    const announcer = document.getElementById('scene-announcer');
    const sceneNames = { work: { cs: 'Práce', en: 'Work' }, about: { cs: 'O mně', en: 'About' }, contact: { cs: 'Kontakt', en: 'Contact' } };
    if (announcer && sceneNames[scene]) announcer.textContent = sceneNames[scene][language];
  }, { threshold: [0, .12, .3, .55, .8] });
  scenes.forEach(scene => observer.observe(scene));
}

const setupVideo = () => {
  const videos = [...document.querySelectorAll('[data-work-film]')];
  if (!videos.length) return;
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    videos.forEach(video => { video.pause(); video.removeAttribute('autoplay'); });
    return;
  }

  const visibility = new Map(videos.map(video => [video, false]));
  const updatePlayback = () => videos.forEach(video => {
    if (document.visibilityState === 'visible' && visibility.get(video)) video.play().catch(() => {});
    else video.pause();
  });
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting));
    updatePlayback();
  }, { rootMargin: '120px 0px', threshold: .05 });
  videos.forEach(video => videoObserver.observe(video));
  document.addEventListener('visibilitychange', updatePlayback);
  reduceMotion.addEventListener('change', event => {
    if (event.matches) videos.forEach(video => video.pause());
    else updatePlayback();
  });
};

const setupTilt = () => {
  if (!window.VanillaTilt || !finePointer.matches || reduceMotion.matches) return;
  const targets = [...document.querySelectorAll('[data-tilt]:not([data-tilt-ready])')];
  if (!targets.length) return;
  targets.forEach(target => target.dataset.tiltReady = 'true');
  window.VanillaTilt.init(targets, {
    max: 3.5,
    speed: 700,
    perspective: 1400,
    scale: 1.015,
    glare: true,
    'max-glare': .12,
    gyroscope: false
  });
};

const setupAnimations = () => {
  setupVideo();
  setupTilt();

  const explorer = document.getElementById('project-explorer');
  if (explorer && 'MutationObserver' in window) {
    new MutationObserver(setupTilt).observe(explorer, { childList: true, subtree: true });
  }

  if (reduceMotion.matches || !window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.fromTo('.hero-meta', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .7 })
    .fromTo('.hero-copy .eyebrow', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, '-=.42')
    .fromTo('.hero-title-line', { yPercent: 112, rotateX: -12 }, { yPercent: 0, rotateX: 0, duration: 1, stagger: .09 }, '-=.42')
    .fromTo('.hero-note', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, '-=.46')
    .fromTo('.hero-stage', { y: 24, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: 1.05 }, '-=.72')
    .fromTo('.hero-rule', { scaleX: 0 }, { scaleX: 1, duration: .8, transformOrigin: 'left center' }, '-=.42');

  const heroStage = document.querySelector('.hero-stage');
  if (heroStage) {
    gsap.to(heroStage, {
      yPercent: 8,
      rotateX: -1.5,
      scale: .97,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 }
    });
  }

  const reveal = (selector, options = {}) => {
    const targets = gsap.utils.toArray(selector);
    if (!targets.length) return;
    gsap.set(targets, { y: 22, opacity: 0 });
    ScrollTrigger.batch(targets, {
      start: options.start || 'top 88%',
      once: true,
      interval: .08,
      batchMax: 3,
      onEnter: batch => gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: .8,
        stagger: .08,
        ease: 'power3.out',
        overwrite: true
      })
    });
  };

  reveal('.section-intro > *, .project-row', { start: 'top 84%' });
  reveal('.about-grid > *, .about > .eyebrow');
  reveal('.contact-top, .contact-kicker, .contact-bottom');

  requestAnimationFrame(() => ScrollTrigger.refresh());
};

if (document.fonts?.ready) document.fonts.ready.then(setupAnimations);
else setupAnimations();

if (finePointer.matches && !reduceMotion.matches) {
  const cursor = document.querySelector('.cursor-dot');
  if (cursor) {
    window.addEventListener('pointermove', event => {
      cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
      document.body.classList.add('cursor-ready');
    }, { passive: true });
    document.addEventListener('pointerover', event => {
      document.body.classList.toggle('cursor-view', Boolean(event.target.closest('.project-trigger, .project-preview, .hero-film')));
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready', 'cursor-view'));
  }
}
