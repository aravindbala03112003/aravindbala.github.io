import { openContactForm } from '../utils/contactNavigation';
import { useSound } from '../context/SoundContext';

export default function QuickContactFAB() {
  const { playSynthSound } = useSound();

  const scrollToContact = () => {
    playSynthSound('click');
    openContactForm({ focus: true });
  };

  return (
    <button className="quick-contact-fab" onClick={scrollToContact} aria-label="Quick contact Aravind Bala">
      <span className="fab-status-dot" />
      <span className="fab-text">Let’s Talk 💬</span>
    </button>
  );
}
