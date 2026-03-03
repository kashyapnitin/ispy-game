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

from elevenlabs.client import ElevenLabs
from elevenlabs import save, VoiceSettings

ELEVENLABS_AVAILABLE = True

LANG_MAP = {
    'hi': 'hi', 'zh': 'zh',
    'pt-PT': 'pt-PT', 'pt-BR': 'pt-BR', 'fr': 'fr', 'ja': 'ja',
    'bn': 'bn', 'gu': 'gu', 'mr': 'mr', 'kn': 'kn',
    'ta': 'ta', 'ml': 'ml', 'pa': 'pa', 'sw': 'sw',
    'ms': 'ms', 'tl': 'tl'
}

VOICE_MAP = {
    'default': 'cgSgspJ2msm6clMCkdW9', # Jessica
    'hi': 'yLldDJzoAIYirDpSiBvy', # Tripti
    'zh': 'hkfHEbBvdQFNX4uWHqRF', # Stacy
    'pt-BR': 'cgSgspJ2msm6clMCkdW9',
    'fr': 'WeAAwKYcS06VmXw086yZ', #Victoria
    'es': 'cgSgspJ2msm6clMCkdW9',
    'bn': 'FDQcYNtvPtQjNlTyU3du', #Sumi
    'gu': 'P3JECz9WQeXyyodBL3ZD', #Gargi
    'mr': 'P3JECz9WQeXyyodBL3ZD', #Gargi
    'kn': 'XcWoPxj7pwnIgM3dQnWv', #Kanika
    'ml': 'XcWoPxj7pwnIgM3dQnWv', #Kanika
    'ta': 'upqptL1FRsrohjTgQOHf' #Vani
}

api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    print("WARNING: ELEVENLABS_API_KEY environment variable is not set. Cannot run tests.")
    exit(1)

client = ElevenLabs(api_key=api_key)

print("Loading game_data.json...")
with open('scripts/game_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('scripts/expanded_dict.json', 'r', encoding='utf-8') as f:
    I18N_DICT = json.load(f)

# Hardcode the object "Ball" for our sample tests
obj_name = "Ball"
key = f"obj_{obj_name.replace(' ', '_')}"

base_dir = "assets/audio/voices_temp_tests"
os.makedirs(base_dir, exist_ok=True)

# Remove any existing old sample files in the temp_tests directory
import glob
old_files = glob.glob(os.path.join(base_dir, "*.mp3"))
for f_path in old_files:
    try:
        os.remove(f_path)
    except OSError:
        pass

for lang_code, mapped_code in LANG_MAP.items():
    locName = I18N_DICT.get(lang_code, {}).get(key, I18N_DICT.get('en', {}).get(key, obj_name))
    
    hintGrammar = {
        'hi': f'चित्र में {locName} ढूँडो', 'zh': f'在图中找到 {locName}',
        'pt-PT': f'Encontra o {locName} na imagem', 'pt-BR': f'Encontre o {locName} na imagem', 'fr': f"Trouve le {locName} dans l'image", 'ja': f'絵の中から {locName} を見つけて',
        'bn': f'ছবিতে {locName} খুঁজুন', 'gu': f'ચિત્રમાં {locName} શોધો', 'mr': f'चित्रात {locName} शोधा', 'kn': f'ಚಿತ್ರದಲ್ಲಿ {locName} ಅನ್ನು ಹುಡುಕಿ',
        'ta': f'படத்தில் {locName} ஐக் கண்டுபிடிக்கவும்', 'ml': f'ചിത്രത്തിൽ {locName} കണ്ടെത്തുക', 'pa': f'ਤਸਵੀਰ ਵਿੱਚ {locName} ਲੱਭੋ', 'sw': f'Tafuta {locName} kwenye picha',
        'ms': f'Cari {locName} dalam gambar', 'tl': f'Hanapin ang {locName} sa larawan'
    }
    hint_text = hintGrammar.get(lang_code, f'Find the {locName} in the picture')
    voice_id = VOICE_MAP.get(lang_code, VOICE_MAP['default'])

    out_path = os.path.join(base_dir, f"sample_{lang_code}_{voice_id}.mp3")
    print(f"Generating sample for {lang_code} using kid voice '{voice_id}'... ({hint_text})")
    
    try:
        audio_generator = client.text_to_speech.convert(
            voice_id=voice_id,
            output_format="mp3_44100_128",
            text=hint_text,
            model_id="eleven_multilingual_v2"
        )
        audio_bytes = b"".join(list(audio_generator))
        with open(out_path, 'wb') as f:
            f.write(audio_bytes)
        time.sleep(0.5) 
    except Exception as e:
        print(f"Error for {lang_code}: {e}")

print("Done generating kid samples. Check the assets/audio/voices_temp_tests directory.")
