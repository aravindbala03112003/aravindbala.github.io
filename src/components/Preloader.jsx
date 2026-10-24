import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLoading(false);
      return;
    }

    // Check if user already saw preloader in this tab session
    const hasLoaded = sessionStorage.getItem('portfolio-session-preloaded');
    const targetDuration = hasLoaded ? 400 : 900;
    const intervalTime = hasLoaded ? 16 : 28;

    let currentVal = 0;
    const timer = setInterval(() => {
      currentVal += hasLoaded ? 8 : 4;
      if (currentVal >= 100) {
        currentVal = 100;
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          setLoading(false);
          try {
            sessionStorage.setItem('portfolio-session-preloaded', 'true');
          } catch (_) {}
        }, 180);
      } else {
        setProgress(currentVal);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          className="preloader-cinematic"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Background Ambient Grid & Glow */}
          <div className="preloader-bg-ambient" aria-hidden="true" />

          <div className="preloader-content">
            {/* Top Monogram Mark */}
            <motion.div
              className="preloader-monogram"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="preloader-logo-ring">
                <img
                  src={`${import.meta.env.BASE_URL}logo/portfolio-logo.png`}
                  alt="Aravind Bala"
                  className="preloader-logo-img"
                />
                <span className="preloader-ring-pulse" />
              </div>
            </motion.div>

            {/* Kinetic Typography Name Reveal */}
            <div className="preloader-title-wrap">
              <motion.h1
                className="preloader-title"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                ARAVIND BALA
              </motion.h1>
              <motion.p
                className="preloader-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                SOFTWARE DEVELOPER &bull; FULL-STACK
              </motion.p>
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
                <motion.div
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
