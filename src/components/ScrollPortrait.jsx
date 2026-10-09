import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollPortrait({ src1, src2, t }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [isRTL, setIsRTL] = useState(() => typeof document !== 'undefined' && document.body.classList.contains('rtl'));

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsRTL(document.body.classList.contains('rtl'));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ─── Unconditional transforms (React hooks rules) ───
  const heroOpacity      = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY            = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  // Desktop photo crossfade
  const desktopImg1      = useTransform(scrollYProgress, [0.28, 0.55], [1, 0]);
  const desktopImg2      = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const desktopBlur      = useTransform(scrollYProgress, [0.28, 0.42, 0.55], ['blur(0px)', 'blur(12px)', 'blur(0px)']);

  // Mobile photo crossfade
  const mobileImg1       = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);
  const mobileImg2       = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const mobileBlur       = useTransform(scrollYProgress, [0.1, 0.25, 0.4], ['blur(0px)', 'blur(8px)', 'blur(0px)']);
  const mobileHeroOp     = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const mobileHeroY      = useTransform(scrollYProgress, [0, 0.1], [0, -24]);

  // Mobile: About text fades in ABOVE the photo (top overlay)
  const aboutOverlayOp   = useTransform(scrollYProgress, [0.45, 0.7], [0, 1]);
  const aboutOverlayY    = useTransform(scrollYProgress, [0.45, 0.7], [-20, 0]);

  // Mobile: photo moves down slightly to make room for About text on top
  const mobilePhotoY     = useTransform(scrollYProgress, [0.45, 0.7], [0, 60]);

  const imgScale         = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // Desktop: portrait slides to one side
  const portraitXLTR     = useTransform(scrollYProgress, [0.58, 0.78], ['0%', '-28%']);
  const portraitXRTL     = useTransform(scrollYProgress, [0.58, 0.78], ['0%', '28%']);
  const aboutOpacity     = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);
  const aboutXLTR        = useTransform(scrollYProgress, [0.62, 0.82], [60, 0]);
  const aboutXRTL        = useTransform(scrollYProgress, [0.62, 0.82], [-60, 0]);
  const indicatorOp      = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  // Pick RTL-aware values
  const portraitX = isRTL ? portraitXRTL : portraitXLTR;
  const aboutX    = isRTL ? aboutXRTL    : aboutXLTR;

  const img1Op = isMobile ? mobileImg1 : desktopImg1;
  const img2Op = isMobile ? mobileImg2 : desktopImg2;
  const blur   = isMobile ? mobileBlur  : desktopBlur;

  const containerHeight = isMobile ? '280vh' : '450vh';

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{ position: 'relative', height: containerHeight, display: 'block', paddingTop: 0 }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* ── HERO NAME ── */}
        <motion.div style={{
          position: 'absolute', zIndex: 20, textAlign: 'center',
          opacity: isMobile ? mobileHeroOp : heroOpacity,
          y: isMobile ? mobileHeroY : heroY,
          pointerEvents: 'none', padding: '0 2rem', width: '100%',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 7vw, 6rem)',
            fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            {t.hero.greeting}
          </h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.72rem, 1.8vw, 1.05rem)',
            textTransform: 'uppercase', letterSpacing: '0.18em',
            color: 'var(--text-secondary)',
          }}>
            {t.hero.role1} · {t.hero.role2}
          </p>
        </motion.div>

        {/* ── PORTRAIT ── */}
        <motion.div style={{
          position: 'absolute',
          width: isMobile ? '72vw' : '36vw',
          maxWidth: isMobile ? '320px' : '520px',
          height: isMobile ? '55vh' : '78vh',
          maxHeight: '860px',
          x: isMobile ? 0 : portraitX,
          y: isMobile ? mobilePhotoY : 0,
          zIndex: 5,
          bottom: isMobile ? '5vh' : 'auto',
          top: isMobile ? 'auto' : 'auto',
        }}>
          <motion.img src={src1} alt="Portrait"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center', borderRadius: '6px',
              filter: blur, WebkitFilter: blur,
              opacity: img1Op, scale: imgScale,
            }}
          />
          <motion.img src={src2} alt="Portrait 2"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top center', borderRadius: '6px',
              filter: blur, WebkitFilter: blur,
              opacity: img2Op, scale: imgScale,
            }}
          />
        </motion.div>

        {/* ── MOBILE: About text appears ABOVE/OVER the photo ── */}
        {isMobile && (
          <motion.div
            style={{
              position: 'absolute',
              top: '8vh',
              left: '5vw',
              right: '5vw',
              zIndex: 15,
              opacity: aboutOverlayOp,
              y: aboutOverlayY,
              // Frosted glass background so text is readable over photo
              background: 'linear-gradient(to bottom, var(--bg) 60%, transparent)',
              paddingBottom: '2rem',
            }}
          >
            <span className="section-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
              01. {t.about.title}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
              fontWeight: 400, lineHeight: 1.25, marginBottom: '1.2rem',
            }}>
              {t.about.subtitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
              {t.about.p1}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {t.about.p2}
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                {t.about.languages}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem' }}>
                {t.about.langList.map((l, i) => (
                  <span key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{l}</span>
                ))}
              </div>
            </div>
            <a href="/cv.pdf" download="Oussama_Taleb_Dahmane_CV.pdf" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
              {t.about.downloadCV}
            </a>
          </motion.div>
        )}

        {/* ── DESKTOP: About text alongside photo ── */}
        {!isMobile && (
          <motion.div
            id="about"
            style={{
              position: 'absolute',
              [isRTL ? 'left' : 'right']: '4vw',
              top: '12vh',
              width: '36vw', maxWidth: '480px',
              zIndex: 10, opacity: aboutOpacity, x: aboutX,
              overflowY: 'auto', maxHeight: '76vh',
            }}
          >
            <span className="section-label">01. {t.about.title}</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)',
              fontWeight: 400, margin: '0.8rem 0 1.8rem', lineHeight: 1.25,
            }}>
              {t.about.subtitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '1.2rem', fontSize: '1.05rem' }}>
              {t.about.p1}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: '2rem', fontSize: '1.05rem' }}>
              {t.about.p2}
            </p>
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2rem' }}>
              {[t.about.langList.slice(0, 2), t.about.langList.slice(2, 4)].map((col, ci) => (
                <div key={ci}>
                  {ci === 0 && (
                    <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      {t.about.languages}
                    </h4>
                  )}
                  {ci === 1 && <div style={{ height: '1.5rem' }} />}
                  {col.map((l, i) => <div key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{l}</div>)}
                </div>
              ))}
            </div>
            <a href="/cv.pdf" download="Oussama_Taleb_Dahmane_CV.pdf" className="btn btn-outline">
              {t.about.downloadCV}
            </a>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div style={{
          position: 'absolute', bottom: '3vh', opacity: indicatorOp,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: '1px', height: '24px', background: 'var(--text-muted)' }}
          />
        </motion.div>
      </div>

      {/* ── Desktop anchor for nav scroll ── */}
      {!isMobile && <div id="about" style={{ position: 'absolute', top: '100vh' }} />}
    </section>
  );
}
