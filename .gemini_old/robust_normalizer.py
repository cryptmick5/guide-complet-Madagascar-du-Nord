
import os
import re
import json

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
SOURCE_FILE = os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

# Normalization Rules
TAG_MAP = {
    # Manger
    "restaurant": "Manger", "bar": "Manger", "snack": "Manger", "resto": "Manger", "pizzeria": "Manger", "gastronomie": "Manger", "lounge": "Manger",
    # Dormir
    "hotel": "Dormir", "lodge": "Dormir", "bivouac": "Dormir", "camping": "Dormir", "gite": "Dormir", "guest house": "Dormir", "resort": "Dormir", "hébergement": "Dormir",
    # Spots
    "spot local": "Spots", "spot": "Spots", "secret": "Spots", "insolite": "Spots", "grotte": "Spots", "vue": "Spots", "panorama": "Spots",
    # Explorer (Default catch-all for culture/nature if not spot)
    "culture": "Explorer", "nature": "Explorer", "parc": "Explorer", "plage": "Explorer", "incontournable": "Explorer", "touristique": "Explorer", "monument": "Explorer", "musée": "Explorer", "activité": "Explorer"
}

def normalize_price(price_num):
    if not isinstance(price_num, (int, float)):
        return "€"
    if price_num == 0: return "€" # Gratuit
    if price_num < 20000: return "€"
    if price_num < 80000: return "€€"
    return "€€€"

def load_js_data(file_path):
    print(f"Reading {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

    # Regex to find the array
    # Look for [ { ... } ]
    # We'll try to extract the content between the first [ and the last ]
    start = content.find('[')
    end = content.rfind(']')
    
    if start == -1 or end == -1:
        print("No array found in file.")
        return []

    json_str = content[start:end+1]
    
    # Cleaning for JSON compliance
    # 1. Remove comments //
    json_str = re.sub(r'//.*', '', json_str)
    # 2. Quote unquoted keys (simple alphanumeric keys)
    # This is tricky without a parser, but let's assume keys are quoted in source or try to quote them
    # The source file seems to have "id": 1, so keys are quoted.
    
    # 3. Trailing commas
    json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
    
    # 4. Control characters removal (The previous error was char 968)
    # Remove non-printable characters except newlines/tabs
    # Actually, standard JSON load might fail on some escaped unicode.
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        print("Attempting aggressive regex extraction...")
        # Fallback: Find all { ... } blocks and parse individually
        # This assumes no nested objects with braces inside strings
        items = []
        # Primitive object splitter: split by "},"
        # This is fragile but might work for simple data
        # improved regex for objects
        objects = re.findall(r'\{[^{}]*\}', json_str) # This handles only flat objects
        # We know description has nested text, so this regex is bad.
        
        # Let's try raw text manipulation to fix the specific JSON error
        # Often it's a line break in a string
        return []

print("--- RE-NORMALIZATION START ---")
raw_data = load_js_data(SOURCE_FILE)

if not raw_data:
    print("CRITICAL: Could not load source data. Aborting.")
    exit(1)

print(f"Loaded {len(raw_data)} items.")

normalized_items = []
seen_names = set()

for item in raw_data:
    # 1. Identity & Dedup
    if not item.get('nom'): continue
    
    clean_name = re.sub(r'[^\w\s]', '', item['nom']).lower().strip()
    if clean_name in seen_names:
        continue
    seen_names.add(clean_name)
    
    # 2. Determine Category
    raw_type = str(item.get('type', '')).lower()
    raw_tags = [str(t).lower() for t in item.get('tags', []) if isinstance(t, str)]
    
    final_cat = "Explorer" # Buffer
    
    # Combine keywords
    keywords = raw_type + " " + " ".join(raw_tags)
    
    # Priority Check
    if "restaurant" in keywords or "manger" in keywords or "snack" in keywords:
        final_cat = "Manger"
    elif "hotel" in keywords or "dormir" in keywords or "lodge" in keywords:
        final_cat = "Dormir"
    elif "spot" in keywords or "insolite" in keywords:
        final_cat = "Spots"
    elif "sortir" in keywords or "club" in keywords or "bar" in keywords:
        final_cat = "Sortir"
    else:
        # Fallback to map
        for k, v in TAG_MAP.items():
            if k in keywords:
                final_cat = v
                break
    
    # 3. Apply Category to Item
    item['categorie'] = final_cat
    
    # 4. FIX TAGS: Ensure final_cat is in tags, but PRESERVE original sub-type info if possible
    # User wants "Fiche" to have the filter tag.
    # So tags MUST contain [final_cat]
    # We can keep the original type as a secondary tag if we want more info, 
    # BUT the "Badge" in modal takes tags[0]. So tags[0] MUST be the Category.
    
    original_type_tag = item.get('type', '').capitalize()
    new_tags = [final_cat]
    
    # Add secondary tag if it's interesting and not same as category
    if original_type_tag and original_type_tag.lower() != final_cat.lower():
         new_tags.append(original_type_tag)
         
    item['tags'] = new_tags
    
    # 5. Price
    p_num = item.get('prixNum', 0)
    try: p_num = int(p_num)
    except: p_num = 0
    item['prixNum'] = p_num
    item['prix'] = normalize_price(p_num)
    
    normalized_items.append(item)

print(f"Processed {len(normalized_items)} normalized items.")

# Save
js_content = f"const LIEUX_DATA = {json.dumps(normalized_items, indent=4, ensure_ascii=False)};"

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Saved to {OUTPUT_FILE}")
