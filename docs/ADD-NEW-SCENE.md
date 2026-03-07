# Adding a new scene

This checklist reflects the current refactor: flattened scene images, hotspot JSON under `scripts/data/hotspots/`, scene JS convention (no inline bboxes), and tools under `scripts/tools/{data,audio,assets}/`. Run all commands from the **project root**.

---

## 1. Scene image

- Add the background image at **`assets/images/scenes/scene_<id>.<ext>`** (e.g. `scene_beach.jpg`).  
- Use a single file per scene (no per-scene subfolder).  
- Recommended: at least 1024×768 or similar 4:3 for hotspot coordinates.

---

## 2. Hotspots (bounding boxes)

- Run the bbox editor and save to **`scripts/data/hotspots/<id>.json`**:

  ```bash
  python3 scripts/tools/assets/bbox_editor.py \
    --image assets/images/scenes/scene_<id>.<ext> \
    --output scripts/data/hotspots/<id>.json
  ```

- In the UI, draw boxes around each findable object and press **S** to save.  
- Hotspot format: array of `{ "id": "obj_1", "name": "Object Name", "bbox": { "x1", "y1", "x2", "y2" }, "priority": 1 }`. See [DATA-JSON-CONVENTION.md](DATA-JSON-CONVENTION.md).

---

## 3. Scene script

- Create **`js/data/scenes/scene-<id>.js`** following [SCENE-JS-CONVENTION.md](SCENE-JS-CONVENTION.md):
  - Header: `// Ensure the global registry exists` and `window.ISPY_SCENES = window.ISPY_SCENES || {};`
  - Property order: **id** → **bgImage** → **activeCount** → **allObjectsLoaded** → **allObjects** → **i18n**
  - `id`: single-quoted (e.g. `'beach'`)
  - `bgImage`: `'assets/images/scenes/scene_<id>.<ext>'`
  - `allObjectsLoaded: false`, **`allObjects: []`** (bboxes are loaded at runtime from `scripts/data/hotspots/<id>.json`)
  - Comment: `// Bounding boxes loaded from scripts/data/hotspots/<id>.json at runtime.`
  - **i18n**: only `obj_*` keys for each locale (no scene menu label; that goes in i18n-core).  
- Add `obj_<Name>` entries for every findable object in every supported locale (same locale set as other scenes). Object names in hotspot JSON use spaces; i18n keys use underscores (e.g. `"Treasure Chest"` → `obj_Treasure_Chest`).

---

## 4. Register the scene in the app

- **`js/main.js`**  
  - Add the scene to **`SCENE_REGISTRY`** (e.g. `{ id: '<id>', order: N }`).  
  - Hotspot URLs are derived from the registry (`scripts/data/hotspots/<id>.json`), so no separate `HOTSPOT_SOURCES` entry is needed.

- **`js/data/i18n-core.js`**  
  - Add the scene menu label for every locale: key **`scene<SceneId>`** (e.g. `sceneBeach`, `sceneAnimalfarm`), value = localized title.

- **`index.html`**  
  - In `#scene-selection`, add a scene button: `data-scene="<id>"`, thumbnail `img` src = scene image path, and a `span` with **`data-i18n="scene<SceneId>"`** (match the i18n-core key).  
  - Add: `<script src="js/data/scenes/scene-<id>.js"></script>` (with the other scene scripts).

---

## 5. Dump data and generate audio

- Update derived data and legacy game_data:

  ```bash
  python3 scripts/tools/data/dump_data.py
  ```

- Generate voice files (hint + found) for all languages:

  ```bash
  python3 scripts/tools/audio/generate_scene_audio.py --scene <id>
  ```

  Voice files go under **`assets/audio/voices/<lang>/<sceneId>/`** (e.g. `assets/audio/voices/en/beach/`).  
  If you add a new scene-specific audio script later, point it at this layout.

---

## 6. PWA / service worker

- In **`sw.js`**, add to the precache list:
  - `assets/images/scenes/scene_<id>.<ext>`
  - `scripts/data/hotspots/<id>.json`
  - `js/data/scenes/scene-<id>.js`
- Bump the cache version (e.g. `CACHE_NAME`) if you want the new scene cached for offline.

---

## 7. Verify

- Run the consistency check:

  ```bash
  python3 scripts/tools/data/check_consistency.py
  ```

- Serve the app (e.g. `python3 -m http.server 8000`) and confirm:
  - Scene appears in the main menu carousel.
  - Selecting it loads the scene and the “Find these” list.
  - Tapping hotspots triggers confetti, checkmark, and correct hint/found audio.

---

## Quick reference

| Item            | Path or value |
|-----------------|----------------|
| Scene image     | `assets/images/scenes/scene_<id>.<ext>` |
| Hotspots        | `scripts/data/hotspots/<id>.json` |
| Scene script    | `js/data/scenes/scene-<id>.js` |
| Menu label key  | `scene<SceneId>` in `js/data/i18n-core.js` (e.g. `sceneBeach`) |
| Voice files     | `assets/audio/voices/<lang>/<sceneId>/` |
| Bbox editor     | `python3 scripts/tools/assets/bbox_editor.py ...` |
| Dump data       | `python3 scripts/tools/data/dump_data.py` |
| Scene audio     | `python3 scripts/tools/audio/generate_scene_audio.py --scene <id>` |
