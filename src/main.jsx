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
    <BrowserRouter>
      <ThemeProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Register PWA Service Worker
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA Service Worker registration failed:', err);
      });
  });
}

