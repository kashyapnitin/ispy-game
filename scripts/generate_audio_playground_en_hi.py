import json
import os
import time
from pathlib import Path

from elevenlabs.client import ElevenLabs


def load_dotenv(dotenv_path: str) -> None:
    if not os.path.exists(dotenv_path):
        return
    with open(dotenv_path, "r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            if not key:
                continue
            if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
                value = value[1:-1]
            os.environ.setdefault(key, value)


ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise SystemExit("ELEVENLABS_API_KEY is not set. Add it to .env before running.")

client = ElevenLabs(api_key=API_KEY)


def build_i18n_dict():
    with open(ROOT / "scripts" / "game_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    i18n = {}
    for lang, translations in data["ui"].items():
        i18n[lang] = dict(translations)

    for scene in data["scenes"].values():
        if "i18n" in scene:
            for lang, translations in scene["i18n"].items():
                i18n.setdefault(lang, {}).update(translations)

    return i18n


def load_playground_objects():
    hotspots_path = ROOT / "scripts" / "playground_hotspots.json"
    with open(hotspots_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [obj["name"] for obj in data]


def main():
    i18n = build_i18n_dict()
    obj_names = sorted(set(load_playground_objects()))

    print(f"Playground objects: {len(obj_names)}")

    voices = {
        "en": "cgSgspJ2msm6clMCkdW9",  # Jessica
        "hi": "yLldDJzoAIYirDpSiBvy",  # Tripti
    }

    hint_texts = {
        "en": lambda name: f"Find the {name} in the picture",
        "hi": lambda name: f"चित्र में {name} ढूँडो",
    }
    found_texts = {
        "en": lambda name: f"You found the {name}",
        "hi": lambda name: f"वाह, तुमने तो {name} को ढूंढ लिया!",
    }

    base_dir = ROOT / "assets" / "audio" / "voices"
    for lang in ("en", "hi"):
        lang_dir = base_dir / lang
        lang_dir.mkdir(parents=True, exist_ok=True)
        voice_id = voices[lang]
        print(f"\nProcessing {lang} ({len(obj_names)} objects) with voice {voice_id}...")

        for obj_name in obj_names:
            key = f"obj_{obj_name.replace(' ', '_')}"
            loc = i18n.get(lang, {}).get(key, i18n.get("en", {}).get(key, obj_name))

            hint = hint_texts[lang](loc)
            found = found_texts[lang](loc)

            def generate(text: str, out_path: Path):
                print(f"  -> {out_path.name}")
                try:
                    audio_gen = client.text_to_speech.convert(
                        voice_id=voice_id,
                        output_format="mp3_44100_128",
                        text=text,
                        model_id="eleven_multilingual_v2",
                    )
                    audio_bytes = b"".join(list(audio_gen))
                    with open(out_path, "wb") as f:
                        f.write(audio_bytes)
                    time.sleep(0.4)
                except Exception as e:
                    print(f"    ERROR for {out_path.name}: {e}")

            safe = obj_name.replace(" ", "_")
            hint_path = lang_dir / f"hint_{safe}.mp3"
            found_path = lang_dir / f"found_{safe}.mp3"
            generate(hint, hint_path)
            generate(found, found_path)

    print("\nDone generating playground EN+HI audio.")


if __name__ == "__main__":
    main()

