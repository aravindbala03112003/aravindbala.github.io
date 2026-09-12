import { useState } from 'react';
import { useSound } from '../context/SoundContext';
import { navLinks } from '../data/portfolio';
import DownloadApkButton from './DownloadApkButton';
import SelfIntroNavBtn from './SelfIntroNavBtn';
import SelfIntroModal from './SelfIntroModal';
import { usePwaInstall } from '../hooks/usePwaInstall';

export default function Navbar({ active, onCommand }) {
  const { playSynthSound } = useSound();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selfIntroOpen, setSelfIntroOpen] = useState(false);

  const { isInstalled, hasNativePrompt, triggerInstall } = usePwaInstall();

  const visit = (id) => {
    try {
      playSynthSound('click');
    } catch (_) {}
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const handleDownloadApkClick = () => {
    try {
      playSynthSound('click');
    } catch (_) {}
    setOpen(false);

    // Directly trigger download of the actual Android APK file
    const link = document.createElement('a');
    link.href = `${import.meta.env.BASE_URL}aravindbala-portfolio.apk`;
    link.download = 'aravindbala-portfolio.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <header className="nav-shell">
        <nav className="nav container" aria-label="Main navigation">
          <div className="brand">
            <button className="profile-avatar-button brand-logo-button" onClick={() => visit('home')} aria-label="Aravind Bala Portfolio Logo">
              <span className="profile-avatar brand-logo-wrap"><img src={`${import.meta.env.BASE_URL}logo/portfolio-logo.png`} alt="Aravind Bala Logo" /></span>
            </button>
            <button className="brand-name" onClick={() => visit('home')} aria-label="Go home">
              <span className="brand-label">Aravind <b>Bala</b></span><i />
            </button>
          </div>
          <div className={`nav-links ${open ? 'is-open' : ''}`}>
            {navLinks.slice(1).map((link) => (
              <button className={active === link ? 'active' : ''} onClick={() => visit(link)} key={link}>
                {link}
              </button>
            ))}
            <div className="mobile-menu-action">
              <DownloadApkButton
                onInstallClick={handleDownloadApkClick}
                isInstalled={false}
                playSound={playSynthSound}
              />
            </div>
          </div>
          <div className="nav-actions">
            <button className="command-trigger" onClick={onCommand} aria-label="Open command palette">⌘K</button>
            <SelfIntroNavBtn
              onOpenModal={() => setSelfIntroOpen(true)}
              playSound={playSynthSound}
            />
            <div className="desktop-apk-btn">
              <DownloadApkButton
                onInstallClick={handleDownloadApkClick}
                isInstalled={false}
                playSound={playSynthSound}
              />
            </div>
            <button className={`menu-button ${open ? 'is-active' : ''}`} onClick={() => setOpen(!open)} aria-label="Open menu">
              <i /><i /><i />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Backdrop */}
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      {/* Profile Photo Lightbox Modal */}
      {profileOpen && (
        <button className="profile-lightbox" onClick={() => setProfileOpen(false)} aria-label="Close profile photo">
          <img src={`${import.meta.env.BASE_URL}images/profile/aravind-bala.jpg`} alt="Aravind Bala profile photo" />
          <span>Click anywhere to close</span>
        </button>
      )}

      {/* Self Intro Video Modal */}
      <SelfIntroModal
        open={selfIntroOpen}
        onClose={() => setSelfIntroOpen(false)}
      />
    </>
  );
}
