import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function ExpoGallery({ images, type = 'mobile', title }) {
  const trackRef    = useRef(null);
  const wrapRef     = useRef(null);
  const rafRef      = useRef(null);
  const pausedRef   = useRef(false);  // ref so RAF can read latest value
  const [paused, setPaused]     = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const inView = useInView(wrapRef, { once: true, margin: '-80px' });

  // Keep ref in sync with state
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Auto-scroll ticker using native scrollLeft
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = type === 'mobile' ? 0.55 : 0.7;

    const tick = () => {
      if (!pausedRef.current) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll <= 0) { rafRef.current = requestAnimationFrame(tick); return; }
        if (track.scrollLeft >= maxScroll - 1) {
          // smooth loop: jump back
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += speed;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [type]);

  // Drag to scroll (mouse)
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    pauseFor(5000);
    dragStartX.current    = e.pageX - trackRef.current.getBoundingClientRect().left;
    dragScrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const x    = e.pageX - trackRef.current.getBoundingClientRect().left;
    const walk = (x - dragStartX.current) * 1.8;
    trackRef.current.scrollLeft = dragScrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  const pauseFor = (ms = 3000) => {
    setPaused(true);
    clearTimeout(window.__expoResume);
    window.__expoResume = setTimeout(() => setPaused(false), ms);
  };

  // Arrow navigation
  const scrollBy = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    pauseFor(4000);
    const itemW = type === 'mobile' ? 190 : 660;
    track.scrollBy({ left: dir * itemW, behavior: 'smooth' });
  };

  // Progress tracking
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setProgress(max > 0 ? track.scrollLeft / max : 0);
    };
    track.addEventListener('scroll', update, { passive: true });
    return () => track.removeEventListener('scroll', update);
  }, []);

  if (!images || images.length === 0) {
    return <div className="expo-empty">Gallery coming soon</div>;
  }

  const isMobileType = type === 'mobile';

  return (
    <div className="expo-gallery-wrap" ref={wrapRef}>
      {/* Arrows */}
      <div className="expo-controls">
        <button className="expo-btn" onClick={() => scrollBy(-1)} aria-label="Previous">‹</button>
        <button className="expo-btn" onClick={() => scrollBy(1)} aria-label="Next">›</button>
      </div>

      {/* Scrollable track */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          ref={trackRef}
          className="expo-track"
          style={{ cursor: 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={() => pauseFor(4000)}
          onTouchEnd={onMouseUp}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={`expo-item ${isMobileType ? 'expo-img-mobile' : 'expo-img-web'}`}
              onClick={() => { pauseFor(8000); setLightbox(i); }}
            >
              <img src={img} alt={`${title} ${i + 1}`} loading="lazy" draggable={false} />
              <div className="expo-item-hover"><span>View</span></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="expo-progress-track">
        <div
          className="expo-progress-thumb"
          style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
        />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onChange={setLightbox}
            type={type}
            title={title}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Lightbox ---- */
function Lightbox({ images, index, onClose, onChange, type, title }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft')  onChange(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className="lightbox-close" onClick={onClose}>✕</button>

      {index > 0 && (
        <button className="lightbox-arrow left" onClick={() => onChange(i => i - 1)}>‹</button>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28 }}
        className="lightbox-inner"
      >
        <img
          src={images[index]}
          alt={`${title} ${index + 1}`}
          className={type === 'mobile' ? 'lightbox-img-mobile' : 'lightbox-img-web'}
        />
      </motion.div>

      {index < images.length - 1 && (
        <button className="lightbox-arrow right" onClick={() => onChange(i => i + 1)}>›</button>
      )}

      <div className="lightbox-counter">{index + 1} / {images.length}</div>
    </motion.div>
  );
}
