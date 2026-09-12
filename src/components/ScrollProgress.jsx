import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (barRef.current) {
            const progress = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
            barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div className="scroll-progress" ref={barRef} style={{ transform: 'scaleX(0)' }} aria-hidden="true" />;
}
