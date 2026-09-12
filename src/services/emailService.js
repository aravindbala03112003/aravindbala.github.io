import emailjs from '@emailjs/browser';
import { contactEmail, gmailComposeUrl } from '../data/contact';

export const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export const isEmailJsReady = Boolean(
  emailJsConfig.serviceId && emailJsConfig.templateId && emailJsConfig.publicKey
);

export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

export const openGmailFallback = (formOrData) => {
  let name = '';
  let email = '';
  let message = '';

  if (formOrData instanceof HTMLFormElement) {
    const fd = new FormData(formOrData);
    name = sanitizeInput(fd.get('from_name'));
    email = sanitizeInput(fd.get('reply_to'));
    message = sanitizeInput(fd.get('message'));
  } else if (formOrData && typeof formOrData === 'object') {
    name = sanitizeInput(formOrData.from_name || formOrData.fromName);
    email = sanitizeInput(formOrData.reply_to || formOrData.userEmail);
    message = sanitizeInput(formOrData.message || formOrData.userMessage);
  }

  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const url = gmailComposeUrl('Portfolio enquiry', body);
  const draft = window.open(url, '_blank', 'noopener,noreferrer');
  if (!draft) window.location.assign(url);
};

export async function sendContactEmail({ fromName, userEmail, userMessage }) {
  const cleanName = sanitizeInput(fromName);
  const cleanEmail = sanitizeInput(userEmail);
  const cleanMessage = sanitizeInput(userMessage);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new Error('Please fill in your name, email, and message.');
  }

  const now = new Date();
  const formattedTime =
    now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ' (' +
    now.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ')';

  if (!isEmailJsReady) {
    openGmailFallback({ from_name: cleanName, reply_to: cleanEmail, message: cleanMessage });
    return { status: 'draft', message: 'Opened Gmail draft' };
  }

  // 1. Notification email to portfolio owner
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
    { publicKey: emailJsConfig.publicKey }
  );

  // 2. Luxury Auto-Response confirmation email to the visitor
  if (
    emailJsConfig.autoReplyTemplateId &&
    emailJsConfig.autoReplyTemplateId !== emailJsConfig.templateId
  ) {
    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.autoReplyTemplateId,
        {
          from_name: cleanName,
          to_name: cleanName,
          reply_to: contactEmail,
          to_email: cleanEmail,
          user_email: cleanEmail,
          email: cleanEmail,
          recipient_email: cleanEmail,
          message: cleanMessage,
          submission_time: formattedTime,
        },
        { publicKey: emailJsConfig.publicKey }
      );
    } catch (autoErr) {
      console.warn('Auto-reply send warning:', autoErr);
    }
  }

  return { status: 'sent', message: 'Your message was delivered successfully.' };
}
