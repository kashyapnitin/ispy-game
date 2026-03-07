# Project Structure Refactor: Analysis & Proposal

This document analyses the current layout, pain points, and proposes a clearer structure plus optional automated tests. **No changes are applied until you approve direction and options.**

---

## 1. Current State Summary

### 1.1 Assets

| Area | Current layout | Notes |
|------|----------------|------|
| **Audio** | `assets/audio/voices/{locale}/` → flat list of `hint_*.mp3`, `found_*.mp3` | All scenes × all locales in one folder per locale (~185 files per locale). No scene boundary. |
| **Images** | `assets/images/scenes/{sceneId}/` → one file `scene_{id}.png/jpg` per active scene | Many empty `{sceneId}/` dirs (airport, bathroom, etc.). `archive/` holds old per-object art (beach, kitchen, playground, toyshop). |
| **PWA** | `assets/ispy-app-icon-512.png` | Fine. |

### 1.2 Scripts directory

| Type | Files | Purpose |
|------|--------|---------|
| **JSON** | `game_data.json` (~4.6k lines) | Single monolithic file: `ui` (all locales) + `scenes.*.i18n` (all locales × object keys). **Only used by Python** (audio scripts, dump). Frontend never loads it. |
| **JSON** | `*_hotspots.json` (5 files, ~300 lines each) | Scene bboxes. **Loaded by frontend** at runtime from `scripts/`. |
| **Python – build/maintain** | `dump_data.py`, `generate_audio*.py`, `generate_scene_audio.py`, `regenerate_hi_missing.py`, `bbox_editor.py` | Needed for “add new scene” and TTS. |
| **Python – one-off/obsolete** | `split_sprites.py` (root), `generate_dalle_assets.py`, `generate_audio.py` (legacy?), `find_specific_voices.py`, `list_voices.py` | `split_sprites.py` uses a hardcoded path; others are niche or superseded by scene-specific generators. |

### 1.3 Data flow (today)

- **Runtime (browser):**
  - UI strings + scene menu labels: `js/data/i18n-core.js` → `window.ISPY_UI`
  - Scene config (id, bgImage, i18n): `js/data/scenes/scene-<id>.js` → `window.ISPY_SCENES`
  - Bboxes: `fetch(scripts/<scene>_hotspots.json)`
  - Audio: `assets/audio/voices/{lang}/{hint|found}_{ObjectName}.mp3`
- **Build/maintenance:**
  - `dump_data.py` reads `i18n-core.js` + all `scene-*.js` → writes `game_data.json`
  - Audio scripts read `game_data.json` + `*_hotspots.json` → write MP3s under `assets/audio/voices/{lang}/`

So: **JS is source of truth for the app**; `game_data.json` is a **derived artifact** for Python tooling.

### 1.4 Duplication and fragility

- **Scene list** is repeated: `DEFAULT_SCENE_ORDER` and `HOTSPOT_SOURCES` in `main.js`, scene buttons in `index.html`, script tags for each scene, PRECACHE in `sw.js`. Adding a scene touches 4+ places.
- **i18n**: Same UI and scene-label strings live in `i18n-core.js` and (for scenes) in `game_data.json` (via dump). Object names live in scene JS and in `game_data.json`; audio scripts depend on game_data.
- **Paths**: Audio/image/hotspot paths are hardcoded in main.js, scene JS, sw.js, and Python. Moving anything requires careful search/replace.

---

## 2. Proposed restructuring

### 2.1 Audio: locale-first with optional scene subfolders

**Option A – Scene subfolders under locale (recommended for clarity)**

```
assets/audio/
  voices/
    en/
      animalfarm/   hint_Bucket.mp3, found_Bucket.mp3, ...
      beach/        hint_Umbrella.mp3, ...
      kitchen/      hint_Apple.mp3, ...
      playground/   hint_Slide.mp3, ...
      toyshop/      hint_Teddy_Bear.mp3, ...
    hi/
      animalfarm/
      ...
```

- **Pros:** Clear ownership per scene; easy to add/remove a scene’s audio; can cache or lazy-load by scene; fewer naming collisions if two scenes share an object name (e.g. “Bucket”).
- **Cons:** All audio scripts and the frontend must use the new path pattern (`voices/{lang}/{sceneId}/{hint|found}_{name}.mp3`). One-time migration of existing files and updates to `main.js` and `sw.js` (if you precache by scene).

**Option B – Keep flat per locale**

- **Pros:** No migration; current code stays.
- **Cons:** One big folder per locale; no scene boundary; same object name in two scenes would still share one file (current design already does this).

**Recommendation:** Option A if you plan to add many more scenes and want clear “per-scene” assets; otherwise Option B is acceptable and simpler in the short term.

---

### 2.2 Images: flatten scene images, keep archive

**Current:** `assets/images/scenes/{sceneId}/scene_{sceneId}.png` with many empty `{sceneId}/` dirs.

**Option A – Single scenes directory, no per-scene subdirs**

```
assets/images/
  scenes/
    scene_animalfarm.png
    scene_beach.jpg
    scene_kitchen.jpg
    scene_playground.jpg
    scene_toyshop.jpg
  archive/           # keep as-is for old object art
    beach/ ...
```

- **Pros:** One file per scene; no empty folders; simpler paths; less mental overhead.
- **Cons:** Need to update `bgImage` in every scene JS, `index.html` thumbnails, and `sw.js` PRECACHE; ensure naming is unique (e.g. `scene_animalfarm.png`).

**Option B – Keep scene subdirs, remove empty ones**

- Delete empty dirs (airport, bathroom, bedroom, etc.); keep only animalfarm, beach, kitchen, playground, toyshop.
- **Pros:** No path changes; clearer than today.
- **Cons:** Still one file per dir; structure is a bit redundant.

**Recommendation:** Option A (flat `scenes/`) for simplicity and consistency with “one main asset per scene.” Option B if you want minimal code change.

---

### 2.3 Scripts: separate data from tools; split or keep game_data

**Option A – Dedicated data directory; scene-level JSON**

```
data/                        # or config/, content/
  ui.json                    # UI strings only (all locales) – optional, see below
  scenes/
    animalfarm.json         # id, bgImage, i18n (all locales), object keys
    beach.json
    kitchen.json
    playground.json
    toyshop.json
  hotspots/
    animalfarm.json
    beach.json
    ...
```

- **Pros:** Clear split: “data” vs “tools”; one file per scene keeps edits small; hotspots live next to scene config (or in same dir).
- **Cons:** Frontend currently doesn’t load JSON for scenes (it uses scene-*.js). You’d either (1) keep generating scene-*.js from these JSON files (build step), or (2) move to loading JSON at runtime (bigger change). `game_data.json` could be generated by merging `data/ui.json` + `data/scenes/*.json` for Python.

**Option B – Keep hotspots + scene config in scripts, split game_data**

- Leave `scripts/<scene>_hotspots.json` as-is (or move to `data/hotspots/`).
- Split `game_data.json` into:
  - `scripts/data/ui.json` (or one big file per locale)
  - `scripts/data/scenes/{sceneId}.json` (i18n + metadata per scene)
- Python scripts merge these when they need “full game_data”.
- **Pros:** Smaller, editable JSON files; no need to change how the frontend loads scenes (still JS).
- **Cons:** Still two sources of truth (JS for runtime, JSON for Python) unless you introduce a single source (e.g. JSON → generated JS).

**Option C – Single source of truth: JSON → generated JS**

- Define scenes (and optionally UI) only in JSON under `data/scenes/*.json` (and maybe `data/ui.json`).
- Build step: generate `js/data/i18n-core.js` and `js/data/scenes/scene-*.js` (or one bundle) from JSON.
- `dump_data.py` becomes unnecessary; audio scripts read from the same JSON.
- **Pros:** One source of truth; no duplication; adding a scene = add JSON + hotspots + assets, run build.
- **Cons:** Requires a small build pipeline and discipline (always regenerate from JSON).

**Recommendation:** Short term: **Option B** (split game_data under `scripts/data/` or `data/`, keep frontend on JS). Medium term: **Option C** if you want “add new scene” to be “add JSON + run script” with no manual JS editing.

---

### 2.4 Scripts directory: separate tools vs data; retire obsolete

**Proposed layout (without moving to Option C yet):**

```
scripts/
  data/                       # or data/ at repo root
    game_data.json            # keep for now, or split into ui + scenes/*.json
    hotspots/
      animalfarm.json
      beach.json
      ...
  tools/                      # or scripts/ with clearer naming
    bbox_editor.py
    dump_data.py
    generate_audio_animalfarm_all_langs.py
    generate_audio_kitchen_beach_all_langs.py
    generate_audio_toyshop_all_langs.py
    generate_scene_audio.py
    regenerate_hi_missing.py
    # find_specific_voices.py, list_voices.py → keep only if you use them
  # Remove or move to archive/scripts:
  #   split_sprites.py (obsolete; hardcoded path)
  #   generate_dalle_assets.py, generate_audio.py → document as legacy or remove
```

- **Pros:** Clear “data” vs “tools”; hotspots live in one place; easier to point audio scripts at `data/hotspots/` and `data/scenes/` if you split later.
- **Cons:** All references to `scripts/*.json` (main.js, sw.js) must change to e.g. `scripts/data/hotspots/*.json` or `data/hotspots/*.json`.

**Alternative:** Keep `scripts/` as-is but:
- Delete or archive `split_sprites.py` (and any other one-off scripts you don’t use).
- Add a short `scripts/README.md` describing each script (purpose, when to run, inputs/outputs). No path renames.

---

### 2.5 Single “scene registry” to reduce breakage

Introduce one place that defines “what scenes exist” and their metadata (id, order, hotspot file, bgImage). For example:

**In main.js (or a small config module):**

```javascript
const SCENE_REGISTRY = [
  { id: 'animalfarm', hotspotFile: 'scripts/animalfarm_hotspots.json', order: 0 },
  { id: 'toyshop',    hotspotFile: 'scripts/toyshop_hotspots.json',    order: 1 },
  ...
];
const DEFAULT_SCENE_ORDER = SCENE_REGISTRY.map(s => s.id);
const HOTSPOT_SOURCES = Object.fromEntries(SCENE_REGISTRY.map(s => [s.id, s.hotspotFile]));
```

- **Pros:** Adding a scene = add one entry + scene JS + index.html button + sw precache. Fewer magic lists.
- **Cons:** Still need to keep index.html and script tags in sync (or drive them from the same registry via a tiny build step or runtime injection).

**Recommendation:** Do this regardless of other refactors; it reduces mistakes when adding scenes.

---

## 3. Automated tests: what to add

You don’t have tests today; these would guard against regressions as you add scenes and change structure.

### 3.1 Data / config consistency (recommended first)

- **Scene list consistency**
  - All scene IDs in `DEFAULT_SCENE_ORDER` / `HOTSPOT_SOURCES` have a corresponding `scene-<id>.js` and a hotspots JSON file.
  - Every scene JS has `id`, `bgImage`, and (if used) references to the same hotspot file.
- **i18n coverage**
  - For each scene, every locale in `i18n-core.js` has a scene label (e.g. `sceneAnimalfarm`).
  - For each scene, object keys used in that scene’s i18n exist for all locales (or have a defined fallback).
- **Audio files**
  - For each scene × locale × object (from hotspots), `hint_<Name>.mp3` and `found_<Name>.mp3` exist (under current or new path scheme).
- **Assets and SW**
  - Every scene’s bgImage and hotspot JSON are listed in `sw.js` PRECACHE (or a generated list).

**Implementation:** Small Node.js or Python script that:
- Reads scene list from one place (registry or main.js),
- Reads each scene JS and hotspots JSON,
- Checks i18n-core and (optional) game_data for required keys,
- Optionally checks filesystem for audio files and precache list.

Run in CI or pre-commit. No browser needed.

### 3.2 Smoke / E2E (optional)

- **Playwright or Cypress:** Load app → select language → open each scene → assert “Find These” (or equivalent) and that a fixed number of items appear; optionally click one hotspot and assert confetti or “found” state.
- **Pros:** Catches runtime and integration bugs.
- **Cons:** Heavier; need to run a local server or static build.

### 3.3 Unit tests (optional)

- **Pure JS:** e.g. “given this hotspot list and this lang, the audio path is …”; “sanitize object name for audio” behavior.
- **Pros:** Fast; no DOM.
- **Cons:** Most of your logic is DOM/event-driven; payoff is moderate unless you extract small helpers.

**Recommendation:** Start with **§3.1 (data/config consistency)**. Add **§3.2 (E2E)** if you want to guard “play every scene in one language” without manual clicks. Add **§3.3** only for specific utility functions you extract.

---

## 4. Summary table: options and impact

| Area | Option | Pros | Cons |
|------|--------|------|------|
| **Audio** | A: `voices/{lang}/{sceneId}/` | Clear per-scene; scalable | Path change in app + scripts + migration |
| **Audio** | B: Keep flat `voices/{lang}/` | No change | Large flat dirs; no scene boundary |
| **Images** | A: Flat `scenes/*.png` | One file per scene; no empty dirs | Update paths everywhere |
| **Images** | B: Keep subdirs, remove empty | Minimal change | Still one file per dir |
| **Data** | A: `data/scenes/*.json` + hotspots | Clear; scene-sized files | Frontend still on JS unless you add build |
| **Data** | B: Split game_data only | Smaller JSON; same runtime | Two sources (JS + JSON) |
| **Data** | C: JSON → generated JS | Single source of truth | Needs build step |
| **Scripts** | Reorganize into data/ + tools/ | Clear separation | Path updates (main.js, sw, Python) |
| **Scripts** | Only clean obsolete + README | Low risk | No structural improvement |
| **Registry** | One SCENE_REGISTRY in main.js | One place for scene list | index.html still manual unless generated |

---

## 5. Suggested order of work (after you choose options)

1. **Low risk, high clarity**
   - Add scene registry in main.js; derive `DEFAULT_SCENE_ORDER` and `HOTSPOT_SOURCES` from it.
   - Remove or archive obsolete scripts (`split_sprites.py`, etc.) and add `scripts/README.md`.
   - Add data/config consistency tests (§3.1).

2. **If you choose audio scene subfolders (2.1 Option A)**
   - Add path helper in main.js (e.g. `getVoicePath(lang, sceneId, phraseType, objName)`).
   - Migrate audio files to `voices/{lang}/{sceneId}/`; update Python scripts; update sw if needed.

3. **If you choose flat scene images (2.2 Option A)**
   - Move scene images to `assets/images/scenes/scene_<id>.<ext>`; update scene JS, index.html, sw.js.

4. **If you choose data split (2.3 B or C)**
   - Introduce `data/` (or `scripts/data/`); split or add scene JSON; point Python at it; optionally add JSON→JS build.

5. **Optional**
   - E2E test for “load menu → pick scene → see N objects” for one language.

---

## 6. What to decide

To proceed with a concrete refactor plan, please confirm:

1. **Audio:** Option A (scene subfolders) or B (keep flat)?
2. **Images:** Option A (flat `scenes/*.png`) or B (keep subdirs, remove empty)?
3. **Data/game_data:** Option B (split game_data, keep JS as runtime) or aim for C (JSON as source, generate JS) later?
4. **Scripts:** Reorganize into `data/` + `tools/` (and move hotspots path) or only clean obsolete + README?
5. **Tests:** Start with data/config consistency only, or also add a minimal E2E (e.g. one scene, one language)?

Once you pick options, we can outline exact file moves and code edits step by step before changing anything.
