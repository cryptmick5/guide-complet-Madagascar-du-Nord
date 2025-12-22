
import os
import re
import json

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
FILES_TO_SCAN = [
    os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js"), # Priority 1
    os.path.join(BASE_DIR, "data", "lieux.js"), # Priority 2
    os.path.join(BASE_DIR, "js", "app.js") # Check for hardcoded
]
OUTPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

# Normalization Rules
TAG_MAP = {
    "restaurant": "Manger", "bar": "Manger", "snack": "Manger", "resto": "Manger", "pizzeria": "Manger",
    "hotel": "Dormir", "lodge": "Dormir", "bivouac": "Dormir", "camping": "Dormir", "gite": "Dormir", "guest house": "Dormir", "resort": "Dormir",
    "culture": "Explorer", "nature": "Explorer", "parc": "Explorer", "plage": "Explorer", "incontournable": "Explorer", "touristique": "Explorer", "monument": "Explorer",
    "spot local": "Spots", "spot": "Spots", "secret": "Spots", "insolite": "Spots", "grotte": "Spots"
}

def normalize_price(price_num):
    if not isinstance(price_num, (int, float)):
        return "€"
    if price_num < 20000: return "€"
    if price_num < 80000: return "€€"
    return "€€€"

def extract_js_objects(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    matches = re.search(r"const LIEUX_DATA = (\[.*?\]);", content, re.DOTALL)
    if matches:
        json_str = matches.group(1)
        # Cleanup JSON
        json_str = re.sub(r"//.*", "", json_str)
        json_str = re.sub(r",\s*]", "]", json_str)
        json_str = re.sub(r",\s*}", "}", json_str)
        try:
            return json.loads(json_str)
        except:
            pass
    return []

all_items = []
seen_names = set()

print("--- STARTING HARVEST (STRICT DEDUP) ---")

for fpath in FILES_TO_SCAN:
    if os.path.exists(fpath):
        print(f"Scanning {fpath}...")
        extracted = extract_js_objects(fpath)
        if extracted:
            print(f"Found {len(extracted)} items.")
            for item in extracted:
                # Deduplication by NAME (Normalized)
                name = item.get('nom', '').strip()
                norm_name = re.sub(r'[^\w\s]', '', name).lower().replace('restaurant', '').replace('hotel', '').strip()
                
                if not norm_name: continue
                
                if norm_name in seen_names:
                   continue
                
                seen_names.add(norm_name)
                
                # Normalize Data
                raw_type = item.get('type', '').lower()
                raw_tags = [str(t).lower() for t in item.get('tags', [])]
                
                final_cat = "Explorer" # Def
                
                # Logic: Check Type first, then Tags
                combined_keywords = raw_type + " " + " ".join(raw_tags)
                
                for k, v in TAG_MAP.items():
                    if k in combined_keywords:
                        final_cat = v
                        # optimization: stop if found? No, keep checking for better match order?
                        # Map order matters. 'spot local' > 'spot'
                        
                # Prioritize 'Manger' / 'Dormir' over 'Explorer' if ambiguous
                if 'manger' in combined_keywords or 'restaurant' in combined_keywords: final_cat = "Manger"
                elif 'dormir' in combined_keywords or 'hotel' in combined_keywords: final_cat = "Dormir"
                elif 'spot' in combined_keywords: final_cat = "Spots"
                
                # Force Tag List to be clean
                item['categorie'] = final_cat
                item['tags'] = [final_cat] 
                if item.get('type') == 'Incontournable':
                     item['tags'].append('Incontournable')

                # Price
                p_num = item.get('prixNum', 0)
                if isinstance(p_num, str):
                    try: p_num = int(re.sub(r'[^\d]', '', p_num))
                    except: p_num = 0
                item['prixNum'] = p_num
                item['prix'] = normalize_price(p_num)
                
                all_items.append(item)

print(f"Total Unique Items: {len(all_items)}")

js_content = f"const LIEUX_DATA = {json.dumps(all_items, indent=4, ensure_ascii=False)};"
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_content)
