---
description: How to generate and integrate a new scene into the I Spy game
---

# Adding a New Scene to I Spy

**Use the canonical checklist:** [docs/ADD-NEW-SCENE.md](../../docs/ADD-NEW-SCENE.md) (in the repo root).

That doc is the single source of truth. It reflects the current refactor:

- Scene image: `assets/images/scenes/scene_<id>.<ext>` (flattened; no per-scene subfolder).
- Hotspots: `scripts/data/hotspots/<id>.json` via `python3 scripts/tools/assets/bbox_editor.py --image ... --output ...`.
- Scene JS: `js/data/scenes/scene-<id>.js` per `docs/SCENE-JS-CONVENTION.md` (`allObjects: []`, bboxes loaded at runtime).
- App wiring: add to `SCENE_REGISTRY` in `js/main.js`, scene label in `js/data/i18n-core.js`, button + script in `index.html`.
- Data/audio: `python3 scripts/tools/data/dump_data.py`, `python3 scripts/tools/audio/generate_scene_audio.py --scene <id>`.
- Voice output: `assets/audio/voices/<lang>/<sceneId>/`.

When running steps as an agent, execute the commands from the **project root** and follow the paths above.
