#!/usr/bin/env python3
"""One-off: split game_data.json into scripts/data/ui.json and scripts/data/scenes/*.json"""
import json
from pathlib import Path

# Project root (scripts/tools/data/ -> 3 levels up)
ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "scripts" / "data"
GAME_DATA = ROOT / "scripts" / "game_data.json"


def main():
    with GAME_DATA.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # UI only
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / "ui.json").write_text(json.dumps(data["ui"], ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", DATA / "ui.json")

    # Per-scene: id, bgImage, i18n, activeCount (no allObjects/objects)
    scenes_dir = DATA / "scenes"
    scenes_dir.mkdir(parents=True, exist_ok=True)
    for scene_id, scene in data["scenes"].items():
        out = {
            "id": scene["id"],
            "bgImage": scene.get("bgImage", ""),
            "i18n": scene.get("i18n", {}),
            "activeCount": scene.get("activeCount", 15),
        }
        (scenes_dir / f"{scene_id}.json").write_text(
            json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print("Wrote", scenes_dir / f"{scene_id}.json")

    print("Done. Keep game_data.json for now; tools can merge ui + scenes at runtime.")


if __name__ == "__main__":
    main()
