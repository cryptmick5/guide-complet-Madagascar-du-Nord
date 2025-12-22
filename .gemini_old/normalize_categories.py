
import json
import re
import shutil
import os

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"
BACKUP_PATH = FILE_PATH + ".bak_norm"

def normalize_data():
    if not os.path.exists(BACKUP_PATH):
        shutil.copy(FILE_PATH, BACKUP_PATH)
        print(f"Backup created at {BACKUP_PATH}")

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON part
    json_str = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content)
    json_str = json_str.strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1]

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return

    # MAPPING LOGIC
    counts = {'Explorer': 0, 'Manger': 0, 'Dormir': 0, 'Sortir': 0, 'Spot': 0, 'Unknown': 0}
    
    for item in data:
        t = (item.get('type') or '').lower()
        c = (item.get('categorie') or '').lower()
        tags = [tag.lower() for tag in item.get('tags', [])]
        
        new_cat = 'Explorer' # Default

        # 1. SPOT (Priority)
        if item.get('spotLocal') is True or 'spot' in t or 'spot' in c or 'spot' in tags:
            new_cat = 'Spot'
        
        # 2. DORMIR
        elif any(k in t for k in ['hotel', 'hôtel', 'lodge', 'hébergement', 'guest', 'auberge', 'dormir']):
            new_cat = 'Dormir'
            
        # 3. MANGER
        elif any(k in t for k in ['resto', 'manger', 'snack', 'diner', 'déjeuner']):
             new_cat = 'Manger'
             
        # 4. SORTIR
        elif any(k in t for k in ['bar', 'club', 'boîte', 'casino', 'pub', 'sortir']):
            new_cat = 'Sortir'
            
        # 5. EXPLORER (Catch-all for Nature, Culture, etc)
        elif any(k in t for k in ['nature', 'culture', 'plage', 'incontournable', 'vue', 'aventure', 'visite', 'monument', 'parc', 'réserve', 'ville', 'grotte']):
            new_cat = 'Explorer'
            
        else:
            # Fallback based on tags if type is ambiguous
            if 'manger' in tags: new_cat = 'Manger'
            elif 'dormir' in tags: new_cat = 'Dormir'
            elif 'sortir' in tags: new_cat = 'Sortir'
            else:
                new_cat = 'Explorer' # Safe default for "General" items
                # print(f"Defaulted to Explorer: {item['nom']} ({t})")

        item['categorie'] = new_cat
        counts[new_cat] += 1

    print("Normalization Complete. Summary:")
    for cat, count in counts.items():
        print(f"  {cat}: {count}")

    # Write back to file
    new_content = f"const LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};"
    
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"File updated: {FILE_PATH}")

if __name__ == "__main__":
    normalize_data()
