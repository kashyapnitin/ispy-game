import json
import os
import time

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


# Load repo-root .env if present
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

try:
    from elevenlabs.client import ElevenLabs
    from elevenlabs import save
    from elevenlabs import VoiceSettings
    ELEVENLABS_AVAILABLE = True
except ImportError:
    ELEVENLABS_AVAILABLE = False

# Fallback checking
api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    print("WARNING: ELEVENLABS_API_KEY environment variable is not set.")
    print("Falling back to creating silent mock mp3s.")
    ELEVENLABS_AVAILABLE = False
else:
    print("ElevenLabs API Key found.")

# ElevenLabs supports 29 languages using their `eleven_multilingual_v2` model.
# Since your API key restricts `voices_read`, we are hardcoding known premium 
# "Child" and "Animation" voices that work exceptionally well for kids games.
LANG_MAP = {
    'hi': 'hi', 'zh': 'zh',
    'pt-PT': 'pt-PT', 'pt-BR': 'pt-BR', 'fr': 'fr', 'ja': 'ja',
    'bn': 'bn', 'gu': 'gu', 'mr': 'mr', 'kn': 'kn',
    'ta': 'ta', 'ml': 'ml', 'pa': 'pa', 'sw': 'sw',
    'ms': 'ms', 'tl': 'tl'
}

VOICE_MAP = {
    # Jessica (cgSgspJ2msm6clMCkdW9) - Playful, Bright, Warm, Cute
    # Even though she is tagged 'en', the eleven_multilingual_v2 model 
    # automatically makes her speak natively in all 29 languages!
    'default': 'cgSgspJ2msm6clMCkdW9', # Jessica
    
    'hi': 'yLldDJzoAIYirDpSiBvy', # Tripti
    'zh': 'hkfHEbBvdQFNX4uWHqRF', # Stacy
    'pt-BR': 'cgSgspJ2msm6clMCkdW9',
    'fr': 'cgSgspJ2msm6clMCkdW9',
    'es': 'cgSgspJ2msm6clMCkdW9',
    'gu': 'XcWoPxj7pwnIgM3dQnWv', # Kanika for Gujarati
    'ta': 'upqptL1FRsrohjTgQOHf' # Vani
}

def generate_audio():
    print("Loading game_data.json...")
    with open('scripts/game_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Expand standard I18N DICT how main.js does it
    I18N_DICT = {}
    for lang, translations in data['ui'].items():
        I18N_DICT[lang] = dict(translations)
    
    for scene_id, scene_data in data['scenes'].items():
        if 'i18n' in scene_data:
            for lang, translations in scene_data['i18n'].items():
                if lang not in I18N_DICT:
                    I18N_DICT[lang] = {}
                I18N_DICT[lang].update(translations)

    with open('scripts/expanded_dict.json', 'w', encoding='utf-8') as f:
        json.dump(I18N_DICT, f, ensure_ascii=False, indent=2)

    # 2. Iterate every object in every scene and generate audio for every language
    objects_to_translate = set()
    for scene_id, scene_data in data['scenes'].items():
        for obj in scene_data.get('objects', []):
            objects_to_translate.add(obj['name'])
        # Also support hotspot-only scenes that define `allObjects`
        for obj in scene_data.get('allObjects', []):
            objects_to_translate.add(obj['name'])

    print(f"Total unique objects: {len(objects_to_translate)}")
    print(f"Total languages: {len(LANG_MAP)}")

    total_files = len(objects_to_translate) * len(LANG_MAP) * 2 # hint + found
    generated = 0

    base_dir = "assets/audio/voices"
    os.makedirs(base_dir, exist_ok=True)

    if ELEVENLABS_AVAILABLE:
        client = ElevenLabs(api_key=api_key)

    target_langs = {'hi': LANG_MAP['hi']}
    for lang_code, mapped_code in target_langs.items():
        lang_dir = os.path.join(base_dir, lang_code)
        os.makedirs(lang_dir, exist_ok=True)
        print(f"\nProcessing Language: {lang_code}")
        
        voice_id = VOICE_MAP.get(lang_code, VOICE_MAP['default']) 

        for obj_name in objects_to_translate:
            # Get translated name
            key = f"obj_{obj_name.replace(' ', '_')}"
            locName = I18N_DICT.get(lang_code, {}).get(key, I18N_DICT.get('en', {}).get(key, obj_name))
            
            # Construct phrase
            hintGrammar = {
                'en': f'Find the {locName} in the picture', 'es': f'Encuentra el {locName} en la imagen', 'hi': f'चित्र में {locName} ढूँडो', 'zh': f'在图中找到 {locName}',
                'pt-PT': f'Encontra o {locName} na imagem', 'pt-BR': f'Encontre o {locName} na imagem', 'fr': f"Trouve le {locName} dans l'image", 'ja': f'絵の中から {locName} を見つけて',
                'bn': f'ছবিতে {locName} খুঁজুন', 'gu': f'ચિત્રમાં {locName} શોધો', 'mr': f'चित्रात {locName} शोधा', 'kn': f'ಚಿತ್ರದಲ್ಲಿ {locName} ಅನ್ನು ಹುಡುಕಿ',
                'ta': f'படத்தில் {locName} ஐக் கண்டுபிடிக்கவும்', 'ml': f'ചിത്രത്തിൽ {locName} കണ്ടെത്തുക', 'pa': f'ਤਸਵੀਰ ਵਿੱਚ {locName} ਲੱਭੋ', 'sw': f'Tafuta {locName} kwenye picha',
                'ms': f'Cari {locName} dalam gambar', 'tl': f'Hanapin ang {locName} sa larawan'
            }
            hint_text = hintGrammar.get(lang_code, hintGrammar['en'])

            foundGrammar = {
                'en': f'You found the {locName}', 'es': f'Encontraste el {locName}', 'hi': f'वाह, तुमने तो {locName} को ढूंढ लिया!', 'zh': f'你找到了 {locName}',
                'pt-PT': f'Encontraste o {locName}', 'pt-BR': f'Você encontrou o {locName}', 'fr': f'Tu as trouvé le {locName}', 'ja': f'{locName} を見つけました',
                'bn': f'আপনি {locName} খুঁজে পেয়েছেন', 'gu': f'તમે {locName} શોધી લીધું', 'mr': f'तुम्हाला {locName} सापडले', 'kn': f'ನೀವು {locName} ಅನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೀರಿ',
                'ta': f'நீங்கள் {locName} ஐ கண்டுபிடித்துவிட்டீர்கள்', 'ml': f'നിങ്ങൾ {locName} കണ്ടെത്തി', 'pa': f'ਤੁਸੀਂ {locName} ਲੱਭ ਲਿਆ', 'sw': f'Umepata {locName}',
                'ms': f'Anda menjumpai {locName}', 'tl': f'Nahanap mo ang {locName}'
            }
            found_text = foundGrammar.get(lang_code, foundGrammar['en'])

            def generate_mp3(text, out_path):
                if not ELEVENLABS_AVAILABLE:
                    with open(out_path, 'wb') as f:
                        f.write(b'Mock Audio MP3 Header / Silence ')
                    return

                try:
                    audio_generator = client.text_to_speech.convert(
                        voice_id=voice_id,
                        output_format="mp3_44100_128",
                        text=text,
                        model_id="eleven_multilingual_v2"
                    )
                    
                    # Convert Generator to bytes
                    audio_bytes = b"".join(list(audio_generator))

                    with open(out_path, 'wb') as f:
                        f.write(audio_bytes)
                    time.sleep(0.5) 
                except Exception as e:
                    print(f"ElevenLabs API Error for {out_path}: {e}")
                    with open(out_path, 'wb') as f:
                        f.write(b'Mock Audio MP3 Header / Silence ')

            # Generate Hint Audio
            hint_path = os.path.join(lang_dir, f"hint_{obj_name.replace(' ', '_')}.mp3")
            if not os.path.exists(hint_path) or os.path.getsize(hint_path) < 100:
                generate_mp3(hint_text, hint_path)

            # Generate Found Audio
            found_path = os.path.join(lang_dir, f"found_{obj_name.replace(' ', '_')}.mp3")
            if not os.path.exists(found_path) or os.path.getsize(found_path) < 100:
                generate_mp3(found_text, found_path)
            
            generated += 2
            if generated % 100 == 0:
                print(f"  Generated {generated}/{total_files} files...")

if __name__ == "__main__":
    generate_audio()
