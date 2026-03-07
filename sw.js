// Service worker for I Spy Digital Game
// Bump CACHE_NAME (e.g. to ispy-shell-v4) when you change shell assets (HTML/CSS/JS)
// so existing clients get the new SW and old shell cache is cleared on activate.

const CACHE_NAME = 'ispy-shell-v3';
const VOICE_CACHE_NAME = 'ispy-voices-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.webmanifest',
  '/assets/ispy-app-icon-512.png',
  // Full scene background images (exact URLs used by scene data for offline play)
  '/assets/images/scenes/toyshop/scene_toyshop.jpg',
  '/assets/images/scenes/kitchen/scene_kitchen.jpg',
  '/assets/images/scenes/playground/scene_playground.jpg',
  '/assets/images/scenes/playground/scene_playground.jpg?v=3',
  '/assets/images/scenes/beach/scene_beach.jpg',
  // Hotspot JSON used for gameplay
  '/scripts/playground_hotspots.json',
  '/scripts/toyshop_hotspots.json',
  '/scripts/kitchen_hotspots.json',
  '/scripts/beach_hotspots.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url).catch((err) => {
        console.warn('sw: failed to cache', url, err);
      })))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key.startsWith('ispy-shell-') && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

function isVoiceRequest(url) {
  try {
    const u = new URL(url);
    return u.pathname.includes('/assets/audio/voices/') && u.pathname.endsWith('.mp3');
  } catch (_) {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = request.url;
  if (isVoiceRequest(url)) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(VOICE_CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).catch(() => {
        return new Response('', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

