# I Spy Digital Game

An accessible, browser-based "I Spy" / hidden-object game for young kids (roughly ages 2–6). Children pick a scene (Toyshop, Kitchen, Playground, Beach), then find all the hidden objects with visual effects, simple sounds, and localized voice hints.

---

## Tech Stack

- **Frontend**: Static HTML + CSS + vanilla JavaScript
- **Rendering**: Absolutely positioned **hotspot hitboxes** over high‑resolution background images (legacy per-object sprites are archived), tuned for desktop and tablets
- **Effects**: Canvas-based confetti, simple Web Audio API tones
- **Content**:
  - Scene and object data in `js/data/scenes/scene-*.js`
  - UI translations and object names in `js/data/i18n-core.js`
  - Pre-generated MP3 voice lines in `assets/audio/voices/<lang>/`

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

## Environment Variables

Secrets and API keys are kept in a local `.env` file at the project root (which is ignored by git).

Expected keys:

- `OPENAI_API_KEY` – used by `scripts/generate_dalle_assets.py` for image generation
- `ELEVENLABS_API_KEY` – used by the ElevenLabs-related scripts for TTS generation

Example `.env`:

```bash
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=elevenlabs_...
```

---

## Asset / Content Scripts

All helper scripts live in the `scripts/` directory. They are optional and only needed when regenerating assets.

- **Dump game data to JSON**
  - `scripts/dump_data.py`
  - Parses `js/data/i18n-core.js` and `js/data/scenes/scene-*.js` into `scripts/game_data.json`.

- **Generate hint/found voice lines**
  - **Generic full regen**: `scripts/generate_audio.py`
    - Reads `scripts/game_data.json`, expands translations, and generates `hint_*.mp3` / `found_*.mp3` into `assets/audio/voices/<lang>/`.
    - Uses `ELEVENLABS_API_KEY` from `.env`. If the key is missing, it falls back to writing small mock MP3 files.
  - **Per‑scene / hotspot-aware flows**:
    - `scripts/generate_scene_audio.py` – generate audio for a single scene/language via `--scene` / `--lang` / `--engine`.
    - `scripts/generate_audio_toyshop_all_langs.py` – 28 hotspot objects in the toyshop scene (ElevenLabs for English/Hindi, gTTS for others).
    - `scripts/generate_audio_kitchen_beach_all_langs.py` – 28 hotspot objects each for **kitchen**, **beach**, and **playground`** (same ElevenLabs/gTTS split).

- **Discover and inspect ElevenLabs voices**
  - `scripts/find_specific_voices.py` – queries shared voices by name (e.g., Tripti, Stacy).
  - `scripts/list_voices.py` – lists potential kid-friendly voices from your ElevenLabs account.

- **Generate DALL·E object sprites** (legacy)
  - `scripts/tools/generate_dalle_assets.py`
  - Uses `OPENAI_API_KEY` to generate PNG sprites for individual objects. Scenes now use hotspot-only mode (background image + bounding boxes); object sprite art is no longer used and the former `assets/images/archive/` folder has been removed.

Before running any of the above, install Python dependencies (e.g. `requests`, `chompjs`, ElevenLabs SDK) into your environment as needed.

---

## Project Status

- Multiple scenes are fully playable (Toyshop, Kitchen, Playground, Beach).
- The **Toyshop**, **Kitchen**, **Playground**, and **Beach** scenes now run in a unified **hotspot-only** mode:
  - The background image is the only visual; tappable regions are defined as percentage‑based bounding boxes loaded from `scripts/<scene>_hotspots.json`.
  - Each of these scenes defines **28 hotspot objects**; each playthrough randomly activates **14** of them.
  - Sidebar thumbnails are cropped directly from the background image, keeping visuals perfectly consistent across languages.
  - On a correct tap, the found object briefly “pops out” of the image (zoom + shadow) before confetti.
  - Hints (tapping an item 3 times in the sidebar) use the same pop-out highlight but **without** confetti.
- Internationalization is wired up for many languages; all hotspot objects in the four main scenes are localized across the supported locales.
- Static audio hint/found lines are pre-generated for every hotspot object (ElevenLabs for English and Hindi; gTTS for other languages), with scripts in place to easily regenerate or extend coverage.
- Asset-generation tooling is in-place to grow scenes and localized voice lines over time.

