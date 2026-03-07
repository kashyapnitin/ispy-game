"""
Generate all Animal Farm scene audio using gTTS only (all 18 locales).
Writes to assets/audio/voices/{lang}/animalfarm/ (scene subfolders).
"""
import time
from pathlib import Path

from gtts import gTTS
from gtts.tts import gTTSError

import sys
from pathlib import Path
_TOOLS_DIR = Path(__file__).resolve().parents[1]
if str(_TOOLS_DIR) not in sys.path:
    sys.path.insert(0, str(_TOOLS_DIR))
from data_loader import ROOT, load_game_data, load_hotspot_objects


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


def main() -> None:
    data = load_game_data()
    i18n = build_i18n_dict(data)

    scene_id = "animalfarm"
    scene = data["scenes"].get(scene_id, {})
    scene_langs = sorted(scene.get("i18n", {}).keys())
    if not scene_langs:
        raise SystemExit("No i18n languages found for animalfarm in game_data.")

    obj_names = load_hotspot_objects(scene_id)
    print(f"Animal Farm: {len(obj_names)} objects, {len(scene_langs)} languages, gTTS only.")

    base_dir = ROOT / "assets" / "audio" / "voices"

    for lang in scene_langs:
        g_lang = GTTS_LANG_MAP.get(lang)
        if not g_lang:
            print(f"Skipping {lang}: no gTTS language mapping.")
            continue

        scene_dir = base_dir / lang / scene_id
        scene_dir.mkdir(parents=True, exist_ok=True)
        print(f"\n{lang} -> {scene_dir.relative_to(ROOT)}")

        hint_tpl = HINT_TEMPLATES.get(lang, HINT_TEMPLATES["en"])
        found_tpl = FOUND_TEMPLATES.get(lang, FOUND_TEMPLATES["en"])

        for obj_name in obj_names:
            key = f"obj_{obj_name.replace(' ', '_')}"
            loc = i18n.get(lang, {}).get(key, i18n.get("en", {}).get(key, obj_name))

            hint_text = hint_tpl.format(loc=loc)
            found_text = found_tpl.format(loc=loc)
            safe = obj_name.replace(" ", "_")

            for kind, text in (("hint", hint_text), ("found", found_text)):
                out_path = scene_dir / f"{kind}_{safe}.mp3"
                try:
                    tts = gTTS(text=text, lang=g_lang)
                    tts.save(str(out_path))
                    time.sleep(0.25)
                except gTTSError as e:
                    print(f"  gTTS ERROR {out_path.name}: {e}")
                except Exception as e:
                    print(f"  ERROR {out_path.name}: {e}")

    print("\nDone generating Animal Farm audio (gTTS, all locales).")


if __name__ == "__main__":
    main()
