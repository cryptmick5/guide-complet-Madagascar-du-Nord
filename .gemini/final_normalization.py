
import json
import os
import re

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
INPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "lieux.js")

# Mappings
CITY_MAP = {
    "Antananarivo": "Tana",
    "Antsiranana": "Diego",
    "Diego-Suarez": "Diego", # Variant
    "Mahajanga": "Majunga",
    "Toamasina": "Tamatave",
    "Toliara": "Tuléar",
    "Fianarantsoa": "Fianar"
}

# Rule 2: Category
# We check Type and Nom
CAT_EXPLORER = ["plage", "parc", "culture", "rando", "nature", "incontournable", "touristique", "monument", "musée", "activité", "phare", "cascade", "marche", "marché"]
CAT_MANGER = ["restaurant", "bar", "cuisine", "snack", "pizzeria", "gastronomie", "lounge", "boulangerie", "salon de thé", "diner", "déjeuner"]
CAT_DORMIR = ["hotel", "hôtel", "lodge", "bungalow", "bivouac", "camping", "gite", "guest house", "resort", "hébergement", "chambre"]
CAT_SORTIR = ["club", "karaoke", "sortir", "disco", "boite", "boîte", "cabaret", "pub"]
CAT_SPOTS = ["spot"] # If spotLocal is true also

def get_category(text, is_spot=False):
    t = text.lower()
    if is_spot: return "Spots"
    
    # Priority
    if any(k in t for k in CAT_SORTIR): return "Sortir"
    if any(k in t for k in CAT_DORMIR): return "Dormir"
    if any(k in t for k in CAT_MANGER): return "Manger"
    if any(k in t for k in CAT_EXPLORER): return "Explorer"
    if any(k in t for k in CAT_SPOTS): return "Spots"
    
    return "Explorer" # Defaut

# Rule 3: Budget
def get_budget_tag(price_num, price_str):
    # If price_num is valid use it
    try:
        val = int(price_num)
        if val == 0: return "€"
        if val < 20000: return "€"
        if val <= 100000: return "€€" # User said between 20k and 100k -> €€
        return "€€€"
    except:
        pass
        
    # Fallback to string detection
    s = str(price_str).lower()
    if "gratuit" in s: return "€"
    return "€" # Default

print(f"Reading {INPUT_FILE}...")
# Read JS file
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON
start = content.find('[')
end = content.rfind(']')
if start == -1:
    print("Error: No array found")
    exit(1)

json_str = content[start:end+1]
data = json.loads(json_str)

print(f"Loaded {len(data)} items to normalize.")

for item in data:
    tags = []
    
    # 1. Ville
    ville_raw = item.get('ville', '')
    ville_tag = CITY_MAP.get(ville_raw, ville_raw) # Default to full name if Not Found? Or maybe user wants specific list.
    # User said "Antananarivo" -> "Tana". If it's "Ambanja" (not in list), keep "Ambanja" or ignore?
    # User said "Chaque item DOIT avoir au moins 3 tags (1 Ville...)"
    # So we add whatever we have.
    tags.append(ville_tag)
    
    # 2. Category
    full_text = (item.get('nom', '') + " " + item.get('type', '')).lower()
    is_spot = item.get('spotLocal') is True or str(item.get('spotLocal')).lower() == 'true'
    
    cat_tag = get_category(full_text, is_spot)
    tags.append(cat_tag)
    
    # 3. Budget
    p_num = item.get('prixNum', 0)
    p_str = item.get('prix', '')
    bud_tag = get_budget_tag(p_num, p_str)
    tags.append(bud_tag)
    
    # Add explicit TYPE as an extra tag?
    # User example: ["Culture", "Tana", "Explorer", "€"]
    # "Culture" comes from Type. "Tana" is City. "Explorer" is Cat. "€" is Budget.
    # So we SHOULD add the original Type as a tag too if valuable.
    orig_type = item.get('type', '')
    if orig_type and orig_type.capitalize() not in tags:
         tags.insert(0, orig_type.capitalize()) # Put type first? User example had type first.
         
    # Update item
    item['tags'] = tags
    item['categorie'] = cat_tag # Sync categorie field too
    item['prix'] = bud_tag # Sync prix display to symbol? Or keep text? 
    # User said "Si prix < 20 000 ... -> Tag: '€'". Doesn't explicitly say replace 'prix' field, but implied for consistency?
    # Usually 'prix' field is for display ("10 000 Ar"). 'tags' are for filters.
    # Let's keep 'prix' as is or normalized symbol? The user said "MAPPING BUDGET (Ajoute le tag symbole)".
    # Let's just update tags. BUT Step 180 user said "Budget (Price -> €, €€, €€€)".
    # Let's set item['prix'] = bud_tag just to be safe for card display.
    item['prix'] = bud_tag

# Write to DATA/LIEUX.JS
js_out = f"const LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};"
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_out)

print(f"Normalization Complete. Written to {OUTPUT_FILE}")
