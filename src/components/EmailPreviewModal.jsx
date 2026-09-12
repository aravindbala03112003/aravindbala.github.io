import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailPreviewModal({ isOpen, onClose, sampleName = 'Alex Mercer' }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const origBody = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origBody;
    };
  }, [isOpen]);

  const copyTemplateCode = async () => {
    try {
      const res = await fetch('/email-template.html');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      alert('Template file available at /email-template.html');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="email-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="email-modal-container"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Bar */}
          <div className="email-modal-header">
            <div className="email-modal-title">
              <span className="email-modal-badge">PREMIUM AUTO-RESPONDER</span>
              <h3>Interactive Email Preview</h3>
            </div>
            <div className="email-modal-actions">
              <button className="copy-template-btn" onClick={copyTemplateCode}>
                {copied ? '✓ HTML Copied!' : 'Copy HTML for EmailJS'}
              </button>
              <button className="email-modal-close" onClick={onClose} aria-label="Close email preview">
                ✕
              </button>
            </div>
          </div>

          {/* Live Rendered Email Container */}
          <div className="email-modal-body">
            <iframe
              src={`${import.meta.env.BASE_URL}email-template.html`}
              title="Aravind Bala Auto-Response Email Preview"
              className="email-preview-iframe"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
