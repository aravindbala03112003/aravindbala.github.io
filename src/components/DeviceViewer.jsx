import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeviceViewer({ project }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const thumbnailsRef = useRef(null);

  const screenshots = project?.screenshots || [];

  // Always reset to the first screenshot when switching projects
  useEffect(() => {
    setCurrentIndex(0);
    setIsZoomed(false);
    setImgError(false);
  }, [project?.id, project?.name]);

  // Reset error state when index changes
  useEffect(() => {
    setImgError(false);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (screenshots.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  }, [screenshots.length]);

  const handleNext = useCallback(() => {
    if (screenshots.length === 0) return;
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  }, [screenshots.length]);

  // Keyboard arrow keys & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'Escape' && isZoomed) setIsZoomed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isZoomed]);

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current?.children[currentIndex]) {
      thumbnailsRef.current.children[currentIndex].scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: 'center',
      });
    }
  }, [currentIndex]);

  if (!project || !screenshots.length) return null;

  // Safe clamping
  const safeIndex = Math.min(Math.max(0, currentIndex), screenshots.length - 1);
  const currentItem = screenshots[safeIndex];
  const currentImage = typeof currentItem === 'string' ? currentItem : currentItem?.src;
  const activeDeviceType = typeof currentItem === 'string'
    ? project?.deviceType
    : (currentItem?.type || project?.deviceType);
  const isMobile = activeDeviceType === 'mobile';

  const formattedCount = `${String(safeIndex + 1).padStart(2, '0')} / ${String(screenshots.length).padStart(2, '0')}`;

  // Shared image element for both device types
  const renderScreenImage = (altPrefix) => (
    <AnimatePresence mode="sync" initial={false}>
      <motion.img
        key={`${project.id}-${safeIndex}`}
        src={currentImage}
        alt={`${project.name} ${altPrefix} screen ${safeIndex + 1}`}
        className="device-screen-img"
        loading="eager"
        decoding="async"
        draggable={false}
        onError={() => setImgError(true)}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: imgError ? 0 : 1 }}
        exit={{ opacity: 0.3 }}
        transition={{ duration: 0.2 }}
      />
    </AnimatePresence>
  );

  return (
    <div className="device-viewer-wrapper">
      {/* Device Shell Container */}
      <div className={`device-stage ${isMobile ? 'stage-mobile' : 'stage-laptop'}`}>

        {/* Navigation Arrow Left */}
        <button
          className="device-nav-btn nav-btn-left"
          onClick={handlePrev}
          aria-label="Previous screenshot"
          title="Previous screen (←)"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Device Frame */}
        {isMobile ? (
          /* iPhone 16-Style Smartphone Mockup */
          <div className="mockup-phone">
            <div className="phone-bezel">
              <div className="phone-screen" onClick={() => setIsZoomed(true)}>
                <div className="phone-dynamic-island" />
                {renderScreenImage('mobile')}
                <div className="phone-glare" />
              </div>
              <div className="phone-home-indicator" />
            </div>
          </div>
        ) : (
          /* Laptop / MacBook Mockup */
          <div className="mockup-laptop">
            <div className="laptop-top">
              <div className="laptop-camera-dot" />
              <div className="laptop-screen" onClick={() => setIsZoomed(true)}>
                {renderScreenImage('web')}
                <div className="laptop-glare" />
              </div>
            </div>
            <div className="laptop-base">
              <div className="laptop-notch" />
            </div>
          </div>
        )}

        {/* Navigation Arrow Right */}
        <button
          className="device-nav-btn nav-btn-right"
          onClick={handleNext}
          aria-label="Next screenshot"
          title="Next screen (→)"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

      </div>

      {/* Control Bar: Counter + Thumbnail Selector */}
      <div className="device-controls-bar">
        <div className="device-counter-pill">
          <span>{formattedCount}</span>
        </div>

        <div className="device-thumbnails-strip" ref={thumbnailsRef}>
          {screenshots.map((img, idx) => {
            const thumbSrc = typeof img === 'string' ? img : img.src;
            return (
              <button
                key={`${thumbSrc}-${idx}`}
                className={`device-thumb ${idx === safeIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Select screenshot ${idx + 1}`}
              >
                <img src={thumbSrc} alt={`Thumb ${idx + 1}`} loading="lazy" draggable={false} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom / Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="device-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={currentImage}
                alt={`${project.name} enlarged preview`}
                onClick={() => setIsZoomed(false)}
                draggable={false}
              />
              <div className="lightbox-hint">Click anywhere to return (Esc)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

