import React, { useRef, useState, useEffect, Suspense } from 'react';

export default function LazyHydrate({ children, placeholder = null, rootMargin = '300px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      }, { rootMargin });
      io.observe(ref.current);
      return () => io.disconnect();
    }
    // fallback to immediate
    setInView(true);
  }, [rootMargin]);

  return <div ref={ref}>{inView ? <Suspense fallback={placeholder}>{children}</Suspense> : placeholder}</div>;
}
