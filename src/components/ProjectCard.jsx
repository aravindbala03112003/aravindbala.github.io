import { useState, useRef, useMemo } from 'react';
import { ArrowUpRight } from './Icons';
import { useSound } from '../context/SoundContext';
import ProjectCardVisual from './ProjectCardVisual';
import { rafThrottle } from '../utils/rafThrottle';

export default function ProjectCard({ project, onOpen }) {
  const { playSynthSound } = useSound();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);
  const artRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsHovered(true);
  };

  const handleMouseMove = useMemo(
    () =>
      rafThrottle((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;

        // Subtle, controlled tilt angles (-2.5deg to +2.5deg)
        const tiltY = ((normX - 0.5) * 5.0).toFixed(2);
        const tiltX = (-(normY - 0.5) * 5.0).toFixed(2);

        card.style.setProperty('--card-tilt-x', `${tiltX}deg`);
        card.style.setProperty('--card-tilt-y', `${tiltY}deg`);
        card.style.setProperty('--card-mouse-x', `${(normX * 100).toFixed(1)}%`);
        card.style.setProperty('--card-mouse-y', `${(normY * 100).toFixed(1)}%`);

        setMousePos({ x: normX, y: normY });
      }),
    []
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
    const card = cardRef.current;
    if (card) {
      card.style.removeProperty('--card-tilt-x');
      card.style.removeProperty('--card-tilt-y');
      card.style.removeProperty('--card-mouse-x');
      card.style.removeProperty('--card-mouse-y');
    }
  };

  const handleOpen = (e) => {
    onOpen(project, e.currentTarget);
  };

  return (
    <article
      ref={cardRef}
      className={`project-card project-${project.color} visible ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Specular Light Sheen */}
      <span className="project-3d-sheen" aria-hidden="true" />

      {/* Animated Subtle Border Glow */}
      <span className="project-3d-border-glow" aria-hidden="true" />

      <div className="project-index">
        {project.id}
        <span>Featured build</span>
      </div>
      <div className="project-art" ref={artRef} aria-hidden="true">
        <div className="art-glow" />
        <div className="art-full-bleed">
          <ProjectCardVisual project={project} isHovered={isHovered} mousePos={mousePos} />
        </div>
      </div>
      <div className="project-content">
        <p className="project-type">{project.type}</p>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="project-bottom">
          <div className="tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button onClick={handleOpen} aria-label={`Open ${project.name} case study`}>
            <ArrowUpRight />
          </button>
        </div>
      </div>
      <div className="project-metric metallic-glass-badge">
        <strong>{project.metric}</strong>
        <span>{project.metricText}</span>
      </div>
    </article>
  );
}
