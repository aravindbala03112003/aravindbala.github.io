import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rafThrottle } from '../utils/rafThrottle';

export default function MuseumCertificateViewer({ item, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const frameRef = useRef(null);
  const spotlightRef = useRef(null);
  const rectRef = useRef(null);

  const photos = item?.photos || [];

  const scrollYRef = useRef(0);

  // Lock background body/html scroll and prevent all vertical movement in document viewer
  useEffect(() => {
    if (!item) return;

    scrollYRef.current = window.scrollY;
    const origBodyTop = document.body.style.top;
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Completely block any wheel or touch scrolling anywhere while document viewer is active
    const preventWheelAndTouch = (e) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', preventWheelAndTouch, { passive: false });
    window.addEventListener('touchmove', preventWheelAndTouch, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventWheelAndTouch);
      window.removeEventListener('touchmove', preventWheelAndTouch);
      document.body.classList.remove('modal-open');
      document.body.style.top = origBodyTop;
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [item]);

  // Keyboard navigation & Esc listener
  useEffect(() => {
    if (!item || photos.length === 0) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      } else if (['PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', ' ', 'Home', 'End'].includes(e.key)) {
        // Completely disable vertical keyboard scrolling
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length, isZoomed, onClose, item]);

  if (!item || !item.photos || item.photos.length === 0) return null;

  const currentPhoto = photos[activeIdx] || photos[0];

  // Subtle 3D Mouse Parallax Tilt & Spotlight movement (Throttled per frame, direct DOM updates)
  const handleMouseMove = useMemo(
    () =>
      rafThrottle((e) => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (!frameRef.current) return;
        if (!rectRef.current) {
          rectRef.current = frameRef.current.getBoundingClientRect();
        }
        const rect = rectRef.current;
        if (!rect || !rect.width || !rect.height) return;

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const spotX = 50 + (e.clientX / window.innerWidth - 0.5) * 20;
        const spotY = (e.clientY / window.innerHeight) * 15;

        frameRef.current.style.transform = `perspective(1000px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
        if (spotlightRef.current) {
          spotlightRef.current.style.background = `radial-gradient(ellipse 70% 55% at ${spotX.toFixed(1)}% ${spotY.toFixed(1)}%, rgba(117, 167, 255, 0.16) 0%, rgba(11, 18, 32, 0.95) 75%)`;
        }
      }),
    []
  );

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (frameRef.current) {
      frameRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(117, 167, 255, 0.16) 0%, rgba(11, 18, 32, 0.95) 75%)';
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto;
    link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-document-${activeIdx + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="museum-backdrop"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
        onMouseDown={onClose}
        onMouseMove={handleMouseMove}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Dynamic Top Spotlight & Radial Ambient Glow */}
        <div
          ref={spotlightRef}
          className="museum-spotlight"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(117, 167, 255, 0.16) 0%, rgba(11, 18, 32, 0.95) 75%)',
          }}
        />

        {/* Ambient Dark Texture Particles */}
        <div className="museum-particles-layer">
          <div className="museum-particle p1" />
          <div className="museum-particle p2" />
          <div className="museum-particle p3" />
        </div>

        {/* Museum Exhibition Container */}
        <motion.article
          className="museum-container"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
          onMouseDown={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Luxury Header */}
          <header className="museum-header">
            <div className="museum-header-left">
              <div className="museum-meta-tag">
                <span className="museum-status-dot" />
                <span className="museum-year">{item.year}</span>
              </div>
              <h1 className="museum-title">{item.title}</h1>
              <p className="museum-subtitle">{item.place}</p>
            </div>

            <button
              className="museum-close-btn"
              onClick={onClose}
              aria-label="Close exhibition viewer"
              title="Close (Esc)"
            >
              <span>Close</span> ✕
            </button>
          </header>

          {/* Central Exhibition Gallery Stage */}
          <div className="museum-stage">
            {/* Museum Artifact Frame Container */}
            <div
              ref={frameRef}
              className="museum-frame-wrapper"
              onMouseLeave={handleMouseLeave}
              style={{ transition: 'transform 0.15s ease-out' }}
            >
              {/* Outer Matte Black Frame with Brushed Gold Inner Border */}
              <div className="museum-frame-outer">
                <div className="museum-frame-gold-border">
                  <div className="museum-image-viewport" onClick={() => setIsZoomed(true)}>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPhoto}
                        src={currentPhoto}
                        alt={`${item.title} official document page ${activeIdx + 1}`}
                        className="museum-certificate-img"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      />
                    </AnimatePresence>

                    {/* Realistic Glass Overlay & Shimmer Pass */}
                    <div className="museum-glass-layer">
                      <div className="glass-reflection-shimmer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Soft Floor Shadow & Mirror Reflection */}
              <div className="museum-floor-shadow" />
              <div className="museum-reflection-floor" aria-hidden="true">
                <img src={currentPhoto} alt="" decoding="async" loading="lazy" />
                <div className="reflection-fade-mask" />
              </div>
            </div>
          </div>

          {/* Multi-Page Thumbnail Selector (Gold Bordered) */}
          {photos.length > 1 && (
            <div className="museum-thumbnails-bar">
              {photos.map((photo, idx) => (
                <button
                  key={photo}
                  className={`museum-thumb-item ${idx === activeIdx ? 'active-gold' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`View page ${idx + 1}`}
                >
                  <img src={photo} alt={`Page ${idx + 1}`} decoding="async" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* Bottom Floating Glass Controls */}
          <div className="museum-controls-bar">
            {photos.length > 1 && (
              <button
                className="museum-control-btn"
                onClick={() => setActiveIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                aria-label="Previous page"
                title="Previous page (←)"
              >
                ‹
              </button>
            )}

            <div className="museum-counter-pill">
              <span>{String(activeIdx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
            </div>

            {photos.length > 1 && (
              <button
                className="museum-control-btn"
                onClick={() => setActiveIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                aria-label="Next page"
                title="Next page (→)"
              >
                ›
              </button>
            )}

            <div className="museum-controls-divider" />

            <button
              className="museum-control-btn"
              onClick={() => setIsZoomed(true)}
              aria-label="Fullscreen zoom"
              title="Fullscreen zoom"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>

            <button
              className="museum-control-btn"
              onClick={handleDownload}
              aria-label="Download document"
              title="Download document"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </div>
        </motion.article>

        {/* Fullscreen Zoom Lightbox */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              className="museum-lightbox-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
            >
              <div className="museum-lightbox-stage">
                <img src={currentPhoto} alt={`${item.title} enlarged certificate`} />
                <span className="museum-lightbox-hint">Click anywhere to return</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
