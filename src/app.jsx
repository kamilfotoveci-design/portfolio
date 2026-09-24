import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

const projects = [
  {
    id: "lasero",
    index: "01",
    title: "Lasero",
    kind: "AI product / tooling",
    year: "2026",
    cover: "assets/lasero.png",
    full: "assets/lasero-full.png",
    href: "work/lasero.html",
    live: "https://lasero.net",
    cs: "AI pracovní prostor pro laserové gravírování — od workflow po funkční rozhraní.",
    en: "An AI workspace for laser engraving — from workflow to a working interface.",
    problem: "Složitý postup od nápadu po výrobní soubor byl rozdělený mezi několik nesourodých nástrojů.",
    role: "Produktová strategie, UX systém, vizuální design a front-end.",
    result: "Jeden souvislý pracovní prostor, který vede uživatele od promptu až k exportu.",
    problemEn: "The workflow from initial idea to a production-ready file was split across several disconnected tools.",
    roleEn: "Product strategy, UX system, visual design and front-end.",
    resultEn: "A connected workspace guiding users from prompt to export."
  },
  {
    id: "nacas",
    index: "02",
    title: "Načas",
    kind: "Fintech / SaaS",
    year: "2026",
    cover: "assets/nacas.png",
    full: "assets/nacas-full.png",
    href: "work/nacas.html",
    live: "https://nacas.pages.dev",
    cs: "Fakturace pro malé firmy v Česku a na Slovensku bez účetního balastu.",
    en: "Invoicing for small businesses in Czechia and Slovakia without accounting clutter.",
    problem: "Běžné fakturační aplikace působí jako zmenšené účetní systémy a zpomalují jednoduchou práci.",
    role: "Produktový koncept, informační architektura, UI a responzivní implementace.",
    result: "Klidný fakturační tok, který upřednostňuje vystavení a zaplacení před administrativou.",
    problemEn: "Typical invoicing apps feel like scaled-down accounting systems and slow down simple work.",
    roleEn: "Product concept, information architecture, UI and responsive implementation.",
    resultEn: "A calm invoicing flow that puts issuing and getting paid ahead of administration."
  },
  {
    id: "subsentry",
    index: "03",
    title: "SubSentry",
    kind: "Privacy / finance",
    year: "2026",
    cover: "assets/subsentry.png",
    full: "assets/subsentry-full.png",
    href: "work/subsentry.html",
    live: "https://subsentry.pages.dev",
    cs: "Soukromý přehled opakovaných plateb bez připojení bankovního účtu.",
    en: "A private overview of recurring payments without connecting a bank account.",
    problem: "Přehled předplatných obvykle vyžaduje sdílení citlivých bankovních dat s další službou.",
    role: "Výzkum problému, produktový model, design systému a funkční prototyp.",
    result: "Lokální přehled plateb, který dává kontrolu uživateli místo agregátoru dat.",
    problemEn: "A subscription overview often requires sharing sensitive banking data with another service.",
    roleEn: "Problem research, product model, system design and a working prototype.",
    resultEn: "A local payment overview that keeps control with the user instead of a data aggregator."
  }
];

function useLanguage() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("portfolio-lang") === "en" ? "en" : "cs"; }
    catch { return document.documentElement.lang === "en" ? "en" : "cs"; }
  });
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    const onLanguage = event => {
      const nextLang = event.detail?.lang === "en" ? "en" : "cs";
      document.documentElement.lang = nextLang;
      setLang(nextLang);
    };
    window.addEventListener("portfolio:language", onLanguage);
    return () => window.removeEventListener("portfolio:language", onLanguage);
  }, []);
  return lang;
}

function RoleReel() {
  const lang = useLanguage();
  const roles = lang === "en"
    ? ["product systems", "interfaces", "working software"]
    : ["produktové systémy", "rozhraní", "funkční software"];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
    const timer = window.setInterval(() => setIndex(value => (value + 1) % roles.length), 2600);
    return () => window.clearInterval(timer);
  }, [lang]);
  return (
    <span className="role-reel" aria-label={roles.join(", ")}>
      <AnimatePresence mode="wait">
        <motion.span key={`${lang}-${index}`} initial={{ y: "95%" }} animate={{ y: 0 }} exit={{ y: "-95%" }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }}>
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ProjectExplorer() {
  const lang = useLanguage();
  const [active, setActive] = useState(0);
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const media = matchMedia("(hover:hover) and (pointer:fine)");
    const update = () => setPointer(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const selected = projects[active];
  return (
    <div className="project-explorer">
      <div className="project-explorer__list" role="list" aria-label={lang === "en" ? "Selected projects" : "Vybrané projekty"}>
        {projects.map((project, i) => (
          <a key={project.id} className={`project-row ${i === active ? "is-active" : ""}`} href={project.href}
            onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={event => { if (!pointer && i !== active) { event.preventDefault(); setActive(i); } }}>
            <span className="project-row__index mono">{project.index}</span>
            <span className="project-row__name">{project.title}</span>
            <span className="project-row__kind">{project.kind}</span>
            <span className="project-row__year mono">{project.year}</span>
          </a>
        ))}
      </div>
      <div className="project-explorer__stage">
        <AnimatePresence mode="wait">
          <motion.a key={selected.id} href={selected.href} className="project-preview"
            initial={{ opacity: 0, clipPath: "inset(8% 0 8% 0)" }} animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }} exit={{ opacity: 0 }} transition={{ duration: .48, ease: [.16, 1, .3, 1] }}>
            <img src={selected.cover} alt="" />
            <span className="project-preview__caption">
              <span>{selected[lang]}</span>
              <span className="mono">{lang === "en" ? "View case study" : "Otevřít případovou studii"}</span>
            </span>
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PixelCarousel({ project }) {
  const lang = useLanguage();
  const slides = useMemo(() => [
    { src: `../${project.cover}`, position: "center", label: lang === "en" ? "Overview" : "Přehled" },
    { src: `../${project.full}`, position: "top", label: lang === "en" ? "Full-page top" : "Horní část stránky" },
    { src: `../${project.full}`, position: "center", label: lang === "en" ? "Full-page middle" : "Střed stránky" },
    { src: `../${project.full}`, position: "bottom", label: lang === "en" ? "Full-page bottom" : "Spodní část stránky" }
  ], [project, lang]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const choose = next => { setDirection(next > active ? 1 : -1); setActive(next); };
  const step = delta => choose((active + delta + slides.length) % slides.length);
  return (
    <section className="case-gallery" aria-label="Project gallery">
      <div className="pixel-frame">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img key={active} src={slides[active].src} alt={`${project.title} — ${slides[active].label}`}
            style={{ objectPosition: slides[active].position }}
            initial={{ opacity: 0, x: direction * 28, filter: "contrast(1.2) saturate(.35)" }}
            animate={{ opacity: 1, x: 0, filter: "contrast(1) saturate(1)" }} exit={{ opacity: 0, x: direction * -18 }}
            transition={{ duration: .52, ease: [.16, 1, .3, 1] }} />
        </AnimatePresence>
        <motion.div className="pixel-wipe" key={`wipe-${active}`} initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: .62, ease: [.76, 0, .24, 1] }} />
      </div>
      <div className="carousel-control">
        <button type="button" onClick={() => step(-1)} aria-label={lang === "en" ? "Previous image" : "Předchozí obrázek"}>{lang === "en" ? "Prev" : "Zpět"}</button>
        <div className="carousel-dots" role="tablist" aria-label={lang === "en" ? "Gallery images" : "Obrázky galerie"}>{slides.map((slide, index) => <button type="button" role="tab" key={slide.label} className={index === active ? "is-active" : ""} onClick={() => choose(index)} aria-selected={index === active} aria-label={`${lang === "en" ? "Show" : "Zobrazit"} ${slide.label}`} />)}</div>
        <span className="mono">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => step(1)} aria-label={lang === "en" ? "Next image" : "Další obrázek"}>{lang === "en" ? "Next" : "Další"}</button>
      </div>
    </section>
  );
}

function CaseStudy({ id }) {
  const lang = useLanguage();
  const project = projects.find(item => item.id === id) || projects[0];
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main className="case-page">
      <div className="case-topline">
        <a className="case-back mono" href="../#work">{lang === "en" ? "Back to work" : "Zpět na projekty"}</a>
        <div className="language" aria-label={lang === "en" ? "Language" : "Jazyk"}>
          <button type="button" className={`lang ${lang === "cs" ? "is-active" : ""}`} aria-pressed={lang === "cs"} onClick={() => { localStorage.setItem("portfolio-lang", "cs"); window.dispatchEvent(new CustomEvent("portfolio:language", { detail: { lang: "cs" } })); }}>{"CZ"}</button>
          <button type="button" className={`lang ${lang === "en" ? "is-active" : ""}`} aria-pressed={lang === "en"} onClick={() => { localStorage.setItem("portfolio-lang", "en"); window.dispatchEvent(new CustomEvent("portfolio:language", { detail: { lang: "en" } })); }}>{"EN"}</button>
        </div>
      </div>
      <header className="case-hero">
        <p className="mono">{project.index} / {lang === "en" ? "Selected work" : "Vybraná práce"} / {project.year}</p>
        <h1>{project.title}</h1>
        <p className="case-deck">{project[lang]}</p>
        <a className="case-live" href={project.live} target="_blank" rel="noreferrer">{lang === "en" ? "Visit live product" : "Navštívit produkt"}</a>
      </header>
      <PixelCarousel project={project} />
      <section className="case-facts">
        <article><span className="mono">{lang === "en" ? "Problem" : "Problém"}</span><p>{project[lang === "en" ? "problemEn" : "problem"]}</p></article>
        <article><span className="mono">Role</span><p>{project[lang === "en" ? "roleEn" : "role"]}</p></article>
        <article><span className="mono">{lang === "en" ? "Outcome" : "Výsledek"}</span><p>{project[lang === "en" ? "resultEn" : "result"]}</p></article>
      </section>
      <nav className="case-next" aria-label={lang === "en" ? "Next project" : "Další projekt"}>
        <span className="mono">{lang === "en" ? "Next case study" : "Další případová studie"}</span>
        <a href={`${nextProject.id}.html`}>{nextProject.title}</a>
      </nav>
    </main>
  );
}

function ArchiveGallery() {
  const lang = useLanguage();
  const archiveRef = useRef(null);
  const [canDrag, setCanDrag] = useState(false);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 140, damping: 26 });
  const smoothY = useSpring(y, { stiffness: 140, damping: 26 });
  useEffect(() => {
    const updateDragMode = () => setCanDrag(matchMedia("(hover:hover) and (pointer:fine)").matches && window.innerWidth > 1539);
    updateDragMode();
    window.addEventListener("resize", updateDragMode);
    return () => window.removeEventListener("resize", updateDragMode);
  }, []);
  return (
      <main className={`archive-page ${canDrag ? "is-draggable" : ""}`} ref={archiveRef}>
      <header className="archive-header"><a href="index.html">Kamil Hortík</a><span className="mono">{canDrag ? (lang === "en" ? "Selected work / drag to explore" : "Vybrané projekty / přetáhněte") : (lang === "en" ? "Selected work / choose a project" : "Vybrané projekty / vyberte projekt")}</span><a href="index.html#contact">{lang === "en" ? "Contact" : "Kontakt"}</a></header>
      <motion.div className="archive-canvas" drag={canDrag} dragConstraints={archiveRef} dragMomentum={false} dragElastic={0} style={canDrag ? { x: smoothX, y: smoothY } : undefined}>
        {projects.map((item, index) => <a key={item.id} href={item.href} className={`archive-card archive-card--${index + 1}`}><img src={item.cover} alt="" draggable="false" /><span>{item.title}</span><small className="mono">{item.index} / {item.year}</small></a>)}
      </motion.div>
    </main>
  );
}

const mounts = [
  ["role-reel", RoleReel],
  ["project-explorer", ProjectExplorer]
];
mounts.forEach(([id, Component]) => { const node = document.getElementById(id); if (node) createRoot(node).render(<Component />); });
if (document.getElementById("project-explorer")) document.documentElement.classList.add("react-ready");
const caseNode = document.getElementById("case-study");
if (caseNode) createRoot(caseNode).render(<CaseStudy id={caseNode.dataset.project} />);
const archiveNode = document.getElementById("archive-gallery");
if (archiveNode) createRoot(archiveNode).render(<ArchiveGallery />);
