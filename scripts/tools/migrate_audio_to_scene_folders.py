#!/usr/bin/env python3
"""Migrate flat assets/audio/voices/{lang}/*.mp3 into assets/audio/voices/{lang}/{sceneId}/.
Uses scripts/data/hotspots/*.json to know which objects belong to which scene. Copies files
so shared object names (e.g. Bucket in beach and animalfarm) get a copy in each scene folder.
"""
import json
import shutil
from pathlib import Path

from data_loader import ROOT, load_hotspot_objects

VOICES_DIR = ROOT / "assets" / "audio" / "voices"
SCENE_IDS = ["animalfarm", "toyshop", "kitchen", "playground", "beach"]


def main():
    for scene_id in SCENE_IDS:
        try:
            names = load_hotspot_objects(scene_id)
        except Exception as e:
            print(f"Skip {scene_id}: {e}")
            continue
        for lang_dir in VOICES_DIR.iterdir():
            if not lang_dir.is_dir():
                continue
            scene_dir = lang_dir / scene_id
            scene_dir.mkdir(parents=True, exist_ok=True)
            for obj_name in names:
                safe = obj_name.replace(" ", "_")
                for kind in ("hint", "found"):
                    src = lang_dir / f"{kind}_{safe}.mp3"
                    if not src.exists():
                        continue
                    dst = scene_dir / f"{kind}_{safe}.mp3"
                    if not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime:
                        shutil.copy2(src, dst)
                        print(dst.relative_to(ROOT))
    print("Done. Old flat files left in place; you may remove them after verifying.")


if __name__ == "__main__":
    main()
