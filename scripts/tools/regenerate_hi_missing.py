import os
import time
from pathlib import Path

from elevenlabs.client import ElevenLabs

from data_loader import ROOT, load_game_data, load_hotspot_objects


def load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    with dotenv_path.open("r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key, value = key.strip(), value.strip()
            if not key:
                continue
            if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
                value = value[1:-1]
            os.environ.setdefault(key, value)


load_dotenv(ROOT / ".env")
API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise SystemExit("ELEVENLABS_API_KEY is not set. Add it to .env before running.")

client = ElevenLabs(api_key=API_KEY)


def build_i18n_dict(game_data):
    out = {}
    for lang, translations in game_data["ui"].items():
        out[lang] = dict(translations)
    for scene_data in game_data["scenes"].values():
        if "i18n" not in scene_data:
            continue
        for lang, translations in scene_data["i18n"].items():
            out.setdefault(lang, {}).update(translations)
    return out


def main():
    game_data = load_game_data()
    I18N_DICT = build_i18n_dict(game_data)
    voice_id = "yLldDJzoAIYirDpSiBvy"  # Tripti
    lang_code = "hi"

    def localised_name(obj_name: str) -> str:
        key = f"obj_{obj_name.replace(' ', '_')}"
        return I18N_DICT.get(lang_code, {}).get(key, I18N_DICT.get("en", {}).get(key, obj_name))

    def generate_mp3(text: str, out_path: Path) -> None:
        print(f"Generating {out_path.relative_to(ROOT)} ...")
        try:
            audio_generator = client.text_to_speech.convert(
                voice_id=voice_id,
                output_format="mp3_44100_128",
                text=text,
                model_id="eleven_multilingual_v2",
            )
            audio_bytes = b"".join(list(audio_generator))
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_bytes(audio_bytes)
            time.sleep(0.4)
        except Exception as e:
            print(f"Error generating {out_path}: {e}")

    for scene_id in game_data["scenes"]:
        try:
            obj_names = load_hotspot_objects(scene_id)
        except Exception:
            continue
        scene_dir = ROOT / "assets" / "audio" / "voices" / lang_code / scene_id
        for obj_name in sorted(obj_names):
            loc_name = localised_name(obj_name)
            hint_text = f"चित्र में {loc_name} ढूँडो"
            found_text = f"वाह, तुमने तो {loc_name} को ढूंढ लिया!"
            key = obj_name.replace(" ", "_")
            generate_mp3(hint_text, scene_dir / f"hint_{key}.mp3")
            generate_mp3(found_text, scene_dir / f"found_{key}.mp3")

    print("Finished regenerating targeted Hindi files.")


if __name__ == "__main__":
    main()

