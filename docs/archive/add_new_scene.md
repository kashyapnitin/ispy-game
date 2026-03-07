# Adding a New Scene to I Spy

This guide outlines the end-to-end workflow an AI agent (or developer) should follow to generate, prepare, and integrate a new playable scene into the I Spy game.

## Step 1: Generate the Scene Artwork
Use an image generation tool (like DALL-E) to create the scene.
- **Prompt Requirements**: Must be a highly detailed, cartoon-style children's illustration with thick linework.
- **Constraints**: 
  - Ensure EXACTLY ONE of each required item (no repetitive animals).
  - Explicitly forbid text, badges, or numbers from being generated on the image.
  - Ask for at least 25-30 distinct, nameable items scattered throughout the scene.
- Save the resulting image to the project under `assets/images/scenes/<scene_id>/scene_<scene_id>.png`.

## Step 2: Generate Hotspots (Bounding Boxes)
Generate the interactive 'hit areas' where children will click to find the objects.
1. Run the bounding box editor script: 
   ```bash
   python3 scripts/bbox_editor.py --image assets/images/scenes/<scene_id>/scene_<scene_id>.png --output scripts/<scene_id>_hotspots.json
   ```
2. Prompt the User to use the UI to draw boxes around all the distinct items and save the file. (They must press 'S' to save).

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
```bash
python3 scripts/dump_data.py
```

## Step 5: Synthesize Text-To-Speech (TTS) Audio
Generate the audio hints and 'found' voiceovers for every object across all 18 supported languages.
```bash
python3 scripts/generate_scene_audio.py --scene <scene_id>
```
*Note: This script takes several minutes to run as it connects to the translation and TTS APIs.*

## Step 6: Wire the Scene into the UI
Update `index.html` to expose the new scene.
1. Add a new `<button>` inside the `<div id="scene-selection">` carousel containing the thumbnail and title translated via the `data-i18n` tag.
2. Add the `<script src="js/data/scenes/scene-<scene_id>.js"></script>` import at the bottom of the HTML `<head>` or above the core game engine scripts.

## Step 7: Verify Integration
Run a local web server (`python3 -m http.server 8000`) and test carefully:
- Ensure the scene appears in the Main Menu carousel.
- Click the scene and ensure items populate the bottom sidebar list.
- Click a hotspot on the image and verify it triggers the confetti animation, checkmark, and plays the correctly synthesized voice audio.
