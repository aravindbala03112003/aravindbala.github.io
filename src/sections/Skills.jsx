import { useRef, useEffect, useCallback } from 'react';
import SectionHeading from '../components/SectionHeading';
import ArchitectureConstellation from '../components/ArchitectureConstellation';
import { skillGroups } from '../data/portfolio';

function ToolkitCard({ group, index }) {
  const cardRef = useRef(null);
  const rectRef = useRef(null);
  const mousePos = useRef({ currX: 150, currY: 130, targetX: 150, targetY: 130 });
  const rafId = useRef(null);
  const isHoveredRef = useRef(false);

  const updatePosition = useCallback(() => {
    const { currX, currY, targetX, targetY } = mousePos.current;
    // Fluid, silky easing factor
    const nextX = currX + (targetX - currX) * 0.14;
    const nextY = currY + (targetY - currY) * 0.14;
    mousePos.current.currX = nextX;
    mousePos.current.currY = nextY;

    if (cardRef.current) {
      cardRef.current.style.setProperty('--mouse-x', `${nextX.toFixed(1)}px`);
      cardRef.current.style.setProperty('--mouse-y', `${nextY.toFixed(1)}px`);

      // Gentle particle reaction toward cursor (max 5px)
      const rect = rectRef.current;
      const w = rect?.width || 300;
      const h = rect?.height || 260;
      const attractX = ((nextX / w) - 0.5) * 8;
      const attractY = ((nextY / h) - 0.5) * 8;
      cardRef.current.style.setProperty('--attract-x', `${attractX.toFixed(1)}px`);
      cardRef.current.style.setProperty('--attract-y', `${attractY.toFixed(1)}px`);
      const tiltY = (((nextX / w) - 0.5) * 5.5).toFixed(2);
      const tiltX = (-((nextY / h) - 0.5) * 5.5).toFixed(2);
      cardRef.current.style.setProperty('--card-tilt-x', `${tiltX}deg`);
      cardRef.current.style.setProperty('--card-tilt-y', `${tiltY}deg`);
    }

    if (isHoveredRef.current || Math.abs(nextX - targetX) > 0.5 || Math.abs(nextY - targetY) > 0.5) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  }, []);

  const handleMouseEnter = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    isHoveredRef.current = true;
    rectRef.current = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rectRef.current.left;
    const y = e.clientY - rectRef.current.top;
    mousePos.current.targetX = x;
    mousePos.current.targetY = y;
    mousePos.current.currX = x;
    mousePos.current.currY = y;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updatePosition);
  };

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;
    if (!rectRef.current) rectRef.current = cardRef.current.getBoundingClientRect();
    mousePos.current.targetX = e.clientX - rectRef.current.left;
    mousePos.current.targetY = e.clientY - rectRef.current.top;
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updatePosition);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    rectRef.current = null;
    if (cardRef.current) {
      cardRef.current.style.removeProperty('--card-tilt-x');
      cardRef.current.style.removeProperty('--card-tilt-y');
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="skill-group reveal"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Living Neon Glass Backdrop (100% out of document flow, behind content) */}
      <div className="neon-glass-backdrop" aria-hidden="true">
        {/* Effect 1: Animated Gradient Light Sweep */}
        <div className="neon-glass-ambient" />

        {/* Effect 2: Cursor-Following Radial Glow */}
        <div className="neon-cursor-glow" />

        {/* Effect 4: Subtle Background Depth / Particles */}
        <div className="neon-particles-layer">
          <span className="neon-particle p1" />
          <span className="neon-particle p2" />
          <span className="neon-particle p3" />
          <span className="neon-particle p4" />
          <span className="neon-particle p5" />
        </div>

        {/* Effect 5: Glass Reflection (Single Diagonal Sheen) */}
        <div className="neon-glass-reflection" />
      </div>

      {/* Effect 3: Animated Border Energy Highlight (Pure Vector Beam) */}
      <svg className="neon-border-svg" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`neonBeamGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#75a7ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#d5ff6e" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          fill="none"
          stroke={`url(#neonBeamGrad-${index})`}
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="16 84"
          className="neon-beam-rect"
        />
      </svg>

      {/* Static Card Content (3D physical depth layer separation on hover) */}
      <span className="card-number">0{index + 1}</span>
      <h3>{group.label}</h3>
      <div className="skill-list">
        {group.skills.map((skill) => (
          <p key={skill} className="skill-chip-3d">
            {skill}
            <i>↗</i>
          </p>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="skills-lead">
          <SectionHeading
            eyebrow="Toolkit"
            title={
              <>
                Fluent in the tools
                <br />
                that make ideas <em>move.</em>
              </>
            }
          />
          <p className="skills-note reveal">
            I choose technology with purpose — always considering the product, its people, and what comes next.
          </p>
        </div>

        {/* 3D Interactive Architecture Constellation & Data-Flow Topology */}
        <ArchitectureConstellation />

        <div className="skills-grid">
          {skillGroups.map((group, index) => (
            <ToolkitCard group={group} index={index} key={group.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

