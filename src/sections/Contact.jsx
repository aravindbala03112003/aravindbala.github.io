import { useState } from 'react';
import { contactEmail } from '../data/contact';
import SectionHeading from '../components/SectionHeading';
import { ArrowUpRight, Mail } from '../components/Icons';
import EmailPreviewModal from '../components/EmailPreviewModal';
import { useSound } from '../context/SoundContext';
import {
  sendContactEmail,
  isEmailJsReady,
  sanitizeInput,
} from '../services/emailService';
import { openContactForm } from '../utils/contactNavigation';

export default function Contact() {
  const { playSynthSound } = useSound();

  const [state, setState] = useState('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const submit = async (event) => {
    event.preventDefault();

    // Prevent accidental double submissions.
    if (Date.now() - lastSubmitTime < 5000) {
      return;
    }

    setLastSubmitTime(Date.now());

    const form = event.currentTarget;
    const data = new FormData(form);

    const fromName = sanitizeInput(data.get('from_name'));
    const userEmail = sanitizeInput(data.get('reply_to'));
    const userMessage = sanitizeInput(data.get('message'));

    // Validate required fields.
    if (!fromName || !userEmail || !userMessage) {
      setState('error');
      return;
    }

    // EmailJS must be configured.
    if (!isEmailJsReady) {
      console.error('EmailJS is not configured.');
      setState('error');
      return;
    }

    setState('sending');

    try {
      playSynthSound('success');

      const result = await sendContactEmail({
        fromName,
        userEmail,
        userMessage,
      });

      // Only clear the form after successful delivery.
      form.reset();
      setReplyEmail('');

      if (result.autoReplySent) {
        setState('sent');
      } else {
        setState('sent-no-reply');
      }
    } catch (error) {
      console.error('Contact email submission error:', error);

      // IMPORTANT:
      // Never open Gmail or create a draft.
      // The visitor stays on the portfolio.
      setState('error');
    }
  };

  const buttonText =
    state === 'sending'
      ? 'Sending…'
      : state === 'sent'
        ? 'Message sent — thank you!'
        : state === 'sent-no-reply'
          ? 'Message sent — thank you!'
          : state === 'error'
            ? 'Try again'
            : 'Send message';

  const statusText =
    state === 'sending'
      ? 'Sending your message securely…'
      : state === 'sent'
        ? 'Your message was delivered successfully. Check your inbox for the luxury auto-response.'
        : state === 'sent-no-reply'
          ? 'Your message was delivered successfully.'
          : state === 'error'
            ? 'We could not send your message right now. Please try again.'
            : 'Your message is delivered securely through EmailJS with instant auto-response.';

  return (
    <section id="contact" className="section contact container">
      <div
        className="contact-3d-orbital-halo"
        aria-hidden="true"
      />

      <div
        className="contact-spatial-nodes"
        aria-label="Direct transmission channels"
      >
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
        <SectionHeading
          eyebrow="Start a conversation"
          title={
            <>
              Let’s make something
              <br />
              <em>meaningful.</em>
            </>
          }
        />

        <p>
          Have a role, a product challenge, or simply a good idea?
          I’d love to hear it.
        </p>

        <button
          type="button"
          className="email-link email-btn-reset"
          onClick={() => openContactForm({ focus: true })}
          aria-label="Start email in contact form"
        >
          <Mail />
          {contactEmail}
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

      <form
        className="contact-form reveal"
        onSubmit={submit}
      >
        <label>
          Your name

          <input
            name="from_name"
            required
            autoComplete="name"
            placeholder="What should I call you?"
          />
        </label>

        <label>
          Your email

          <input
            name="reply_to"
            required
            type="email"
            autoComplete="email"
            value={replyEmail}
            onChange={(event) => {
              setReplyEmail(event.target.value);

              if (state === 'error') {
                setState('idle');
              }
            }}
            placeholder="Where should I reply?"
          />
        </label>

        <label>
          Tell me a little about it

          <textarea
            name="message"
            required
            placeholder="A new project, a role, or a note…"
            rows="4"
            onChange={() => {
              if (state === 'error') {
                setState('idle');
              }
            }}
          />
        </label>

        <button
          className="button button-primary"
          disabled={state === 'sending'}
          type="submit"
        >
          {buttonText}
          <ArrowUpRight />
        </button>

        <small aria-live="polite">
          {statusText}
        </small>
      </form>

      <EmailPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </section>
  );
}