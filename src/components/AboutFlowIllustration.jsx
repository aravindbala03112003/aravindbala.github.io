import { useState } from 'react';
import { useSound } from '../context/SoundContext';

export default function AboutFlowIllustration() {
  const { playSynthSound } = useSound();
  const [activeNode, setActiveNode] = useState(null);

  const handleHover = (node) => {
    setActiveNode(node);
    try {
      playSynthSound('pop');
    } catch (_) {}
  };

  return (
    <div className="about-flow-schematic" aria-hidden="true">
      <div className="flow-schematic-header">
        <span className="flow-schematic-pill">
          <span className="pill-dot" />
          SYSTEM PHILOSOPHY // FLOW PIPELINE
        </span>
        <span className="flow-schematic-speed">60 FPS REALTIME</span>
      </div>

      <svg
        className="flow-schematic-svg"
        viewBox="0 0 520 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flowBeamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b6cff" />
          </linearGradient>
          <linearGradient id="flowBeamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b6cff" />
            <stop offset="100%" stopColor="#d5ff6e" />
          </linearGradient>
          <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting Paths with Flowing Signal Beams */}
        <path
          d="M 140 90 L 230 90"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 140 90 L 230 90"
          stroke="url(#flowBeamGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="flow-beam-pulse path-1"
          filter="url(#flowGlow)"
        />

        <path
          d="M 290 90 L 380 90"
          stroke="rgba(213, 255, 110, 0.25)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d="M 290 90 L 380 90"
          stroke="url(#flowBeamGrad2)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="flow-beam-pulse path-2"
          filter="url(#flowGlow)"
        />

        {/* Node 1: Client Layer */}
        <g
          className={`flow-node ${activeNode === 'client' ? 'is-active' : ''}`}
          onMouseEnter={() => handleHover('client')}
          onMouseLeave={() => setActiveNode(null)}
          transform="translate(40, 45)"
          style={{ cursor: 'pointer' }}
        >
          <rect
            width="100"
            height="90"
            rx="14"
            className="flow-node-bg"
            fill="rgba(15, 29, 56, 0.85)"
            stroke={activeNode === 'client' ? '#38bdf8' : 'rgba(56, 189, 248, 0.35)'}
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="10" fill="rgba(56, 189, 248, 0.2)" />
          <path
            d="M 24 28 L 28 24 L 32 28 M 28 32 L 28 24"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text x="24" y="58" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            Interface
          </text>
          <text x="24" y="74" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            React / Mobile
          </text>
        </g>

        {/* Node 2: Logic Layer */}
        <g
          className={`flow-node ${activeNode === 'logic' ? 'is-active' : ''}`}
          onMouseEnter={() => handleHover('logic')}
          onMouseLeave={() => setActiveNode(null)}
          transform="translate(210, 45)"
          style={{ cursor: 'pointer' }}
        >
          <rect
            width="100"
            height="90"
            rx="14"
            className="flow-node-bg"
            fill="rgba(15, 29, 56, 0.85)"
            stroke={activeNode === 'logic' ? '#8b6cff' : 'rgba(139, 108, 255, 0.35)'}
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="10" fill="rgba(139, 108, 255, 0.2)" />
          <path
            d="M 24 28 L 32 28 M 28 24 L 28 32"
            stroke="#8b6cff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text x="24" y="58" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            Architecture
          </text>
          <text x="24" y="74" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            Java / Node.js
          </text>
        </g>

        {/* Node 3: Systems Layer */}
        <g
          className={`flow-node ${activeNode === 'data' ? 'is-active' : ''}`}
          onMouseEnter={() => handleHover('data')}
          onMouseLeave={() => setActiveNode(null)}
          transform="translate(380, 45)"
          style={{ cursor: 'pointer' }}
        >
          <rect
            width="100"
            height="90"
            rx="14"
            className="flow-node-bg"
            fill="rgba(15, 29, 56, 0.85)"
            stroke={activeNode === 'data' ? '#d5ff6e' : 'rgba(213, 255, 110, 0.35)'}
            strokeWidth="1.5"
          />
          <circle cx="28" cy="28" r="10" fill="rgba(213, 255, 110, 0.2)" />
          <ellipse cx="28" cy="26" rx="6" ry="2.5" stroke="#d5ff6e" strokeWidth="1.2" fill="none" />
          <path d="M 22 26 v 4 c 0 1.4 2.7 2.5 6 2.5 s 6 -1.1 6 -2.5 v -4" stroke="#d5ff6e" strokeWidth="1.2" fill="none" />
          <text x="24" y="58" fill="#e2e8f0" fontSize="12" fontWeight="700" fontFamily="sans-serif">
            Persistence
          </text>
          <text x="24" y="74" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            Postgres / Mongo
          </text>
        </g>
      </svg>

      <div className="flow-schematic-footer">
        <span className="flow-info-label">
          {activeNode === 'client' && 'Interactive touch/pointer responsiveness with predictable lifecycle states.'}
          {activeNode === 'logic' && 'Modular service boundaries, typed APIs, and strict error containment.'}
          {activeNode === 'data' && 'Normalized relational schemas and transactional integrity.'}
          {!activeNode && 'Hover any node to inspect architectural domain and engineering standards.'}
        </span>
      </div>
    </div>
  );
}
