import json
import os
import time
from pathlib import Path

from gtts import gTTS
from gtts.tts import gTTSError
from elevenlabs.client import ElevenLabs


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


import sys
from pathlib import Path
_TOOLS_DIR = Path(__file__).resolve().parents[1]
if str(_TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(_TOOLS_DIR))
from data_loader import ROOT, load_game_data, load_hotspot_objects

load_dotenv(ROOT / ".env")

API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not API_KEY:
    raise SystemExit("ELEVENLABS_API_KEY is not set. Add it to .env before running.")

client = ElevenLabs(api_key=API_KEY)


def build_i18n_dict(data: dict) -> dict:
    i18n: dict = {}
    for lang, translations in data["ui"].items():
        i18n[lang] = dict(translations)
    for scene in data["scenes"].values():
        if "i18n" in scene:
            for lang, translations in scene["i18n"].items():
                i18n.setdefault(lang, {}).update(translations)
    return i18n


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

GTTS_LANG_MAP = {
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


ELEVEN_VOICES = {
    "en": "cgSgspJ2msm6clMCkdW9",  # Jessica
    "hi": "yLldDJzoAIYirDpSiBvy",  # Tripti
}


SCENES = ["kitchen", "beach", "playground"]


def main() -> None:
    data = load_game_data()
    i18n = build_i18n_dict(data)

    base_dir = ROOT / "assets" / "audio" / "voices"

    for scene_id in SCENES:
        obj_names = load_hotspot_objects(scene_id)
        print(f"{scene_id} hotspot objects: {len(obj_names)}")

        scene = data["scenes"].get(scene_id, {})
        scene_langs = sorted(scene.get("i18n", {}).keys())
        if not scene_langs:
            raise SystemExit(f"No i18n languages found for {scene_id} in game_data.")

        for lang in scene_langs:
            use_eleven = lang in ("en", "hi")
            engine = "eleven" if use_eleven else "gtts"

            scene_dir = base_dir / lang / scene_id
            scene_dir.mkdir(parents=True, exist_ok=True)

            print(f"\nScene '{scene_id}' language '{lang}' ({len(obj_names)} objects) using engine='{engine}'")

            voice_id = ELEVEN_VOICES.get(lang) if use_eleven else None

            for obj_name in obj_names:
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
                        g_lang = GTTS_LANG_MAP.get(lang)
                        if not g_lang:
                            print(f"    Skipping {lang}: no gTTS language mapping.")
                            continue
                        try:
                            tts = gTTS(text=text, lang=g_lang)
                            tts.save(str(out_path))
                        except gTTSError as e:
                            print(f"    gTTS ERROR for {out_path.name}: {e}")
                        except Exception as e:
                            print(f"    Unexpected gTTS error for {out_path.name}: {e}")
                    else:
                        if not voice_id:
                            print(f"    Skipping {out_path.name}: no ElevenLabs voice configured for {lang}.")
                            continue
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
                            time.sleep(0.4)
                        except Exception as e:
                            print(f"    ERROR for {out_path.name}: {e}")

    print("\nDone generating kitchen + beach audio for all languages.")


if __name__ == "__main__":
    main()

