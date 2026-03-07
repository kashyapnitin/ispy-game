import os
import requests
import urllib.request

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


# Load repo-root .env if present (scripts/tools/assets/ -> 3 levels up)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Safe direct API payload to avoid needing to install the official package
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set. Add it to .env or export it in your shell.")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

items = {
    "Bicycle": "A cartoon style children's bicycle. Bright, vibrant colors with thick linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game.",
    "Bench": "A cartoon style park bench. Bright, vibrant colors with thick linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game.",
    "Bird": "A cartoon style small blue bird flying. Bright, vibrant colors with thick linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game.",
    "Cloud": "A cartoon style fluffy white cloud with thick blue linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game.",
    "Sun": "A cartoon style bright yellow sun. Bright, vibrant colors with thick linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game.",
    "Flower": "A cartoon style colourful blooming flower in a small pot. Bright, vibrant colors with thick linework on a solid white background. No background scenery. Suitable for an 'I Spy' toddler game."
}

for item, prompt in items.items():
    print(f"Generating {item}...")
    payload = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024"
    }
    
    try:
        response = requests.post("https://api.openai.com/v1/images/generations", headers=headers, json=payload)
        if response.status_code == 200:
            url = response.json()["data"][0]["url"]
            safe_name = item.replace(" ", "_")
            dest = f"/Users/nitinkashyap/Projects/ispy-game/assets/images/scenes/playground/{safe_name}.png"
            urllib.request.urlretrieve(url, dest)
            print(f"SUCCESS: Saved {item} to {dest}")
        else:
            print(f"ERROR: Failed to generate {item}: {response.text}")
    except Exception as e:
        print(f"EXCEPTION generating {item}: {e}")
