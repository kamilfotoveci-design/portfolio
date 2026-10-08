const storedLanguage = (() => {
  try { return localStorage.getItem("portfolio-lang"); }
  catch { return null; }
})();

let language = storedLanguage === "en" ? "en" : "cs";
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");

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

setLanguage(language);
