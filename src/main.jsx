import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import './styles/global.css';
import './styles/premium.css';
import './styles/depth3d.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Auto-recover from Vite dynamic preload errors (stale chunks after deployment)
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preload error detected, auto-reloading page for fresh assets...', event);
    window.location.reload();
  });
}

// Register PWA Service Worker (unregister in dev to prevent stale caching)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`)
        .then((reg) => {
          reg.update();
          console.log('PWA Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('PWA Service Worker registration failed:', err);
        });
    });
  }
}

