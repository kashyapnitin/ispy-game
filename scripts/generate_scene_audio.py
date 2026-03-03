import argparse
import json
import os
from pathlib import Path
from typing import Dict, List, Set

from gtts import gTTS

try:
    from elevenlabs.client import ElevenLabs  # type: ignore
except ImportError:
    ElevenLabs = None  # type: ignore


def load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    with dotenv_path.open("r", encoding="utf-8") as f:
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


def load_game_data() -> Dict:
    with (ROOT / "scripts" / "game_data.json").open("r", encoding="utf-8") as f:
        return json.load(f)


def build_i18n_dict(data: Dict) -> Dict[str, Dict[str, str]]:
    i18n: Dict[str, Dict[str, str]] = {}
    for lang, translations in data["ui"].items():
        i18n[lang] = dict(translations)
    for scene in data["scenes"].values():
        if "i18n" in scene:
            for lang, translations in scene["i18n"].items():
                i18n.setdefault(lang, {}).update(translations)
    return i18n


def scene_object_names(data: Dict, scene_id: str) -> Set[str]:
    scene = data["scenes"][scene_id]
    names: Set[str] = set()
    for obj in scene.get("objects", []):
        names.add(obj["name"])
    for obj in scene.get("allObjects", []):
        names.add(obj["name"])
    return names


HINT_TEMPLATES = {
    "en": "Find the {loc} in the picture",
    "es": "Encuentra el {loc} en la imagen",
    "hi": "चित्र में {loc} ढूँडो",
    "zh": "在图中找到 {loc}",
    "pt-PT": "Encontra o {loc} na imagem",
    "pt-BR": "Encontre o {loc} na imagem",
    "fr": "Trouve le {loc} dans l'image",
    "ja": "絵の中から {loc} を見つけて",
    "bn": "ছবিতে {loc} খুঁজুন",
    "gu": "ચિત્રમાં {loc} શોધો",
    "mr": "चित्रात {loc} शोधा",
    "kn": "ಚಿತ್ರದಲ್ಲಿ {loc} ಅನ್ನು ಹುಡುಕಿ",
    "ta": "படத்தில் {loc} ஐக் கண்டுபிடிக்கவும்",
    "ml": "ചിത്രത്തിൽ {loc} കണ്ടെത്തുക",
    "pa": "ਤਸਵੀਰ ਵਿੱਚ {loc} ਲੱਭੋ",
    "sw": "Tafuta {loc} kwenye picha",
    "ms": "Cari {loc} dalam gambar",
    "tl": "Hanapin ang {loc} sa larawan",
}

FOUND_TEMPLATES = {
    "en": "Wow, you found the {loc}!",
    "es": "¡Guau, encontraste el {loc}!",
    "hi": "वाह, तुमने {loc} को ढूंढ लिया!",
    "zh": "哇，你找到了{loc}！",
    "pt-PT": "Uau, encontraste o {loc}!",
    "pt-BR": "Uau, você encontrou o {loc}!",
    "fr": "Waouh, tu as trouvé le {loc} !",
    "ja": "わあ、{loc} を見つけたね！",
    "bn": "বাহ, তুমি {loc} খুঁজে পেয়েছো!",
    "gu": "વાહ, તમે {loc} શોધી લીધી!",
    "mr": "वा, तुला {loc} सापडले!",
    "kn": "ವಾಹ್, ನೀವು {loc} ಕಂಡುಕೊಂಡಿದ್ದೀರಿ!",
    "ta": "வாவ், நீங்கள் {loc} ஐ கண்டுபிடித்துவிட்டீர்கள்!",
    "ml": "വാവ, നിങ്ങൾ {loc} കണ്ടെത്തി!",
    "pa": "ਵਾਹ, ਤੁਸੀਂ {loc} ਲੱਭ ਲਈ।",
    "sw": "Wow, umepata {loc}!",
    "ms": "Wah, anda menjumpai {loc}!",
    "tl": "Wow, nahanap mo ang {loc}!",
}

GTTs_LANG_MAP = {
    "en": "en",
    "es": "es",
    "hi": "hi",
    "zh": "zh-CN",
    "pt-PT": "pt",
    "pt-BR": "pt",
    "fr": "fr",
    "ja": "ja",
    "bn": "bn",
    "gu": "gu",
    "mr": "mr",
    "kn": "kn",
    "ta": "ta",
    "ml": "ml",
    "pa": "pa",
    "sw": "sw",
    "ms": "ms",
    "tl": "tl",
}


def generate_for_lang_scene(
    data: Dict,
    i18n: Dict[str, Dict[str, str]],
    lang: str,
    scene_id: str,
    engine: str,
    voice_id: str = None,
):
    objs = sorted(scene_object_names(data, scene_id))
    if not objs:
        print(f"No objects found for scene '{scene_id}'. Skipping.")
        return

    print(f"\nScene '{scene_id}', language '{lang}' -> {len(objs)} objects")

    scene_dir = ROOT / "assets" / "audio" / "voices" / lang
    scene_dir.mkdir(parents=True, exist_ok=True)

    if engine == "eleven":
        if ElevenLabs is None:
            raise SystemExit("elevenlabs client not installed.")
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            raise SystemExit("ELEVENLABS_API_KEY is not set.")
        if not voice_id:
            raise SystemExit("--voice-id is required when engine='eleven'.")
        client = ElevenLabs(api_key=api_key)
    else:
        client = None  # type: ignore

    for obj_name in objs:
        key = f"obj_{obj_name.replace(' ', '_')}"
        loc = i18n.get(lang, {}).get(key, i18n.get("en", {}).get(key, obj_name))

        hint_tpl = HINT_TEMPLATES.get(lang, HINT_TEMPLATES["en"])
        found_tpl = FOUND_TEMPLATES.get(lang, FOUND_TEMPLATES["en"])
        hint_text = hint_tpl.format(loc=loc)
        found_text = found_tpl.format(loc=loc)

        safe = obj_name.replace(" ", "_")
        for kind, text in (("hint", hint_text), ("found", found_text)):
            out_path = scene_dir / f"{kind}_{safe}.mp3"
            print(f"  -> {out_path.relative_to(ROOT)}")

            if engine == "gtts":
                gtts_lang = GTTs_LANG_MAP.get(lang)
                if not gtts_lang:
                    print(f"    Skipping {lang}: no gTTS language mapping.")
                    continue
                tts = gTTS(text=text, lang=gtts_lang)
                tts.save(str(out_path))
            else:
                try:
                    audio_gen = client.text_to_speech.convert(
                        voice_id=voice_id,
                        output_format="mp3_44100_128",
                        text=text,
                        model_id="eleven_multilingual_v2",
                    )
                    audio_bytes = b"".join(list(audio_gen))
                    with out_path.open("wb") as f:
                        f.write(audio_bytes)
                except Exception as e:
                    print(f"    ERROR for {out_path.name}: {e}")


def main():
    parser = argparse.ArgumentParser(description="Generate scene audio (hint/found) per language and scene.")
    parser.add_argument("--scene", required=True, help="Scene id (e.g. playground)")
    parser.add_argument("--lang", help="Language code (e.g. en, hi, bn). If omitted, uses all scene languages.")
    parser.add_argument(
        "--engine",
        choices=["gtts", "eleven"],
        default="gtts",
        help="TTS engine to use (default: gtts).",
    )
    parser.add_argument("--voice-id", help="ElevenLabs voice id (required if engine=eleven).")
    args = parser.parse_args()

    data = load_game_data()
    if args.scene not in data["scenes"]:
        raise SystemExit(f"Scene '{args.scene}' not found in game_data.json.")

    i18n = build_i18n_dict(data)
    scene_i18n = data["scenes"][args.scene].get("i18n", {})
    scene_langs: List[str] = sorted(scene_i18n.keys())

    if args.lang:
        target_langs = [args.lang]
    else:
        # Default: all languages for that scene
        target_langs = scene_langs

    for lang in target_langs:
        generate_for_lang_scene(data, i18n, lang, args.scene, args.engine, args.voice_id)


if __name__ == "__main__":
    main()

