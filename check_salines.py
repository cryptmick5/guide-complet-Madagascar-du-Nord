import json
import os

# Read the file content manually since it might be a JS file with variable declaration
with open('data/lieux.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Strip "const LIEUX_DATA = " and ";" to parse as JSON
json_content = content.replace('const LIEUX_DATA = ', '').strip().rstrip(';')

try:
    data = json.loads(json_content)
    found = False
    for lieu in data:
        if 'Salines' in lieu['nom'] or 'salines' in lieu['nom'].lower():
            print("FOUND ENTRY:")
            print(json.dumps(lieu, indent=4, ensure_ascii=False))
            found = True
            
            # Check if file exists
            img_path = lieu.get('image', '')
            if os.path.exists(img_path):
                 print(f"IMAGE EXISTS: {img_path}")
            else:
                 print(f"IMAGE MISSING: {img_path}")
                 
    if not found:
        print("Entry containing 'Salines' NOT FOUND in data/lieux.js")

except Exception as e:
    print(f"Error parsing JSON: {e}")
