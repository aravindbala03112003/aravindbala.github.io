import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

import { downloadResumePdf } from '../utils/resumeDownload';

export default function ResumePreviewModal({ isOpen, onClose }) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const dragStartRef = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
  const touchDistRef = useRef(null);
  const touchScaleStartRef = useRef(1);

  // Reset zoom whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Escape key and keyboard scrolling handler
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        if (wrapperRef.current) {
          e.preventDefault();
          wrapperRef.current.scrollTop += 60;
        }
      } else if (e.key === 'ArrowUp') {
        if (wrapperRef.current) {
          e.preventDefault();
          wrapperRef.current.scrollTop -= 60;
        }
      } else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (wrapperRef.current) {
          e.preventDefault();
          wrapperRef.current.scrollTop += wrapperRef.current.clientHeight * 0.8;
        }
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        if (wrapperRef.current) {
          e.preventDefault();
          wrapperRef.current.scrollTop -= wrapperRef.current.clientHeight * 0.8;
        }
      }
    },
    [onClose],
  );

  // Zoom controls
  const handleZoomIn = (e) => {
    if (e) e.stopPropagation();
    setScale((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = (e) => {
    if (e) e.stopPropagation();
    setScale((prev) => Math.max(1, +(prev - 0.25).toFixed(2)));
  };

  const resetZoom = (e) => {
    if (e) e.stopPropagation();
    setScale(1);
    setIsDragging(false);
  };

  // Double click toggles zoom (fitted 1x <-> readable 1.75x)
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (scale > 1.05) {
      setScale(1);
    } else {
      setScale(1.75);
    }
  };

  // Mouse wheel: strictly isolated vertical scrolling inside the resume modal / viewer
  useEffect(() => {
    const card = cardRef.current;
    const wrapper = wrapperRef.current;
    if (!isOpen || !card || !wrapper) return;

    const onWheel = (e) => {
      // Strictly prevent event from reaching background page, Lenis, or window
      e.stopPropagation();
      e.preventDefault();

      // Zoom interaction when Ctrl key is held or trackpad pinch gesture is used
      if (e.ctrlKey) {
        const delta = -e.deltaY * 0.005;
        setScale((prev) => Math.min(2.5, Math.max(1, +(prev + delta).toFixed(2))));
        return;
      }

      // Normal vertical mouse-wheel / trackpad scrolling
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        // Line mode (mouse wheel notches on Windows/Firefox)
        deltaY *= 28;
      } else if (e.deltaMode === 2) {
        // Page mode
        deltaY *= wrapper.clientHeight;
      }

      let deltaX = e.deltaX;
      if (e.deltaMode === 1) {
        deltaX *= 28;
      } else if (e.deltaMode === 2) {
        deltaX *= wrapper.clientWidth;
      }

      // Scroll the resume viewer directly and smoothly
      wrapper.scrollTop += deltaY;

      // Scroll horizontally if zoomed and content overflows
      if (deltaX && wrapper.scrollWidth > wrapper.clientWidth) {
        wrapper.scrollLeft += deltaX;
      }
    };

    // passive: false is mandatory so preventDefault() can cancel outer scroll
    card.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      card.removeEventListener('wheel', onWheel);
    };
  }, [isOpen]);

  // Mouse Drag / Pan when zoomed
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    if (e.target.closest('button')) return;
    e.preventDefault();

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: wrapperRef.current ? wrapperRef.current.scrollLeft : 0,
      scrollTop: wrapperRef.current ? wrapperRef.current.scrollTop : 0,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e) => {
      if (!wrapperRef.current) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      wrapperRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
      wrapperRef.current.scrollTop = dragStartRef.current.scrollTop - dy;
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  // Mobile Touch Gestures: Pinch to zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      touchDistRef.current = dist;
      touchScaleStartRef.current = scale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistRef.current) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const factor = currentDist / touchDistRef.current;
      const nextScale = Math.min(2.5, Math.max(1, +(touchScaleStartRef.current * factor).toFixed(2)));
      setScale(nextScale);
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="resume-preview-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={onClose}
          onKeyDown={handleKeyDown}
          role="presentation"
        >
          <div className="resume-preview-layout">
            <motion.article
              ref={cardRef}
              className="resume-preview-card"
              role="dialog"
              aria-modal="true"
              aria-label="Aravind Bala Resume Preview"
              tabIndex={-1}
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient Glow Orbs */}
              <div className="resume-card-glow resume-glow-purple" aria-hidden="true" />
              <div className="resume-card-glow resume-glow-blue" aria-hidden="true" />

              {/* Card Header */}
              <div className="resume-card-header">
                <div className="resume-header-brand">
                  <span className="resume-status-dot" aria-hidden="true" />
                  <span className="resume-header-title">Aravind Bala — Resume</span>
                </div>

                <div className="resume-header-controls">
                  <div className="resume-zoom-toolbar">
                    <button
                      type="button"
                      className="resume-zoom-btn"
                      onClick={handleZoomOut}
                      disabled={scale <= 1}
                      title="Zoom out"
                      aria-label="Zoom out"
                    >
                      <ZoomOutIcon />
                    </button>
                    <span className="resume-zoom-level">{Math.round(scale * 100)}%</span>
                    <button
                      type="button"
                      className="resume-zoom-btn"
                      onClick={handleZoomIn}
                      disabled={scale >= 2.5}
                      title="Zoom in"
                      aria-label="Zoom in"
                    >
                      <ZoomInIcon />
                    </button>
                  </div>

                  {scale > 1.05 && (
                    <button
                      type="button"
                      className="resume-reset-zoom-btn"
                      onClick={resetZoom}
                      title="Reset to fitted size"
                      aria-label="Reset zoom to fitted size"
                    >
                      <ResetIcon />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="resume-reset-zoom-btn"
                    onClick={downloadResumePdf}
                    title="Download Resume PDF"
                    aria-label="Download Resume PDF"
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </button>

                  <button
                    type="button"
                    className="resume-close-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    aria-label="Close resume preview"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              {/* Dedicated Scrollable Resume Viewer */}
              <div
                ref={wrapperRef}
                className={`resume-image-wrapper ${
                  scale > 1 ? (isDragging ? 'is-panning' : 'is-zoomed') : 'is-fitted'
                }`}
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                tabIndex={0}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <div
                  className="resume-document-container"
                  style={{
                    width: `${scale * 100}%`,
                    maxWidth: scale > 1 ? `${Math.round(820 * scale)}px` : '820px',
                    transition: isDragging ? 'none' : 'max-width 0.18s ease-out',
                  }}
                  onDoubleClick={handleDoubleClick}
                >
                  <img
                    ref={imgRef}
                    src="/aravindbala_resume_page-0001.jpg"
                    alt="Aravind Bala — Software Developer Resume"
                    className="resume-preview-img"
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>
            </motion.article>

            {/* "Click anywhere to close" instruction text */}
            <motion.button
              type="button"
              className="resume-preview-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              onClick={onClose}
              aria-label="Close preview"
            >
              <span className="resume-hint-bullet" aria-hidden="true" />
              <span>Click anywhere to close</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
