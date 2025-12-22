
import os
import re
import json

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
SOURCE_FILE = os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

# Normalization Rules
TAG_MAP = {
    "restaurant": "Manger", "bar": "Manger", "snack": "Manger", "resto": "Manger", "pizzeria": "Manger", "gastronomie": "Manger", "lounge": "Manger", "boulangerie": "Manger", "salon de thé": "Manger",
    "hotel": "Dormir", "lodge": "Dormir", "bivouac": "Dormir", "camping": "Dormir", "gite": "Dormir", "guest house": "Dormir", "resort": "Dormir", "hébergement": "Dormir", "bungalow": "Dormir",
    "spot local": "Spots", "spot": "Spots", "secret": "Spots", "insolite": "Spots", "grotte": "Spots", "vue": "Spots", "panorama": "Spots",
    "culture": "Explorer", "nature": "Explorer", "parc": "Explorer", "plage": "Explorer", "incontournable": "Explorer", "touristique": "Explorer", "monument": "Explorer", "musée": "Explorer", "activité": "Explorer", "phare": "Explorer"
}

def normalize_price(price_num):
    if not isinstance(price_num, (int, float)): return "€"
    if price_num == 0: return "€"
    if price_num < 20000: return "€"
    if price_num < 80000: return "€€"
    return "€€€"

print("--- REGEX EXTRACTION START ---")

try:
    with open(SOURCE_FILE, 'rb') as f:
        content_bytes = f.read()
    content_str = content_bytes.decode('utf-8', errors='ignore')
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

# Find all blocks that look like objects: { ... }
# Minimal matching to capture top-level objects in the array
# We look for "id": ... }
# Regex is tricky. Let's filter by lines that contain "id": and capture the block.
# Actually, since it's a JS array, we can use a simpler approach:
# Split by }, (end of object)
objects_raw = content_str.split('},')
items = []

for obj_str in objects_raw:
    # Ensure it's a valid object part (has "id" or "nom")
    if '"nom":' not in obj_str: continue
    
    # Restore the closing brace if missing due to split
    if not obj_str.strip().endswith('}'):
        obj_str += '}'
    
    # Clean up array start
    if '[' in obj_str:
        obj_str = obj_str[obj_str.find('{'):]
        
    # Extract Fields using Regex
    def get_val(key, text):
        # Match "key": "value" OR "key": value
        # Handle strings with quotes
        m = re.search(r'"' + key + r'"\s*:\s*"([^"]*)"', text)
        if m: return m.group(1)
        # Handle numbers/booleans (no quotes)
        m = re.search(r'"' + key + r'"\s*:\s*([0-9\.\-]+)', text)
        if m: return m.group(1)
        return ""

    def get_list(key, text):
        # Try to find array like "tags": [ "A", "B" ]
        m = re.search(r'"' + key + r'"\s*:\s*\[(.*?)\]', text, re.DOTALL)
        if m:
            inner = m.group(1)
            # Extract strings
            return [x.strip('" ') for x in re.findall(r'"([^"]+)"', inner)]
        return []

    item = {}
    item['id'] = get_val("id", obj_str)
    item['nom'] = get_val("nom", obj_str)
    item['ville'] = get_val("ville", obj_str)
    item['type'] = get_val("type", obj_str)
    item['lat'] = get_val("lat", obj_str)
    item['lng'] = get_val("lng", obj_str)
    
    p_num_str = get_val("prixNum", obj_str)
    try: item['prixNum'] = int(p_num_str)
    except: item['prixNum'] = 0
    
    item['prix'] = normalize_price(item['prixNum'])
    
    # Text fields
    item['description'] = get_val("description", obj_str)
    item['image'] = get_val("image", obj_str)
    item['siteWeb'] = get_val("siteWeb", obj_str)
    
    # --- LOGIC FOR CATEGORY ---
    raw_type = item['type'].lower()
    raw_cat = get_val("categorie", obj_str).lower()
    raw_tags = get_list("tags", obj_str)
    
    final_cat = "Explorer" # Default
    
    keywords = raw_type + " " + raw_cat + " " + " ".join([t.lower() for t in raw_tags])
    
    if "restaurant" in keywords or "manger" in keywords or "snack" in keywords or "gastronomie" in keywords:
        final_cat = "Manger"
    elif "hotel" in keywords or "dormir" in keywords or "lodge" in keywords or "resort" in keywords:
        final_cat = "Dormir"
    elif "spot" in keywords or "insolite" in keywords or "vue" in keywords:
        final_cat = "Spots"
    elif "sortir" in keywords or "bar" in keywords or "club" in keywords:
        final_cat = "Sortir"
    else:
        # Fallback Map
        for k, v in TAG_MAP.items():
            if k in keywords:
                final_cat = v
                break
                
    item['categorie'] = final_cat.capitalize()
    
    # --- LOGIC FOR TAGS ---
    # MUST start with Primary Category
    new_tags = [final_cat.capitalize()]
    
    # Add Original Type if distinct
    if item['type'] and item['type'].lower() != final_cat.lower():
        new_tags.append(item['type'])
        
    # Add valid original tags
    for t in raw_tags:
        t_clean = t.capitalize()
        if t_clean.lower() != final_cat.lower() and t_clean not in new_tags:
            new_tags.append(t_clean)
            
    item['tags'] = new_tags
    
    # Add y_aller if present (custom extraction needed as it might be missing in simple regex)
    # Let's extract generic key-values if needed, but these are crucial.
    
    items.append(item)

print(f"Extracted and Normalized {len(items)} items.")

# Write
js_out = f"const LIEUX_DATA = {json.dumps(items, indent=4, ensure_ascii=False)};"
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_out)
    
print(f"Saved to {OUTPUT_FILE}")
