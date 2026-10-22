import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../context/SoundContext';
import { getProjectLiveConfig } from '../data/projectLinks';

function ExternalLinkIcon() {
  return (
    <svg
      className="open-live-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="open-live-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function OpenLiveProjectButton({ project }) {
  const { playSynthSound } = useSound();
  const [isPressing, setIsPressing] = useState(false);

  const config = getProjectLiveConfig(project);

  const handleClick = useCallback(
    (e) => {
      // Do not prevent default so the browser opens the link in a new tab / starts download
      if (playSynthSound) {
        try {
          playSynthSound('pop');
        } catch (_) {}
      }

      setIsPressing(true);
      setTimeout(() => setIsPressing(false), 240);
    },
    [playSynthSound]
  );

  // If no link is configured or if this is the Personal Portfolio project, render nothing
  if (!config) {
    return null;
  }

  const isApk = config.type === 'apk';

  return (
    <motion.a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      download={isApk ? true : undefined}
      className={`open-live-project-btn ${isApk ? 'is-apk' : 'is-web'} ${
        isPressing ? 'is-pressing' : ''
      }`}
      aria-label={config.ariaLabel || config.label}
      title={config.label}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.22, delay: 0.06, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Subtle animated highlight shimmer sweep */}
      <span className="open-live-shimmer" aria-hidden="true" />

      {/* Luminous glowing backdrop on hover */}
      <span className="open-live-glow" aria-hidden="true" />

      {/* Pulsing live / download status indicator dot */}
      <span className="open-live-dot" aria-hidden="true" />

      {/* Button label text */}
      <span className="open-live-text">{config.label}</span>

      {/* Launch / Download Icon box */}
      <span className="open-live-icon-box" aria-hidden="true">
        {isApk ? <DownloadIcon /> : <ExternalLinkIcon />}
      </span>
    </motion.a>
  );
}
