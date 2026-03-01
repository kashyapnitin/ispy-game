import os
import json
import chompjs
import re

def parse_js_to_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We use chompjs which can parse Javascript objects directly natively
    # Let's extract everything that looks like an object assignment
    try:
        if 'i18n-core.js' in filepath:
            match = re.search(r'window\.ISPY_UI\s*=\s*({[\s\S]+?});', content)
            if match:
                return chompjs.parse_js_object(match.group(1))
        elif 'scene-' in filepath:
            match = re.search(r'window\.ISPY_SCENES\.[a-zA-Z0-9_]+\s*=\s*({[\s\S]+?});', content)
            if match:
                return chompjs.parse_js_object(match.group(1))
    except Exception as e:
        print(f"Failed to parse {filepath}: {e}")
    return None

def dump_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output = {'ui': {}, 'scenes': {}}
    
    # Parse UI
    ui_data = parse_js_to_json(os.path.join(base_dir, 'js', 'data', 'i18n-core.js'))
    if ui_data:
        output['ui'] = ui_data
        
    # Parse Scenes
    scenes_dir = os.path.join(base_dir, 'js', 'data', 'scenes')
    for scene_file in os.listdir(scenes_dir):
        if not scene_file.endswith('.js'): continue
        scene_data = parse_js_to_json(os.path.join(scenes_dir, scene_file))
        if scene_data:
            output['scenes'][scene_data.get('id', scene_file)] = scene_data
            
    with open(os.path.join(base_dir, 'scripts', 'game_data.json'), 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        
    print("Successfully wrote game_data.json")

if __name__ == '__main__':
    dump_data()
