import emailjs from '@emailjs/browser';
import { contactEmail } from '../data/contact.js';

/*
 * ============================================================
 * EMAILJS CONFIGURATION
 * ============================================================
 *
 * Values are injected at build time by Vite from local .env or
 * GitHub repository secrets during CI/CD.
 */
const cleanEnv = (value, fallback = '') => {
  if (!value || typeof value !== 'string') return fallback;
  const clean = value.trim().replace(/^["']|["']$/g, '');
  return clean || fallback;
};

export const emailJsConfig = {
  serviceId: cleanEnv(import.meta.env?.VITE_EMAILJS_SERVICE_ID, 'service_o3uqjxf'),
  templateId: cleanEnv(import.meta.env?.VITE_EMAILJS_TEMPLATE_ID, 'template_sdls3up'),
  autoReplyTemplateId: cleanEnv(import.meta.env?.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID, 'template_84dy4nn'),
  publicKey: cleanEnv(import.meta.env?.VITE_EMAILJS_PUBLIC_KEY, 'vikiT2Tf4PATmJ-n2'),
};

// Initialize EmailJS browser SDK with public key if available
if (typeof window !== 'undefined' && emailJsConfig.publicKey) {
  try {
    emailjs.init(emailJsConfig.publicKey);
  } catch (initErr) {
    console.warn('[EmailJS] SDK init warning:', initErr);
  }
}

/*
 * EmailJS is ready only when the required browser-side
 * configuration exists.
 */
export const isEmailJsReady = Boolean(
  emailJsConfig.serviceId &&
  emailJsConfig.templateId &&
  emailJsConfig.publicKey
);

/*
 * ============================================================
 * INPUT SANITIZATION & VALIDATION
 * ============================================================
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/<[^>]*>?/gm, '')
    .trim();
};

export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
};

/*
 * ============================================================
 * TWO-EMAIL WORKFLOW (NOTIFICATION + AUTO-REPLY)
 * ============================================================
 *
 * Step 1: Validate all form fields and email syntax.
 * Step 2: Send notification to portfolio owner (Aravind's inbox).
 *         If this fails, throw immediately — DO NOT send acknowledgment.
 * Step 3: Send automatic acknowledgment to visitor (their inbox).
 *         If this fails, preserve successful notification result,
 *         record failure, and return truthful outcome.
 */
export async function sendContactEmail({
  fromName,
  userEmail,
  userMessage,
}) {
  const cleanName = sanitizeInput(fromName);
  const cleanEmail = sanitizeInput(userEmail);
  const cleanMessage = sanitizeInput(userMessage);

  /*
   * Step 1: Validate form data and syntax
   */
  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new Error('Please fill in your name, email, and message.');
  }

  if (!isValidEmail(cleanEmail)) {
    throw new Error('Please provide a valid email address.');
  }

  if (!isEmailJsReady) {
    throw new Error('Email service is not configured.');
  }

  const now = new Date();
  const formattedTime =
    now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }) +
    ' (' +
    now.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    }) +
    ')';

  /*
   * Step 2: Send Notification Email to Portfolio Owner
   *
   * Template: template_sdls3up
   * Recipient: contactEmail (configured in EmailJS dashboard)
   */
  console.info('[EmailJS] Step 1: Sending notification inquiry to portfolio owner...');
  try {
    await emailjs.send(
      emailJsConfig.serviceId,
      emailJsConfig.templateId,
      {
        from_name: cleanName,
        reply_to: cleanEmail,
        user_email: cleanEmail,
        email: cleanEmail,
        to_email: contactEmail,
        message: cleanMessage,
        submission_time: formattedTime,
      },
      emailJsConfig.publicKey
    );
    console.info('[EmailJS] Step 1: Notification inquiry delivered successfully.');
  } catch (notificationError) {
    console.error('[EmailJS] Step 1 FAILED: Notification delivery error:', notificationError?.text || notificationError?.message || notificationError);
    // Abort workflow: do not send acknowledgment if notification failed
    throw new Error('Failed to deliver your message. Please try again.');
  }

  /*
   * Step 3: Send Automatic Acknowledgment to Visitor
   *
   * Template: template_84dy4nn (Auto-Reply)
   * Recipient: visitor's email address ({{to_email}})
   * Greeting: Hello {{from_name}},
   */
  let autoReplySent = false;
  let autoReplyError = null;

  if (
    emailJsConfig.autoReplyTemplateId &&
    emailJsConfig.autoReplyTemplateId !== emailJsConfig.templateId
  ) {
    console.info('[EmailJS] Step 2: Sending automatic acknowledgment to visitor:', cleanEmail);
    try {
      const response = await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.autoReplyTemplateId,
        {
          // Primary recipient expected by EmailJS Auto-Reply dashboard setting
          to_email: cleanEmail,
          // Visitor name for the greeting: Hello {{from_name}}
          from_name: cleanName,
          to_name: cleanName,
          // Common fallback variables in case template is adapted
          user_email: cleanEmail,
          email: cleanEmail,
          recipient_email: cleanEmail,
          // Owner reply-to address
          reply_to: contactEmail,
          // Inquiry reference
          message: cleanMessage,
          submission_time: formattedTime,
        },
        emailJsConfig.publicKey
      );
      console.info('[EmailJS] Step 2: Auto-reply acknowledgment sent successfully (Status:', response?.status || 200, ').');
      autoReplySent = true;
    } catch (replyErr) {
      console.warn('[EmailJS] Step 2: Auto-reply acknowledgment failed:', replyErr?.text || replyErr?.message || replyErr);
      autoReplyError = replyErr;
    }
  }

  /*
   * Return independent outcomes
   */
  return {
    status: 'sent',
    notificationSent: true,
    autoReplySent,
    autoReplyError: autoReplyError ? (autoReplyError?.text || autoReplyError?.message || 'Auto-reply delivery issue') : null,
    visitorEmail: cleanEmail,
    message: autoReplySent
      ? 'Your message was delivered and an acknowledgment has been sent to your email.'
      : 'Your message was delivered to Aravind! (Automatic acknowledgment could not be sent to your address, but your inquiry was received.)',
  };
}

/*
 * Safe retry helper: sends ONLY the auto-reply acknowledgment
 * without resending duplicate notification inquiries.
 */
export async function sendAutoReplyOnly({ fromName, userEmail, userMessage }) {
  const cleanName = sanitizeInput(fromName);
  const cleanEmail = sanitizeInput(userEmail);
  const cleanMessage = sanitizeInput(userMessage);

  if (!cleanName || !cleanEmail || !isValidEmail(cleanEmail)) {
    throw new Error('Valid visitor name and email are required for acknowledgment.');
  }

  const now = new Date();
  const formattedTime =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ' (' +
    now.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ')';

  return emailjs.send(
    emailJsConfig.serviceId,
    emailJsConfig.autoReplyTemplateId,
    {
      to_email: cleanEmail,
      from_name: cleanName,
      to_name: cleanName,
      user_email: cleanEmail,
      email: cleanEmail,
      recipient_email: cleanEmail,
      reply_to: contactEmail,
      message: cleanMessage,
      submission_time: formattedTime,
    },
    emailJsConfig.publicKey
  );
}