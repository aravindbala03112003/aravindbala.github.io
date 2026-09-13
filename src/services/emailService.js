import emailjs from '@emailjs/browser';
import { contactEmail } from '../data/contact';

/*
 * ============================================================
 * EMAILJS CONFIGURATION
 * ============================================================
 *
 * These values are injected by Vite during the GitHub Actions
 * build from the GitHub repository secrets.
 */
const cleanEnv = (value, fallback = '') => {
  if (!value || typeof value !== 'string') return fallback;
  const clean = value.trim().replace(/^["']|["']$/g, '');
  return clean || fallback;
};

export const emailJsConfig = {
  serviceId: cleanEnv(import.meta.env.VITE_EMAILJS_SERVICE_ID, 'service_o3uqjxf'),
  templateId: cleanEnv(import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 'template_sdls3up'),
  autoReplyTemplateId: cleanEnv(import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID, 'template_84dy4nn'),
  publicKey: cleanEnv(import.meta.env.VITE_EMAILJS_PUBLIC_KEY),
};

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
 * INPUT SANITIZATION
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

/*
 * ============================================================
 * SEND CONTACT EMAIL
 * ============================================================
 *
 * Expected flow:
 *
 * Visitor
 *   ↓
 * Contact form
 *   ↓
 * EmailJS
 *   ├── 1. Send message to Aravind's Gmail
 *   └── 2. Send automatic confirmation to visitor
 *
 * IMPORTANT:
 * There is intentionally NO Gmail compose/draft fallback here.
 * If EmailJS fails, the function throws an error so the UI can
 * clearly tell the visitor that sending failed.
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
   * Validate form data.
   */
  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new Error(
      'Please fill in your name, email, and message.'
    );
  }

  /*
   * Validate email configuration.
   */
  if (!isEmailJsReady) {
    throw new Error(
      'Email service is not configured.'
    );
  }

  /*
   * ==========================================================
   * SUBMISSION TIME
   * ==========================================================
   */
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
   * ==========================================================
   * 1. SEND MESSAGE TO PORTFOLIO OWNER
   * ==========================================================
   *
   * The Contact template receives these variables:
   *
   * {{from_name}}
   * {{reply_to}}
   * {{user_email}}
   * {{to_email}}
   * {{message}}
   * {{submission_time}}
   */
  await emailjs.send(
    emailJsConfig.serviceId,
    emailJsConfig.templateId,
    {
      from_name: cleanName,
      reply_to: cleanEmail,
      user_email: cleanEmail,
      to_email: contactEmail,
      message: cleanMessage,
      submission_time: formattedTime,
    },
    {
      publicKey: emailJsConfig.publicKey,
    }
  );

  /*
   * ==========================================================
   * 2. AUTOMATIC VISITOR AUTO-REPLY
   * ==========================================================
   *
   * This runs ONLY after the owner's email was successfully sent.
   *
   * The auto-reply template should use the visitor's email
   * variable as its recipient.
   */
  let autoReplySent = false;

  if (
    emailJsConfig.autoReplyTemplateId &&
    emailJsConfig.autoReplyTemplateId !== emailJsConfig.templateId
  ) {
    await emailjs.send(
      emailJsConfig.serviceId,
      emailJsConfig.autoReplyTemplateId,
      {
        from_name: cleanName,
        to_name: cleanName,

        /*
         * Visitor's email.
         */
        to_email: cleanEmail,
        user_email: cleanEmail,
        email: cleanEmail,
        recipient_email: cleanEmail,

        /*
         * Portfolio owner's email.
         */
        reply_to: contactEmail,

        /*
         * Original message.
         */
        message: cleanMessage,

        /*
         * Submission timestamp.
         */
        submission_time: formattedTime,
      },
      {
        publicKey: emailJsConfig.publicKey,
      }
    );

    autoReplySent = true;
  }

  /*
   * ==========================================================
   * SUCCESS
   * ==========================================================
   */
  return {
    status: 'sent',
    autoReplySent,
    message: autoReplySent
      ? 'Your message was delivered successfully.'
      : 'Your message was delivered successfully. Auto-reply is not configured.',
  };
}