# Data JSON convention (scripts/data)

This document defines the expected shape and consistency rules for JSON under `scripts/data/hotspots/` and `scripts/data/scenes/`. These files are used by tooling (e.g. audio generation, consistency checks) and may be produced by dumping from the scene JS files. The **runtime** loads scene definitions from `js/data/scenes/*.js` and hotspot data from `scripts/data/hotspots/<id>.json`.

---

## 1. Hotspots — `scripts/data/hotspots/<sceneId>.json`

### Purpose

Each file holds the list of tappable objects (bounding boxes) for one scene. The app fetches these at runtime and populates `scene.allObjects`.

### Filename

- One file per scene: `<sceneId>.json` where `sceneId` matches the scene’s `id` (e.g. `beach.json`, `animalfarm.json`, `playground.json`, `kitchen.json`, `toyshop.json`).

### Root value

- A **JSON array** of object entries (no wrapper object).

### Entry shape

Each array element must have:

| Key       | Type   | Description |
|----------|--------|-------------|
| `id`     | string | Unique id within the file. Use format `obj_1`, `obj_2`, … `obj_N` for consistency. |
| `name`   | string | Display name (spaces allowed, e.g. `"Treasure Chest"`, `"Space-Ship"`). Used to resolve i18n key `obj_<name with spaces→underscores>` (hyphens kept). |
| `bbox`   | object | Bounding box in percentage of background image (0–100). |
| `priority` | number | Hint for draw/selection order (e.g. 1 = high). |

### `bbox` shape

- `x1`, `y1`: top-left percentage (0–100).
- `x2`, `y2`: bottom-right percentage (0–100).
- All four keys required; numeric values.

### Consistency rules

- **No extra keys** on each entry (only `id`, `name`, `bbox`, `priority`).
- Every `name` must have a matching `obj_*` key in the scene’s i18n (in scene JS and in `scripts/data/scenes/<sceneId>.json`): the key is `obj_` + `name` with spaces replaced by underscores (e.g. `"Merry Go Round"` → `obj_Merry_Go_Round`). Hyphens are kept (e.g. `"Space-Ship"` → `obj_Space-Ship`).
- `id` values should be unique and stable within the file (e.g. `obj_1` … `obj_N`).

### Example

```json
[
  {
    "id": "obj_1",
    "name": "Bucket",
    "bbox": { "x1": 42.49, "y1": 72.63, "x2": 48.62, "y2": 79.66 },
    "priority": 1
  }
]
```

---

## 2. Scenes — `scripts/data/scenes/<sceneId>.json`

### Purpose

Per-scene data used by scripts (e.g. audio generation, consistency checks). Often derived from the scene JS files (e.g. via a dump step). The **runtime** does not load these; it uses `js/data/scenes/*.js` and `scripts/data/hotspots/<id>.json`.

### Filename

- One file per scene: `<sceneId>.json` (e.g. `beach.json`, `animalfarm.json`). The scene’s `id` inside the file must match the filename stem.

### Root value

- A **JSON object** with the following top-level keys.

### Property order

Use this order for consistency and diffing:

1. **id** – string; scene identifier (e.g. `"beach"`, `"animalfarm"`). Must match filename stem.
2. **bgImage** – string; path to scene background image (e.g. `"assets/images/scenes/scene_beach.jpg"`).
3. **activeCount** – number; how many objects to show per round (e.g. 14, 15).
4. **i18n** – object; locale code → object of translation keys and values.

### `i18n` shape

- **Keys:** Locale codes (e.g. `en`, `es`, `hi`, `zh`, `pt-BR`, `pt-PT`). The same set of locales should appear in every scene file for consistency.
- **Values:** Object mapping **only** `obj_*` keys to localized strings (e.g. `"obj_Apple": "Apple"`, `"obj_Beach_Ball": "Beach Ball"`).
- **Do not** include scene menu labels (e.g. `sceneBeach`, `sceneAnimalFarm`) here; those live in `js/data/i18n-core.js`. If a dump includes them, they can be stripped for consistency.

### Consistency rules

- **No** `allObjects` or `allObjectsLoaded` in scene JSON; hotspot data lives only in `scripts/data/hotspots/<sceneId>.json`.
- **No** legacy `objects` array.
- Every `obj_*` key in i18n should correspond to an object `name` in the scene’s hotspot file (after mapping name → `obj_<name_with_underscores>`). Optional keys for extra objects (e.g. alternate labels) are allowed.
- Same locales in every scene file (e.g. en, es, hi, zh, pt-PT, pt-BR, fr, ja, bn, gu, mr, kn, ta, ml, pa, sw, ms, tl).

### Example (minimal)

```json
{
  "id": "beach",
  "bgImage": "assets/images/scenes/scene_beach.jpg",
  "activeCount": 14,
  "i18n": {
    "en": {
      "obj_Sun_Hat": "Sun Hat",
      "obj_Beach_Ball": "Beach Ball"
    },
    "es": {
      "obj_Sun_Hat": "Sombrero de Sol",
      "obj_Beach_Ball": "Pelota de Playa"
    }
  }
}
```

---

## 3. Cross-file consistency

| Rule | Hotspots | Scenes |
|------|----------|--------|
| Filename | `scripts/data/hotspots/<sceneId>.json` | `scripts/data/scenes/<sceneId>.json` |
| Scene ids | Same set of scene ids (beach, kitchen, playground, toyshop, animalfarm). | Same. |
| Object names | Each entry’s `name` must have a corresponding `obj_*` in the scene’s i18n. | Each `obj_*` key should match at least one hotspot `name` (after normalising spaces → underscores). |
| Locales | N/A | Same locale set in all scene JSON files. |

---

## 4. Relation to scene JS

- **Source of truth for runtime:** `js/data/scenes/*.js` and `scripts/data/hotspots/*.json` (see also [SCENE-JS-CONVENTION.md](./SCENE-JS-CONVENTION.md)).
- **Scene JSON** under `scripts/data/scenes/` is for tooling and can be generated from scene JS + i18n-core (e.g. dump script). When generating or updating scene JSON, follow the property order and omit scene menu labels from `i18n` for consistency with this convention.
