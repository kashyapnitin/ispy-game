import os
import sys

# Minimal .env loader (no external deps)
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
            if (len(value) >= 2) and ((value[0] == value[-1]) and value[0] in ("'", '"')):
                value = value[1:-1]
            os.environ.setdefault(key, value)


# Load repo-root .env if present
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Add installed package to sys.path since pip might have installed to site-packages locally
import site
sys.path.append(site.getusersitepackages())

try:
    from elevenlabs.client import ElevenLabs
except ImportError:
    print("Failed to import ElevenLabs")
    sys.exit(1)

api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    print("WARNING: ELEVENLABS_API_KEY environment variable is not set. Cannot run tests.")
    exit(1)

client = ElevenLabs(api_key=api_key)

print("Fetching all ElevenLabs voices...")
response = client.voices.get_all()

print(f"Loaded {len(response.voices)} voices.")

# Filter for voices that might be good for kids / cartoons
kid_voices = []
for voice in response.voices:
    labels = voice.labels or {}
    age = labels.get('age', '').lower()
    description = (voice.description or '').lower()
    use_case = labels.get('use_case', '').lower()
    
    if 'child' in age or 'young' in age or 'animation' in use_case or 'children' in description or 'kids' in description:
        kid_voices.append(voice)

print(f"\nFound {len(kid_voices)} potential kid-friendly voices:")
for v in kid_voices:
    print(f"- {v.name} (ID: {v.voice_id}) | Tags: {v.labels}")
