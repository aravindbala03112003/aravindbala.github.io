import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { ArrowUpRight } from '../components/Icons';
import { useSound } from '../context/SoundContext';
import { openContactForm } from '../utils/contactNavigation';

const servicesData = [
  {
    id: '01',
    number: '01',
    title: 'Web development',
    subtitle: 'RESPONSIVE SYSTEMS',
    description: 'Fast, adaptable interfaces that feel considered on every screen.',
    theme: 'service-theme-blue',
    accentColor: '#75a7ff',
    tags: ['React', 'HTML', 'CSS', 'JavaScript', 'Figma'],
    schematic: (
      <svg className="service-schematic-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#75a7ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Browser Frame */}
        <rect x="15" y="15" width="170" height="90" rx="8" className="schematic-browser-frame" stroke="rgba(117,167,255,0.3)" strokeWidth="1.2" fill="rgba(8,16,30,0.5)" />
        {/* Browser Top Bar */}
        <line x1="15" y1="32" x2="185" y2="32" stroke="rgba(117,167,255,0.2)" strokeWidth="1" />
        <circle cx="28" cy="23.5" r="2.5" fill="#75a7ff" opacity="0.6" />
        <circle cx="37" cy="23.5" r="2.5" fill="#38bdf8" opacity="0.4" />
        <circle cx="46" cy="23.5" r="2.5" fill="#d5ff6e" opacity="0.4" />
        {/* URL Bar */}
        <rect x="62" y="20" width="76" height="7" rx="3.5" fill="rgba(117,167,255,0.12)" />
        {/* Content Wireframe */}
        <rect x="26" y="42" width="46" height="52" rx="4" className="schematic-col-left" stroke="rgba(117,167,255,0.25)" strokeWidth="1" fill="rgba(117,167,255,0.06)" />
        <rect x="80" y="42" width="94" height="23" rx="4" className="schematic-col-top" stroke="rgba(117,167,255,0.25)" strokeWidth="1" fill="rgba(117,167,255,0.08)" />
        <rect x="80" y="71" width="44" height="23" rx="4" className="schematic-card-1" stroke="rgba(56,189,248,0.25)" strokeWidth="1" fill="rgba(56,189,248,0.06)" />
        <rect x="130" y="71" width="44" height="23" rx="4" className="schematic-card-2" stroke="rgba(56,189,248,0.25)" strokeWidth="1" fill="rgba(56,189,248,0.06)" />
        {/* Pulsing Interactive Cursor Node */}
        <circle cx="118" cy="53" r="3" className="schematic-cursor-node" fill="#75a7ff" />
        <circle cx="118" cy="53" r="7" className="schematic-cursor-pulse" stroke="#75a7ff" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: '02',
    number: '02',
    title: 'Android development',
    subtitle: 'NATIVE ARCHITECTURE',
    description: 'Useful mobile experiences designed around real-world context.',
    theme: 'service-theme-lime',
    accentColor: '#d5ff6e',
    tags: ['Java', 'XML'],
    schematic: (
      <svg className="service-schematic-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d5ff6e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#75a7ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Radiating Signal Waves */}
        <circle cx="100" cy="58" r="48" className="schematic-signal-wave wave-1" stroke="rgba(213,255,110,0.12)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="100" cy="58" r="40" className="schematic-signal-wave wave-2" stroke="rgba(213,255,110,0.18)" strokeWidth="1" strokeDasharray="3 3" />
        {/* Smartphone Silhouette */}
        <rect x="74" y="14" width="52" height="92" rx="10" className="schematic-phone-bezel" stroke="rgba(213,255,110,0.4)" strokeWidth="1.2" fill="rgba(8,16,30,0.7)" />
        {/* Dynamic Island / Notch */}
        <rect x="91" y="19" width="18" height="4" rx="2" fill="rgba(213,255,110,0.5)" />
        {/* Native App UI Cards */}
        <rect x="81" y="29" width="38" height="22" rx="4" stroke="rgba(213,255,110,0.3)" strokeWidth="1" fill="rgba(213,255,110,0.1)" />
        <rect x="81" y="56" width="17" height="22" rx="4" stroke="rgba(213,255,110,0.25)" strokeWidth="1" fill="rgba(213,255,110,0.06)" />
        <rect x="102" y="56" width="17" height="22" rx="4" stroke="rgba(213,255,110,0.25)" strokeWidth="1" fill="rgba(213,255,110,0.06)" />
        <rect x="81" y="83" width="38" height="12" rx="3" stroke="rgba(213,255,110,0.2)" strokeWidth="0.8" fill="rgba(213,255,110,0.05)" />
        {/* Home Bar */}
        <line x1="92" y1="101" x2="108" y2="101" stroke="#d5ff6e" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: '03',
    number: '03',
    title: 'API & systems',
    subtitle: 'SCALABLE INTEGRATION',
    description: 'Reliable integration layers that make product capabilities reusable.',
    theme: 'service-theme-cyan',
    accentColor: '#38bdf8',
    tags: ['Node.js', 'Express.js', 'Spring Boot (Java)', 'PHP', 'Postman'],
    schematic: (
      <svg className="service-schematic-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Network Connecting Lines */}
        <path d="M48 60 L100 60 L152 35" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeDasharray="3 3" className="schematic-network-path" />
        <path d="M100 60 L152 85" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeDasharray="3 3" className="schematic-network-path" />
        {/* Central Gateway Node */}
        <rect x="82" y="44" width="36" height="32" rx="7" className="schematic-gateway-node" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2" fill="rgba(8,20,38,0.8)" />
        <circle cx="100" cy="60" r="5" fill="#38bdf8" className="schematic-core-node" />
        {/* Client Origin Node */}
        <rect x="30" y="48" width="24" height="24" rx="5" stroke="rgba(117,167,255,0.4)" strokeWidth="1" fill="rgba(10,24,44,0.7)" />
        <circle cx="42" cy="60" r="3" fill="#75a7ff" />
        {/* Service Endpoint A */}
        <rect x="146" y="23" width="26" height="24" rx="5" stroke="rgba(56,189,248,0.4)" strokeWidth="1" fill="rgba(8,20,38,0.7)" />
        <circle cx="159" cy="35" r="3" fill="#38bdf8" />
        {/* Service Endpoint B */}
        <rect x="146" y="73" width="26" height="24" rx="5" stroke="rgba(167,139,250,0.4)" strokeWidth="1" fill="rgba(14,16,36,0.7)" />
        <circle cx="159" cy="85" r="3" fill="#a78bfa" />
        {/* Traveling Data Packets */}
        <circle cx="70" cy="60" r="2.2" fill="#38bdf8" className="schematic-packet packet-1" />
        <circle cx="126" cy="47.5" r="2.2" fill="#38bdf8" className="schematic-packet packet-2" />
      </svg>
    ),
  },
  {
    id: '04',
    number: '04',
    title: 'Database design',
    subtitle: 'DATA FOUNDATION',
    description: 'Practical data models that support clear, maintainable products.',
    theme: 'service-theme-purple',
    accentColor: '#a78bfa',
    tags: ['MySQL', 'MongoDB', 'PostgreSQL', 'Firebase'],
    schematic: (
      <svg className="service-schematic-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Relational Connector Lines */}
        <path d="M100 38 L100 82" stroke="rgba(167,139,250,0.3)" strokeWidth="1.2" strokeDasharray="2 3" />
        <path d="M100 60 L148 60" stroke="rgba(167,139,250,0.3)" strokeWidth="1.2" strokeDasharray="2 3" />
        {/* Cylinder 1 (Primary Database) */}
        <g className="schematic-db-cylinder" transform="translate(72, 18)">
          <ellipse cx="28" cy="10" rx="28" ry="8" stroke="rgba(167,139,250,0.5)" strokeWidth="1.2" fill="rgba(18,16,38,0.7)" />
          <path d="M0 10 V26 C0 30 12 34 28 34 C44 34 56 30 56 26 V10" stroke="rgba(167,139,250,0.4)" strokeWidth="1" fill="rgba(18,16,38,0.5)" />
          <ellipse cx="28" cy="18" rx="28" ry="7.5" stroke="rgba(167,139,250,0.25)" strokeWidth="0.8" />
          <ellipse cx="28" cy="26" rx="28" ry="7.5" stroke="rgba(167,139,250,0.3)" strokeWidth="0.8" />
        </g>
        {/* Cylinder 2 (Replica / Secondary) */}
        <g className="schematic-db-cylinder-sub" transform="translate(77, 66)">
          <ellipse cx="23" cy="8" rx="23" ry="6.5" stroke="rgba(167,139,250,0.45)" strokeWidth="1" fill="rgba(18,16,38,0.6)" />
          <path d="M0 8 V20 C0 24 10 27 23 27 C36 27 46 24 46 20 V8" stroke="rgba(167,139,250,0.35)" strokeWidth="0.8" fill="rgba(18,16,38,0.4)" />
          <ellipse cx="23" cy="14" rx="23" ry="6" stroke="rgba(167,139,250,0.2)" strokeWidth="0.7" />
        </g>
        {/* Query Index Node */}
        <rect x="142" y="48" width="30" height="24" rx="5" stroke="rgba(213,255,110,0.35)" strokeWidth="1" fill="rgba(16,24,20,0.7)" />
        <circle cx="157" cy="60" r="3" fill="#d5ff6e" />
      </svg>
    ),
  },
];

export default function Services() {
  const { playSynthSound } = useSound();
  const [hoveredId, setHoveredId] = useState(null);

  const handleCardClick = (service) => {
    try {
      playSynthSound('whoosh');
    } catch (_) {}
    openContactForm({ focus: true });
  };

  return (
    <section id="services" className="section services">
      <div className="container">
        <SectionHeading
          eyebrow="How I can help"
          title={
            <>
              From blank canvas to
              <br />
              <em>working product.</em>
            </>
          }
        />

        <div className="service-cards-grid">
          {servicesData.map((service) => {
            const isHovered = hoveredId === service.id;
            return (
              <article
                key={service.id}
                className={`service-card ${service.theme} ${isHovered ? 'is-card-hovered' : ''}`}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleCardClick(service)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(service);
                  }
                }}
                aria-label={`${service.title} — ${service.description}. Click to discuss.`}
              >
                {/* Ambient Hover Spotlight */}
                <div className="service-card-ambient-glow" aria-hidden="true" />
                <div className="service-card-border-sheen" aria-hidden="true" />

                {/* Top Meta Header */}
                <div className="service-card-header">
                  <div className="service-index-group">
                    <span className="service-number">{service.number}</span>
                    <span className="service-subtitle-badge">{service.subtitle}</span>
                  </div>
                  <button
                    type="button"
                    className="service-action-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(service);
                    }}
                    aria-label={`Inquire about ${service.title}`}
                  >
                    <span>Discuss</span>
                    <ArrowUpRight />
                  </button>
                </div>

                {/* Title and Scope Description */}
                <div className="service-card-body">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>

                {/* Animated Technical Schematic Graphic */}
                <div className="service-schematic-wrap" aria-hidden="true">
                  {service.schematic}
                </div>

                {/* Architectural Capability Chips */}
                <div className="service-tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="service-tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
