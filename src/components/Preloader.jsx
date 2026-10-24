import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoading(false);
      return;
    }

    // Safely check session storage with try-catch
    let hasLoaded = false;
    try {
      hasLoaded = Boolean(sessionStorage.getItem('portfolio-session-preloaded'));
    } catch (_) {}

    // Strict safety timer: unmount within 480ms max unconditionally
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setLoading(false);
    }, hasLoaded ? 220 : 480);

    const intervalTime = hasLoaded ? 10 : 16;
    const increment = hasLoaded ? 12 : 8;

    let currentVal = 0;
    const timer = setInterval(() => {
      currentVal += increment;
      if (currentVal >= 100) {
        currentVal = 100;
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
          try {
            sessionStorage.setItem('portfolio-session-preloaded', 'true');
          } catch (_) {}
        }, 120);
      } else {
        setProgress(currentVal);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="preloader-cinematic"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{ pointerEvents: loading ? 'auto' : 'none' }}
        >
          {/* Background Ambient Grid & Glow */}
          <div className="preloader-bg-ambient" aria-hidden="true" />

          <div className="preloader-content">
            {/* Top Monogram Mark */}
            <div className="preloader-monogram">
              <div className="preloader-logo-ring">
                <img
                  src={`${import.meta.env.BASE_URL}logo/portfolio-logo.png`}
                  alt="Aravind Bala"
                  className="preloader-logo-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="preloader-ring-pulse" />
              </div>
            </div>

            {/* Kinetic Typography Name Reveal */}
            <div className="preloader-title-wrap">
              <h1 className="preloader-title">
                ARAVIND BALA
              </h1>
              <p className="preloader-subtitle">
                SOFTWARE DEVELOPER &bull; FULL-STACK
              </p>
            </div>

            {/* Progress Tracker & Numerical Counter */}
            <div className="preloader-progress-wrap">
              <div className="preloader-counter-row">
                <span className="preloader-status">
                  <span className="status-ping" />
                  INITIALIZING EXPERIENCE
                </span>
                <span className="preloader-number">
                  {String(progress).padStart(2, '0')}%
                </span>
              </div>

              {/* Progress Line Bar */}
              <div className="preloader-bar-track">
                <div
                  className="preloader-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
