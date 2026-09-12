import React from 'react';

/**
 * TimelineDocBtn
 * Renders one of 5 distinct, bespoke micro-CTA document buttons:
 * 0: MCA -> 'academic-scan'
 * 1: Programmer Trainee -> 'code-reveal'
 * 2: Paper Presentation -> 'page-turn'
 * 3: Software Development Training -> 'data-flow'
 * 4: BCA -> 'digital-archive'
 */
export default function TimelineDocBtn({ index, onClick }) {
  const configs = [
    { type: 'scan', label: 'Academic Scan' },
    { type: 'code', label: 'Code Reveal' },
    { type: 'paper', label: 'Page Turn' },
    { type: 'data', label: 'Data Flow' },
    { type: 'archive', label: 'Digital Archive' }
  ];

  const config = configs[index % configs.length];
  const type = config.type;

  return (
    <span
      className={`timeline-doc-btn doc-btn-${type}`}
      onClick={(e) => {
        // Allow click directly on button or bubbling to parent timeline row
        onClick?.();
      }}
      aria-label={`View Document - ${config.label}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* 1. Bespoke Micro-Graphic Vector Icon */}
      <span className="doc-icon-wrap" aria-hidden="true">
        {type === 'scan' && (
          <svg className="doc-svg svg-scan" viewBox="0 0 16 16" fill="none">
            {/* Base Certificate Sheet */}
            <path
              d="M 3 2.5 L 9.5 2.5 L 12.5 5.5 L 12.5 13.5 L 3 13.5 Z"
              className="scan-doc-outline"
            />
            <path d="M 9.5 2.5 L 9.5 5.5 L 12.5 5.5" className="scan-doc-fold" />
            <path d="M 5 6.8 L 8.5 6.8 M 5 9 L 10.5 9 M 5 11.2 L 8 11.2" className="scan-doc-lines" />
            {/* Vertical Scanning Beam Line */}
            <line x1="2" y1="3" x2="13.5" y2="3" className="scan-beam-line" />
          </svg>
        )}

        {type === 'code' && (
          <svg className="doc-svg svg-code" viewBox="0 0 16 16" fill="none">
            {/* Terminal Window / Code File Outline */}
            <rect x="2.5" y="3" width="11" height="10" rx="1.2" className="code-doc-frame" />
            <line x1="2.5" y1="5.6" x2="13.5" y2="5.6" className="code-header-bar" />
            <circle cx="4.5" cy="4.3" r="0.7" className="code-dot dot-1" />
            <circle cx="6.5" cy="4.3" r="0.7" className="code-dot dot-2" />
            {/* Abstract Code Syntax Lines */}
            <line x1="4.5" y1="8" x2="10.5" y2="8" className="code-line line-1" />
            <line x1="6" y1="10.2" x2="10.5" y2="10.2" className="code-line line-2" />
            <rect x="11" y="9.2" width="1" height="1.8" className="code-cursor-tick" />
          </svg>
        )}

        {type === 'paper' && (
          <svg className="doc-svg svg-paper" viewBox="0 0 16 16" fill="none">
            {/* Background Layer (Second Page underneath) */}
            <path d="M 5.5 1.5 L 13.8 1.5 L 13.8 11.5" className="paper-under-sheet" />
            {/* Front Paper Sheet */}
            <path
              d="M 2.5 3.5 L 9.2 3.5 L 12.5 6.8 L 12.5 14.5 L 2.5 14.5 Z"
              className="paper-front-sheet"
            />
            {/* Turning Dog-Ear Corner */}
            <path d="M 9.2 3.5 L 9.2 6.8 L 12.5 6.8 Z" className="paper-fold-flap" />
            <path d="M 4.5 7.8 L 8.5 7.8 M 4.5 10 L 10.5 10 M 4.5 12.2 L 7.5 12.2" className="paper-body-lines" />
            {/* Diagonal Lime Sheen Sweep Line */}
            <line x1="2" y1="4" x2="6" y2="14" className="paper-sheen-beam" />
          </svg>
        )}

        {type === 'data' && (
          <svg className="doc-svg svg-data" viewBox="0 0 18 16" fill="none">
            {/* Data Stream Input Bus Line */}
            <line x1="1" y1="8" x2="6" y2="8" className="data-bus-line" />
            {/* Document Processing Node */}
            <rect x="6.5" y="4" width="7" height="8" rx="1" className="data-doc-node" />
            <path d="M 8.5 6.5 L 11.5 6.5 M 8.5 9.5 L 11.5 9.5" className="data-node-core" />
            {/* Luminous Data Packet traveling into node */}
            <circle cx="2" cy="8" r="1.1" className="data-packet-bead" />
          </svg>
        )}

        {type === 'archive' && (
          <svg className="doc-svg svg-archive" viewBox="0 0 16 16" fill="none">
            {/* Central Archived Document */}
            <rect x="4.2" y="3.5" width="7.6" height="9" rx="1" className="archive-doc-card" />
            <path d="M 5.8 6 L 10.2 6 M 5.8 8 L 10.2 8 M 5.8 10 L 8.2 10" className="archive-doc-lines" />
            {/* Orbital Archive Retrieval Track & Orbit Node */}
            <circle cx="8" cy="8" r="6.8" className="archive-orbit-track" />
            <g className="archive-orbit-spinner">
              <circle cx="8" cy="1.2" r="1" className="archive-orbit-node" />
            </g>
          </svg>
        )}
      </span>

      {/* 2. Text Label */}
      <span className="doc-label-wrap">
        <span className="doc-label-text">VIEW DOCUMENT</span>
        {/* Subtle Underline or Base Glow */}
        <span className="doc-accent-line" />
      </span>

      {/* 3. Interactive External-Link Arrow */}
      <span className="doc-arrow-wrap" aria-hidden="true">
        <svg className="doc-arrow-svg" viewBox="0 0 10 10" fill="none">
          <path
            d="M 2 8 L 8 2 M 3.5 2 L 8 2 L 8 6.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
