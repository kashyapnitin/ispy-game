# PWA status and what’s left

## Original 4-phase plan

| Phase | Goal | Status |
|-------|------|--------|
| **1** | Installable shell (manifest, icons, SW registration) | ✅ Done |
| **2** | Offline shell + core assets (precache HTML, CSS, JS, manifest, app icon, scene thumbnails, hotspot JSON) | ✅ Done |
| **3** | Graceful offline behaviour (offline banner, dismiss, toast messages, scene load failure → back to menu, voice text fallback, no `/undefined`, SW fetch 503 on failure) | ✅ Done |
| **4** | Fine-tuning (cache versioning, full scene images, voice caching) | ✅ Done |

---

## What’s left for a “complete” PWA

1. **Cache versioning**  
   ✅ Done. `CACHE_NAME` is `ispy-shell-v3`; a comment in `sw.js` says to bump it when shell assets change. Activate deletes only caches whose name starts with `ispy-shell-` and is not the current `CACHE_NAME`, so voice cache is never wiped.

2. **Full scene background images offline**  
   ✅ Done. Precache list includes the exact URLs used by each scene for the game background (including `scene_playground.jpg?v=3` for playground), so all four scenes are playable offline from first install.

3. **Voice hints cached on first scene load**  
   ✅ Implemented (SW network-first for voice URLs + page prefetch of all hint/found for the scene on first load).

4. **Optional later improvements**  
   - Cache size / eviction (e.g. limit voice cache or use LRU if you add many languages).  
   - “Update available” prompt when a new SW is waiting (e.g. `skipWaiting` + prompt to reload).  
   - Offline fallback page only if you want a custom “You’re offline” page instead of the app shell.

---

## Voice caching (hint + found on first scene load)

**Behaviour:**

- **Service worker**  
  For requests to `assets/audio/voices/…/*.mp3` the SW uses a **network-first** strategy: fetch from the network, store a copy in a dedicated cache (`ispy-voices-v1`), then return the response. If the network fails (e.g. offline), it serves from that cache. So every hint/found played is cached for next time.

- **Page (aggressive prefetch)**  
  When a scene has finished loading and the game screen is shown, the page starts a **background prefetch** of all hint and found clips for the current language and the objects in that scene (`gameState.objectsToFind`). Those requests go through the SW, which fetches and caches them. So on first load of a scene in a given language, all 14 hint + 14 found URLs for that scene are cached as they’re requested in the background.

**What you need:**

- In **`sw.js`**: a separate cache name for voices; in the `fetch` handler, detect voice URLs and run network-first (fetch → clone → `caches.open('ispy-voices-v1').then(c => c.put(request, clone))`), then return the response; on fetch error, `caches.match(request)` for that voice cache. Other URLs keep the existing cache-first (or 503 on failure) behaviour.
- In **`main.js`**: after the scene is ready (e.g. after `switchScreen('game')` and the rest of init), call something like `prefetchSceneVoices(currentLang, gameState.objectsToFind)`. That function opens `ispy-voices-v1`, then for each object does `cache.add(fullUrl)` for both `hint_<Name>.mp3` and `found_<Name>.mp3` (with name sanitized: spaces → underscores). Use `location.origin` so the URL is absolute. Run it in the background (don’t block the UI; catch errors so offline prefetch doesn’t throw).
- **Activate handler**: when cleaning old caches, only remove old **shell** caches (e.g. names that start with `ispy-shell-` and are not the current `CACHE_NAME`), and leave `ispy-voices-v1` (and any future voice version) intact.

With that, the first time a scene loads in a given language, all its voice clips are cached (by prefetch + play), and later plays or offline use are served from cache.
