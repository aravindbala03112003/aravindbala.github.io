import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VIDEO_CONFIGS = {
  '01': {
    src: `${import.meta.env.BASE_URL}gifs/Creating_product_animation_video_1080p_202609021652.mp4`,
    heroClass: 'hero-eventease',
    label: 'EventEase Video Loop'
  },
  '02': {
    src: `${import.meta.env.BASE_URL}gifs/Campus_vote_video_generation_prompt_202609021700.mp4`,
    heroClass: 'hero-campusvote',
    label: 'Campus Vote Video Loop'
  },
  '03': {
    src: `${import.meta.env.BASE_URL}gifs/AI_video_generation_prompt_FinDesk_202609021727.mp4`,
    heroClass: 'hero-findesk',
    label: 'FinDesk Video Loop'
  },
  '04': {
    src: `${import.meta.env.BASE_URL}gifs/Smart_travel_mode_video_animation_202609021732.mp4`,
    heroClass: 'hero-smarttravel',
    label: 'Smart Travel Mode Video Loop'
  },
  '05': {
    src: `${import.meta.env.BASE_URL}gifs/Research_paper_management_AI_video_202609021737.mp4`,
    heroClass: 'hero-research',
    label: 'Research Paper Management Video Loop'
  },
  '06': {
    src: `${import.meta.env.BASE_URL}gifs/Food_recommendation_system_anima…_1080p_20261021123412_gwr_video_mvp.mp4`,
    heroClass: 'hero-foodrecommender',
    label: 'Food Recommender Video Loop'
  },
  '07': {
    src: `${import.meta.env.BASE_URL}gifs/EduHelp_ticket_resolution_animat…_1080p_20261021124733_gwr_video_mvp.mp4`,
    poster: `${import.meta.env.BASE_URL}images/edu-help/Screenshot 2026-10-21 162605.png`,
    heroClass: 'hero-eduhelp',
    label: 'EDU-HELP Video Loop'
  },
  '08': {
    src: `${import.meta.env.BASE_URL}gifs/Barbershop_appointment_booking_s…_1080p_20261021125224_gwr_video_mvp.mp4`,
    poster: `${import.meta.env.BASE_URL}images/barber-shop/Screenshot 2026-10-21 171910.png`,
    heroClass: 'hero-barbershop',
    label: 'Barber Shop Video Loop'
  },
  '09': {
    src: `${import.meta.env.BASE_URL}gifs/Hotel_room_booking_system_video_20261021125732_gwr_video_mvp.mp4`,
    poster: `${import.meta.env.BASE_URL}images/hotel-room-booking/Screenshot 2026-10-21 174341.png`,
    heroClass: 'hero-aurahaven',
    label: 'Aura Heaven Video Loop'
  },
  '10': {
    src: `${import.meta.env.BASE_URL}gifs/Vehicle_parking_management_syste…_1080p_20261021130048_gwr_video_mvp.mp4`,
    poster: `${import.meta.env.BASE_URL}images/vehicle-parking/Screenshot 2026-10-21 181402.png`,
    heroClass: 'hero-vehicleparking',
    label: 'Online Vehicle Parking System Video Loop'
  },
  '11': {
    src: `${import.meta.env.BASE_URL}gifs/Software_developer_portfolio_int…_1080p_20261021183821_gwr_video_mvp.mp4`,
    poster: `${import.meta.env.BASE_URL}photos/port-folio/WhatsApp Image 2026-10-21 at 6.27.54 PM (1).jpeg`,
    heroClass: 'hero-personalportfolio',
    label: 'Personal Portfolio Video Loop'
  }
};

function ProjectMotif({ id, isHovered }) {
  switch (id) {
    case '01':
      return (
        <div className={`project-bespoke-motif motif-event ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-cyan" />
            <span className="motif-code">TICKET // VIP ACCESS</span>
            <span className="motif-sub">ID #EE-2026</span>
          </div>
        </div>
      );
    case '02':
      return (
        <div className={`project-bespoke-motif motif-vote ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-lime" />
            <span className="motif-code">BALLOT // ZK-VERIFIED</span>
            <span className="motif-sub">0x7f4a…b89e</span>
          </div>
        </div>
      );
    case '03':
      return (
        <div className={`project-bespoke-motif motif-finance ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-lime" />
            <span className="motif-code">MARKET TELEMETRY</span>
            <span className="motif-sub">+4.82% ▲ VOL: $2.4M</span>
          </div>
        </div>
      );
    case '04':
      return (
        <div className={`project-bespoke-motif motif-travel ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-cyan" />
            <span className="motif-code">WAYPOINT NAV // GPS</span>
            <span className="motif-sub">LAT 13.0827° N</span>
          </div>
        </div>
      );
    case '05':
      return (
        <div className={`project-bespoke-motif motif-research ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-purple" />
            <span className="motif-code">CITATION MESH // AI</span>
            <span className="motif-sub">98.4% SEMANTIC MATCH</span>
          </div>
        </div>
      );
    case '06':
      return (
        <div className={`project-bespoke-motif motif-food ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-emerald" />
            <span className="motif-code">DIETARY AI // KNN+SVD</span>
            <span className="motif-sub">120K RECS • SHAP ML</span>
          </div>
        </div>
      );
    case '07':
      return (
        <div className={`project-bespoke-motif motif-eduhelp ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-cyan" />
            <span className="motif-code">STUDENT DESK // SLA</span>
            <span className="motif-sub">TICKET LIFECYCLE</span>
          </div>
        </div>
      );
    case '08':
      return (
        <div className={`project-bespoke-motif motif-barber ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-amber" />
            <span className="motif-code">SALON BOOKING // PHP</span>
            <span className="motif-sub">APPOINTMENT ENGINE</span>
          </div>
        </div>
      );
    case '09':
      return (
        <div className={`project-bespoke-motif motif-aurahaven ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-amber" />
            <span className="motif-code">HOTEL SUITES // MERN</span>
            <span className="motif-sub">RESERVATION ENGINE</span>
          </div>
        </div>
      );
    case '10':
      return (
        <div className={`project-bespoke-motif motif-parking ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-orange" />
            <span className="motif-code">PARKING BAY // MYSQL</span>
            <span className="motif-sub">56-SLOT VISUALIZER</span>
          </div>
        </div>
      );
    case '11':
      return (
        <div className={`project-bespoke-motif motif-portfolio ${isHovered ? 'active' : ''}`} aria-hidden="true">
          <div className="motif-badge-glass">
            <span className="motif-dot dot-cyan" />
            <span className="motif-code">FLUTTER // MOBILE ENGINE</span>
            <span className="motif-sub">CROSS-PLATFORM APP</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function ProjectCardVisual({ project, isHovered, mousePos = { x: 0.5, y: 0.5 } }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const id = project?.id;
  const config = VIDEO_CONFIGS[id];

  // Pause video when off-screen to save CPU/GPU and battery
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  if (!config) return null;

  // 3D Perspective Parallax Tilt (Only when card is hovered on pointer: fine devices)
  const rotateX = isHovered ? (mousePos.y - 0.5) * -10 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 10 : 0;

  return (
    <div
      ref={containerRef}
      className={`cinema-hero ${config.heroClass} ${isHovered ? 'hovered' : ''}`}
      style={{ padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
    >
      <motion.video
        ref={videoRef}
        src={config.src}
        poster={config.poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label={config.label}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        animate={{ rotateX, rotateY, scale: isHovered ? 1.04 : 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      />

      {/* Domain-Bespoke 3D Floating HUD Motif */}
      <ProjectMotif id={id} isHovered={isHovered} />
    </div>
  );
}
