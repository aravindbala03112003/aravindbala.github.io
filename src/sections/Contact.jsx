import { useState } from 'react';
import { contactEmail } from '../data/contact';
import SectionHeading from '../components/SectionHeading';
import { ArrowUpRight, Mail } from '../components/Icons';
import { LuUserRound, LuMail, LuMessageSquareText } from 'react-icons/lu';
import EmailPreviewModal from '../components/EmailPreviewModal';
import { useSound } from '../context/SoundContext';
import {
  sendContactEmail,
  isEmailJsReady,
  sanitizeInput,
  isValidEmail,
} from '../services/emailService';
import { openContactForm } from '../utils/contactNavigation';

export default function Contact() {
  const { playSynthSound } = useSound();

  const [state, setState] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [replyEmail, setReplyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const submit = async (event) => {
    event.preventDefault();

    // Prevent accidental double clicks or concurrent submissions
    if (isSubmitting || state === 'sending') {
      return;
    }

    if (Date.now() - lastSubmitTime < 3000) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    const fromName = sanitizeInput(data.get('from_name'));
    const userEmail = sanitizeInput(data.get('reply_to'));
    const userMessage = sanitizeInput(data.get('message'));

    // Validate required fields
    if (!fromName || !userEmail || !userMessage) {
      setErrorMessage('Please fill in your name, email, and message.');
      setState('error');
      return;
    }

    // Validate email address format
    if (!isValidEmail(userEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setState('error');
      return;
    }

    // EmailJS must be configured
    if (!isEmailJsReady) {
      console.error('EmailJS is not configured.');
      setErrorMessage('Email service is temporarily unavailable. Please try again later.');
      setState('error');
      return;
    }

    setLastSubmitTime(Date.now());
    setIsSubmitting(true);
    setState('sending');
    setErrorMessage('');

    try {
      const result = await sendContactEmail({
        fromName,
        userEmail,
        userMessage,
      });

      // Clear the form after successful notification delivery so message isn't resent
      form.reset();
      setReplyEmail('');
      playSynthSound('success');

      if (result.autoReplySent) {
        setState('sent');
      } else {
        setState('sent-no-reply');
      }
    } catch (error) {
      console.error('Contact email submission error:', error);
      setErrorMessage(error?.message || 'We could not send your message right now. Please try again.');
      setState('error');
    } finally {
      setIsSubmitting(false);
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
        ? 'Your message was delivered successfully! A confirmation email has been sent to your inbox.'
        : state === 'sent-no-reply'
          ? 'Your inquiry was delivered to Aravind! (Automatic acknowledgment email could not be sent to your inbox, but your message was received successfully.)'
          : state === 'error'
            ? (errorMessage || 'We could not send your message right now. Please try again.')
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
        <label className="contact-field-label">
          <span className="contact-label-text">Your name</span>
          <div className="contact-input-wrapper">
            <div className="electric-field-icon electric-name-icon" aria-hidden="true">
              <span className="electric-aura-glow" />
              <span className="electric-arc-ring" />
              <span className="electric-lime-spark" />
              <LuUserRound className="electric-svg-icon" />
            </div>
            <input
              name="from_name"
              required
              autoComplete="name"
              placeholder="What should I call you?"
              onChange={() => {
                if (state === 'error') {
                  setState('idle');
                  setErrorMessage('');
                }
              }}
            />
          </div>
        </label>

        <label className="contact-field-label">
          <span className="contact-label-text">Your email</span>
          <div className="contact-input-wrapper">
            <div className="electric-field-icon electric-email-icon" aria-hidden="true">
              <span className="electric-aura-glow" />
              <span className="electric-sweep-beam" />
              <span className="electric-lime-spark" />
              <LuMail className="electric-svg-icon" />
            </div>
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
                  setErrorMessage('');
                }
              }}
              placeholder="Where should I reply?"
            />
          </div>
        </label>

        <label className="contact-field-label">
          <span className="contact-label-text">Tell me a little about it</span>
          <div className="contact-input-wrapper contact-textarea-wrapper">
            <div className="electric-field-icon electric-message-icon" aria-hidden="true">
              <span className="electric-aura-glow" />
              <span className="electric-ripple-ring" />
              <span className="electric-lime-spark" />
              <LuMessageSquareText className="electric-svg-icon" />
            </div>
            <textarea
              name="message"
              required
              placeholder="A new project, a role, or a note…"
              rows="4"
              onChange={() => {
                if (state === 'error') {
                  setState('idle');
                  setErrorMessage('');
                }
              }}
            />
          </div>
        </label>

        <button
          className="button button-primary"
          disabled={state === 'sending' || isSubmitting}
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