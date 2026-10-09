const storedLanguage = (() => {
  try { return localStorage.getItem("portfolio-lang"); }
  catch { return null; }
})();

let language = storedLanguage === "en" ? "en" : "cs";
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const wordRevealSelector = [
  ".work-heading-row h2",
  ".contact-kicker",
  ".contact-link > span:first-child"
].join(", ");
document.querySelectorAll(wordRevealSelector).forEach(element => element.setAttribute("data-reveal-words", ""));

function prepareWordReveal() {
  document.querySelectorAll("[data-reveal-words]").forEach(element => {
    const text = element.textContent.trim();
    const fragment = document.createDocumentFragment();
    let wordIndex = 0;
    text.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        return;
      }
      const word = document.createElement("span");
      word.className = "reveal-word";
      word.style.setProperty("--word-delay", `${Math.min(wordIndex * 34, 408)}ms`);
      word.textContent = part;
      fragment.append(word);
      wordIndex += 1;
    });
    element.replaceChildren(fragment);
  });
}

function setLanguage(nextLanguage) {
  language = nextLanguage === "en" ? "en" : "cs";
  document.documentElement.lang = language;
  document.title = language === "en" ? "Kamil Hortík — portfolio" : "Kamil Hortík — portfolio";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = language === "en"
    ? "Kamil Hortík — product design and selected digital projects."
    : "Kamil Hortík — produktový design a digitální projekty.";
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
    const subject = language === "en" ? "A new chapter — Kamil Hortík" : "Nová kapitola — Kamil Hortík";
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

setLanguage(language);

if ("IntersectionObserver" in window) {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.body.classList.add("motion-enabled");
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      textObserver.unobserve(entry.target);
    });
  }, { threshold: .16, rootMargin: "0px 0px -7% 0px" });
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      projectObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: "0px 0px -5% 0px" });
  document.querySelectorAll("[data-reveal-words], .contact-link, .contact-kicker").forEach(item => textObserver.observe(item));
  document.querySelectorAll(".project").forEach(item => projectObserver.observe(item));
} else {
  document.querySelectorAll("[data-reveal-words], .contact-link, .contact-kicker, .project").forEach(item => item.classList.add("is-revealed"));
}
