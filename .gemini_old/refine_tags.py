
import json
import os
import re

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
FILE_PATH = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

print(f"Reading {FILE_PATH}...")

# Read the JS file
with open(FILE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON array
start = content.find('[')
end = content.rfind(']')
json_str = content[start:end+1]

data = json.loads(json_str)
print(f"Loaded {len(data)} items.")

# Strict Keywords
CAT_MANGER = ["restaurant", "snack", "pizzeria", "gastronomie", "boulangerie", "salon de thé", "diner", "déjeuner", "repas"]
CAT_DORMIR = ["hotel", "hôtel", "lodge", "bivouac", "camping", "gite", "guest house", "resort", "hébergement", "bungalow", "chambre", "relai"]
CAT_SORTIR = ["bar", "club", "disco", "boite de nuit", "boîte de nuit", "cabaret", "karaoke", "lounge", "pub", "sortir v"]
CAT_SPOTS = ["spot", "secret", "insolite", "grotte", "vue", "panorama", "point de vue"]
CAT_EXPLORER = ["culture", "nature", "parc", "plage", "incontournable", "touristique", "monument", "musée", "activité", "phare", "cascade", "marche", "marché"]

count_fixed = 0

for item in data:
    name = item.get('nom', '').lower()
    desc = item.get('description', '').lower()
    otype = item.get('type', '').lower()
    
    # Combined text for detection
    full_text = f"{name} {otype}"
    
    current_cat = item.get('categorie', '')
    
    # 1. Detect Real Category with Priority
    # DORMIR (High Priority - misplaced as Explorer often)
    new_cat = None
    
    if any(k in full_text for k in CAT_DORMIR):
        new_cat = "Dormir"
        
    elif any(k in full_text for k in CAT_SORTIR):
        # Watch out for "Bar" in "Barque" or similar? No, strict spacing usually better but "bar" is short.
        # "Le Bar"
        new_cat = "Sortir"
        
    elif any(k in full_text for k in CAT_MANGER):
        if not new_cat: new_cat = "Manger" # If Hotel + Restaurant, usually Hotel is primary unless it's known as a Restaurant.
        # Let's assume if it has Hotel, it's Dormir.
        if new_cat == "Dormir": pass # Keep Dormir
        else: new_cat = "Manger"

    elif any(k in full_text for k in CAT_SPOTS):
        new_cat = "Spots"
        
    elif any(k in full_text for k in CAT_EXPLORER):
        new_cat = "Explorer"
        
    # Apply Correction
    if new_cat and new_cat != current_cat:
        # User Feedback: "Hotel cannot be Explorer"
        # "Nightclub cannot be Explorer"
        print(f"Refining '{item['nom']}': {current_cat} -> {new_cat}")
        item['categorie'] = new_cat
        count_fixed += 1
        current_cat = new_cat

    # 2. Refine Tags
    tags = item.get('tags', [])
    if isinstance(tags, str): tags = [tags]
    
    # Remove old category if it conflicts
    # e.g. remove "Explorer" if now "Sortir"
    clean_tags = []
    
    # Always add Primary Category
    clean_tags.append(current_cat)
    
    # Specific User Rule: "Incontournable" -> Add "Spots"
    if "incontournable" in full_text:
        if "Spots" not in clean_tags:
            clean_tags.append("Spots")
            
    # Add other descriptive tags from original type
    if otype and otype != current_cat.lower():
        clean_tags.append(otype.capitalize())
        
    # Add valid existing tags (excluding categories to avoid duplicates/conflicts)
    all_cats_lower = ["explorer", "manger", "dormir", "sortir", "spots"]
    for t in tags:
        t_clean = str(t).strip()
        if not t_clean: continue
        if t_clean.lower() in all_cats_lower: continue # Don't add other category names as tags randomly
        if t_clean in clean_tags: continue
        clean_tags.append(t_clean)
        
    item['tags'] = clean_tags

    # 3. Price Normalization Check (User mentioned harmonization)
    p = item.get('prix', '€')
    if p not in ['€', '€€', '€€€']:
        # recalculate
        pn = item.get('prixNum', 0)
        if pn < 20000: item['prix'] = '€'
        elif pn < 80000: item['prix'] = '€€'
        else: item['prix'] = '€€€'

print(f"Fixed {count_fixed} items categories.")

# Save
js_out = f"const LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};"
with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(js_out)
    
print("Saved refined data.")
