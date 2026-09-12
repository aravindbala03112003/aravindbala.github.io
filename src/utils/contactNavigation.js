export function openContactForm({ focus = true } = {}) {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  contactSection.scrollIntoView({ behavior: 'smooth' });

  if (focus) {
    setTimeout(() => {
      const nameInput = contactSection.querySelector('input[name="from_name"]');
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
      const form = contactSection.querySelector('.contact-form');
      if (form) {
        form.classList.remove('contact-highlight');
        void form.offsetWidth; // Force CSS reflow
        form.classList.add('contact-highlight');
        setTimeout(() => form.classList.remove('contact-highlight'), 2200);
      }
    }, 450);
  }
}
