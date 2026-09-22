// Aravind Bala Portfolio — Service Worker
const CACHE_NAME = 'aravind-portfolio-v7';
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '') || '';
const withBase = (path) => `${BASE_PATH}${path}`.replace(/\/+/g, '/');

const STATIC_ASSETS = [
  withBase('/'),
  withBase('/index.html'),
  withBase('/manifest.webmanifest'),
  withBase('/favicon.svg'),
  withBase('/favicon.png'),
  withBase('/logo/portfolio-logo.png'),
  withBase('/icons/icon-192.png'),
  withBase('/icons/icon-512.png'),
  withBase('/icons/icon-maskable-512.png'),
  withBase('/apple-touch-icon.png'),
  withBase('/resume.pdf'),
  withBase('/aravindbala_resume_page-0001.jpg')
];

// Install Event: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear older cache versions & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-while-revalidate for assets, Network-first for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests that aren't fonts/CDNs
  if (request.method !== 'GET') return;

  // Navigation requests: Network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match(withBase('/index.html'));
          return fallback || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // Same-origin static assets: Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Third-party assets (Google Fonts, Unpkg, etc.): Cache-first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => null);
    })
  );
});
