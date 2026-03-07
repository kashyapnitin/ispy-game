# Animal Farm vs Playground – Gaps & Errors Analysis

Deep comparison of the **animalfarm** scene with the **playground** scene (and the rest of the codebase) for code, assets, scripts, and i18n.

---

## 1. Object i18n (localized object names) – **MISSING for Animal Farm**

**Playground (reference):**  
`scene-playground.js` has an `i18n` block with **every locale** (en, es, hi, zh, pt-PT, pt-BR, fr, ja, bn, gu, mr, kn, ta, ml, pa, sw, ms, tl) and for each locale a full set of **obj_*** keys for every findable object, e.g.:

- `obj_Slide`, `obj_Bucket`, `obj_Dog`, `obj_Climbing_Net`, etc.

The game resolves display names with:

```js
const key = `obj_${name.replace(/ /g, "_")}`;
return I18N_DICT[currentLang]?.[key] || I18N_DICT.en[key] || name;
```

So if a locale has no `obj_*` entry, the UI falls back to English and then to the raw `name`.

**Animal Farm (current):**  
`scene-animalfarm.js` only has **scene-level** i18n: one key per locale, `sceneAnimalFarm` (the menu title). There are **no** `obj_*` keys for any of the 28 objects in any language.

**Effect:**  
- Sidebar “Find these” list and “Found” labels always show **English** names (Bucket, Pumpkin, Hat, Duck, Pond, Dog, Corn, Milk Can, Goat, Donkey, Pig, Sheep, Cow, Hay, Wheelbarrow, Tractor, Scare Crow, Horse, Sunflowers, Rooster, Hen, Chicken, Blue Bird, Owl, Mouse, Cat on a Box, Barn, Wooden Box).  
- When a hint/found audio file is missing, the fallback text also uses that name; with object i18n missing, it will stay in English for all locales.

**Required fix:**  
Add to `scene-animalfarm.js` an `i18n` block that includes, for **each** of the 18 locales (en, es, hi, zh, pt-PT, pt-BR, fr, ja, bn, gu, mr, kn, ta, ml, pa, sw, ms, tl), one entry per object:

- Keys: `obj_Bucket`, `obj_Pumpkin`, `obj_Hat`, `obj_Duck`, `obj_Pond`, `obj_Dog`, `obj_Corn`, `obj_Milk_Can`, `obj_Goat`, `obj_Donkey`, `obj_Pig`, `obj_Sheep`, `obj_Cow`, `obj_Hay`, `obj_Wheelbarrow`, `obj_Tractor`, `obj_Scare_Crow`, `obj_Horse`, `obj_Sunflowers`, `obj_Rooster`, `obj_Hen`, `obj_Chicken`, `obj_Blue_Bird`, `obj_Owl`, `obj_Mouse`, `obj_Cat_on_a_Box`, `obj_Barn`, `obj_Wooden_Box`.

Use the same locale set and structure as in `scene-playground.js` (or `scene-toyshop.js`).

---

## 2. Audio (hint / found) – **Missing in 5 locales**

Audio filenames follow:  
`assets/audio/voices/<lang>/<hint|found>_<ObjectName>.mp3`  
with spaces in object names replaced by underscores (e.g. `Scare_Crow`, `Cat_on_a_Box`, `Milk_Can`, `Blue_Bird`, `Wooden_Box`).

**Check:** For all 28 animalfarm objects × 2 (hint + found) = 56 files per locale.

**Result:**

| Locale | Missing (of 56) | Status |
|--------|------------------|--------|
| en     | 0                | OK     |
| es, hi, fr, ja, bn, gu, mr, kn, ml, pa, ms, pt-BR | 0 | OK |
| **zh** | **52**           | **Almost no animalfarm audio** |
| **ta** | **52**           | **Almost no animalfarm audio** |
| **sw** | **52**           | **Almost no animalfarm audio** |
| **tl** | **52**           | **Almost no animalfarm audio** |
| **pt-PT** | **51**        | **Only hint_Barn present** |

So:

- **Audio has not been generated (e.g. via gTTS) for animalfarm** in: **zh**, **ta**, **sw**, **tl**, and almost all of **pt-PT** (only `hint_Barn.mp3` exists there).

**Required fix:**  
Generate and add the missing MP3s for those locales:

- For **zh, ta, sw, tl**: all 56 files (28 objects × hint + found).
- For **pt-PT**: 51 files (all except `hint_Barn.mp3`).

Use the same object names (with spaces → underscores in filenames) and the same directory layout as for `en` (and other complete locales).

---

## 3. Main menu scene title (i18n-core) – **Optional consistency**

**Current:**  
- Other scenes (Toyshop, Kitchen, Playground, Beach) have their **menu** label in **`i18n-core.js`**: `sceneToyshop`, `sceneKitchen`, `scenePlayground`, `sceneBeach` in every locale.  
- Animal Farm’s menu label is **only** in `scene-animalfarm.js` as `sceneAnimalFarm` (capital F).  
- `index.html` uses `data-i18n="sceneAnimalFarm"`.  
- Because scene i18n is merged into `I18N_DICT`, the menu still shows the correct “Animal Farm” (and translations) for each language.

**Gap:**  
- `js/data/i18n-core.js` does **not** define `sceneAnimalfarm` (or `sceneAnimalFarm`) for any locale. So the “main” UI dictionary is inconsistent with the other four scenes.

**Recommendation:**  
For consistency and single source of truth, add `sceneAnimalfarm` (or keep `sceneAnimalFarm` to match HTML) to **every locale** in `i18n-core.js`, with the same strings you already have in `scene-animalfarm.js`. You can then optionally remove the scene-title keys from the scene file and rely on i18n-core only (like the other scenes).

---

## 4. DEFAULT_SCENE_ORDER (main.js) – **Animal Farm not included**

**Current:**

```js
const DEFAULT_SCENE_ORDER = ['toyshop', 'kitchen', 'playground', 'beach'];
```

**Issue:**  
`updateSceneSelectionUI()` uses `DEFAULT_SCENE_ORDER` to decide order (uncompleted first, then completed). Only these four IDs are reordered. The animalfarm button is never in that list, so:

- It is never reordered and stays in its DOM position (first).
- When the user completes animalfarm, it will **not** move to the end of the carousel with other completed scenes; completion-based ordering applies only to the four scenes in `DEFAULT_SCENE_ORDER`.

**Required fix:**  
Include animalfarm and make it first, e.g.:

```js
const DEFAULT_SCENE_ORDER = ['animalfarm', 'toyshop', 'kitchen', 'playground', 'beach'];
```

---

## 5. HOTSPOT_SOURCES (main.js) – **Optional**

**Current:**  
`HOTSPOT_SOURCES` lists only:

- playground, toyshop, kitchen, beach  

So **animalfarm** does **not** load from `scripts/animalfarm_hotspots.json`. The game uses the **inline** `allObjects` array in `scene-animalfarm.js` instead.

**Implications:**  
- No bug: the scene works with inline data.  
- If you want animalfarm to behave like toyshop/kitchen/beach (load from JSON so you can edit hotspots without touching the scene file), add:

  ```js
  animalfarm: 'scripts/animalfarm_hotspots.json'
  ```

  and in `scene-animalfarm.js` set `allObjects: []` and `allObjectsLoaded: false` (and remove the long inline array).  
- If you keep inline only, you can leave `HOTSPOT_SOURCES` as-is.

---

## 6. Service worker precache (sw.js) – **Animal Farm not precached**

**Current:**  
`PRECACHE_URLS` includes:

- Scene images: toyshop, kitchen, playground, beach (and playground with `?v=3`).  
- Hotspot JSON: playground, toyshop, kitchen, beach.

**Missing for animalfarm:**

- Scene image:  
  `/assets/images/scenes/animalfarm/scene_animalfarm.png`
- If you later switch to JSON-loaded hotspots:  
  `/scripts/animalfarm_hotspots.json`

**Effect:**  
Offline (or cache-first) users may not get the animalfarm scene image (and, if you add JSON, the hotspot file) unless it’s cached on first visit.

**Required fix:**  
Append to `PRECACHE_URLS`:

- `'/assets/images/scenes/animalfarm/scene_animalfarm.png'`
- Optionally `'/scripts/animalfarm_hotspots.json'` if you add animalfarm to `HOTSPOT_SOURCES`.

Consider bumping `CACHE_NAME` (e.g. to `ispy-shell-v4`) when you change precache so clients refresh the shell cache.

---

## 7. Scene script – **Minor / structural**

- **allObjectsLoaded:**  
  Set to `false` in scene-animalfarm.js while `allObjects` is fully defined inline. The game does not use JSON for animalfarm, so this flag is never set to `true`. No functional bug; you can set it to `true` if you want to express “we are not loading from JSON,” or leave as-is if you plan to switch to JSON later.

- **Redundant data:**  
  The same 28 objects exist in both `scene-animalfarm.js` (inline) and `scripts/animalfarm_hotspots.json`. If you add animalfarm to `HOTSPOT_SOURCES` and load from JSON, you can remove the long inline `allObjects` array to avoid duplication.

- **Object name typo:**  
  One object is named `"Scare Crow"` (two words). Audio and i18n keys use `Scare_Crow`. That’s consistent; no change needed unless you want to rename to “Scarecrow” everywhere.

---

## 8. index.html – **Correct**

- Animal Farm is the first scene button; `data-scene="animalfarm"` and `data-i18n="sceneAnimalFarm"` are set.
- Thumbnail uses `scene_animalfarm.png` with an onerror fallback.
- `scene-animalfarm.js` is included in the script list.

No gaps found here.

---

## 9. Assets on disk – **Correct**

- Scene image: `assets/images/scenes/animalfarm/scene_animalfarm.png` exists (you use .png; no need to match the template’s .jpg).
- Hotspot JSON: `scripts/animalfarm_hotspots.json` exists and matches the 28 objects.

---

## Summary checklist

| Item | Status | Action |
|------|--------|--------|
| Object i18n (obj_* for 28 objects × 18 locales) | Missing | Add full i18n block to scene-animalfarm.js (same structure as playground) |
| Audio EN | OK | None |
| Audio es, hi, fr, ja, bn, gu, mr, kn, ml, pa, ms, pt-BR | OK | None |
| Audio zh, ta, sw, tl | 52 missing each | Generate hint_ / found_ for all 28 objects (e.g. gTTS) |
| Audio pt-PT | 51 missing | Generate all except hint_Barn.mp3 |
| sceneAnimalfarm in i18n-core.js | Missing (optional) | Add to all locales for consistency with other scenes |
| DEFAULT_SCENE_ORDER | Missing animalfarm | Add `'animalfarm'` as first element |
| HOTSPOT_SOURCES | Optional | Add animalfarm entry if you want JSON-loaded hotspots |
| sw.js PRECACHE_URLS | Missing animalfarm | Add scene image (and optionally hotspot JSON); consider bumping CACHE_NAME |
| Scene script allObjectsLoaded / duplication | Minor | Optional cleanup if switching to JSON |
| index.html / assets | OK | None |

---

## Playground reference (for implementation)

When adding object i18n for animalfarm, use the same **locale set** and **key pattern** as in:

- `js/data/scenes/scene-playground.js` → `i18n` with en, es, hi, zh, pt-PT, pt-BR, fr, ja, bn, gu, mr, kn, ta, ml, pa, sw, ms, tl and one `obj_<Name>` per findable object (spaces → underscores in the key).

That will align animalfarm with playground and the rest of the app for both display and future audio fallback text.
