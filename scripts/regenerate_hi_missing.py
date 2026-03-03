import os
import json
import time

from elevenlabs.client import ElevenLabs


def load_dotenv(dotenv_path: str) -> None:
    """
    Minimal .env loader (no external deps).
    Loads KEY=VALUE pairs into process env if not already set.
    """
    if not os.path.exists(dotenv_path):
        return

    with open(dotenv_path, "r", encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()
            if not key:
                continue
            if (len(value) >= 2) and ((value[0] == value[-1]) and value[0] in ("'", '"')):
                value = value[1:-1]
            os.environ.setdefault(key, value)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise SystemExit("ELEVENLABS_API_KEY is not set. Add it to .env before running.")

client = ElevenLabs(api_key=API_KEY)


def load_game_data():
    with open(os.path.join(BASE_DIR, "scripts", "game_data.json"), "r", encoding="utf-8") as f:
        return json.load(f)


def build_i18n_dict(game_data):
    I18N_DICT = {}
    for lang, translations in game_data["ui"].items():
        I18N_DICT[lang] = dict(translations)

    for scene_id, scene_data in game_data["scenes"].items():
        if "i18n" in scene_data:
            for lang, translations in scene_data["i18n"].items():
                if lang not in I18N_DICT:
                    I18N_DICT[lang] = {}
                I18N_DICT[lang].update(translations)
    return I18N_DICT


def main():
    game_data = load_game_data()
    I18N_DICT = build_i18n_dict(game_data)

    # Regenerate ALL Hindi files for all current objects
    target_objects = set()
    for scene_data in game_data["scenes"].values():
        for obj in scene_data.get("objects", []):
            target_objects.add(obj["name"])

    base_dir = os.path.join(BASE_DIR, "assets", "audio", "voices", "hi")
    os.makedirs(base_dir, exist_ok=True)

    voice_id = "yLldDJzoAIYirDpSiBvy"  # Tripti
    lang_code = "hi"

    def localised_name(obj_name: str) -> str:
        key = f"obj_{obj_name.replace(' ', '_')}"
        return I18N_DICT.get(lang_code, {}).get(
            key, I18N_DICT.get("en", {}).get(key, obj_name)
        )

    for obj_name in sorted(target_objects):
        locName = localised_name(obj_name)

        hint_text = f"चित्र में {locName} ढूँडो"
        found_text = f"वाह, तुमने तो {locName} को ढूंढ लिया!"

        def generate_mp3(text: str, out_path: str):
            print(f"Generating {out_path} ...")
            try:
                audio_generator = client.text_to_speech.convert(
                    voice_id=voice_id,
                    output_format="mp3_44100_128",
                    text=text,
                    model_id="eleven_multilingual_v2",
                )
                audio_bytes = b"".join(list(audio_generator))
                with open(out_path, "wb") as f:
                    f.write(audio_bytes)
                time.sleep(0.4)
            except Exception as e:
                print(f"Error generating {out_path}: {e}")

        key = obj_name.replace(" ", "_")
        hint_path = os.path.join(base_dir, f"hint_{key}.mp3")
        found_path = os.path.join(base_dir, f"found_{key}.mp3")

        # Force-regenerate these specific files regardless of existing content
        generate_mp3(hint_text, hint_path)
        generate_mp3(found_text, found_path)

    print("Finished regenerating targeted Hindi files.")


if __name__ == "__main__":
    main()

