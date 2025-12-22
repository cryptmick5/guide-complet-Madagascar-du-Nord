
import json
import re
import os
import shutil

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
PLACEHOLDER_IMG = "images/placeholders/default.jpg"

def repair_data():
    print("🛠️ STARTING FULL CONTENT REPAIR...")
    
    # 1. Backup
    if not os.path.exists(FILE_PATH + ".bak_repair"):
        shutil.copy(FILE_PATH, FILE_PATH + ".bak_repair")
        print("✅ Backup created.")

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON
    json_part = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content).strip()
    if json_part.endswith(';'): json_part = json_part[:-1]

    try:
        data = json.loads(json_part)
    except json.JSONDecodeError as e:
        print(f"❌ JSON LOAD ERROR: {e}")
        return

    fixed_count = 0
    
    for item in data:
        modified = False
        
        # --- A. CHECK IMAGE ---
        img_rel = item.get('image', '')
        # Normalize separators for check
        img_path_os = img_rel.replace('/', os.sep)
        full_path = os.path.join(BASE_DIR, img_path_os)
        
        # If image missing or file not found
        if not img_rel or not os.path.exists(full_path):
            print(f"🔧 FIXING IMAGE for {item.get('nom')}: Was '{img_rel}' -> Now '{PLACEHOLDER_IMG}'")
            item['image'] = PLACEHOLDER_IMG
            modified = True

        # --- B. CHECK TAGS ---
        tags = item.get('tags')
        if not tags or not isinstance(tags, list) or len(tags) == 0:
            cat = item.get('categorie', 'Explorer')
            new_tags = [cat]
            if cat == 'Explorer': new_tags.append('Nature')
            if cat == 'Manger': new_tags.append('Gastronomie')
            if cat == 'Dormir': new_tags.append('Repos')
            
            print(f"🔧 FIXING TAGS for {item.get('nom')}: Added {new_tags}")
            item['tags'] = new_tags
            modified = True

        # --- C. CHECK DESCRIPTION ---
        desc = item.get('description', '')
        if not desc or len(desc) < 5:
             new_desc = f"Découvrez {item.get('nom')}, un lieu incontournable à {item.get('ville', 'Madagascar')}."
             print(f"🔧 FIXING DESC for {item.get('nom')}")
             item['description'] = new_desc
             modified = True
             
        if modified:
            fixed_count += 1

    # Save
    new_content = f"const LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};"
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"\n✅ REPAIR COMPLETE. {fixed_count} items fixed.")

if __name__ == "__main__":
    repair_data()
