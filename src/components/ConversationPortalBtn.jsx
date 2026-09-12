import { useState, useRef, useEffect, useCallback } from 'react';

export default function ConversationPortalBtn({ onClick }) {
  const btnRef = useRef(null);
  const mousePos = useRef({ currX: 78, currY: 78, targetX: 78, targetY: 78 });
  const rafId = useRef(null);
  const isHoveredRef = useRef(false);

  // Typing animation for "Let's talk"
  const fullText = "Let's talk";
  const [displayedText, setDisplayedText] = useState(fullText);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setDisplayedText(fullText);
        return;
      }
    }

    let timeoutId;
    let textIndex = fullText.length;
    let isDeleting = false;

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        if (textIndex < fullText.length) {
          textIndex++;
          setDisplayedText(fullText.slice(0, textIndex));
          timeoutId = setTimeout(tick, 95 + Math.random() * 35); // 95-130ms per char
        } else {
          // Completed full text -> hold pause
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 1600); // 1.6s hold
        }
      } else {
        // Deleting backward
        if (textIndex > 0) {
          textIndex--;
          setDisplayedText(fullText.slice(0, textIndex));
          timeoutId = setTimeout(tick, 60); // 60ms per char
        } else {
          // Fully cleared -> brief pause before retyping
          timeoutId = setTimeout(() => {
            isDeleting = false;
            tick();
          }, 800); // 800ms pause
        }
      }
    };

    // Initial delay before first delete cycle
    timeoutId = setTimeout(() => {
      isDeleting = true;
      tick();
    }, 2200);

    return () => clearTimeout(timeoutId);
  }, []);

  const updatePosition = useCallback(() => {
    const { currX, currY, targetX, targetY } = mousePos.current;
    const nextX = currX + (targetX - currX) * 0.15;
    const nextY = currY + (targetY - currY) * 0.15;
    mousePos.current.currX = nextX;
    mousePos.current.currY = nextY;

    if (btnRef.current) {
      btnRef.current.style.setProperty('--portal-x', `${nextX.toFixed(1)}px`);
      btnRef.current.style.setProperty('--portal-y', `${nextY.toFixed(1)}px`);
    }

    if (isHoveredRef.current || Math.abs(nextX - targetX) > 0.5 || Math.abs(nextY - targetY) > 0.5) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  }, []);

  const handleMouseEnter = (e) => {
    isHoveredRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current.targetX = x;
    mousePos.current.targetY = y;
    mousePos.current.currX = x;
    mousePos.current.currY = y;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updatePosition);
  };

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    mousePos.current.targetX = e.clientX - rect.left;
    mousePos.current.targetY = e.clientY - rect.top;
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updatePosition);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="portal-btn-container">
      {/* Outer Atmospheric Aura & Communication Field */}
      <div className="portal-ambient-aura" aria-hidden="true" />

      {/* Orbiting Technical Ring with Traveling Light Node */}
      <div className="portal-orbit-track-wrap" aria-hidden="true">
        <svg className="portal-orbit-svg" viewBox="0 0 190 190">
          <defs>
            <linearGradient id="portalOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d5ff6e" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#4ce0d2" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#75a7ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <circle cx="95" cy="95" r="91" className="portal-orbit-circle" />
          <circle cx="95" cy="95" r="91" className="portal-orbit-arc" />
          <circle cx="95" cy="4" r="2.8" className="portal-orbit-bead" />
        </svg>
      </div>

      {/* Micro Digital Light Particles */}
      <div className="portal-particles-layer" aria-hidden="true">
        <span className="portal-particle pp1" />
        <span className="portal-particle pp2" />
        <span className="portal-particle pp3" />
        <span className="portal-particle pp4" />
        <span className="portal-particle pp5" />
        <span className="portal-particle pp6" />
        <span className="portal-particle pp7" />
        <span className="portal-particle pp8" />
      </div>

      {/* Primary Clickable Conversation Portal Button */}
      <button
        ref={btnRef}
        type="button"
        className="round-cta conversation-portal"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Start a conversation - Let's talk"
      >
        {/* Dimensional Inner Chamber Backgrounds */}
        <div className="portal-glass-disc" aria-hidden="true">
          {/* Luminous Lime Core Gradient */}
          <div className="portal-lime-core" />

          {/* Cursor Interactive Radial Spotlight */}
          <div className="portal-cursor-spotlight" />

          {/* Inner Technical Ring Frame */}
          <div className="portal-inner-ring" />
        </div>

        {/* The Two Standing Stylized Animated Characters (SVG Illustration) */}
        <div className="portal-dialogue-stage" aria-hidden="true">
          <svg
            className="portal-figures-svg"
            viewBox="0 0 160 105"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Premium Gradient Shading for Characters */}
              <linearGradient id="charGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1e2b" />
                <stop offset="45%" stopColor="#0a2624" />
                <stop offset="100%" stopColor="#051219" />
              </linearGradient>

              <linearGradient id="charGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0c1e2b" />
                <stop offset="45%" stopColor="#181e36" />
                <stop offset="100%" stopColor="#051219" />
              </linearGradient>

              {/* Head Gradients */}
              <linearGradient id="headGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#102533" />
                <stop offset="70%" stopColor="#091b22" />
                <stop offset="100%" stopColor="#051118" />
              </linearGradient>

              <linearGradient id="headGradB" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#102533" />
                <stop offset="70%" stopColor="#1a1e35" />
                <stop offset="100%" stopColor="#051118" />
              </linearGradient>

              {/* Communication Wave Gradients */}
              <linearGradient id="commWaveGradA" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#02806e" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#05443a" stopOpacity="0.1" />
              </linearGradient>

              <linearGradient id="commWaveGradB" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#1b4b6c" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#052c38" stopOpacity="0.1" />
              </linearGradient>

              {/* Soft Wave Glow Filter */}
              <filter id="waveGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#38bdf8" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Standing Ground Plane Contact Shadows */}
            <ellipse cx="49" cy="84" rx="14" ry="2" fill="#0b1e17" opacity="0.28" />
            <ellipse cx="111" cy="84" rx="14" ry="2" fill="#0b1e17" opacity="0.28" />

            {/* PERSON A (Left: Standing, 3/4 facing Person B, Explaining with Hand Gesture) */}
            <g className="person-figure person-a">
              {/* Standing Legs & Pants */}
              <g className="person-legs legs-a">
                {/* Background Left Leg */}
                <path
                  d="M 43 62 L 44 82 L 47.5 82 L 47 62 Z"
                  fill="#050e15"
                  stroke="#16382f"
                  strokeWidth="0.7"
                />
                {/* Foreground Right Leg */}
                <path
                  d="M 49 62 L 50.5 82 L 55 82 L 54.5 62 Z"
                  fill="#07131c"
                  stroke="#16382f"
                  strokeWidth="0.7"
                />
                {/* Sleek Shoes */}
                <path
                  d="M 42 82 L 48 82 C 48.5 82.8, 48.5 83.8, 47.5 84.2 L 41.5 84.2 C 41 83.8, 41.5 82.5, 42 82 Z"
                  fill="#081822"
                />
                <path
                  d="M 49.5 82 L 56.5 82 C 57.2 82.8, 57.2 83.8, 56 84.2 L 48.5 84.2 C 48.5 83.5, 49 82.5, 49.5 82 Z"
                  fill="#081822"
                />
              </g>

              {/* Torso & Tailored Tech Blazer */}
              <g className="person-body body-a">
                <path
                  d="M 37.5 42 C 37 40, 44 38, 49 38 C 54 38, 60.5 39.5, 60.5 41.5 L 59.5 62.5 C 55 64, 43 64, 38 62.5 Z"
                  className="person-torso torso-a"
                  fill="url(#charGradA)"
                  stroke="#1c453c"
                  strokeWidth="0.9"
                />
                {/* Inner Crew Collar Accent */}
                <path
                  d="M 47 38.5 Q 49 42 51 38.5"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.9"
                  opacity="0.85"
                />
                {/* Blazer Lapel Crease */}
                <path
                  d="M 46 41 L 49 53 L 53 41"
                  fill="none"
                  stroke="#235c4c"
                  strokeWidth="0.8"
                />
              </g>

              {/* Outer Left Arm (Relaxed along side) */}
              <path
                d="M 37.5 42 C 34.5 48, 34 54, 35.5 59"
                fill="none"
                stroke="#081822"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M 35.5 59 C 35 60.2, 36.2 61, 37 60.2 Z"
                fill="#081822"
              />

              {/* Head with Neck & Stylized Profile facing right */}
              <g className="head-group-a">
                {/* Slender Neck */}
                <path d="M 47.5 32 L 50.5 32 L 51 38.5 L 47 38.5 Z" fill="#08191f" />
                {/* Head Silhouette with hair & jawline */}
                <path
                  d="M 48 16 C 53.5 16, 57.5 19, 57.5 24 C 57.5 26.5, 56.5 29, 54 30.5 L 51 32.5 C 46 32.5, 43 28.5, 43 24 C 43 19, 45.5 16, 48 16 Z"
                  className="person-head head-a"
                  fill="url(#headGradA)"
                  stroke="#205748"
                  strokeWidth="0.9"
                />
                {/* Hairline Contour */}
                <path
                  d="M 44.5 22 C 44 18, 48 15.5, 53 16 C 56 16.5, 57.5 18.5, 57.5 21 C 55 19.5, 50 19, 46 22 Z"
                  fill="#040d13"
                  opacity="0.5"
                />
                {/* Directional Visor / Eye Focus Node */}
                <circle cx="54.5" cy="23.5" r="1.2" className="person-eye eye-a" />
              </g>

              {/* Articulated Conversational Right Arm (Explaining Gesture, ends at X=70) */}
              <g className="person-arm arm-a">
                {/* Upper Arm from shoulder (60, 41) to elbow (63.5, 50) */}
                <path
                  d="M 60 41 Q 62.5 46, 63.5 50"
                  fill="none"
                  stroke="#081822"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Forearm angled forward-up to wrist at (67.5, 45) */}
                <path
                  d="M 63.5 50 Q 65.5 47, 67.5 45"
                  fill="none"
                  stroke="#081822"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                />
                {/* Stylized Open Explaining Hand (Palm + Finger gesture toward Person B, stops at X=70.5) */}
                <path
                  d="M 67.5 45 C 68.5 43.5, 70 43.2, 70.8 44.2 C 70.3 45.3, 68.8 46, 67.5 45.8 Z"
                  fill="#0a202a"
                  stroke="#256e5c"
                  strokeWidth="0.6"
                />
                <path
                  d="M 70 43.8 L 71.2 44.4"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
            </g>

            {/* PERSON B (Right: Standing, 3/4 facing Person A, Responding with Hand Gesture) */}
            <g className="person-figure person-b">
              {/* Standing Legs & Pants */}
              <g className="person-legs legs-b">
                {/* Foreground Left Leg */}
                <path
                  d="M 105.5 62 L 105 82 L 109.5 82 L 111 62 Z"
                  fill="#07131c"
                  stroke="#1c2c3d"
                  strokeWidth="0.7"
                />
                {/* Background Right Leg */}
                <path
                  d="M 112.5 62 L 112 82 L 116 82 L 117 62 Z"
                  fill="#050e15"
                  stroke="#1c2c3d"
                  strokeWidth="0.7"
                />
                {/* Sleek Shoes */}
                <path
                  d="M 103.5 82 L 110.5 82 C 111 82.5, 111.5 83.5, 111.5 84.2 L 104 84.2 C 102.8 83.8, 102.8 82.8, 103.5 82 Z"
                  fill="#081822"
                />
                <path
                  d="M 111.5 82 L 117.5 82 C 118 82.5, 118.5 83.5, 118 84.2 L 111 84.2 C 110.5 83.8, 111 82.8, 111.5 82 Z"
                  fill="#081822"
                />
              </g>

              {/* Torso & Tailored Tech Blazer */}
              <g className="person-body body-b">
                <path
                  d="M 99.5 41.5 C 99.5 39.5, 106 38, 111 38 C 116 38, 123 40, 122.5 42 L 122 62.5 C 117 64, 105 64, 100.5 62.5 Z"
                  className="person-torso torso-b"
                  fill="url(#charGradB)"
                  stroke="#25354d"
                  strokeWidth="0.9"
                />
                {/* Inner Crew Collar Accent */}
                <path
                  d="M 109 38.5 Q 111 42 113 38.5"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="0.9"
                  opacity="0.85"
                />
                {/* Blazer Lapel Crease */}
                <path
                  d="M 107 41 L 111 53 L 114 41"
                  fill="none"
                  stroke="#31435d"
                  strokeWidth="0.8"
                />
              </g>

              {/* Outer Right Arm (Relaxed along side) */}
              <path
                d="M 122.5 42 C 125.5 48, 126 54, 124.5 59"
                fill="none"
                stroke="#081822"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M 124.5 59 C 125 60.2, 123.8 61, 123 60.2 Z"
                fill="#081822"
              />

              {/* Head with Neck & Stylized Profile facing left */}
              <g className="head-group-b">
                {/* Slender Neck */}
                <path d="M 109.5 32 L 112.5 32 L 113 38.5 L 109 38.5 Z" fill="#08191f" />
                {/* Head Silhouette with hair & jawline */}
                <path
                  d="M 112 16 C 106.5 16, 102.5 19, 102.5 24 C 102.5 26.5, 103.5 29, 106 30.5 L 109 32.5 C 114 32.5, 117 28.5, 117 24 C 117 19, 114.5 16, 112 16 Z"
                  className="person-head head-b"
                  fill="url(#headGradB)"
                  stroke="#2c3e56"
                  strokeWidth="0.9"
                />
                {/* Hairline Contour */}
                <path
                  d="M 115.5 22 C 116 18, 112 15.5, 107 16 C 104 16.5, 102.5 18.5, 102.5 21 C 105 19.5, 110 19, 114 22 Z"
                  fill="#040d13"
                  opacity="0.5"
                />
                {/* Directional Visor / Eye Focus Node */}
                <circle cx="105.5" cy="23.5" r="1.2" className="person-eye eye-b" />
              </g>

              {/* Articulated Conversational Left Arm (Responding Gesture, starts at X=89.5, leaving 18.5px clear gap) */}
              <g className="person-arm arm-b">
                {/* Upper Arm from shoulder (99.5, 41) to elbow (96.5, 51) */}
                <path
                  d="M 99.5 41 Q 97 47, 96.5 51"
                  fill="none"
                  stroke="#081822"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Forearm angled forward-up to wrist at (92.5, 47.5) */}
                <path
                  d="M 96.5 51 Q 94.5 49, 92.5 47.5"
                  fill="none"
                  stroke="#081822"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                />
                {/* Stylized Acknowledging Hand (Palm + Finger gesture toward Person A, starts at X=89.5) */}
                <path
                  d="M 92.5 47.5 C 91.5 46, 90 45.7, 89.2 46.7 C 89.7 47.8, 91.2 48.5, 92.5 48.3 Z"
                  fill="#0d1c28"
                  stroke="#374d6c"
                  strokeWidth="0.6"
                />
                <path
                  d="M 90 46.3 L 88.8 46.9"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
            </g>

            {/* COMMUNICATION WAVES & PULSES (Delicate signals in the 18.5px clear gap between hands) */}
            <g className="comm-waves-group" filter="url(#waveGlow)">
              {/* Waves streaming from Person A toward Person B */}
              <path
                d="M 73 40 Q 77 44, 73 48"
                fill="none"
                className="comm-wave wave-a-1"
                stroke="url(#commWaveGradA)"
              />
              <path
                d="M 76 38 Q 80 44, 76 50"
                fill="none"
                className="comm-wave wave-a-2"
                stroke="url(#commWaveGradA)"
              />

              {/* Waves streaming from Person B toward Person A */}
              <path
                d="M 87 43 Q 83 47, 87 51"
                fill="none"
                className="comm-wave wave-b-1"
                stroke="url(#commWaveGradB)"
              />
              <path
                d="M 84 41 Q 80 47, 84 53"
                fill="none"
                className="comm-wave wave-b-2"
                stroke="url(#commWaveGradB)"
              />

              {/* Luminous Traveling Micro Signal Beads */}
              <circle cx="75" cy="44" r="1.1" className="comm-bead bead-a" />
              <circle cx="85" cy="47" r="1.1" className="comm-bead bead-b" />
            </g>
          </svg>
        </div>

        {/* Dedicated "Let's talk" Typing CTA with Subtle Luminous Cursor */}
        <div className="portal-content" aria-hidden="true">
          <span className="portal-label">
            <span className="portal-typed-text">{displayedText}</span>
            <span className="portal-typing-cursor" />
          </span>
        </div>

        {/* Luminous Glass Perimeter Border */}
        <div className="portal-border-frame" aria-hidden="true" />
      </button>
    </div>
  );
}

