
import json
import re
import os

def load_js_list(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'const\s+\w+\s*=\s*(\[.*\])', content, re.DOTALL)
            if match:
                json_str = match.group(1)
                json_str = re.sub(r',(\s*[\]}])', r'\1', json_str) # trailing comma
                return json.loads(json_str, strict=False)
    except Exception as e:
        print(f"Error JS: {e}")
    return []

def load_zones_data(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            flat_list = []
            for z in data.get('zones', {}).values():
                flat_list.extend(z.get('lieux', []))
            return flat_list
    except Exception as e:
        print(f"Error Zones: {e}")
        return []

def inspect_ramena():
    lieux = load_js_list('data/lieux.js')
    zones = load_zones_data('data/zones_data.json')
    
    target = next((i for i in lieux if "Ramena" in i.get('nom', '')), None)
    source = next((i for i in zones if "Ramena" in i.get('nom', '')), None)
    
    print("--- TARGET (Current Local) ---")
    if target:
        for k, v in target.items():
            print(f"{k}: {str(v)[:100]}")
    else:
        print("Not Found")

    print("\n--- SOURCE (GitHub/Zones) ---")
    if source:
        for k, v in source.items():
            print(f"{k}: {str(v)[:100]}")
    else:
        print("Not Found")
        
    if target and source:
        print("\n--- DIFFERENCES ---")
        all_keys = set(target.keys()) | set(source.keys())
        for k in all_keys:
            if target.get(k) != source.get(k):
                print(f"Key {k} differs or missing.")

if __name__ == "__main__":
    inspect_ramena()
