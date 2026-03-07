import json
import os
import re
from pathlib import Path

import chompjs

# Project root (scripts/tools/ -> 2 levels up)
ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "scripts" / "data"


def parse_js_to_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We use chompjs which can parse Javascript objects directly natively
    # Let's extract everything that looks like an object assignment
    try:
        if 'i18n-core.js' in filepath:
            match = re.search(r'window\.ISPY_UI\s*=\s*({[\s\S]+?});', content)
            if match:
                return chompjs.parse_js_object(match.group(1))
        elif 'scene-' in filepath:
            match = re.search(r'window\.ISPY_SCENES\.[a-zA-Z0-9_]+\s*=\s*({[\s\S]+?});', content)
            if match:
                return chompjs.parse_js_object(match.group(1))
    except Exception as e:
        print(f"Failed to parse {filepath}: {e}")
    return None

def dump_data():
    output = {"ui": {}, "scenes": {}}

    # Parse UI
    ui_path = ROOT / "js" / "data" / "i18n-core.js"
    ui_data = parse_js_to_json(str(ui_path))
    if ui_data:
        output["ui"] = ui_data

    # Parse Scenes
    scenes_dir = ROOT / "js" / "data" / "scenes"
    for scene_path in scenes_dir.glob("*.js"):
        scene_data = parse_js_to_json(str(scene_path))
        if scene_data:
            sid = scene_data.get("id", scene_path.stem)
            output["scenes"][sid] = scene_data

    # Write split data: ui.json + scenes/*.json (and legacy game_data.json for compatibility)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    (DATA_DIR / "ui.json").write_text(json.dumps(output["ui"], ensure_ascii=False, indent=2), encoding="utf-8")
    scenes_out = DATA_DIR / "scenes"
    scenes_out.mkdir(parents=True, exist_ok=True)
    for sid, scene in output["scenes"].items():
        out = {"id": scene["id"], "bgImage": scene.get("bgImage", ""), "i18n": scene.get("i18n", {}), "activeCount": scene.get("activeCount", 15)}
        (scenes_out / f"{sid}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "scripts" / "game_data.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Successfully wrote scripts/data/ui.json, scripts/data/scenes/*.json, and scripts/game_data.json")

if __name__ == '__main__':
    dump_data()
