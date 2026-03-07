# Scene JS convention

All scene definition files under `js/data/scenes/` must follow this structure so scenes stay consistent and tooling works reliably.

## File header

- Start every file with:
  ```js
  // Ensure the global registry exists
  window.ISPY_SCENES = window.ISPY_SCENES || {};
  ```
- No per-scene title comment; the scene `id` is the identifier.

## Property order

Use this order for the scene object:

1. **id** – scene identifier (single-quoted string, e.g. `'beach'`)
2. **bgImage** – path to scene background image (single-quoted)
3. **activeCount** – number of objects to show per round
4. **allObjectsLoaded** – `false`; set to `true` at runtime after hotspots are loaded
5. **allObjects** – `[]`; populated at runtime from `scripts/data/hotspots/<id>.json`
6. **i18n** – locale keys and `obj_*` labels only (no scene menu label here; those live in `js/data/i18n-core.js`)

## Hotspots (bounding boxes)

- Bounding boxes are **not** stored in the scene JS file.
- They are loaded at runtime from `scripts/data/hotspots/<id>.json` (see `HOTSPOT_SOURCES` in the app).
- In the scene file, include a single short comment, e.g.:
  ```js
  // Bounding boxes loaded from scripts/data/hotspots/<id>.json at runtime.
  ```

## No legacy `objects` array

- Do **not** keep a legacy `objects` array (old `imgUrl` / `x,y,w` format) in scene files.
- The runtime and tooling use `allObjects` filled from the hotspot JSON.

## i18n

- **Scene menu labels** (e.g. `sceneBeach`, `sceneAnimalfarm`) are defined only in `js/data/i18n-core.js`. Do not duplicate them in the scene file’s `i18n`.
- **Object labels** use `obj_<Name>` keys (e.g. `obj_Apple`, `obj_Beach_Ball`). For keys that contain hyphens, use a quoted key (e.g. `"obj_Space-Ship"`).
- Use one line per locale when the list is short; multiple lines per locale are fine for long lists.

## Summary

| Item              | Rule |
|-------------------|------|
| Header            | `// Ensure the global registry exists` + `window.ISPY_SCENES = ...` |
| Property order    | id → bgImage → activeCount → allObjectsLoaded → allObjects → i18n |
| id                | Single quotes |
| allObjectsLoaded  | Always `false` in source; set by runtime |
| allObjects        | Always `[]` in source; filled from hotspot JSON |
| Hotspot comment  | `scripts/data/hotspots/<id>.json` |
| Scene label       | Only in i18n-core.js |
| Legacy `objects`  | Omit |
