import { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import SectionHeading from '../components/SectionHeading';
import { useSound } from '../context/SoundContext';

const slidesData = [
  [
    {
      id: '01',
      number: '01',
      quote: 'A calm, thoughtful builder who makes complex work feel manageable.',
      source: 'COLLABORATION NOTE',
    },
    {
      id: '02',
      number: '02',
      quote: 'Clear communication, a strong learning mindset, and real care for the craft.',
      source: 'MENTOR PERSPECTIVE',
    },
  ],
  [
    {
      id: '03',
      number: '03',
      quote: 'Brings curiosity to every challenge and turns ideas into thoughtful, practical solutions.',
      source: 'PROJECT PARTNER',
    },
    {
      id: '04',
      number: '04',
      quote: 'Reliable, adaptable, and always focused on building work that feels purposeful and refined.',
      source: 'COMING SOON',
    },
  ],
];

/* --------------------------------------------------------------------------
   BESPOKE 3D BACKGROUND LAYER (Visual-Only, Pointer-Events: None)
   -------------------------------------------------------------------------- */
function Testimonial3DBackground({ id }) {
  return (
    <div className={`testimonial-3d-bg testimonial-3d-bg-${id}`} aria-hidden="true">
      {/* Deep Spatial Gradient Base */}
      <div className="bg-spatial-gradient" />

      {/* Internal Motion Stage — Moves ONLY internal layers, never outer card */}
      <div className="bg-motion-stage">
        {/* CARD 01: Atmospheric 3D Depth Field */}
        {id === '01' && (
          <div className="card01-spatial-env">
            {/* Soft pulsing light core */}
            <div className="card01-light-core" />

            {/* 3D Perspective Grid Horizon */}
            <div className="card01-horizon-grid" />

            {/* Faint Concentric Depth Geometry */}
            <div className="card01-depth-rings">
              <span className="depth-ring ring-1" />
              <span className="depth-ring ring-2" />
            </div>

            {/* Floating 3D Depth Particles */}
            <div className="card01-particles">
              <span className="c01-particle cp1" />
              <span className="c01-particle cp2" />
              <span className="c01-particle cp3" />
              <span className="c01-particle cp4" />
            </div>
          </div>
        )}

        {/* CARD 02: Subtle 3D Orbit & Energy Ring */}
        {id === '02' && (
          <div className="card02-spatial-env">
            {/* 3D Perspective Orbit System */}
            <div className="card02-orbit-wrap">
              <svg className="card02-orbit-svg" viewBox="0 0 160 160" aria-hidden="true">
                <defs>
                  <linearGradient id="orbitGrad02" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d5ff6e" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#75a7ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#d5ff6e" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="orbitGlow02" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Orbital Plane Track */}
                <ellipse cx="80" cy="80" rx="60" ry="34" className="c02-orbit-track" />
                <ellipse cx="80" cy="80" rx="60" ry="34" className="c02-orbit-arc" filter="url(#orbitGlow02)" />
                {/* Floating Orbit Node */}
                <circle cx="80" cy="46" r="3.2" className="c02-orbit-node" />
                <circle cx="130" cy="92" r="2" className="c02-orbit-node-secondary" />
              </svg>
            </div>

            {/* Slow Traveling Depth Sheen */}
            <div className="card02-traveling-light" />

            {/* Ambient Lime Astral Field */}
            <div className="card02-astral-glow" />
          </div>
        )}

        {/* CARD 03: Flowing Depth Field & Connected Point Network */}
        {id === '03' && (
          <div className="card03-spatial-env">
            {/* Ambient Cyan Depth Glow */}
            <div className="card03-cyan-glow" />

            {/* Connected Constellation Vector Mesh (SVG 3D Perspective) */}
            <div className="card03-constellation-wrap">
              <svg className="card03-constellation-svg" viewBox="0 0 240 180" aria-hidden="true">
                <defs>
                  <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7ef2e6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#75a7ff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Connecting Depth Vectors */}
                <line x1="40" y1="45" x2="110" y2="70" className="c03-link l1" />
                <line x1="110" y1="70" x2="190" y2="40" className="c03-link l2" />
                <line x1="110" y1="70" x2="150" y2="125" className="c03-link l3" />
                <line x1="40" y1="45" x2="80" y2="135" className="c03-link l4" />
                <line x1="80" y1="135" x2="150" y2="125" className="c03-link l5" />
                <line x1="150" y1="125" x2="210" y2="115" className="c03-link l6" />

                {/* Spatial Constellation Nodes */}
                <circle cx="40" cy="45" r="2.5" className="c03-node n1" />
                <circle cx="110" cy="70" r="3.2" className="c03-node n2" />
                <circle cx="190" cy="40" r="2.2" className="c03-node n3" />
                <circle cx="80" cy="135" r="2.4" className="c03-node n4" />
                <circle cx="150" cy="125" r="2.8" className="c03-node n5" />
                <circle cx="210" cy="115" r="2" className="c03-node n6" />
              </svg>
            </div>

            {/* Depth Flow Stream */}
            <div className="card03-depth-stream" />
          </div>
        )}

        {/* CARD 04: Minimal Orbital & Light-Field Environment */}
        {id === '04' && (
          <div className="card04-spatial-env">
            {/* Ambient Purple Nebula Glow */}
            <div className="card04-nebula-glow" />

            {/* Nested Minimal Orbital Rings */}
            <div className="card04-orbits-wrap">
              <svg className="card04-orbits-svg" viewBox="0 0 180 180" aria-hidden="true">
                <defs>
                  <linearGradient id="purpleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b28cff" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#75a7ff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Concentric Elliptical Orbits at 3D Angle */}
                <ellipse cx="90" cy="90" rx="72" ry="38" className="c04-ring outer-ring" />
                <ellipse cx="90" cy="90" rx="48" ry="25" className="c04-ring inner-ring" />
                {/* Orbital Nodes */}
                <circle cx="152" cy="76" r="2.8" className="c04-node nd1" />
                <circle cx="48" cy="98" r="2" className="c04-node nd2" />
              </svg>
            </div>

            {/* Ethereal Depth Floating Points */}
            <div className="card04-floating-nodes">
              <span className="c04-star s1" />
              <span className="c04-star s2" />
              <span className="c04-star s3" />
              <span className="c04-star s4" />
            </div>
          </div>
        )}
      </div>

      {/* Subtle Radial Cursor Follower inside Background */}
      <div className="bg-cursor-radial" />
    </div>
  );
}

/* --------------------------------------------------------------------------
   TESTIMONIAL CARD COMPONENT (Stable Outer Hitbox + Independent Background)
   -------------------------------------------------------------------------- */
function TestimonialCard({ item }) {
  const cardRef = useRef(null);
  const mousePos = useRef({ currX: 0, currY: 0, targetX: 0, targetY: 0 });
  const rafId = useRef(null);
  const isHoveredRef = useRef(false);

  // Smooth interpolation loop (shifts ONLY inner background layers, outer card is 100% stationary)
  const updatePosition = useCallback(() => {
    const { currX, currY, targetX, targetY } = mousePos.current;
    const nextX = currX + (targetX - currX) * 0.1;
    const nextY = currY + (targetY - currY) * 0.1;
    mousePos.current.currX = nextX;
    mousePos.current.currY = nextY;

    if (cardRef.current) {
      cardRef.current.style.setProperty('--bg-offset-x', `${nextX.toFixed(2)}px`);
      cardRef.current.style.setProperty('--bg-offset-y', `${nextY.toFixed(2)}px`);
    }

    if (isHoveredRef.current || Math.abs(nextX - targetX) > 0.1 || Math.abs(nextY - targetY) > 0.1) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    isHoveredRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Constrain offset range to gentle subtle depth movement (-10px to +10px)
    mousePos.current.targetX = Math.max(-10, Math.min(10, (x / (rect.width / 2)) * 10));
    mousePos.current.targetY = Math.max(-10, Math.min(10, (y / (rect.height / 2)) * 10));

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updatePosition);
  };

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mousePos.current.targetX = Math.max(-10, Math.min(10, (x / (rect.width / 2)) * 10));
    mousePos.current.targetY = Math.max(-10, Math.min(10, (y / (rect.height / 2)) * 10));

    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updatePosition);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    // Smoothly glide background back to neutral center (0, 0)
    mousePos.current.targetX = 0;
    mousePos.current.targetY = 0;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className={`quote-card testimonial-card card-effect-${item.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Background Layer: Isolated Behind Content, Pointer-Events: None, Z-Index: 1 */}
      <Testimonial3DBackground id={item.id} />

      {/* Static Razor-Sharp Content: Z-Index: 5, Pointer-Events: Auto, Never Wobbles */}
      <span className="quote-number">{item.number}</span>
      <blockquote>“{item.quote}”</blockquote>
      <p className="quote-label">{item.source}</p>

      {/* Physical Crisp Card Border Frame: Z-Index: 10, Pointer-Events: None, 100% Stable */}
      <div className="card-border" aria-hidden="true" />
    </article>
  );
}

/* --------------------------------------------------------------------------
   TESTIMONIALS SECTION MAIN
   -------------------------------------------------------------------------- */
export default function Testimonials() {
  const { playSynthSound } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handlePrev = () => {
    playSynthSound('pop');
    if (!swiperRef.current) return;
    if (swiperRef.current.activeIndex === 0) {
      swiperRef.current.slideTo(slidesData.length - 1);
    } else {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    playSynthSound('pop');
    if (!swiperRef.current) return;
    if (swiperRef.current.activeIndex >= slidesData.length - 1) {
      swiperRef.current.slideTo(0);
    } else {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <SectionHeading
          eyebrow="In collaboration"
          title={
            <>
              Kind words, when
              <br />
              <em>the work speaks.</em>
            </>
          }
        />

        <div className="testimonial-carousel-wrapper">
          {/* Previous Slide Button: Always active, high z-index, never stuck */}
          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-prev"
            onClick={handlePrev}
            aria-label="Previous testimonial slide"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="testimonial-slider-container">
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet testimonial-pagination-dot',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              speed={550}
              className="testimonial-swiper"
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveIndex(swiper.activeIndex || 0);
              }}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex || 0);
              }}
            >
              {slidesData.map((pair, slideIdx) => (
                <SwiperSlide key={slideIdx}>
                  <div className="testimonial-slide-grid">
                    {pair.map((item) => (
                      <TestimonialCard key={item.number} item={item} />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Next Slide Button: Always active, high z-index, never stuck */}
          <button
            type="button"
            className="testimonial-nav-btn testimonial-nav-next"
            onClick={handleNext}
            aria-label="Next testimonial slide"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

