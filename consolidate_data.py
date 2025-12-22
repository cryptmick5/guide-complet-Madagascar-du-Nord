import json
import os
import re

# --- CONFIGURATION ---
INPUT_ZONES = 'data/zones_data.json'
INPUT_LIEUX = 'data/lieux.js'
OUTPUT_FILE = 'data/lieux_consolidated.js'

# --- NORMALIZATION RULES ---
CATEGORY_MAPPING = {
    'Plage': ['mer', 'lagon', 'plage', 'beach', 'sable', 'baie', 'ilot', 'ile', 'nautique', 'snorkeling', 'kitesurf'],
    'Nature': ['foret', 'parc', 'randonnée', 'animal', 'faune', 'flore', 'cascade', 'lémurien', 'montagne', 'volcan', 'geyser', 'lac', 'reserve', 'tsingy'],
    'Culture': ['ville', 'histoire', 'monument', 'ruine', 'musée', 'artisanat', 'cathédrale', 'palais', 'royal', 'village', 'colonial'],
    'Manger': ['resto', 'bar', 'cuisine', 'gastronomie', 'diner', 'déjeuner', 'manger', 'restaurant', 'club', 'sortir'],
    'Dormir': ['hôtel', 'lodge', 'hébergement', 'bivouac', 'camping', 'dodo', 'hotel']
}

def normalize_tags(item):
    """
    Generate normalized tags based on item 'type', 'nom', 'description', and existing 'tags'.
    Returns a list of capitalized strings (e.g. ['Nature', 'Plage']).
    """
    raw_text = (item.get('type', '') + ' ' + item.get('nom', '') + ' ' + item.get('description', '') + ' ' + ' '.join(item.get('tags', []))).lower()
    
    new_tags = set()
    
    # Priority from existing distinct type
    cur_type = item.get('type', '').lower()
    if 'plage' in cur_type: new_tags.add('Plage')
    if 'nature' in cur_type: new_tags.add('Nature')
    if 'culture' in cur_type or 'incontournable' in cur_type: new_tags.add('Culture')
    if 'resto' in cur_type or 'bar' in cur_type or 'manger' in cur_type or 'sortir' in cur_type: new_tags.add('Manger')
    if 'hotel' in cur_type or 'hébergement' in cur_type: new_tags.add('Dormir')
    
    # NLP-ish keyword matching
    for cat, keywords in CATEGORY_MAPPING.items():
        if any(k in raw_text for k in keywords):
            new_tags.add(cat)
            
    # Default fallback
    if not new_tags:
        new_tags.add('Culture') # Default generic
        
    return list(new_tags)

def load_lieux_js(filepath):
    """
    Manually parse the JS file to extract the JSON-like array.
    """
    if not os.path.exists(filepath):
        return []
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract Array content between [ and ]; (assuming variable declaration)
    # Simple strategy: find first [ and last ]
    try:
        start = content.index('[')
        end = content.rindex(']') + 1
        json_str = content[start:end]
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return []

def load_zones_json(filepath):
    """
    Load data/zones_data.json and flatten it.
    """
    if not os.path.exists(filepath):
        return []
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    flattened = []
    if 'zones' in data:
        for zone_name, zone_content in data['zones'].items():
            if 'lieux' in zone_content:
                items = zone_content['lieux']
                # Ensure each item has 'ville' or zone name
                for item in items:
                    if 'ville' not in item:
                        item['ville'] = zone_name
                    flattened.append(item)
    return flattened

def merge_datasets(list1, list2):
    """
    Merge list2 into list1.
    Key: Normalized 'nom' (lowercase, trimmed).
    Strategy: 
    - Use Dictionary {norm_nom: item}
    - If collision: Prefer item with 'y_aller' > Longest description > list1 (priority)
    """
    merged_dict = {}
    
    all_items = list1 + list2
    
    for item in all_items:
        if 'nom' not in item: continue
        
        key = item['nom'].strip().lower()
        
        if key not in merged_dict:
            merged_dict[key] = item
        else:
            existing = merged_dict[key]
            
            # --- CONFLICT RESOLUTION ---
            
            # 1. Critical: y_aller preservation
            if 'y_aller' in item and 'y_aller' not in existing:
                existing['y_aller'] = item['y_aller'] # Inject
                
            # 2. Description richness
            len_new = len(item.get('description', ''))
            len_old = len(existing.get('description', ''))
            if len_new > len_old:
                existing['description'] = item['description']
                
            # 3. Image validity (basic check)
            if 'placeholder' in existing.get('image', '') and 'placeholder' not in item.get('image', ''):
                 existing['image'] = item['image']
                 
            # 4. Merge tags
            tags_old = set(existing.get('tags', []))
            tags_new = set(item.get('tags', []))
            existing['tags'] = list(tags_old.union(tags_new))

    return list(merged_dict.values())

def process():
    print("--- STARTING DATA CONSOLIDATION ---")
    
    # 1. Load Sources
    lieux_legacy = load_lieux_js(INPUT_LIEUX)
    print(f"Loaded {len(lieux_legacy)} items from {INPUT_LIEUX}")
    
    zones_items = load_zones_json(INPUT_ZONES)
    print(f"Loaded {len(zones_items)} items from {INPUT_ZONES}")
    
    # 2. Merge
    consolidated = merge_datasets(lieux_legacy, zones_items)
    print(f"Merged Total: {len(consolidated)} unique items")
    
    # 3. Normalize & Sanitize
    final_list = []
    category_counts = {}
    
    for i, item in enumerate(consolidated):
        # ID Fix: Ensure unique ID if missing or collision (though merge used Name)
        # We re-assign IDs to be clean? No, keep existing IDs if possible to not break favorites.
        if 'id' not in item:
            item['id'] = 2000 + i # Safe range
            
        # Defaults
        if 'price' not in item and 'prix' in item: item['price'] = item['prix']
        if 'price' not in item: item['price'] = "Gratuit"
        if 'rating' not in item and 'note' in item: item['rating'] = item['note']
        if 'rating' not in item: item['rating'] = 4.5
        if 'duration' not in item and 'duree' in item: item['duration'] = item['duree']
        if 'duration' not in item: item['duration'] = "Libre"
        
        # Tags
        item['tags'] = normalize_tags(item)
        
        # Stats
        for t in item['tags']:
            category_counts[t] = category_counts.get(t, 0) + 1
            
        final_list.append(item)
        
    print("Category Stats:", category_counts)
    
    # 4. Output
    js_content = f"const LIEUX_DATA = {json.dumps(final_list, indent=4, ensure_ascii=False)};"
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"SUCCESS: Written {len(final_list)} items to {OUTPUT_FILE}")

if __name__ == "__main__":
    process()
