"""Shared loader for scripts/data (ui + scenes). Use from scripts/tools/ with ROOT = project root."""
import json
from pathlib import Path

# Project root (scripts/tools/ -> 2 levels up)
ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "scripts" / "data"
HOTSPOTS_DIR = DATA_DIR / "hotspots"
SCENES_DIR = DATA_DIR / "scenes"


def load_game_data() -> dict:
    """Load merged game data from scripts/data/ui.json and scripts/data/scenes/*.json."""
    with (DATA_DIR / "ui.json").open("r", encoding="utf-8") as f:
        ui = json.load(f)
    scenes = {}
    for path in SCENES_DIR.glob("*.json"):
        scene_id = path.stem
        with path.open("r", encoding="utf-8") as f:
            scenes[scene_id] = json.load(f)
    return {"ui": ui, "scenes": scenes}


def load_hotspot_objects(scene_id: str) -> list:
    """Load object names from scripts/data/hotspots/{scene_id}.json. Returns sorted list of names."""
    path = HOTSPOTS_DIR / f"{scene_id}.json"
    if not path.exists():
        path = ROOT / "scripts" / "data" / "hotspots" / f"{scene_id}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return sorted({obj["name"] for obj in data})
