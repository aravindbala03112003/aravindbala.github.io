import { useState, useEffect, useRef } from 'react';
import { openContactForm } from '../utils/contactNavigation';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from '../components/Icons';
import { useSound } from '../context/SoundContext';
import HeroScene3D from '../components/HeroScene3D';
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
      if (scrollY > h * 1.3) return; // Stop processing once past hero

      const progress = Math.min(1, Math.max(0, scrollY / h));
      const dollyZ = (progress * 75).toFixed(1);
      const gridScale = (1 + progress * 0.16).toFixed(3);
      const opacity = (1 - progress * 0.5).toFixed(3);

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
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      playSynthSound('pop');
    } catch (_) {}

    // Open resume preview overlay
    setResumePreviewOpen(true);

    // Download actual resume PDF
    downloadResumePdf();

    setTimeout(() => {
      setIsDownloading(false);
    }, 1100);
  };

  const handleDownloadApk = (e) => {
    try {
      playSynthSound('click');
    } catch (_) {}
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}aravindbala-portfolio.apk`;
    link.download = 'aravindbala-portfolio.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Central Interactive 3D WebGL Scene */}
      <HeroScene3D />

      <div className="hero-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      {/* Volumetric Deep Space Fog Plane */}
      <div className="hero-3d-deep-fog" aria-hidden="true" />

      {/* 3D Atmospheric Orbital Rings Layer */}
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
          <div className="hero-dev-vignette-overlay" />
          <div className="hero-dev-laptop-reflection" />
        </div>
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-intro">
            <span />Available for new opportunities &bull; Puducherry, India
          </p>

          <h1 className="hero-kinetic-title">
            <span className="hero-title-name">Aravind Bala</span>
            <span className="period">.</span>
            <br />
            <em className="hero-title-role">Software Developer</em>
          </h1>

          <p className="hero-description">
            Interfaces with intent, code with character. I’m <b>Aravind Bala</b>, a software developer building clear, resilient web, mobile, and full-stack applications where thoughtful interaction meets practical engineering.
          </p>

          {/* Primary Calls to Action */}
          <div className="hero-buttons">
            <a
              className="button button-primary aurora-btn"
              href="#work"
              onClick={() => playSynthSound('whoosh')}
            >
              Explore selected work <ArrowUpRight />
            </a>

            <button
              className="button button-secondary hero-contact-btn"
              onClick={(e) => {
                e.preventDefault();
                playSynthSound('pop');
                openContactForm({ focus: true });
              }}
              aria-label="Contact Me — Send message to Aravind Bala"
            >
              <Mail /> Contact Me
            </button>

            {/* Futuristic Download Resume Button */}
            <a
              className={`button button-ghost futuristic-resume-btn ${isDownloading ? 'is-downloading' : ''}`}
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              download="Aravind_Bala_Resume.pdf"
              onClick={handleResumeClick}
              aria-label="Download Resume — PDF and preview"
              role="button"
            >
              <span className="hud-border-circuit" aria-hidden="true" />
              <span className="hud-light-sweep" aria-hidden="true" />
              <span className="hud-btn-text">Download Resume</span>
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
                  <svg className="hud-download-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path className="hud-arrow" d="M12 3v10m0 0l-3.5-3.5m3.5 3.5l3.5-3.5" />
                    <path className="hud-tray" d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
                  </svg>
                )}
              </span>
            </a>

            {/* Direct Download Android APK Button */}
            <button
              className="button button-ghost hero-apk-btn"
              onClick={handleDownloadApk}
              aria-label="Download APK — Standalone Android App"
            >
              <svg className="apk-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0001 0-.5515.4482-.9997.9993-.9997.5512 0 .9997.4482.9997.9997 0 .5515-.4485 1.0001-.9997 1.0001m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0001 0-.5515.4482-.9997.9993-.9997.5512 0 .9997.4482.9997.9997 0 .5515-.4485 1.0001-.9997 1.0001m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8533 8.08 12 8.08s-3.5902.331-5.1368.8707L4.8409 5.4477a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span>Download APK</span>
            </button>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="hero-social">
            <a
              href="https://github.com/ARAVINDBALA3"
              target="_blank"
              rel="noreferrer"
              className="glass-social-pill"
              onClick={() => playSynthSound('pop')}
              aria-label="GitHub"
            >
              <Github /> <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/aravind-bala-8aa3233a1"
              target="_blank"
              rel="noreferrer"
              className="glass-social-pill"
              onClick={() => playSynthSound('pop')}
              aria-label="LinkedIn"
            >
              <Linkedin /> <span>LinkedIn</span>
            </a>
            <a
              href="#contact"
              className="glass-social-pill"
              onClick={(e) => {
                e.preventDefault();
                playSynthSound('pop');
                openContactForm({ focus: true });
              }}
              aria-label="Email Aravind"
            >
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
