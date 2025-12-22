
import os
import re
import json

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
SOURCE_FILE = os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

# Normalization Rules (Same as before)
TAG_MAP = {
    "restaurant": "Manger", "bar": "Manger", "snack": "Manger", "resto": "Manger", "pizzeria": "Manger", "gastronomie": "Manger", "lounge": "Manger",
    "hotel": "Dormir", "lodge": "Dormir", "bivouac": "Dormir", "camping": "Dormir", "gite": "Dormir", "guest house": "Dormir", "resort": "Dormir", "hébergement": "Dormir",
    "spot local": "Spots", "spot": "Spots", "secret": "Spots", "insolite": "Spots", "grotte": "Spots", "vue": "Spots", "panorama": "Spots",
    "culture": "Explorer", "nature": "Explorer", "parc": "Explorer", "plage": "Explorer", "incontournable": "Explorer", "touristique": "Explorer", "monument": "Explorer", "musée": "Explorer", "activité": "Explorer"
}

def normalize_price(price_num):
    if not isinstance(price_num, (int, float)): return "€"
    if price_num == 0: return "€"
    if price_num < 20000: return "€"
    if price_num < 80000: return "€€"
    return "€€€"

def load_and_repair_data(file_path):
    print(f"Reading {file_path} for SURGICAL REPAIR...")
    try:
        # Binary mode to see exactly what's there
        with open(file_path, 'rb') as f:
            raw_bytes = f.read()
            
        # Decode as utf-8, ignoring errors initially to get string
        text_content = raw_bytes.decode('utf-8', errors='ignore')
        
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

    # Find array
    start = text_content.find('[')
    end = text_content.rfind(']')
    
    if start == -1 or end == -1:
        print("No array found.")
        return []

    json_candidate = text_content[start:end+1]
    
    # SANITIZATION
    # 1. Remove JavaScript comments //
    json_candidate = re.sub(r'//.*', '', json_candidate)
    
    # 2. Fix Trailing Commas
    json_candidate = re.sub(r',(\s*[}\]])', r'\1', json_candidate)
    
    # 3. Escape Control Characters
    # The error was at line 20, likely a newline inside a string or a bad char.
    # We will simply replace typical bad chars (like 0x00-0x1F excluding \n \r \t) with spaces
    def replace_control_chars(match):
        char = match.group(0)
        return '' if char in ['\n', '\r', '\t'] else ' '

    # Actually, let's just use json.loads with 'strict=False' if possible, but python doesn't have that easily.
    # Better: find keys that are not quoted? 
    # The error "Invalid control character" usually means an unescaped newline in a string.
    # e.g. "description": "Line 1
    # Line 2"
    
    # We will try to replace literal newlines inside strings.
    # proper regex for strings is complex. 
    # Let's try a simpler approach: remove all chars < 32 except 9, 10, 13
    
    filtered_chars = []
    for char in json_candidate:
        if ord(char) < 32 and ord(char) not in [9, 10, 13]:
            filtered_chars.append(' ') # Replace bad control char with space
        else:
            filtered_chars.append(char)
            
    clean_json_str = "".join(filtered_chars)
    
    # Try parsing
    try:
        data = json.loads(clean_json_str)
        return data
    except json.JSONDecodeError as e:
        print(f"Still JSON Parse Error: {e}")
        # Last Resort: Manual Evaluation using Python's eval (DANGEROUS but effective for JS objects)
        # We replace "true"->"True", "false"->"False", "null"->"None"
        try:
            print("Attempting Python EVAL...")
            # Ideally we shouldn't do this but we are sandboxed.
            # Make it python syntax compatible
            py_str = clean_json_str.replace("true", "True").replace("false", "False").replace("null", "None")
            data = eval(py_str)
            return data
        except Exception as eval_e:
            print(f"Eval failed: {eval_e}")
            return []

print("--- SURGICAL REPAIR START ---")
raw_data = load_and_repair_data(SOURCE_FILE)

if not raw_data:
    print("CRITICAL: Reconstruction failed.")
    exit(1)

print(f"Successfully recovered {len(raw_data)} items.")

normalized_items = []
seen_names = set()

for item in raw_data:
    if not item.get('nom'): continue
    
    # Normalize ID to be string or consistent
    item['id'] = str(item.get('id', ''))
    
    clean_name = re.sub(r'[^\w\s]', '', item['nom']).lower().strip()
    if clean_name in seen_names: continue
    seen_names.add(clean_name)
    
    # Logic (Same as before)
    raw_type = str(item.get('type', '')).lower()
    raw_tags = [str(t).lower() for t in item.get('tags', []) if isinstance(t, str)]
    final_cat = "Explorer"
    keywords = raw_type + " " + " ".join(raw_tags)
    
    if "restaurant" in keywords or "manger" in keywords or "snack" in keywords: final_cat = "Manger"
    elif "hotel" in keywords or "dormir" in keywords: final_cat = "Dormir"
    elif "spot" in keywords: final_cat = "Spots"
    elif "sortir" in keywords: final_cat = "Sortir"
    else:
        for k, v in TAG_MAP.items():
            if k in keywords: final_cat = v; break
            
    item['categorie'] = final_cat.capitalize()
    
    # TAGS ENFORCEMENT
    old_tags = item.get('tags', [])
    if isinstance(old_tags, str): old_tags = [old_tags] # Handle bad data
    
    new_tags = [final_cat] # Primary category FIRST
    
    # Add original type if meaningful
    orig_type = str(item.get('type', '')).capitalize()
    if orig_type and orig_type.lower() != final_cat.lower():
        new_tags.append(orig_type)
        
    # Append old tags if not duplicates
    for t in old_tags:
        t_str = str(t).capitalize()
        if t_str.lower() != final_cat.lower() and t_str not in new_tags:
            new_tags.append(t_str)
            
    item['tags'] = new_tags
    
    # Normalize Price
    p_num = item.get('prixNum', 0)
    try: p_num = int(p_num)
    except: p_num = 0
    item['prixNum'] = p_num
    item['prix'] = normalize_price(p_num)
    
    normalized_items.append(item)

print(f"Final Normalized Count: {len(normalized_items)}")

js_out = f"const LIEUX_DATA = {json.dumps(normalized_items, indent=4, ensure_ascii=False)};"
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_out)

print(f"Saved to {OUTPUT_FILE}")
