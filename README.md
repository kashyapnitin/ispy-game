# I Spy Digital Game

An accessible, browser-based "I Spy" / hidden-object game for young kids (roughly ages 2–6). Children pick a scene (Animal Farm, Toyshop, Kitchen, Playground, Beach), then find all the hidden objects with visual effects, simple sounds, and localized voice hints.

---

## Tech Stack

- **Frontend**: Static HTML + CSS + vanilla JavaScript
- **Rendering**: Absolutely positioned **hotspot hitboxes** over high‑resolution background images (legacy per-object sprites are archived), tuned for desktop and tablets
- **Effects**: Canvas-based confetti, simple Web Audio API tones
- **Content**:
  - Scene and object data in `js/data/scenes/scene-*.js`
  - UI translations and object names in `js/data/i18n-core.js`
  - Pre-generated MP3 voice lines in `assets/audio/voices/<lang>/<sceneId>/`

**Key files at project root:**

- **`manifest.webmanifest`** – PWA manifest (name, icons, display mode) for install and home screen.
- **`package.json`** – npm scripts: `test:e2e` (Playwright), `test:consistency` (data/asset checks).
- **`playwright.config.js`** – Playwright E2E test config (base URL, timeouts).
- **`sw.js`** – Service worker; caches shell and assets for offline play.

---

## Running the App Locally

This is a static site; you just need a simple HTTP server (no build step).

From the project root:

```bash
cd /Users/nitinkashyap/Projects/ispy-game
python3 -m http.server 8000
```

Then open the game in your browser at:

- `http://localhost:8000/`

You should see the main menu with a language dropdown and a scene carousel. Pick a scene to start playing.

---

## PWA and offline

The app is a **Progressive Web App (PWA)** and can be installed on supported devices (e.g. Add to Home Screen). When served over HTTPS (or localhost), a service worker caches the shell (HTML, CSS, JS, manifest, icons, scene images, hotspot JSON) so the game runs **offline** after the first load. Voice hint and found clips are cached on first play per scene and language, so repeated play and offline use work without re-downloading.

---

## Environment Variables

Secrets and API keys are kept in a local `.env` file at the project root (which is ignored by git).

Expected keys:

- `OPENAI_API_KEY` – used by `scripts/tools/assets/generate_dalle_assets.py` for image generation
- `ELEVENLABS_API_KEY` – used by scripts under `scripts/tools/audio/` for TTS generation

Example `.env`:

```bash
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=elevenlabs_...
```

---

## Asset / Content Scripts

Helper scripts live under `scripts/tools/` (see `scripts/README.md` for the full layout). Run commands from the **project root**. They are optional and only needed when regenerating assets or adding scenes.

- **Data**
  - **Dump game data**: `python3 scripts/tools/data/dump_data.py`  
    Parses `js/data/i18n-core.js` and `js/data/scenes/scene-*.js` into `scripts/data/ui.json`, `scripts/data/scenes/*.json`, and legacy `scripts/game_data.json`.
  - **Consistency check**: `python3 scripts/tools/data/check_consistency.py`  
    Verifies scene JS, hotspot JSON, and assets.

- **Audio** (under `scripts/tools/audio/`)
  - **Per-scene**: `python3 scripts/tools/audio/generate_scene_audio.py --scene <id>` – one scene, all or one language.
  - **Scene-specific bulk**: `generate_audio_animalfarm_all_langs.py`, `generate_audio_kitchen_beach_all_langs.py`, `generate_audio_toyshop_all_langs.py` (ElevenLabs for en/hi, gTTS for others).
  - **Generic**: `generate_audio.py` (full regen; uses `game_data.json`; falls back to mock MP3s if no API key).
  - **Voices**: `list_voices.py`, `find_specific_voices.py` – discover ElevenLabs voices.

- **Assets** (under `scripts/tools/assets/`)
  - **Bbox editor**: `python3 scripts/tools/assets/bbox_editor.py --image <path> --output scripts/data/hotspots/<id>.json` – draw hotspot bounding boxes.
  - **DALL·E sprites** (legacy): `generate_dalle_assets.py` – uses `OPENAI_API_KEY`. Scenes use hotspot-only mode; object sprite art is no longer used.

Before running scripts, install Python dependencies (e.g. `requests`, `chompjs`, ElevenLabs SDK) as needed.

---

## Project Status

- Five scenes are fully playable: **Animal Farm**, Toyshop, Kitchen, Playground, and Beach.
- All scenes run in **hotspot-only** mode: one background image per scene; tappable regions are percentage-based bounding boxes from `scripts/data/hotspots/<scene>.json`. Each playthrough activates a subset (e.g. 14 objects); sidebar thumbnails are cropped from the background. On a correct tap, the found object briefly pops out (zoom + shadow) before confetti; hints (tap 3× in sidebar) use the same highlight without confetti.
- Internationalization is wired for many languages; hotspot objects are localized. Voice hint/found lines are pre-generated (ElevenLabs for en/hi; gTTS for others), with tooling under `scripts/tools/audio/` to regenerate or extend.
- To add a new scene, see **`docs/ADD-NEW-SCENE.md`**.

## Testing

- **Consistency**: `npm run test:consistency` (or `python3 scripts/tools/data/check_consistency.py`).
- **E2E**: `npm run test:e2e` (Playwright; run `npx playwright install` if needed).

## Docs

Conventions and guides are in **`docs/`**: scene/data JSON conventions, visual guidelines, add-new-scene checklist. See `docs/README.md`.

