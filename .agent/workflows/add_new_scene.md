---
description: How to generate and integrate a new scene into the I Spy game
---
# Adding a New Scene to I Spy

This workflow details the end-to-end steps an AI agent should follow to generate, prepare, and integrate a new playable scene into the I Spy game.

## Step 1: Generate the Scene Artwork
Use the `generate_image` tool to create the scene.
- **Prompt Requirements**: Must be a highly detailed, cartoon-style children's illustration with thick linework.
- **Constraints**: 
  - Ensure EXACTLY ONE of each required item (no repetitive animals).
  - Explicitly forbid text, badges, or numbers from being generated on the image.
  - Ask for at least 25-30 distinct, nameable items scattered throughout the scene.
- Create the target directory: `mkdir -p assets/images/scenes/<scene_id>`
- Move the generated image to the project under `assets/images/scenes/<scene_id>/scene_<scene_id>.png`.

## Step 2: Generate Hotspots (Bounding Boxes)
Generate the interactive 'hit areas' where children will click to find the objects.
// turbo
1. Run the bounding box editor script: 
   `python3 scripts/bbox_editor.py --image assets/images/scenes/<scene_id>/scene_<scene_id>.png --output scripts/<scene_id>_hotspots.json`
2. Use the `notify_user` tool to block and wait for the User to use the UI to draw boxes around all the distinct items and save the file.

## Step 3: Create the Scene Data File
Create a new javascript configuration file for the scene at `js/data/scenes/scene-<scene_id>.js`.
Make sure it contains:
1. The `id` matching the scene name.
2. The `bgImage` path.
3. The `i18n` dictionary for translations.
4. The exact JSON array generated in Step 2 pasted directly into the `allObjects` property. (This is critical so the python scripts can parse it).

```javascript
window.ISPY_SCENES = window.ISPY_SCENES || {};
window.ISPY_SCENES.<scene_id> = {
    id: "<scene_id>",
    bgImage: 'assets/images/scenes/<scene_id>/scene_<scene_id>.png',
    i18n: {
        en: {
            // Add translation overrides if necessary
        }
    },
    allObjectsLoaded: false,
    allObjects: [
        // PASTE JSON ARRAY FROM bbox_editor OUTPUT HERE
    ],
    activeCount: 15
};
```

## Step 4: Extract Data to Master JSON
Run the data dumping script to read the new JS configuration and update the master `game_data.json` file. This allows the TTS engine to understand what words to synthesize.
// turbo
`python3 scripts/dump_data.py`

## Step 5: Synthesize Text-To-Speech (TTS) Audio
Generate the audio hints and 'found' voiceovers for every object across all 18 supported languages.
// turbo
`python3 scripts/generate_scene_audio.py --scene <scene_id>`

## Step 6: Wire the Scene into the UI
Update `index.html` to expose the new scene.
1. Add a new `<button>` inside the `<div id="scene-selection">` carousel containing the thumbnail and title translated via the `data-i18n` tag.
2. Add the `<script src="js/data/scenes/scene-<scene_id>.js"></script>` import below the existing scenes.

## Step 7: Verify Integration
Test carefully using the browser subagent:
- Ensure the scene appears in the Main Menu carousel.
- Click the scene and ensure items populate the bottom sidebar list.
- Click a hotspot on the image and verify it triggers the confetti animation, checkmark, and UI logic.
