import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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