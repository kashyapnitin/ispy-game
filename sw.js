// Service worker for I Spy Digital Game
// Bump CACHE_NAME (e.g. to ispy-shell-v6) when you change shell assets (HTML/CSS/JS)
// so existing clients get the new SW and old shell cache is cleared on activate.
// Precache URLs are relative to the SW scope so they work at any base path (e.g. / or /ispy-game/).

const CACHE_NAME = 'ispy-shell-v7';
const VOICE_CACHE_NAME = 'ispy-voices-v1';
// Relative to registration scope (no leading slash) so cache keys match page fetch URLs
const PRECACHE_URLS = [
  'index.html',
  'css/style.css',
  'js/main.js',
  'manifest.webmanifest',
  'assets/ispy-app-icon-32.png',
  'assets/ispy-app-icon-512-square.png',
  'assets/ispy-app-icon-512.png',
  // Scene background images (offline play)
  'assets/images/scenes/scene_animalfarm.png',
  'assets/images/scenes/scene_toyshop.jpg',
  'assets/images/scenes/scene_kitchen.jpg',
  'assets/images/scenes/scene_playground.jpg',
  'assets/images/scenes/scene_beach.jpg',
  // Hotspot JSON (required for each scene to load offline)
  'scripts/data/hotspots/animalfarm.json',
  'scripts/data/hotspots/playground.json',
  'scripts/data/hotspots/toyshop.json',
  'scripts/data/hotspots/kitchen.json',
  'scripts/data/hotspots/beach.json'
];

self.addEventListener('install', (event) => {
  const scope = self.registration.scope;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((path) => {
        const url = new URL(path, scope).href;
        return cache.add(url).catch((err) => {
          console.warn('sw: failed to precache', url, err);
        });
      }))
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

function getIndexUrl() {
  return new URL('index.html', self.registration.scope).href;
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

  // Navigation to scope root (e.g. / or /ispy-game/) -> serve cached index.html
  if (request.mode === 'navigate') {
    const scopeUrl = new URL(self.registration.scope);
    const requestUrl = new URL(url);
    const scopePath = scopeUrl.pathname.replace(/\/$/, '') || '/';
    const requestPath = requestUrl.pathname.replace(/\/$/, '') || '/';
    const isScopeRoot = requestUrl.origin === scopeUrl.origin && (requestPath === scopePath || requestPath + '/' === scopePath || requestPath === scopePath + '/');
    if (isScopeRoot) {
      event.respondWith(
        caches.match(new Request(getIndexUrl())).then((cached) => {
          if (cached) return cached;
          return fetch(request).catch(() => caches.match(getIndexUrl()).then((r) => r || new Response('', { status: 503, statusText: 'Service Unavailable' })));
        })
      );
      return;
    }
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

