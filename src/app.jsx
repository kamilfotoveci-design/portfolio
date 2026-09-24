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
    result: "Jeden souvislý pracovní prostor, který vede uživatele od promptu až k exportu."
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
    result: "Klidný fakturační tok, který upřednostňuje vystavení a zaplacení před administrativou."
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
    result: "Lokální přehled plateb, který dává kontrolu uživateli místo agregátoru dat."
  }
];

function useLanguage() {
  const [lang, setLang] = useState(document.documentElement.lang === "en" ? "en" : "cs");
  useEffect(() => {
    const onLanguage = event => setLang(event.detail?.lang === "en" ? "en" : "cs");
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
  const slides = useMemo(() => [
    { src: `../${project.cover}`, position: "center", label: "Overview" },
    { src: `../${project.full}`, position: "top", label: "System" },
    { src: `../${project.full}`, position: "center", label: "Flow" },
    { src: `../${project.full}`, position: "bottom", label: "Detail" }
  ], [project]);
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
        <button type="button" onClick={() => step(-1)} aria-label="Previous image">Prev</button>
        <div className="carousel-dots" role="tablist">{slides.map((slide, index) => <button type="button" key={slide.label} className={index === active ? "is-active" : ""} onClick={() => choose(index)} aria-label={`Show ${slide.label}`} />)}</div>
        <span className="mono">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => step(1)} aria-label="Next image">Next</button>
      </div>
    </section>
  );
}

function CaseStudy({ id }) {
  const project = projects.find(item => item.id === id) || projects[0];
  return (
    <main className="case-page">
      <a className="case-back mono" href="../index.html#work">Back to work</a>
      <header className="case-hero">
        <p className="mono">{project.index} / Selected work / {project.year}</p>
        <h1>{project.title}</h1>
        <p className="case-deck">{project.cs}</p>
        <a className="case-live" href={project.live} target="_blank" rel="noreferrer">Visit live product</a>
      </header>
      <PixelCarousel project={project} />
      <section className="case-facts">
        <article><span className="mono">Problem</span><p>{project.problem}</p></article>
        <article><span className="mono">Role</span><p>{project.role}</p></article>
        <article><span className="mono">Result</span><p>{project.result}</p></article>
      </section>
      <nav className="case-next" aria-label="Next project">
        <span className="mono">Next case study</span>
        <a href={`${projects[(projects.indexOf(project) + 1) % projects.length].id}.html`}>{projects[(projects.indexOf(project) + 1) % projects.length].title}</a>
      </nav>
    </main>
  );
}

function ArchiveGallery() {
  const x = useMotionValue(0); const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 140, damping: 26 });
  const smoothY = useSpring(y, { stiffness: 140, damping: 26 });
  const canDrag = useMemo(() => matchMedia("(hover:hover) and (pointer:fine)").matches, []);
  const items = [...projects, ...projects].map((project, index) => ({ ...project, uid: `${project.id}-${index}` }));
  return (
    <main className="archive-page">
      <header className="archive-header"><a href="index.html">Kamil Hortík</a><span className="mono">Visual archive / drag to explore</span><a href="index.html#contact">Contact</a></header>
      <motion.div className="archive-canvas" drag={canDrag} dragConstraints={{ left: -620, right: 80, top: -460, bottom: 80 }} style={canDrag ? { x: smoothX, y: smoothY } : undefined}>
        {items.map((item, index) => <a key={item.uid} href={item.href} className={`archive-card archive-card--${index + 1}`}><img src={item.cover} alt="" draggable="false" /><span>{item.title}</span><small className="mono">{item.index} / {item.year}</small></a>)}
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
