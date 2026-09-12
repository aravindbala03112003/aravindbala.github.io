import { useState, useEffect, useRef } from 'react';
import { openContactForm } from '../utils/contactNavigation';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from '../components/Icons';
import { useSound } from '../context/SoundContext';
import HeroConstellation3D from '../components/HeroConstellation3D';
import ResumePreviewModal from '../components/ResumePreviewModal';
import { downloadResumePdf } from '../utils/resumeDownload';
import aravindCinematicHero from '../assets/images/aravind-cinematic-hero.jpg';

export default function Hero() {
  const { playSynthSound } = useSound();
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    let rafId = null;
    const handleScroll = () => {
      if (!heroRef.current) return;
      const h = window.innerHeight || 800;
      const scrollY = window.scrollY || 0;
      if (scrollY > h * 1.2) return; // Stop processing once far past hero

      const progress = Math.min(1, Math.max(0, scrollY / h));
      const dollyZ = (progress * 80).toFixed(1);
      const gridScale = (1 + progress * 0.18).toFixed(3);
      const opacity = (1 - progress * 0.45).toFixed(3);

      heroRef.current.style.setProperty('--hero-dolly-z', `${dollyZ}px`);
      heroRef.current.style.setProperty('--hero-grid-scale', gridScale);
      heroRef.current.style.setProperty('--hero-scroll-opacity', opacity);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleResumeClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isDownloading) return; // Prevent duplicate download calls
    setIsDownloading(true);

    try {
      playSynthSound('pop');
    } catch (_) {}

    // 1. Immediately open the resume preview overlay
    setResumePreviewOpen(true);

    // 2. Programmatically download the actual resume PDF (native Android bridge inside APK or browser fallback)
    downloadResumePdf();

    // 3. Reset download state after animation finishes
    setTimeout(() => {
      setIsDownloading(false);
    }, 1100);
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      <HeroConstellation3D />
      <div className="hero-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      {/* Volumetric Deep Space Fog Plane */}
      <div className="hero-3d-deep-fog" aria-hidden="true" />

      {/* 3D Atmospheric Orbital Rings (Decorative Non-Destructive Layer) */}
      <div className="hero-3d-orbital-container" aria-hidden="true">
        <div className="hero-3d-orbital-ring hero-3d-ring-primary" />
        <div className="hero-3d-orbital-ring hero-3d-ring-secondary" />
        <div className="hero-3d-orbital-ring hero-3d-ring-accent" />
      </div>

      {/* Perspective Horizon Floor Grid */}
      <div className="hero-3d-perspective-grid" aria-hidden="true" />

      {/* Large Cinematic Developer Photo Composition */}
      <div className="hero-cinematic-developer-stage" aria-hidden="true">
        {/* Ambient Backlight Rim Lighting */}
        <div className="hero-dev-glow dev-glow-blue" />
        <div className="hero-dev-glow dev-glow-cyan" />
        <div className="hero-dev-glow dev-glow-lime" />

        {/* Environmental Floating Dust Particles */}
        <div className="hero-dev-particles">
          <span className="dev-particle dp1" />
          <span className="dev-particle dp2" />
          <span className="dev-particle dp3" />
          <span className="dev-particle dp4" />
        </div>

        {/* Floating Spatial Tech Accent Badges */}
        <div className="hero-3d-tech-badge tech-badge-left">
          <span className="badge-pulse" />
          <code>sys.online</code>
        </div>
        <div className="hero-3d-tech-badge tech-badge-right">
          <code>precision.built</code>
        </div>

        {/* Seamless Edge-Blended Photo Container */}
        <div className="hero-dev-photo-wrap">
          <img
            src={aravindCinematicHero}
            alt="Aravind Bala — Software Developer"
            className="hero-dev-photo-img"
            loading="eager"
            fetchPriority="high"
          />
          {/* Seamless Multi-Stop Atmospheric Vignette Overlay */}
          <div className="hero-dev-vignette-overlay" />
          <div className="hero-dev-laptop-reflection" />
        </div>
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-intro"><span />Available for new opportunities</p>
          <h1>Interfaces with<br /><em>intent</em>, code with<br />character<span className="period">.</span></h1>
          <p className="hero-description">I’m <b>Aravind Bala</b>, a software developer building clear, resilient products where thoughtful interaction meets practical engineering.</p>
          <div className="hero-buttons">
            <a className="button button-primary aurora-btn" href="#work" onClick={() => playSynthSound('whoosh')}>
              Explore selected work <ArrowUpRight />
            </a>
            <a
              className={`button button-ghost futuristic-resume-btn ${isDownloading ? 'is-downloading' : ''}`}
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              download="Aravind_Bala_Resume.pdf"
              onClick={handleResumeClick}
              aria-label="Download Aravind Bala Resume PDF and open preview"
              role="button"
            >
              {/* Circuit Glow Border (Moving Energy Gradient) */}
              <span className="hud-border-circuit" aria-hidden="true" />

              {/* Diagonal Neon Light Sweep */}
              <span className="hud-light-sweep" aria-hidden="true" />

              {/* Ambient Floating Micro-Particles */}
              <span className="hud-particles" aria-hidden="true">
                <span className="hud-particle p1" />
                <span className="hud-particle p2" />
                <span className="hud-particle p3" />
              </span>

              {/* Button Label */}
              <span className="hud-btn-text">Download Resume</span>

              {/* Bottom Glowing Energy Circuit Line */}
              <span className="hud-energy-bar" aria-hidden="true">
                <span className="hud-energy-core" />
              </span>

              {/* Futuristic Animated Download Icon / Circular Progress Ring */}
              <span className="hud-icon-wrapper" aria-hidden="true">
                {isDownloading ? (
                  <svg className="hud-download-spinner" viewBox="0 0 24 24" fill="none">
                    <circle className="hud-spinner-track" cx="12" cy="12" r="9" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="2" />
                    <circle className="hud-spinner-bar" cx="12" cy="12" r="9" stroke="url(#hud-spinner-grad)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="56.5" strokeDashoffset="18" />
                    <defs>
                      <linearGradient id="hud-spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#8b6cff" />
                        <stop offset="100%" stopColor="#d5ff6e" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <span className="hud-icon-container">
                    <svg className="hud-energy-ring" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="11" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="3 3.5" />
                      <circle className="hud-ring-pulsar" cx="14" cy="14" r="11" stroke="url(#hud-ring-grad)" strokeWidth="1.2" strokeDasharray="7 18" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="hud-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#8b6cff" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <svg className="hud-download-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path className="hud-arrow" d="M12 3v10m0 0l-3.5-3.5m3.5 3.5l3.5-3.5" />
                      <path className="hud-tray" d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                    </svg>

                    <span className="hud-spark" />
                  </span>
                )}
              </span>
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-social">
            <a href="https://github.com/ARAVINDBALA3" target="_blank" rel="noreferrer" className="glass-social-pill" onClick={() => playSynthSound('pop')} aria-label="GitHub">
              <Github /> <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/aravind-bala-8aa3233a1" target="_blank" rel="noreferrer" className="glass-social-pill" onClick={() => playSynthSound('pop')} aria-label="LinkedIn">
              <Linkedin /> <span>LinkedIn</span>
            </a>
            <a href="#contact" className="glass-social-pill" onClick={(e) => { e.preventDefault(); playSynthSound('pop'); openContactForm({ focus: true }); }} aria-label="Email Aravind">
              <Mail /> <span>Email</span>
            </a>
          </div>
          <div className="scroll-prompt-wrapper">
            <a href="#about" className="scroll-prompt" onClick={() => playSynthSound('whoosh')}>
              Scroll to discover <span className="scroll-prompt-arrow"><ArrowDown /></span>
            </a>
          </div>
        </div>
      </div>

      {/* Center-Bottom Floating Resume Preview Overlay */}
      <ResumePreviewModal
        isOpen={resumePreviewOpen}
        onClose={() => setResumePreviewOpen(false)}
      />
    </section>
  );
}
