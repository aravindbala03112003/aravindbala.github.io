import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import CrystalHeart3D from './CrystalHeart3D';
import AICore3D from './AICore3D';
import { useSound } from '../context/SoundContext';

const COUNTAPI_NAMESPACE = 'portfolio';
const INITIAL_LIKES = 320;
const INITIAL_VIEWS = 400;

function readStoredCount(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(key);
  const parsed = Number(stored);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function writeStoredCount(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, String(value));
}

function formatCount(value) {
  return value.toLocaleString();
}

function AnimatedCounter({ target, isInView }) {
  const spanRef = useRef(null);
  
  useEffect(() => {
    if (!isInView || !spanRef.current) return;
    
    let frameId;
    let startTime = null;
    const duration = 800;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const val = Math.floor(target * easeOutQuad);
      
      if (spanRef.current) {
        spanRef.current.textContent = formatCount(val);
      }
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else if (spanRef.current) {
        spanRef.current.textContent = formatCount(target);
      }
    };
    
    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, target]);
  
  return <span ref={spanRef}>{formatCount(target)}</span>;
}

export default function EngagementSection() {
  const { playSynthSound } = useSound();
  const [likes, setLikes] = useState(() => readStoredCount('portfolio-likes', INITIAL_LIKES));
  const [views, setViews] = useState(() => readStoredCount('portfolio-views', INITIAL_VIEWS));
  const [liked, setLiked] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Increment view count locally instantly without dead API timeouts
    const currentViews = readStoredCount('portfolio-views', INITIAL_VIEWS);
    const nextViews = currentViews + 1;
    setViews(nextViews);
    writeStoredCount('portfolio-views', nextViews);
  }, []);

  const handleLike = () => {
    playSynthSound('like');
    if (liked) return;
    setLiked(true);
    const nextLikes = likes + 1;
    setLikes(nextLikes);
    writeStoredCount('portfolio-likes', nextLikes);
  };

  return (
    <section className="engagement-section section reveal" ref={sectionRef}>
      <div className="container">
        <div className="engagement-shell">
          {/* Hover particles layer */}
          {hoveredCard === 'like' && (
            <div className="engagement-particles">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(i * Math.PI / 4) * 60,
                    y: Math.sin(i * Math.PI / 4) * 60,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}

          <motion.article
            className="engagement-card engagement-card-like"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            onMouseEnter={() => setHoveredCard('like')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="engagement-card-orb" />
            <div className="engagement-card-orb orb-b" />
            {hoveredCard === 'like' && (
              <>
                <motion.div className="hover-glow hover-glow-1" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.div className="hover-glow hover-glow-2" animate={{ scale: [1, 1.3, 1], opacity: [0, 0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </>
            )}
            <div className="engagement-topline">
              <span className="engagement-pill">Community love</span>
              <span className="engagement-status">{liked ? 'Boosted' : 'Ready'}</span>
            </div>
            <motion.button
              className="engagement-icon engagement-icon-3d"
              onClick={handleLike}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Appreciate the community"
            >
              <CrystalHeart3D />
            </motion.button>
            <p className="engagement-label">Community Love</p>
            <motion.h3 key={`likes-${isInView}`}>
              <AnimatedCounter target={likes} isInView={isInView} />
            </motion.h3>
            <p className="engagement-copy">Tap the heart to spread appreciation and celebrate the community.</p>
          </motion.article>

          <motion.article
            className="engagement-card engagement-card-view"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            onMouseEnter={() => setHoveredCard('view')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="engagement-card-orb" />
            <div className="engagement-card-orb orb-c" />
            {hoveredCard === 'view' && (
              <>
                <motion.div className="hover-glow hover-glow-3" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.2, repeat: Infinity }} />
                <motion.div className="hover-glow hover-glow-4" animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
              </>
            )}
            <div className="engagement-topline">
              <span className="engagement-pill">Live audience</span>
              <span className="engagement-status">Watching</span>
            </div>
            <div className="engagement-icon engagement-icon-3d engagement-icon-eye">
              <AICore3D />
            </div>
            <p className="engagement-label">Views</p>
            <motion.h3 key={`views-${isInView}`}>
              <AnimatedCounter target={views} isInView={isInView} />
            </motion.h3>
            <p className="engagement-copy">Every visit on the portfolio adds to the count and brightens the pulse.</p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
