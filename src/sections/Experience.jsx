import { useState, useEffect, useRef } from 'react';
import SectionHeading from '../components/SectionHeading';
import TimelineDocBtn from '../components/TimelineDocBtn';
import TimelineModal from '../components/TimelineModal';
import { useSound } from '../context/SoundContext';
import { timeline } from '../data/portfolio';

export default function Experience() {
  const { playSynthSound } = useSound();
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const beamRef = useRef(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const activeItemIndexRef = useRef(0);
  const isVisibleRef = useRef(true);

  const handleSelect = (item) => {
    playSynthSound('document');
    setSelected(item);
  };

  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      if (beamRef.current) {
        beamRef.current.style.setProperty('--beam-scale', '1');
      }
      setActiveItemIndex(timeline.length - 1);
      activeItemIndexRef.current = timeline.length - 1;
      return;
    }

    const section = sectionRef.current;
    const container = containerRef.current;
    if (!container || !section) return;

    // 1. IntersectionObserver: Pause scroll computations when timeline is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '150px 0px 150px 0px' }
    );
    observer.observe(section);

    let rafId = null;

    const handleScroll = () => {
      if (!isVisibleRef.current) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Focus anchor point around 54% of viewport height for comfortable natural reading
      const triggerPoint = viewportHeight * 0.54;
      const startY = rect.top;
      const totalHeight = rect.height;

      if (totalHeight <= 0) return;

      // Calculate progress through the timeline
      const rawProgress = (triggerPoint - startY) / (totalHeight - 40);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      // Direct GPU transform update on central beam line (ZERO continuous React re-renders)
      if (beamRef.current) {
        const scale = Math.max(0.04, Math.min(1.0, clampedProgress));
        beamRef.current.style.setProperty('--beam-scale', scale.toFixed(4));
      }

      // Discrete milestone calculation (at most 5 updates total across entire section)
      const numItems = timeline.length;
      const step = 1 / numItems;
      const currentIndex = Math.min(numItems - 1, Math.max(0, Math.floor(clampedProgress / step)));

      if (currentIndex !== activeItemIndexRef.current) {
        activeItemIndexRef.current = currentIndex;
        setActiveItemIndex(currentIndex);
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="experience" className="section experience" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          eyebrow="The path so far"
          title={
            <>
              Learning in public.
              <br />
              <em>Growing with intent.</em>
            </>
          }
        />

        {/* Holographic Interactive Timeline */}
        <div className="timeline holographic-timeline" ref={containerRef}>
          {/* Static Guide Track */}
          <div className="cyber-beam-track" aria-hidden="true" />

          {/* Progressive Scroll-Synchronized Glowing Energy Beam (GPU scaleY) */}
          <div
            ref={beamRef}
            className="cyber-beam-fill"
            aria-hidden="true"
          >
            <div className="cyber-beam-pulse-head" />
          </div>

          {timeline.map((item, index) => {
            const isPassed = index <= activeItemIndex;
            const isActive = index === activeItemIndex;

            return (
              <div
                className={`timeline-item cyber-timeline-item ${isPassed ? 'is-passed' : 'is-pending'} ${
                  isActive ? 'is-active' : ''
                }`}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`${item.year} - ${item.title}`}
                key={item.title}
              >
                <p className="timeline-year">{item.year}</p>

                {/* Circular Energy Node with Radial Glow (Always Centered) */}
                <div className="cyber-node-wrapper" aria-hidden="true">
                  <i className="cyber-node" />
                  <span className="cyber-node-ring" />
                </div>

                {/* Content Card with Subtle Depth & Document Button */}
                <div className="timeline-card-content">
                  <h3>{item.title}</h3>
                  <span className="timeline-place">{item.place}</span>
                  <TimelineDocBtn
                    index={index}
                    onClick={() => handleSelect(item)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="hire-block reveal">
          <p className="eyebrow">
            <span />
            What I bring
          </p>
          <div>
            {['Problem solver', 'Clean systems', 'Fast learner', 'Team mindset'].map((item) => (
              <p key={item}>
                {item}
                <b>↗</b>
              </p>
            ))}
          </div>
        </div>
      </div>
      <TimelineModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

