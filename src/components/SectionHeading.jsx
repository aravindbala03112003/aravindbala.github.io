import { useEffect, useRef } from 'react';

export default function SectionHeading({ eyebrow, title, copy }) {
  const heading = useRef(null);

  useEffect(() => {
    const element = heading.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.add('visible');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="section-heading reveal" ref={heading}><p className="eyebrow"><span />{eyebrow}</p><h2>{title}</h2>{copy && <p className="heading-copy">{copy}</p>}</div>;
}
