import { useState, useRef, useId } from 'react';
import { useSound } from '../context/SoundContext';

const ARCH_NODES = [
  {
    id: 'client',
    flow: 'frontend',
    num: '01',
    label: 'Client & Mobile Interfaces',
    badge: 'FRONTEND / UX',
    color: '#75a7ff',
    techs: ['React 19', 'React Native', 'Vite', 'HTML5 / Modern CSS', 'TailwindCSS'],
    description: 'Responsive multi-surface viewports, mobile apps, and 60fps micro-interactions.',
    metric: '< 16ms render',
    downstream: ['api'],
  },
  {
    id: 'api',
    flow: 'api',
    num: '02',
    label: 'Network & API Gateway',
    badge: 'TRANSPORT',
    color: '#38bdf8',
    techs: ['RESTful APIs', 'Axios', 'JWT / Auth Guards', 'WebSockets'],
    description: 'Type-safe contracts, payload validation, token authorization, and real-time streaming.',
    metric: 'Zero-Trust Protocol',
    downstream: ['backend'],
  },
  {
    id: 'backend',
    flow: 'backend',
    num: '03',
    label: 'Core Services & Engine',
    badge: 'SYSTEMS / LOGIC',
    color: '#d5ff6e',
    techs: ['Java', 'Spring Boot', 'Node.js', 'Express.js'],
    description: 'High-throughput transactional logic, modular routing, and clean architecture boundaries.',
    metric: 'ACID Guaranteed',
    downstream: ['storage'],
  },
  {
    id: 'storage',
    flow: 'data',
    num: '04',
    label: 'Persistence & Databases',
    badge: 'DATA STORE',
    color: '#a855f7',
    techs: ['PostgreSQL', 'MongoDB', 'Supabase', 'Relational SQL'],
    description: 'Schema modeling, performant query indexing, and scalable distributed storage.',
    metric: 'Sub-10ms latency',
    downstream: [],
  },
];

const FLOW_FILTERS = [
  { id: 'all', label: 'All Architecture Layers' },
  { id: 'frontend', label: 'Client Flow' },
  { id: 'backend', label: 'Server & Logic' },
  { id: 'data', label: 'Data Persistence' },
];

export default function ArchitectureConstellation() {
  const { playSynthSound } = useSound();
  const [activeFlow, setActiveFlow] = useState('all');
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const containerRef = useRef(null);
  const gradId = useId();

  const handleNodeEnter = (nodeId) => {
    setHoveredNodeId(nodeId);
    try {
      playSynthSound('pop');
    } catch (_) {}
  };

  const handleNodeLeave = () => {
    setHoveredNodeId(null);
  };

  const handleFilterClick = (flowId) => {
    setActiveFlow(flowId);
    try {
      playSynthSound('whoosh');
    } catch (_) {}
  };

  // Determine if a node is dimmed based on hover or filter
  const isNodeDimmed = (node) => {
    if (activeFlow !== 'all' && node.flow !== activeFlow) {
      // If filtering frontend, show client & api
      if (activeFlow === 'frontend' && (node.id === 'client' || node.id === 'api')) return false;
      // If filtering backend, show api & backend & storage
      if (activeFlow === 'backend' && (node.id === 'api' || node.id === 'backend')) return false;
      // If filtering data, show backend & storage
      if (activeFlow === 'data' && (node.id === 'backend' || node.id === 'storage')) return false;
      return true;
    }

    if (hoveredNodeId) {
      if (node.id === hoveredNodeId) return false;
      const hovered = ARCH_NODES.find((n) => n.id === hoveredNodeId);
      if (hovered?.downstream.includes(node.id)) return false;
      // Also check if node links to hovered
      if (node.downstream.includes(hoveredNodeId)) return false;
      return true;
    }

    return false;
  };

  // Determine if a node is illuminated/highlighted
  const isNodeHighlighted = (node) => {
    if (!hoveredNodeId) return false;
    if (node.id === hoveredNodeId) return true;
    const hovered = ARCH_NODES.find((n) => n.id === hoveredNodeId);
    return hovered?.downstream.includes(node.id) || node.downstream.includes(hoveredNodeId);
  };

  return (
    <div className="arch-constellation-container" ref={containerRef}>
      {/* Top Header & Interactive Flow Filters */}
      <div className="arch-constellation-header">
        <div className="arch-header-left">
          <div className="arch-status-pill">
            <span className="arch-status-dot" />
            <span>INTERACTIVE SYSTEM PIPELINE</span>
          </div>
          <h4 className="arch-title">Full-Stack Data Flow & Architecture Topology</h4>
        </div>
        <div className="arch-flow-filters" role="tablist" aria-label="Architecture filters">
          {FLOW_FILTERS.map((f) => (
            <button
              key={f.id}
              id={`arch-filter-${f.id}`}
              type="button"
              role="tab"
              aria-selected={activeFlow === f.id}
              className={`arch-filter-btn ${activeFlow === f.id ? 'active' : ''}`}
              onClick={() => handleFilterClick(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Spatial Pipeline Graph */}
      <div className="arch-pipeline-board">
        {/* Dynamic Vector Connector Track (Desktop) */}
        <div className="arch-vector-track" aria-hidden="true">
          <svg className="arch-vector-svg" viewBox="0 0 1000 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`${gradId}-beam`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#75a7ff" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#d5ff6e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Background static conduit track */}
            <path
              d="M 125 20 L 875 20"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
              strokeDasharray="4 6"
              fill="none"
            />
            {/* Glowing Traveling Data Vector */}
            <path
              d="M 125 20 L 875 20"
              stroke={`url(#${gradId}-beam)`}
              strokeWidth="2.5"
              strokeDasharray="28 140"
              fill="none"
              className={`arch-pulse-path ${hoveredNodeId ? 'path-active' : ''}`}
            />
          </svg>
        </div>

        {/* 4 Architecture Pillar Nodes */}
        <div className="arch-nodes-grid">
          {ARCH_NODES.map((node) => {
            const dimmed = isNodeDimmed(node);
            const highlighted = isNodeHighlighted(node);

            return (
              <div
                key={node.id}
                className={`arch-node-card ${dimmed ? 'is-dimmed' : ''} ${highlighted ? 'is-highlighted' : ''}`}
                style={{ '--node-accent': node.color }}
                onMouseEnter={() => handleNodeEnter(node.id)}
                onMouseLeave={handleNodeLeave}
              >
                {/* 3D Glass Specular Sheen */}
                <div className="arch-node-sheen" aria-hidden="true" />

                {/* Card Top Metadata */}
                <div className="arch-node-top">
                  <span className="arch-node-num">{node.num}</span>
                  <span className="arch-node-badge">{node.badge}</span>
                </div>

                {/* Node Title & Description */}
                <h5 className="arch-node-title">{node.label}</h5>
                <p className="arch-node-desc">{node.description}</p>

                {/* Tech Badges List */}
                <div className="arch-node-techs">
                  {node.techs.map((tech) => (
                    <span key={tech} className="arch-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Node Bottom Telemetry Metric */}
                <div className="arch-node-metric">
                  <span className="metric-indicator" />
                  <code>{node.metric}</code>
                </div>

                {/* Holographic Arrow Vector (shows flow into next stage) */}
                {node.downstream.length > 0 && (
                  <div className="arch-flow-arrow" aria-hidden="true">
                    <span>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
