# Scripts

- **`data/`** – Source data for the app and tools.
  - **`ui.json`** – UI strings per locale (used by Python audio tools).
  - **`scenes/*.json`** – Per-scene i18n and metadata (id, bgImage, activeCount).
  - **`hotspots/*.json`** – Bounding boxes per scene (loaded by the frontend at runtime).
- **`tools/`** – Python scripts. Run from **project root** (e.g. `python3 scripts/tools/data/dump_data.py`). Shared helper: `data_loader.py` (used by scripts in subdirs).
  - **`data/`** – Data dumping and consistency
    - **`dump_data.py`** – Reads `js/data/i18n-core.js` and `js/data/scenes/*.js`, writes `data/ui.json`, `data/scenes/*.json`, and legacy `game_data.json`.
    - **`check_consistency.py`** – Checks scene JS, hotspot JSON, and assets; exits 0 if all pass.
  - **`split_game_data.py`** – One-off: splits `game_data.json` into `data/ui.json` and `data/scenes/*.json` (inverse of dump_data).
  - **`audio/`** – Voice and audio generation
    - **`generate_audio.py`** – General audio generation (ElevenLabs / mock).
    - **`generate_scene_audio.py`** – One scene, all or one lang: `python3 scripts/tools/audio/generate_scene_audio.py --scene <id> [--lang xx]`.
    - **`generate_audio_animalfarm_all_langs.py`** – gTTS-only audio for animalfarm → `assets/audio/voices/<lang>/animalfarm/`.
    - **`generate_audio_kitchen_beach_all_langs.py`** – Kitchen, beach, playground (ElevenLabs for en/hi, gTTS rest) → `assets/audio/voices/<lang>/<scene_id>/`.
    - **`generate_audio_toyshop_all_langs.py`** – Toyshop audio → `assets/audio/voices/<lang>/toyshop/`.
    - **`regenerate_hi_missing.py`** – Regenerate Hindi voice files (ElevenLabs) for all scenes.
    - **`migrate_audio_to_scene_folders.py`** – One-off; copies flat voice files into `voices/<lang>/<scene_id>/`.
    - **`list_voices.py`** – List ElevenLabs voices.
    - **`find_specific_voices.py`** – Find specific voices (e.g. Tripti) in ElevenLabs.
  - **`assets/`** – Bbox editing and image generation
    - **`bbox_editor.py`** – Interactive bbox editor. Output: `scripts/data/hotspots/<scene_id>.json`.
    - **`generate_dalle_assets.py`** – Generate scene assets via DALL·E (OpenAI).
- **`game_data.json`** – Legacy monolithic file (still written by `dump_data.py` for compatibility). Prefer `data/ui.json` + `data/scenes/*.json` for tooling.

## Adding a new scene

See **[docs/ADD-NEW-SCENE.md](../docs/ADD-NEW-SCENE.md)** for the full checklist. Summary:

1. Add scene image to `assets/images/scenes/scene_<id>.<ext>`.
2. Run `python3 scripts/tools/assets/bbox_editor.py --image assets/images/scenes/scene_<id>.<ext> --output scripts/data/hotspots/<id>.json` and save bboxes.
3. Create `js/data/scenes/scene-<id>.js` (see docs/SCENE-JS-CONVENTION.md) and add scene to `SCENE_REGISTRY` in `js/main.js`, scene label in `js/data/i18n-core.js`, and menu button + script tag in `index.html`.
4. Run `python3 scripts/tools/data/dump_data.py` to update `data/` and `game_data.json`.
5. Generate audio: `python3 scripts/tools/audio/generate_scene_audio.py --scene <id>` (or scene-specific script if added).
6. Update `sw.js` precache with new scene image and hotspot JSON paths.
