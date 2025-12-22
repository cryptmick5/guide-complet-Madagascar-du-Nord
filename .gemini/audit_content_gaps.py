
import json
import re
import os

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"
IMAGE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"

def audit_content():
    print("📋 AUDITING CONTENT COMPLETENESS...")
    
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON
    json_str = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content)
    json_str = json_str.strip()
    if json_str.endswith(';'): json_str = json_str[:-1]

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"❌ JSON ERROR: {e}")
        return

    missing_images = []
    missing_tags = []
    missing_desc = []
    
    for item in data:
        id_ref = f"ID {item.get('id')} ({item.get('nom')})"
        
        # 1. Image Check
        img = item.get('image')
        if not img or not img.strip():
            missing_images.append(id_ref)
        else:
            # Check if file exists locally (optional, but good)
            # We assume paths are relative to root.
            full_path = os.path.join(IMAGE_DIR, img.replace('/', os.sep))
            # Rough check, might fail on casing or separators, avoiding strict FS check for now to save time
            # unless requested.

        # 2. Tag Check
        tags = item.get('tags')
        if not tags or len(tags) == 0:
            missing_tags.append(id_ref)

        # 3. Description Check
        desc = item.get('description')
        if not desc or len(desc) < 10:
            missing_desc.append(id_ref)

    print(f"\n📉 REPORT:")
    print(f"  - Items checking: {len(data)}")
    print(f"  - Missing Images: {len(missing_images)}")
    if missing_images:
        print(f"    First 5: {missing_images[:5]}")
    
    print(f"  - Missing Tags: {len(missing_tags)}")
    if missing_tags:
        print(f"    First 5: {missing_tags[:5]}")

    print(f"  - Missing Description: {len(missing_desc)}")

if __name__ == "__main__":
    audit_content()
