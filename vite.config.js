import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Clean and normalize EmailJS environment variables at build time
const targetContactTemplateId = 'template_sdls3up';
const targetAutoReplyTemplateId = 'template_84dy4nn';
const targetServiceId = 'service_o3uqjxf';

if (process.env.VITE_EMAILJS_TEMPLATE_ID) {
  const cleanTemplate = process.env.VITE_EMAILJS_TEMPLATE_ID.trim().replace(/^["']|["']$/g, '');
  if (
    cleanTemplate === 'template_sdl3sup' ||
    cleanTemplate === 'template_sdlssup' ||
    cleanTemplate.includes('sdl3') ||
    cleanTemplate.includes('sdlss') ||
    !cleanTemplate
  ) {
    process.env.VITE_EMAILJS_TEMPLATE_ID = targetContactTemplateId;
  } else {
    process.env.VITE_EMAILJS_TEMPLATE_ID = cleanTemplate;
  }
} else {
  process.env.VITE_EMAILJS_TEMPLATE_ID = targetContactTemplateId;
}

if (process.env.VITE_EMAILJS_SERVICE_ID) {
  process.env.VITE_EMAILJS_SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID.trim().replace(/^["']|["']$/g, '');
} else {
  process.env.VITE_EMAILJS_SERVICE_ID = targetServiceId;
}

if (process.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID) {
  process.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID = process.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID.trim().replace(/^["']|["']$/g, '');
} else {
  process.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID = targetAutoReplyTemplateId;
}

if (process.env.VITE_EMAILJS_PUBLIC_KEY) {
  process.env.VITE_EMAILJS_PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY.trim().replace(/^["']|["']$/g, '');
}

export default defineConfig({
  root: __dirname,

  // GitHub Pages project-site base path
  base: '/aravindbala.github.io/',

  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      ignored: [
        '**/resume/**',
        '**/.vercel/**',
        '**/dist/**',
        '**/tmp/**',
        '**/*.zip',
        '**/*.apk',
        '**/android/**',
      ],
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }

            if (
              id.includes('framer-motion') ||
              id.includes('gsap') ||
              id.includes('lenis')
            ) {
              return 'motion';
            }

            return 'vendor';
          }
        },
      },
    },

    chunkSizeWarningLimit: 1200,
  },
});