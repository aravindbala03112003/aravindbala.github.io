import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MAIN_TITLE = "ARAVIND BALA - SOFTWARE DEVELOPER";
const SECONDARY_ROLES = ["WEB DEVELOPER", "MOBILE APP DEVELOPER"];

export default function SelfIntroModal({ open, onClose }) {
  const videoRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleFading, setSubtitleFading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing & Alternating Title Lifecycle
  useEffect(() => {
    if (!open) {
      setTypedText("");
      setIsTypingDone(false);
      setRoleIndex(0);
      setSubtitleVisible(false);
      setSubtitleFading(false);
      setVideoLoaded(false);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          videoRef.current.removeAttribute('src');
          videoRef.current.load();
        } catch (_) {}
      }
      return;
    }

    // Play video with autoplay handling
    const startPlay = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
        } catch (err) {
          // Autoplay policy fallback: user can click native play controls
        }
      }
    };
    const playTimer = setTimeout(startPlay, 150);

    // If reduced motion is requested, show full text immediately without typing
    if (prefersReducedMotion) {
      setTypedText(MAIN_TITLE);
      setIsTypingDone(true);
      setSubtitleVisible(true);
      return () => clearTimeout(playTimer);
    }

    // Step 1: Smooth Typewriter Effect for Main Title (ONCE ONLY)
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      charIndex++;
      setTypedText(MAIN_TITLE.slice(0, charIndex));
      if (charIndex >= MAIN_TITLE.length) {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 65);

    // Cleanup typing and video start
    return () => {
      clearTimeout(playTimer);
      clearInterval(typingInterval);
    };
  }, [open, prefersReducedMotion]);

  // Step 2: Once Main Title typing is done, reveal Subtitle and start alternating loop
  useEffect(() => {
    if (!open || !isTypingDone || prefersReducedMotion) return;

    let subtitleTimer;
    let loopInterval;

    // Reveal the first subtitle "WEB DEVELOPER" after typing settles
    subtitleTimer = setTimeout(() => {
      setSubtitleVisible(true);

      // Start alternating between WEB DEVELOPER and MOBILE APP DEVELOPER
      loopInterval = setInterval(() => {
        setSubtitleFading(true);
        setTimeout(() => {
          setRoleIndex((prev) => (prev + 1) % SECONDARY_ROLES.length);
          setSubtitleFading(false);
        }, 400);
      }, 3000);
    }, 600);

    return () => {
      clearTimeout(subtitleTimer);
      clearInterval(loopInterval);
    };
  }, [open, isTypingDone, prefersReducedMotion]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent background scrolling while modal is active
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="self-intro-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Self Introduction Video"
    >
      {/* Atmosphere Glow Accents */}
      <div className="self-intro-backdrop-glow cyan" aria-hidden="true" />
      <div className="self-intro-backdrop-glow blue" aria-hidden="true" />

      {/* Main Centered Modal Window */}
      <div
        className="self-intro-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Refined Close Button */}
        <button
          type="button"
          className="self-intro-close-btn"
          onClick={onClose}
          aria-label="Close self intro video"
          title="Close (ESC)"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Cinematic Header Typography */}
        <header className="self-intro-header">
          {/* Main Title: Types ONCE */}
          <h2 className="self-intro-main-title">
            <span className="self-intro-title-text">{typedText}</span>
            {!isTypingDone && !prefersReducedMotion && (
              <span className="self-intro-cursor" aria-hidden="true">|</span>
            )}
          </h2>

          {/* Subtitle: WEB DEVELOPER <-> MOBILE APP DEVELOPER Alternating Loop */}
          <div
            className={`self-intro-subtitle-wrap ${subtitleVisible ? 'is-visible' : ''} ${
              subtitleFading ? 'is-fading' : ''
            }`}
          >
            <span className="self-intro-subtitle-text">
              {SECONDARY_ROLES[roleIndex]}
            </span>
          </div>
        </header>

        {/* Video Presentation Stage */}
        <div className="self-intro-video-stage">
          <div className="self-intro-video-frame">
            {/* Corner Decorative Tech Brackets */}
            <span className="self-intro-corner tl" aria-hidden="true" />
            <span className="self-intro-corner tr" aria-hidden="true" />
            <span className="self-intro-corner bl" aria-hidden="true" />
            <span className="self-intro-corner br" aria-hidden="true" />

            {/* Subtle traveling edge illumination line */}
            <span className="self-intro-frame-glow" aria-hidden="true" />

            {/* Video Player Loading State / Glass Backing */}
            {!videoLoaded && (
              <div className="self-intro-video-placeholder" aria-hidden="true">
                <div className="self-intro-loader-spinner" />
              </div>
            )}

            {/* Authentic Self-Introduction Video */}
            <video
              ref={videoRef}
              className="self-intro-video-element"
              src={open ? "/self-intro/aravind%20v2.mp4" : undefined}
              controls
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlay={() => setVideoLoaded(true)}
              aria-label="Aravind Bala Software Developer Introduction Video"
            >
              <track kind="captions" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
