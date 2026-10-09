import { useState, useEffect, useRef } from 'react';
import { translations } from './i18n';
import ScrollPortrait from './components/ScrollPortrait';
import ExpoGallery from './components/ExpoGallery';
import './index.css';

// ---- Photos ----
import portrait1 from './assets/WhatsApp Image 2026-10-09 at 13.26.49.jpeg';
import portrait2 from './assets/WhatsApp Image 2026-10-09 at 16.10.43.jpeg';

// ---- Curated preview shots (13 hand-picked) for the expo gallery ----
import elmarsa1 from './assets/elmarsa (1).PNG';
import elmarsa2 from './assets/elmarsa (2).PNG';
import elmarsa3 from './assets/elmarsa (3).PNG';
import elmarsa4 from './assets/elmarsa (4).PNG';
import elmarsa5 from './assets/elmarsa (5).PNG';
import elmarsa6 from './assets/elmarsa (6).PNG';
import elmarsa7 from './assets/elmarsa (7).PNG';
import elmarsa8 from './assets/elmarsa (8).PNG';
import elmarsa9 from './assets/elmarsa (9).PNG';
import elmarsa10 from './assets/elmarsa (10).PNG';
import elmarsa11 from './assets/elmarsa (11).PNG';
import elmarsa12 from './assets/elmarsa (12).PNG';
import elmarsa13 from './assets/elmarsa (13).PNG';
const elmarsaCurated = [elmarsa1, elmarsa2, elmarsa3, elmarsa4, elmarsa5, elmarsa6, elmarsa7,
  elmarsa8, elmarsa9, elmarsa10, elmarsa11, elmarsa12, elmarsa13];

// ---- Full screenshot banks (118+ for elmarsa, tourathi when ready) ----
// These are ONLY loaded into the "View All Screens" modal, NOT the expo ticker.
const elmarsaGlob = import.meta.glob('./assets/elmarsa-sc/*.{PNG,png,JPG,jpg,jpeg}', { eager: true });
const elmarsaAllImages = Object.values(elmarsaGlob).map(m => m.default).sort();

const tourathiGlob = import.meta.glob('./assets/tourathi-sc/*.{PNG,png,JPG,jpg,jpeg}', { eager: true });
const tourathiAllImages = Object.values(tourathiGlob).map(m => m.default).sort();

// ---- Web project screenshots ----
import mektby1 from './assets/mektby1.png';
import mektby2 from './assets/mektby2.png';
import mektby3 from './assets/mektby3.png';
import mektby4 from './assets/mektby4.png';

import packpro1 from './assets/packpro1.png';
import packpro2 from './assets/packpro2.png';
import packpro3 from './assets/packpro3.png';
import packpro4 from './assets/packpro4.png';

import bng1 from './assets/bng1.png';
import bng2 from './assets/bng2.png';
import bng3 from './assets/bng3.png';
import bng4 from './assets/bng4.png';

const PROJECT_SCREENSHOTS = {
  elmarsa: {
    type: 'mobile',
    images: elmarsaCurated,       // shown in expo ticker (13 curated)
    allImages: elmarsaAllImages,  // shown ONLY in "View All" modal (118+)
  },
  tourathi: {
    type: 'mobile',
    images: [],                   // no curated yet — expo shows empty placeholder
    allImages: tourathiAllImages, // full gallery when user adds files
  },
  mektby: {
    type: 'web',
    images: [mektby1, mektby2, mektby3, mektby4],
  },
  packpro: {
    type: 'web',
    images: [packpro1, packpro2, packpro3, packpro4],
  },
  bng: {
    type: 'web',
    images: [bng1, bng2, bng3, bng4],
  },
};


function useScrollFadeUp() {
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll('.fade-up');
      const io = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        }),
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      els.forEach(el => io.observe(el));
      return io;
    };
    const io = observe();
    return () => io.disconnect();
  });
}

/* ===== NAVBAR ===== */
function Navbar({ lang, setLang, t, darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navKeys = ['home', 'about', 'projects', 'skills', 'contact'];
  const navIds = { home: 'hero', about: 'about', projects: 'projects', skills: 'skills', contact: 'contact' };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(d => !d)}
            aria-label="Toggle light/dark mode"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              // Sun icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // Moon icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
        <ul className="nav-links">
          {navKeys.map(k => (
            <li key={k}>
              <a href={`#${navIds[k]}`} onClick={e => { e.preventDefault(); scrollTo(navIds[k]); }}>
                {t.nav[k]}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
            <option value="ar">AR</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="tr">TR</option>
          </select>
          <div className={`hamburger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            <span /><span />
          </div>
        </div>
      </nav>

      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-nav-inner">
          <img src="/logo.png" alt="Logo" style={{ height: '48px', width: 'auto', marginBottom: '2rem' }} />
          {navKeys.map(k => (
            <a key={k} href="#" onClick={e => { e.preventDefault(); scrollTo(navIds[k]); }}>
              {t.nav[k]}
            </a>
          ))}
          <div className="mobile-lang-wrap">
            <select className="lang-select" value={lang} onChange={e => { setLang(e.target.value); setMobileOpen(false); }}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="tr">Türkçe</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== PROJECT CARD ===== */
function ViewAllScreensBtn({ project, sc }) {
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index of open image
  const allImages = sc?.allImages || [];
  const totalCount = allImages.length;
  if (sc?.type !== 'mobile') return null;

  const openLightbox = (i) => { setLightbox(i); };
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => Math.max(0, i - 1));
  const nextImg = () => setLightbox(i => Math.min(allImages.length - 1, i + 1));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  return (
    <>
      <button
        className="btn btn-outline view-all-btn"
        onClick={() => setOpen(true)}
        style={{ marginTop: '1rem' }}
      >
        {totalCount > 0
          ? `View All ${totalCount} Screens`
          : 'Gallery Coming Soon'
        }
      </button>

      {/* ── Grid modal ── */}
      {open && totalCount > 0 && (
        <div
          className="modal-overlay open"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          role="dialog" aria-modal="true"
        >
          <div className="modal">
            <div className="modal-header">
              <h3>{project.title} — All {totalCount} Screens</h3>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="modal-thumb"
                  onClick={() => openLightbox(i)}
                  title="Click to expand"
                >
                  <img src={img} alt={`${project.title} screen ${i + 1}`} loading="lazy" />
                  <div className="modal-thumb-hover">⤢</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-screen lightbox ── */}
      {lightbox !== null && (
        <div
          className="modal-overlay open"
          style={{ zIndex: 4000, background: 'rgba(0,0,0,0.97)' }}
          onClick={e => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close */}
          <button className="modal-close" onClick={closeLightbox}
            style={{ position: 'fixed', top: '1.2rem', right: '1.5rem', zIndex: 4010 }}>✕</button>

          {/* Counter */}
          <div style={{
            position: 'fixed', top: '1.2rem', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', letterSpacing: '0.12em', zIndex: 4010,
          }}>
            {lightbox + 1} / {allImages.length}
          </div>

          {/* Prev */}
          {lightbox > 0 && (
            <button onClick={prevImg} className="lightbox-arrow left" style={{ zIndex: 4010 }}>‹</button>
          )}

          {/* Image — auto-fit landscape or portrait */}
          <img
            src={allImages[lightbox]}
            alt={`${project.title} ${lightbox + 1}`}
            style={{
              maxWidth: '95vw',
              maxHeight: '92vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '6px',
              display: 'block',
            }}
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {lightbox < allImages.length - 1 && (
            <button onClick={nextImg} className="lightbox-arrow right" style={{ zIndex: 4010 }}>›</button>
          )}
        </div>
      )}
    </>
  );
}

function ProjectCard({ project, t, index }) {
  const sc = PROJECT_SCREENSHOTS[project.id];
  const previewImages = sc?.images || [];    // curated — shown in expo ticker
  const isEven = index % 2 === 0;

  return (
    <div className={`project-row fade-up delay-${(index % 3) + 1} ${isEven ? '' : 'project-row-reverse'}`}>
      <div className="project-info">
        <div className="project-header">
          <span className="project-tag">{project.tag}</span>
          <h3 className="project-title">{project.title}</h3>
        </div>
        <p className="project-desc">{project.desc}</p>
        <div className="project-tech">
          {project.tech.map((tech, i) => <span key={i} className="tech-item">{tech}</span>)}
        </div>
        <div className="project-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-outline">
              Live Link ↗
            </a>
          )}
          {/* View All Screens button — always visible for mobile app projects */}
          <ViewAllScreensBtn project={project} sc={sc} />
        </div>
      </div>

      <div className="project-visuals">
        <ExpoGallery images={previewImages} type={sc?.type || 'mobile'} title={project.title} />
      </div>
    </div>
  );
}

/* ===== PROJECTS ===== */
function Projects({ t }) {
  // Temporary: Hide tourathi until photos are available
  const activeProjects = t.projects.items.filter(p => p.id !== 'tourathi');

  return (
    <section id="projects">
      <div className="section-header fade-up">
        <span className="section-label">02. {t.projects.title}</span>
        <h2 className="section-title">{t.projects.subtitle}</h2>
      </div>
      <div className="projects-list">
        {activeProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} t={t} index={i} />
        ))}
      </div>
    </section>
  );
}


/* ===== SKILLS ===== */
function Skills({ t }) {
  return (
    <section id="skills">
      <div className="section-header fade-up">
        <span className="section-label">03. {t.skills.title}</span>
        <h2 className="section-title">{t.skills.subtitle}</h2>
      </div>
      <div className="skills-grid">
        {t.skills.categories.map((cat, i) => (
          <div key={i} className={`skill-category fade-up delay-${(i % 3) + 1}`}>
            <h3 className="skill-category-name">{cat.name}</h3>
            <ul className="skill-items-list">
              {cat.items.map((item, j) => <li key={j} className="skill-item">{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== CONTACT ===== */
function Contact({ t }) {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrapper">
        <div className="section-header fade-up">
          <span className="section-label">04. {t.contact.title}</span>
          <h2 className="section-title">{t.contact.subtitle}</h2>
        </div>

        <div className="contact-content fade-up delay-1">
          <p className="contact-desc">{t.contact.available}</p>
          <div className="contact-location">{t.contact.location}</div>

          <div className="contact-links">
            <a href="mailto:Usametalebdahmane@gmail.com" className="contact-link">
              {t.contact.email} ↗
            </a>
            <a href="https://github.com/usameeee" target="_blank" rel="noreferrer" className="contact-link">
              {t.contact.github} ↗
            </a>
            <a href="https://wa.me/+22220177536" target="_blank" rel="noreferrer" className="contact-link">
              {t.contact.whatsapp} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== APP ===== */
export default function App() {
  const [lang, setLang] = useState('ar');
  const [darkMode, setDarkMode] = useState(true);
  const t = translations[lang];
  const isRTL = lang === 'ar';

  useScrollFadeUp();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = 'Oussama Taleb Dahmane — Portfolio';
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [lang, isRTL, darkMode]);

  return (
    <div className="app-container">
      <Navbar lang={lang} setLang={setLang} t={t} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main>
        <ScrollPortrait src1={portrait1} src2={portrait2} t={t} />
        <Projects t={t} />
        <Skills t={t} />
        <Contact t={t} />
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Oussama Taleb Dahmane. All rights reserved.</p>
      </footer>
    </div>
  );
}
