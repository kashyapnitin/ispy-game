# Archive

One-off or obsolete scripts kept for reference only.

- **split_sprites.py** – Legacy: split a spritesheet into per-object PNGs under `assets/images/objects/`. Uses a hardcoded local path. Scenes now use **hotspot-only** mode (single background image + bounding boxes); per-object sprite art is no longer used. Do not run from here; retained for history only.

- **tmp_gen.js** – Legacy Node.js scaffold: generated scene JS files and injected script tags. Uses the old `objects` array format (x, y, w, imgUrl) and scene set (bedroom, bathroom, farm, etc.) that don’t match the current app. Current scenes follow `docs/SCENE-JS-CONVENTION.md` and hotspot JSON; do not run. Retained for history only.
