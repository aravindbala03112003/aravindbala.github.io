import { useState, useEffect, useRef } from 'react';
import SectionHeading from '../components/SectionHeading';

const STATS_DATA = [
  {
    targetValue: 5,
    hasPlus: true,
    padDigits: 2,
    text: (
      <>
        Products designed
        <br />
        and developed
      </>
    ),
  },
  {
    targetValue: 10,
    hasPlus: true,
    padDigits: 2,
    text: (
      <>
        Technologies in
        <br />
        active practice
      </>
    ),
  },
  {
    targetValue: 5,
    hasPlus: false,
    padDigits: 2,
    text: (
      <>
        Months of professional
        <br />
        experience
      </>
    ),
  },
  {
    targetValue: null,
    hasPlus: false,
    text: (
      <>
        Curiosity to keep
        <br />
        learning
      </>
    ),
  },
];

export default function About() {
  const statsRef = useRef(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    let frameId = null;

    const startCountAnimation = () => {
      if (frameId) cancelAnimationFrame(frameId);

      setIsAnimating(true);

      // Support prefers-reduced-motion
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setCounts([5, 10, 5]);
        return;
      }

      const duration = 2000; // 2000ms smooth, deliberate count-up (1800-2200ms range)
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easeOutCubic curve
        const eased = 1 - Math.pow(1 - progress, 3);

        setCounts([
          Math.round(eased * 5),
          Math.round(eased * 10),
          Math.round(eased * 5),
        ]);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setCounts([5, 10, 5]);
          frameId = null;
        }
      };

      frameId = requestAnimationFrame(step);
    };

    const resetCountAnimation = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      setCounts([0, 0, 0]);
      setIsAnimating(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCountAnimation();
        } else {
          resetCountAnimation();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    // Section scroll parallax for 3-layer depth reveal
    let parallaxRaf = null;
    const handleAboutScroll = () => {
      const section = document.getElementById('about');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const h = window.innerHeight || 800;
      // Calculate progress from entering bottom to leaving top
      const totalDist = h + rect.height;
      const currentPos = h - rect.top;
      const progress = Math.max(-0.2, Math.min(1.2, currentPos / totalDist));

      const bgOffset = ((progress - 0.5) * -40).toFixed(1);
      const fgOffset = ((progress - 0.5) * 55).toFixed(1);

      section.style.setProperty('--about-parallax-bg', `${bgOffset}px`);
      section.style.setProperty('--about-parallax-fg', `${fgOffset}px`);
    };

    window.addEventListener('scroll', handleAboutScroll, { passive: true });
    handleAboutScroll();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
      window.removeEventListener('scroll', handleAboutScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="about" className="section about container">
      {/* Subtle 3D Depth Layer (Layer 1: Background Blueprint Grid & Prisms) */}
      <div className="about-3d-depth-stage" aria-hidden="true">
        <div className="about-3d-blueprint-grid" />
        <div className="about-depth-plane" />
        <span className="about-depth-shape ds-1" />
        <span className="about-depth-shape ds-2" />
      </div>

      {/* Layer 3: Foreground Floating Telemetry Glass Chips (Differential Scroll) */}
      <div className="about-floating-telemetry" aria-hidden="true">
        <div className="telemetry-chip chip-right">
          <span className="telemetry-dot dot-lime" />
          <span>🚀 Micro-Interactions & Fluid 3D UI</span>
        </div>
        <div className="telemetry-chip chip-bottom">
          <span className="telemetry-dot dot-purple" />
          <span>🔒 Zero-Trust Resilient APIs</span>
        </div>
      </div>

      <SectionHeading eyebrow="A little context" title={<>A developer who sees the<br />whole <em>picture.</em></>} />
      <div className="about-layout">
        <div className="about-statement reveal">
          <p>I care about the invisible details: the edge cases, the loading states, and the way a product feels in someone’s hands.</p>
          <a href="#contact" className="text-link">More about my approach <span>↗</span></a>
        </div>
        <div className="about-cards">
          <div className="value-card glass-tilt-card reveal">
            <div className="specular-sheen" />
            <span className="value-number">01</span>
            <div className="value-visual human-visual"><img src={`${import.meta.env.BASE_URL}images/about/human-first.svg`} alt="" aria-hidden="true" /></div>
            <h3>Human first</h3>
            <p>Technology should make the complicated feel natural. I design and build around that belief.</p>
          </div>
          <div className="value-card glass-tilt-card reveal">
            <div className="specular-sheen" />
            <span className="value-number">02</span>
            <div className="value-visual systems-visual"><img src={`${import.meta.env.BASE_URL}images/about/built-to-last.svg`} alt="" aria-hidden="true" /></div>
            <h3>Built to last</h3>
            <p>Clean architecture and intentional systems keep a good product good as it grows.</p>
          </div>
        </div>
      </div>
      <div ref={statsRef} className="stats-band reveal">
        {STATS_DATA.map((item, index) => {
          if (item.targetValue === null) {
            return (
              <div key="infinity">
                <strong className={`stat-infinity ${isAnimating ? 'is-active' : ''}`}>∞</strong>
                <p>{item.text}</p>
              </div>
            );
          }

          const currentNumber = counts[index];
          const formattedNumber = String(currentNumber).padStart(item.padDigits || 2, '0');

          return (
            <div key={index}>
              <strong>
                {formattedNumber}
                {item.hasPlus && <span>+</span>}
              </strong>
              <p>{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
