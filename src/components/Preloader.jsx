import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setProgress((value) => Math.min(value + 5, 100)), 28);
    const done = window.setTimeout(() => setLoading(false), 720);
    return () => { window.clearInterval(timer); window.clearTimeout(done); };
  }, []);
  return (
    <AnimatePresence>
      {loading && (
        <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: .45 } }}>
          <div className="loader-mark">
            <img src={`${import.meta.env.BASE_URL}logo/portfolio-logo.png`} alt="Aravind Bala" className="loader-logo-img" />
            <i />
          </div>
          <p>Loading the work</p>
          <div className="loader-track">
            <motion.i animate={{ width: `${progress}%` }} />
          </div>
          <b>{progress}%</b>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
