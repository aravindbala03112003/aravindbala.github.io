import { openContactForm } from '../utils/contactNavigation';
import { Github, Linkedin, Mail } from './Icons';
import { useSound } from '../context/SoundContext';
import ConversationPortalBtn from './ConversationPortalBtn';

export default function Footer() {
  const { playSynthSound } = useSound();

  return (
    <footer>
      <div className="footer-cta container">
        <div>
          <p className="eyebrow"><span />A good place to start</p>
          <h2>Have an idea worth<br /><em>building?</em></h2>
        </div>
        <ConversationPortalBtn
          onClick={() => {
            playSynthSound('whoosh');
            openContactForm({ focus: true });
          }}
        />
      </div>
      <div className="footer-base container">
        <p>© {new Date().getFullYear()} Aravind Bala</p>
        <div className="footer-social">
          <a href="https://github.com/ARAVINDBALA3" target="_blank" rel="noreferrer" aria-label="GitHub" onClick={() => playSynthSound('pop')}>
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/aravind-bala-8aa3233a1" target="_blank" rel="noreferrer" aria-label="LinkedIn" onClick={() => playSynthSound('pop')}>
            <Linkedin />
          </a>
          <button type="button" className="footer-social-btn" onClick={() => { playSynthSound('pop'); openContactForm({ focus: true }); }} aria-label="Email Aravind">
            <Mail />
          </button>
        </div>
        <button onClick={() => { playSynthSound('whoosh'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
