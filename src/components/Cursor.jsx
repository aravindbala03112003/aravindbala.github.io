import { useEffect, useRef } from 'react';
import { rafThrottle } from '../utils/rafThrottle';

export default function Cursor() {
  const cursor = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    const move = rafThrottle(({ clientX, clientY }) => {
      if (cursor.current) cursor.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    });
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div className="cursor" ref={cursor} aria-hidden="true" />;
}
