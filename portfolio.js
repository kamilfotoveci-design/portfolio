const storedLanguage = (() => {
  try { return localStorage.getItem("portfolio-lang"); }
  catch { return null; }
})();

let language = storedLanguage === "en" ? "en" : "cs";
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const wordRevealSelector = [
  ".intro-lede",
  ".section-heading h2",
  ".section-heading > p",
  ".project h3",
  ".project-description",
  ".project-role",
  ".project-copy .text-link > span:first-child",
  ".about-content h2",
  ".about-content > div > p:not(.about-signoff)",
  ".contact-top > p:last-child",
  ".contact-link > span:first-child"
].join(", ");
document.querySelectorAll(wordRevealSelector).forEach(element => element.setAttribute("data-reveal-words", ""));
let wordRevealObserver = null;

function prepareWordReveal() {
  document.querySelectorAll("[data-reveal-words]").forEach(element => {
    element.querySelectorAll(".reveal-word").forEach(word => wordRevealObserver?.unobserve(word));
    const fragment = document.createDocumentFragment();
    const text = element.textContent.trim();
    let wordIndex = 0;
    text.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "reveal-word";
      word.style.setProperty("--word-delay", `${Math.min(wordIndex * 32, 448)}ms`);
      word.textContent = part;
      fragment.append(word);
      wordIndex += 1;
    });
    element.replaceChildren(fragment);
    element.classList.add("has-word-reveal");
    if (wordRevealObserver) element.querySelectorAll(".reveal-word").forEach(word => wordRevealObserver.observe(word));
  });
}

function setLanguage(nextLanguage) {
  language = nextLanguage === "en" ? "en" : "cs";
  document.documentElement.lang = language;
  document.title = language === "en"
    ? "Kamil Hortík — Product design & development"
    : "Kamil Hortík — Produktový design & vývoj";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = language === "en"
    ? "Kamil Hortík — Product design and development for digital products."
    : "Kamil Hortík — Produktový design a vývoj digitálních produktů.";
  document.querySelectorAll("[data-cs][data-en]").forEach(element => {
    element.textContent = element.dataset[language];
  });
  prepareWordReveal();
  document.querySelectorAll(".lang").forEach(button => {
    const active = button.dataset.lang === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  menuButton?.setAttribute("aria-label", header?.classList.contains("nav-open")
    ? (language === "en" ? "Close navigation" : "Zavřít navigaci")
    : (language === "en" ? "Open navigation" : "Otevřít navigaci"));
  const contactLink = document.querySelector(".contact-link");
  if (contactLink) {
    const subject = language === "en" ? "New project — Kamil Hortík" : "Nový projekt — Kamil Hortík";
    contactLink.href = `mailto:kami.hortik@gmail.com?subject=${encodeURIComponent(subject)}`;
  }
  try { localStorage.setItem("portfolio-lang", language); }
  catch { /* Language selection still works when storage is disabled. */ }
}

function closeMenu() {
  header?.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

document.querySelectorAll(".lang").forEach(button => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  header?.classList.toggle("nav-open", open);
  menuButton.setAttribute("aria-label", open
    ? (language === "en" ? "Close navigation" : "Zavřít navigaci")
    : (language === "en" ? "Open navigation" : "Otevřít navigaci"));
});
document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

const portrait = document.querySelector(".intro-portrait");
const portraitTilt = document.querySelector(".portrait-tilt");
if (portrait && portraitTilt && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  portrait.addEventListener("pointermove", event => {
    const bounds = portrait.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    portraitTilt.style.setProperty("--tilt-x", `${(-y * 4).toFixed(1)}deg`);
    portraitTilt.style.setProperty("--tilt-y", `${(x * 7).toFixed(1)}deg`);
  });
  portrait.addEventListener("pointerleave", () => {
    portraitTilt.style.setProperty("--tilt-x", "0deg");
    portraitTilt.style.setProperty("--tilt-y", "0deg");
  });
}

setLanguage(language);

if ("IntersectionObserver" in window) {
  wordRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      wordRevealObserver.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -10% 0px" });
  const revealItems = [...document.querySelectorAll(".intro-portrait, .project-image")];
  revealItems.forEach(item => {
    item.dataset.reveal = "";
    if (item.classList.contains("intro-portrait")) item.style.setProperty("--reveal-delay", "140ms");
    if (item.classList.contains("project-image")) item.style.setProperty("--reveal-delay", "180ms");
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -7% 0px" });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll(".reveal-word").forEach(word => wordRevealObserver.observe(word));
    revealItems.forEach(item => revealObserver.observe(item));
  }));
} else {
  document.querySelectorAll("[data-reveal-words], .intro-portrait, .project-image").forEach(item => {
    item.classList.add("is-revealed");
  });
  document.querySelectorAll(".reveal-word").forEach(word => word.classList.add("is-visible"));
}
