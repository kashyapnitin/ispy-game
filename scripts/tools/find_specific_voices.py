import os
import requests
import json

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

api_key = os.environ.get('ELEVENLABS_API_KEY')
if not api_key:
    print("WARNING: ELEVENLABS_API_KEY environment variable is not set. Cannot run tests.")
    exit(1)

# We must use the shared voices endpoint since these are public voices, not default ones.
url = "https://api.elevenlabs.io/v1/shared-voices"
headers = {
    "xi-api-key": api_key
}

# Search for Tripti
print("Searching for 'Tripti'...")
response = requests.get(url, headers=headers, params={"search": "Tripti"})
if response.status_code == 200:
    data = response.json()
    for voice in data.get('voices', []):
        print(f"Found Tripti: '{voice.get('name')}' (ID: {voice.get('public_owner_id')}/{voice.get('voice_id')})")
        print(f"  Description: {voice.get('description')}")
else:
    print(f"Failed to search for Tripti: {response.status_code} - {response.text}")

# Search for Stacy
print("\nSearching for 'Stacy'...")
response = requests.get(url, headers=headers, params={"search": "Stacy"})
if response.status_code == 200:
    data = response.json()
    for voice in data.get('voices', []):
        print(f"Found Stacy: '{voice.get('name')}' (ID: {voice.get('public_owner_id')}/{voice.get('voice_id')})")
        print(f"  Description: {voice.get('description')}")
else:
    print(f"Failed to search for Stacy: {response.status_code} - {response.text}")
