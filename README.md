# I Spy Digital Game

An accessible, browser-based "I Spy" / hidden-object game for young kids (roughly ages 2–6). Children pick a scene (Toyshop, Kitchen, Playground, Beach), then find all the hidden objects with visual effects, simple sounds, and localized voice hints.

---

## Tech Stack

- **Frontend**: Static HTML + CSS + vanilla JavaScript
- **Rendering**: Absolutely positioned hitboxes with per-object sprites, responsive layout tuned for desktop and tablets
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
python3 -m http.server 8080
```

Then open the game in your browser at:

- `http://localhost:8080/`

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
  - `scripts/generate_audio.py`
  - Reads `scripts/game_data.json`, expands translations, and generates `hint_*.mp3` / `found_*.mp3` into `assets/audio/voices/<lang>/`.
  - Uses `ELEVENLABS_API_KEY` from `.env`. If the key is missing, it falls back to writing small mock MP3 files.

- **Generate sample kid voices (for testing)**
  - `scripts/generate_sample.py`
  - Writes sample MP3s into `assets/audio/voices_temp_tests/` for multiple languages.

- **Discover and inspect ElevenLabs voices**
  - `scripts/find_specific_voices.py` – queries shared voices by name (e.g., Tripti, Stacy).
  - `scripts/list_voices.py` – lists potential kid-friendly voices from your ElevenLabs account.

- **Generate DALL·E object sprites**
  - `scripts/generate_dalle_assets.py`
  - Uses `OPENAI_API_KEY` to generate PNG sprites for individual objects (e.g., Bicycle, Bench) and saves them under `assets/images/scenes/<scene>/`.

Before running any of the above, install Python dependencies (e.g. `requests`, `chompjs`, ElevenLabs SDK) into your environment as needed.

---

## Project Status

- Multiple scenes are fully playable (Toyshop, Kitchen, Playground, Beach).
- Internationalization is wired up for many languages; static audio currently exists primarily for English, Spanish, and Hindi, with the scripts available to expand coverage.
- Asset-generation tooling is in-place to grow scenes and localized voice lines over time.

