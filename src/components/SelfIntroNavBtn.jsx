import React, { useState } from 'react';

export default function SelfIntroNavBtn({ onOpenModal, playSound }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    try {
      if (playSound) playSound('click');
    } catch (_) {}
    if (onOpenModal) {
      onOpenModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="self-intro-nav-slot">
      <button
        type="button"
        className={`self-intro-btn ${isHovered ? 'is-expanded' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label="Self Intro"
        title="Self Intro"
      >
        {/* Luminous perimeter border glow */}
        <span className="self-intro-border-glow" aria-hidden="true" />

        {/* Shimmer light sweep on hover */}
        <span className="self-intro-shimmer" aria-hidden="true" />

        {/* Play Icon Glyph */}
        <span className="self-intro-icon-wrap" aria-hidden="true">
          <svg
            className="self-intro-play-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer subtle circle beacon */}
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              className="self-intro-play-orbit"
            />
            {/* Crisp filled play triangle */}
            <path
              d="M9.75 8.25L16.25 12L9.75 15.75V8.25Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Expanding Text Label */}
        <span className="self-intro-label-wrap" aria-hidden="true">
          <span className="self-intro-label-text">SELF INTRO</span>
        </span>
      </button>
    </div>
  );
}
