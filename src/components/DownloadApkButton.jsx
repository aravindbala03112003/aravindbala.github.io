import { useState, useCallback } from 'react';

function DownloadIcon() {
  return (
    <svg
      className="download-apk-icon"
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

export default function DownloadApkButton({ onInstallClick, isInstalled, playSound }) {
  const [isPressing, setIsPressing] = useState(false);

  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      if (playSound) {
        try {
          playSound('click');
        } catch (_) {}
      }

      setIsPressing(true);
      setTimeout(() => setIsPressing(false), 240);

      // Invoke the installation flow
      if (onInstallClick) {
        onInstallClick();
      }
    },
    [onInstallClick, playSound],
  );

  return (
    <button
      type="button"
      className={`download-apk-btn ${isPressing ? 'is-pressing' : ''} ${
        isInstalled ? 'is-installed' : ''
      }`}
      onClick={handleClick}
      aria-label="Download Aravind Bala Portfolio Android APK"
      title="Download Android APK"
    >
      <span className="download-apk-shimmer" aria-hidden="true" />
      <span className="download-apk-glow" aria-hidden="true" />
      
      {/* Subtle Neon Green Accent dot matching portfolio */}
      <span className="download-apk-dot" aria-hidden="true" />

      {/* Button text */}
      <span className="download-apk-text">
        {isInstalled ? 'App Installed' : 'Download APK'}
      </span>

      {/* Futuristic animated download icon */}
      <span className="download-apk-icon-box" aria-hidden="true">
        <DownloadIcon />
      </span>
    </button>
  );
}
