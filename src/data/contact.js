export const contactEmail = 'aravindbala3112003@gmail.com';

export const gmailComposeUrl = (subject = 'Portfolio enquiry', body = '') => {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: contactEmail, su: subject, body });
  return `https://mail.google.com/mail/?${params}`;
};
