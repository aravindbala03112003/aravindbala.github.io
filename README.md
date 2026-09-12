# Aravind Bala Portfolio

A responsive React portfolio with a premium editorial visual system, theme switcher, project showcase, and animated section reveals.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Run `npm run build` and deploy the generated `dist` directory to Vercel, Netlify, or any static host. Add `public/resume.pdf` to enable the résumé download link.

## Contact delivery

The contact form opens a prefilled Gmail draft by default, so visitors can always send a message. To send submissions automatically, create a local `.env` file from `.env.example` and add your EmailJS service ID, template ID, and public key. Configure the template with `from_name`, `reply_to`, and `message` variables.
