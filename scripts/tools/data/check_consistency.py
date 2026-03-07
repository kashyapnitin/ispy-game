#!/usr/bin/env python3
"""
Data/config consistency checks. Run from project root or scripts/tools/.
Exits 0 if all pass, 1 otherwise.
"""
import sys
from pathlib import Path

_TOOLS_DIR = Path(__file__).resolve().parents[1]
if str(_TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(_TOOLS_DIR))
from data_loader import ROOT, load_game_data, load_hotspot_objects

# Must match js/main.js SCENE_REGISTRY order
EXPECTED_SCENE_IDS = ["animalfarm", "toyshop", "kitchen", "playground", "beach"]


def main() -> int:
    errors = []
    data = load_game_data()

    # 1) Each scene in registry has scene JS, hotspots JSON, and bg image
    scenes_js = ROOT / "js" / "data" / "scenes"
    hotspots_dir = ROOT / "scripts" / "data" / "hotspots"
    images_dir = ROOT / "assets" / "images" / "scenes"

    for scene_id in EXPECTED_SCENE_IDS:
        if not (scenes_js / f"scene-{scene_id}.js").exists():
            errors.append(f"Missing js/data/scenes/scene-{scene_id}.js")
        if not (hotspots_dir / f"{scene_id}.json").exists():
            errors.append(f"Missing scripts/data/hotspots/{scene_id}.json")
        # bg image: scene_<id>.png or .jpg
        bg = images_dir / f"scene_{scene_id}.png"
        if not bg.exists():
            bg = images_dir / f"scene_{scene_id}.jpg"
        if not bg.exists():
            errors.append(f"Missing scene image: assets/images/scenes/scene_{scene_id}.png or .jpg")

    # 2) Each scene exists in game_data.scenes and has i18n for all ui locales
    ui_langs = set(data["ui"].keys())
    for scene_id in EXPECTED_SCENE_IDS:
        if scene_id not in data["scenes"]:
            errors.append(f"Scene '{scene_id}' missing from data/scenes (game_data).")
            continue
        scene = data["scenes"][scene_id]
        scene_langs = set(scene.get("i18n", {}).keys())
        missing = ui_langs - scene_langs
        if missing:
            errors.append(f"Scene '{scene_id}' i18n missing locales: {sorted(missing)}")

    # 3) For each scene × locale, audio exists (hint_ and found_ for each object)
    voices_dir = ROOT / "assets" / "audio" / "voices"
    for scene_id in EXPECTED_SCENE_IDS:
        try:
            obj_names = load_hotspot_objects(scene_id)
        except Exception as e:
            errors.append(f"Scene '{scene_id}' hotspots load failed: {e}")
            continue
        for lang in sorted(ui_langs):
            scene_dir = voices_dir / lang / scene_id
            if not scene_dir.exists():
                errors.append(f"Missing audio dir: {scene_dir.relative_to(ROOT)}")
                continue
            for obj_name in obj_names:
                safe = obj_name.replace(" ", "_")
                for kind in ("hint", "found"):
                    f = scene_dir / f"{kind}_{safe}.mp3"
                    if not f.exists():
                        errors.append(f"Missing audio: {f.relative_to(ROOT)}")

    if errors:
        for e in errors:
            print("ERROR:", e)
        print(f"\n{len(errors)} consistency error(s).")
        return 1
    print("Consistency checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
