
import json
import re

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"

VALID_FILTERS = ['Explorer', 'Manger', 'Dormir', 'Sortir', 'Spot']

# Keywords for logic check
KEYWORDS = {
    'Manger': ['resto', 'manger', 'snack', 'diner', 'déjeuner', 'gastronomie'],
    'Dormir': ['hotel', 'hôtel', 'lodge', 'hébergement', 'guest', 'auberge', 'resort'],
    'Sortir': ['bar', 'club', 'boîte', 'casino', 'pub', 'sortir'],
    'Spot': ['spot'],
    'Explorer': ['nature', 'culture', 'plage', 'parc', 'visite']
}

def audit_strict():
    print("🚀 STARTING STRICT ENGINEER AUDIT...")
    
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON
    json_str = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content)
    json_str = json_str.strip()
    if json_str.endswith(';'): json_str = json_str[:-1]

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"❌ JSON ERROR: {e}")
        return

    print(f"📦 Total Data Points: {len(data)}")
    
    errors = []
    warnings = []
    
    distribution = {k: 0 for k in VALID_FILTERS}
    
    for i, item in enumerate(data):
        nom = item.get('nom', f"Item {i}")
        cat = item.get('categorie')
        type_orig = (item.get('type') or "").lower()
        
        # 1. EXISTENCE CHECK
        if not cat:
            errors.append(f"❌ [MISSING CAT] {nom} (ID: {item.get('id')}) has NO category.")
            continue
            
        # 2. VALIDITY CHECK
        if cat not in VALID_FILTERS:
            errors.append(f"❌ [INVALID CAT] {nom} (ID: {item.get('id')}) has category '{cat}' which is NOT in logic.")
            continue
            
        distribution[cat] += 1
        
        # 3. LOGIC CHECK (Heuristic)
        # Check if a "Hotel" is labeled as "Manger" or "Explorer"
        
        # If type says 'hotel', cat SHOULD be Dormir
        if 'hotel' in type_orig or 'hôtel' in type_orig or 'lodge' in type_orig:
            if cat != 'Dormir' and cat != 'Spot': # Spot overrides everything
                 warnings.append(f"⚠️ [MISMATCH?] {nom} is type '{type_orig}' but category '{cat}' (Expected Dormir?)")

        # If type says 'restaurant', cat SHOULD be Manger
        if 'restaurant' in type_orig or 'resto' in type_orig:
             if cat != 'Manger' and cat != 'Spot':
                 warnings.append(f"⚠️ [MISMATCH?] {nom} is type '{type_orig}' but category '{cat}' (Expected Manger?)")
                 
    print("\n📊 CATEGORY DISTRIBUTION:")
    for k, v in distribution.items():
        print(f"   - {k}: {v}")

    print("\n🔍 AUDIT RESULTS:")
    if not errors and not warnings:
        print("✅ SUCCESS: All 194 items are perfectly categorized and logically consistent.")
    else:
        if errors:
            print(f"\n❌ FOUND {len(errors)} CRITICAL ERRORS:")
            for e in errors: print(e)
        if warnings:
            print(f"\n⚠️ FOUND {len(warnings)} LOGICAL WARNINGS (Please review):")
            for w in warnings: print(w)

if __name__ == "__main__":
    audit_strict()
