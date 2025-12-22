
import json
import re
import os

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"

def check_images():
    print("🖼️ CHECKING IMAGE FILES ON DISK...")
    
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

    missing_files = []
    
    for item in data:
        img_rel = item.get('image')
        if not img_rel:
            continue
            
        # Construct full path
        # JSON paths use forward slashes. Windows uses backslashes.
        img_path = img_rel.replace('/', os.sep)
        full_path = os.path.join(BASE_DIR, img_path)
        
        if not os.path.exists(full_path):
            missing_files.append(f"ID {item.get('id')} ({item.get('nom')}): {img_rel}")

    print(f"\n📉 REPORT:")
    print(f"  - Total Items Checked: {len(data)}")
    print(f"  - Missing Files: {len(missing_files)}")
    
    if missing_files:
        print("\n❌ MISSING IMAGE FILES:")
        for m in missing_files:
            print(f"   - {m}")
    else:
        print("✅ All referenced images exist on disk!")

if __name__ == "__main__":
    check_images()
