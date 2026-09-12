import { useState } from 'react';
import { contactEmail } from '../data/contact';
import SectionHeading from '../components/SectionHeading';
import { ArrowUpRight, Mail } from '../components/Icons';
import EmailPreviewModal from '../components/EmailPreviewModal';
import { useSound } from '../context/SoundContext';
import { sendContactEmail, isEmailJsReady, openGmailFallback, sanitizeInput } from '../services/emailService';
import { openContactForm } from '../utils/contactNavigation';

export default function Contact() {
  const { playSynthSound } = useSound();
  const [state, setState] = useState('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const submit = async (event) => {
    event.preventDefault();

    // Prevent rapid multiple submissions (5s rate-limit cooldown)
    if (Date.now() - lastSubmitTime < 5000) {
      return;
    }
    setLastSubmitTime(Date.now());
    playSynthSound('success');

    const form = event.currentTarget;
    const data = new FormData(form);
    const fromName = sanitizeInput(data.get('from_name'));
    const userEmail = sanitizeInput(data.get('reply_to'));
    const userMessage = sanitizeInput(data.get('message'));

    if (!fromName || !userEmail || !userMessage) {
      return;
    }

    setState('sending');
    try {
      const res = await sendContactEmail({ fromName, userEmail, userMessage });
      if (res.status === 'draft') {
        setState('draft');
      } else {
        form.reset();
        setReplyEmail('');
        setState('sent');
      }
    } catch (err) {
      console.error('Contact email submission error:', err);
      openGmailFallback(form);
      setState('draft');
    }
  };

  const buttonText = state === 'sending' ? 'Sending…' : state === 'sent' ? 'Message sent — thank you!' : state === 'draft' ? 'Gmail draft opened' : isEmailJsReady ? 'Send message' : 'Open email draft';
  const statusText = state === 'sent' ? 'Your message was delivered successfully. Check your inbox for the luxury auto-response.' : state === 'draft' ? 'Your message is prefilled in Gmail. Review it and select Send.' : isEmailJsReady ? 'Your message is delivered securely through EmailJS with instant auto-response.' : 'Submitting opens a prefilled Gmail draft, ready for you to send.';

  return (
    <section id="contact" className="section contact container">
      {/* 3D Atmospheric Depth Halo (Non-Destructive Background) */}
      <div className="contact-3d-orbital-halo" aria-hidden="true" />

      {/* Floating Spatial Transmission Nodes */}
      <div className="contact-spatial-nodes" aria-label="Direct transmission channels">
        <a
          href="https://github.com/ARAVINDBALA3"
          target="_blank"
          rel="noreferrer"
          className="contact-spatial-node node-github"
          onClick={() => playSynthSound('pop')}
        >
          <span className="node-beacon-dot dot-cyan" />
          <code>GitHub // Codebase Telemetry</code>
        </a>
        <a
          href="https://www.linkedin.com/in/aravind-bala-8aa3233a1"
          target="_blank"
          rel="noreferrer"
          className="contact-spatial-node node-linkedin"
          onClick={() => playSynthSound('pop')}
        >
          <span className="node-beacon-dot dot-lime" />
          <code>LinkedIn // Direct Beacon</code>
        </a>
      </div>

      <div className="contact-copy">
        <SectionHeading eyebrow="Start a conversation" title={<>Let’s make something<br /><em>meaningful.</em></>} />
        <p>Have a role, a product challenge, or simply a good idea? I’d love to hear it.</p>
        <button
          type="button"
          className="email-link email-btn-reset"
          onClick={() => openContactForm({ focus: true })}
          aria-label="Start email in contact form"
        >
          <Mail />{contactEmail}
        </button>
        <button
          type="button"
          className="preview-email-trigger"
          onClick={() => {
            playSynthSound('chime');
            setShowPreview(true);
          }}
          style={{ marginTop: '24px' }}
        >
          <span>✉️ Preview Luxury Auto-Response Email</span>
        </button>
      </div>
      <form className="contact-form reveal" onSubmit={submit}>
        <input type="hidden" name="to_email" value={replyEmail} />
        <label>Your name<input name="from_name" required placeholder="What should I call you?" /></label>
        <label>Your email<input name="reply_to" required type="email" value={replyEmail} onChange={(e) => setReplyEmail(e.target.value)} placeholder="Where should I reply?" /></label>
        <label>Tell me a little about it<textarea name="message" required placeholder="A new project, a role, or a note…" rows="4" /></label>
        <button className="button button-primary" disabled={state === 'sending'} type="submit">
          {buttonText} <ArrowUpRight />
        </button>
        <small>{statusText}</small>
      </form>
      <EmailPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </section>
  );
}
