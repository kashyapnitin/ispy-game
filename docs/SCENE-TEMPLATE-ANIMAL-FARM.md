# Animal Farm Scene – Template Prompts & Wiring

Use these prompts to generate the **Animal Farm** scene in the same style as Toy Shop, Kitchen, Playground, and Beach, then follow the wiring steps to add it as the **first** scene in the carousel.

---

## Part 1: Generate the scene (image + objects)

### Prompt 1 – Scene background image

Use this with your image generator (e.g. DALL·E, Midjourney, Ideogram, or similar) to get a single background image:

```
Children's "I Spy" game scene: cheerful illustrated animal farm. Style: bright, friendly 2D illustration (not photo). One wide landscape image showing a farm with a red barn, green fields, fence, hay bales, a pond, and blue sky. Include many clearly visible objects that kids can "spy": animals (pig, cow, chicken, duck, sheep, horse, dog, cat), farm items (tractor, wheelbarrow, pitchfork, bucket, watering can, scarecrow, windmill or silo). Same visual style as a kids' picture book or educational game – clean shapes, readable objects, no text in the image. Aspect ratio 4:3. No realistic photos; keep it illustrated and colorful.
```

**Save the image as:**  
`assets/images/scenes/animalfarm/scene_animalfarm.jpg`  
(Create the folder `assets/images/scenes/animalfarm/` if needed.)

- Prefer **.jpg** for the main scene (like toyshop, kitchen, beach).  
- Recommended size: at least **1024×768** or similar 4:3 so hotspot coordinates scale correctly.

---

### Prompt 2 – List of findable objects (for hotspots + i18n)

Use this to get a consistent list of 12–16 object names (English) that appear in your scene. You can also derive this from the image you generated.

```
For a kids' I Spy "Animal Farm" scene, list 14 findable objects. Use short, clear names (one or two words when possible). Mix animals and farm items. Examples: Pig, Cow, Chicken, Duck, Sheep, Horse, Barn, Tractor, Wheelbarrow, Scarecrow, Hay Bale, Fence, Bucket, Windmill. Output only the list, one per line, no numbering. Names must match what is clearly visible in a typical illustrated farm scene (no obscure items). Use underscores for multi-word IDs in code later (e.g. Hay_Bale, Watering_Can).
```

**Example list you might use (adjust to match your image):**

- Pig  
- Cow  
- Chicken  
- Duck  
- Sheep  
- Horse  
- Barn  
- Tractor  
- Wheelbarrow  
- Scarecrow  
- Hay_Bale  
- Fence  
- Bucket  
- Windmill  

Use this list when you:
- Draw bounding boxes in the bbox editor (object names),
- Add entries to `scene-animalfarm.js` (e.g. `allObjects` and i18n),
- Add voice filenames later (hint_*.mp3, found_*.mp3) if you add audio.

---

## Part 2: Wiring steps (checklist)

After you have:
- `assets/images/scenes/animalfarm/scene_animalfarm.jpg`
- A final list of findable object names

complete these steps in order.

### 1. Hotspot data (bounding boxes)

- **Option A – JSON (like toyshop/kitchen/beach)**  
  - Create `scripts/animalfarm_hotspots.json`.  
  - Use the bbox editor to draw boxes on the scene image:
    ```bash
    python scripts/bbox_editor.py --image assets/images/scenes/animalfarm/scene_animalfarm.jpg --objects "Pig,Cow,Chicken,Duck,Sheep,Horse,Barn,Tractor,Wheelbarrow,Scarecrow,Hay_Bale,Fence,Bucket,Windmill" --output scripts/animalfarm_hotspots.json
    ```
  - Edit the JSON so each item has: `id`, `name`, `bbox` (x1, y1, x2, y2 in **percent 0–100**), `priority`.

- **Option B – Inline in scene JS (like playground)**  
  - Skip the JSON and define `allObjects` with `id`, `name`, `bbox`, `priority` inside `scene-animalfarm.js`.  
  - Bbox format: `bbox: { x1, y1, x2, y2 }` in percent (0–100).

### 2. Scene script

- Add `js/data/scenes/scene-animalfarm.js`.
- Structure (same as other scenes):
  - `window.ISPY_SCENES.animalfarm = { id: 'animalfarm', bgImage: 'assets/images/scenes/animalfarm/scene_animalfarm.jpg', activeCount: 14, allObjects: [] or inline array, allObjectsLoaded: false if using JSON }`.
  - If using JSON: leave `allObjects: []` and set `hotspotSource` in main.js (see below).
  - Add `i18n` for all supported locales: for each object, key `obj_<Name>` (spaces → underscores), value = localized label (e.g. en: "Pig", es: "Cerdo", …). Copy the locale set from `scene-toyshop.js` or `scene-playground.js`.

### 3. main.js

- In `HOTSPOT_SOURCES`, add:
  ```js
  animalfarm: 'scripts/animalfarm_hotspots.json'
  ```
  (Omit if you use inline `allObjects` in the scene script.)
- In `DEFAULT_SCENE_ORDER`, put **animalfarm first**:
  ```js
  const DEFAULT_SCENE_ORDER = ['animalfarm', 'toyshop', 'kitchen', 'playground', 'beach'];
  ```

### 4. index.html

- **Scene carousel:** Insert the Animal Farm card as the **first** button in `#scene-selection` (before Toy Shop). Reuse the same structure as the other scene buttons:
  - `data-scene="animalfarm"`
  - `img` src: `assets/images/scenes/animalfarm/scene_animalfarm.jpg`
  - `span` with `data-i18n="sceneAnimalfarm"` and default text "Animal Farm"
  - Same `scene-thumb-wrap` and `scene-thumb-done` markup as the other scenes.
- **Script:** Add before the other scene scripts:
  ```html
  <script src="js/data/scenes/scene-animalfarm.js"></script>
  ```

### 5. i18n (menu label “Animal Farm”)

- In `js/data/i18n-core.js`, add `sceneAnimalfarm` for every locale (en, es, hi, zh, pt-PT, pt-BR, fr, ja, bn, gu, mr, kn, ta, ml, pa, sw, ms, tl).  
  Example: en: `"Animal Farm"`, es: `"Granja de animales"`, hi: `"पशु फार्म"`, etc.

### 6. PWA / Service worker (if you use precache)

- In `sw.js`, add to the precache list:
  - `assets/images/scenes/animalfarm/scene_animalfarm.jpg`
  - `scripts/animalfarm_hotspots.json` (if used)
  - `js/data/scenes/scene-animalfarm.js`
- Bump cache version if needed so the new scene is cached for offline.

### 7. Voice audio (optional)

- For each object and each language you support, add:
  - `assets/audio/voices/<lang>/hint_<Object_Name>.mp3`
  - `assets/audio/voices/<lang>/found_<Object_Name>.mp3`
- Object names in filenames: spaces → underscores (e.g. `Hay_Bale`).
- If a file is missing, the game falls back to the “Find: {name}” text (and offline hint).

### 8. Thumbnail for menu

- The same image `scene_animalfarm.jpg` is used as the carousel thumbnail (via the `img` in the scene button). No separate thumbnail asset is required.

---

## Quick reference

| Item              | Value / path |
|-------------------|--------------|
| Scene ID          | `animalfarm` |
| Background image  | `assets/images/scenes/animalfarm/scene_animalfarm.jpg` |
| Hotspots (option) | `scripts/animalfarm_hotspots.json` |
| Scene script      | `js/data/scenes/scene-animalfarm.js` |
| i18n key (menu)   | `sceneAnimalfarm` |
| Carousel order    | First (then toyshop, kitchen, playground, beach) |

---

## Order of work (recommended)

1. Generate and save the scene image (Prompt 1).  
2. Finalize the object list (Prompt 2).  
3. Run bbox editor (or hand-write) → hotspots JSON or inline `allObjects`.  
4. Add `scene-animalfarm.js` with `i18n` for all locales.  
5. Wire main.js (HOTSPOT_SOURCES, DEFAULT_SCENE_ORDER).  
6. Add the Animal Farm button and script in index.html.  
7. Add `sceneAnimalfarm` to i18n-core.js for all locales.  
8. Update sw.js precache (and cache version) if used.  
9. Add voice files per language if desired.  
10. Test: select Animal Farm from the menu, find objects, win, then check menu order and completion tick.

After this, Animal Farm will appear as the first scene and behave like the other four scenes (completion tick, best time, carousel order).
