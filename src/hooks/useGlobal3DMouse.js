import { useEffect } from 'react';

/**
 * useGlobal3DMouse
 * Extremely lightweight, passive mouse depth tracker.
 * Sets CSS custom properties on document.documentElement:
 *  --mouse-3d-x: normalized from -1 (left) to +1 (right)
 *  --mouse-3d-y: normalized from -1 (top) to +1 (bottom)
 *  --mouse-3d-px: pixel delta from center (-15px to +15px)
 *  --mouse-3d-py: pixel delta from center (-15px to +15px)
 *
 * Runs strictly inside requestAnimationFrame with silky damping.
 * Causes ZERO React re-renders.
 * Automatically disabled on touch / mobile devices and when prefers-reduced-motion is active.
 */
export function useGlobal3DMouse() {
  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currX = 0;
    let currY = 0;
    let rafId = null;
    let isRunning = false;

    const root = document.documentElement;

    const update3D = () => {
      // Gentle damping factor (0.08) for silky cinematic lag
      currX += (targetX - currX) * 0.08;
      currY += (targetY - currY) * 0.08;

      // Update CSS variables with subtle, controlled degree bounds (-3deg to +3deg)
      const tiltX = (currX * 2.8).toFixed(2); // degrees
      const tiltY = (currY * 2.8).toFixed(2); // degrees

      root.style.setProperty('--mouse-3d-x', currX.toFixed(3));
      root.style.setProperty('--mouse-3d-y', currY.toFixed(3));
      root.style.setProperty('--mouse-3d-px', `${(currX * 12).toFixed(1)}px`);
      root.style.setProperty('--mouse-3d-py', `${(currY * 12).toFixed(1)}px`);
      root.style.setProperty('--mouse-tilt-x', `${tiltX}deg`);
      root.style.setProperty('--mouse-tilt-y', `${tiltY}deg`);

      if (Math.abs(targetX - currX) > 0.001 || Math.abs(targetY - currY) > 0.001) {
        rafId = requestAnimationFrame(update3D);
      } else {
        isRunning = false;
      }
    };

    const handlePointerMove = (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetX = ((e.clientX / w) - 0.5) * 2; // -1 to +1
      targetY = ((e.clientY / h) - 0.5) * 2; // -1 to +1

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(update3D);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
      root.style.removeProperty('--mouse-3d-x');
      root.style.removeProperty('--mouse-3d-y');
      root.style.removeProperty('--mouse-3d-px');
      root.style.removeProperty('--mouse-3d-py');
      root.style.removeProperty('--mouse-tilt-x');
      root.style.removeProperty('--mouse-tilt-y');
    };
  }, []);
}
