
import json
import os
import re

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
INPUT_FILE = os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "lieux.js")

# Mappings
CITY_MAP = {
    "Antananarivo": "Tana",
    "Antsiranana": "Diego",
    "Diego-Suarez": "Diego",
    "Mahajanga": "Majunga",
    "Toamasina": "Tamatave",
    "Toliara": "Tuléar",
    "Fianarantsoa": "Fianar"
}

# Categories
CAT_EXPLORER = ["plage", "parc", "culture", "rando", "nature", "incontournable", "touristique", "monument", "musée", "activité", "phare", "cascade", "marche", "marché"]
CAT_MANGER = ["restaurant", "bar", "cuisine", "snack", "pizzeria", "gastronomie", "lounge", "boulangerie", "salon de thé", "diner", "déjeuner", "repas"]
CAT_DORMIR = ["hotel", "hôtel", "lodge", "bungalow", "bivouac", "camping", "gite", "guest house", "resort", "hébergement", "chambre"]
CAT_SORTIR = ["club", "karaoke", "sortir", "disco", "boite", "boîte", "cabaret", "pub"]
CAT_SPOTS = ["spot"]

def get_category(text, is_spot=False):
    t = text.lower()
    if is_spot: return "Spots"
    if any(k in t for k in CAT_SORTIR): return "Sortir"
    if any(k in t for k in CAT_DORMIR): return "Dormir"
    if any(k in t for k in CAT_MANGER): return "Manger"
    if any(k in t for k in CAT_EXPLORER): return "Explorer"
    if any(k in t for k in CAT_SPOTS): return "Spots"
    return "Explorer" 

def get_budget_tag(p_num, p_str):
    try:
        val = int(p_num)
        if val == 0: return "€"
        if val < 20000: return "€"
        if val <= 100000: return "€€"
        return "€€€"
    except:
        s = str(p_str).lower()
        if "gratuit" in s: return "€"
        return "€"

# --- 1. Load & Extract (Regex) ---
print(f"Reading {INPUT_FILE}...")
with open(INPUT_FILE, 'rb') as f:
    content_str = f.read().decode('utf-8', errors='ignore')

# Split objects
objects_raw = content_str.split('},')
items = []

seen_ids = set()
seen_names = set()

for obj_str in objects_raw:
    if '"nom":' not in obj_str: continue
    if not obj_str.strip().endswith('}'): obj_str += '}'
    if '[' in obj_str: obj_str = obj_str[obj_str.find('{'):]

    # Regex Helpers
    def get_val(key, text):
        m = re.search(r'"' + key + r'"\s*:\s*"([^"]*)"', text)
        if m: return m.group(1)
        m = re.search(r'"' + key + r'"\s*:\s*([0-9\.\-]+)', text)
        if m: return m.group(1)
        return ""
        
    def get_bool(key, text):
        m = re.search(r'"' + key + r'"\s*:\s*(true|false)', text, re.IGNORECASE)
        if m: return m.group(1).lower() == 'true'
        return False

    # Extract
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
    
    item['prix'] = get_val("prix", obj_str)
    item['description'] = get_val("description", obj_str)
    item['image'] = get_val("image", obj_str)
    item['siteWeb'] = get_val("siteWeb", obj_str)
    item['spotLocal'] = get_bool("spotLocal", obj_str)

    # Dedup
    # Ideally dedup by name
    clean_name = re.sub(r'[^\w]', '', item['nom'].lower())
    if clean_name in seen_names: continue
    seen_names.add(clean_name)
    
    # --- 2. Normalize Tags ---
    tags = []
    
    # City
    v_raw = item['ville']
    v_tag = CITY_MAP.get(v_raw, v_raw)
    if v_tag: tags.append(v_tag)
    
    # Category
    full_text = f"{item['nom']} {item['type']}"
    cat_tag = get_category(full_text, item['spotLocal'])
    tags.append(cat_tag)
    
    # Budget
    bud_tag = get_budget_tag(item['prixNum'], item['prix'])
    tags.append(bud_tag)
    
    # Original Type
    if item['type'] and item['type'].capitalize() not in tags:
        tags.insert(0, item['type'].capitalize())
        
    item['tags'] = tags
    item['categorie'] = cat_tag
    item['prix'] = bud_tag # Force symbol display
    
    items.append(item)

print(f"Extracted & Normalized {len(items)} items.")

# Write
js_out = f"const LIEUX_DATA = {json.dumps(items, indent=4, ensure_ascii=False)};"
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_out)

print(f"Verified & Saved to {OUTPUT_FILE}")
