import json
import os
import random

# --- CONFIGURATION (BACKUP RESTORE) ---
INPUT_ZONES = 'data/zones_data.json' # Ignored
INPUT_LIEUX_OLD = 'data/lieux_FINAL_RESTORED.js' 

# LISTE DES CIBLES
TARGET_FILES = [
    'data/lieux.js',
    'lieux.js',
    'js/lieux.js'
]

CITY_COORDINATES = {
    'Antananarivo': (-18.8792, 47.5079), 'Tana': (-18.8792, 47.5079),
    'Antsiranana': (-12.2797, 49.2917), 'Diego-Suarez': (-12.2797, 49.2917), 'Diego': (-12.2797, 49.2917),
    'Mahajanga': (-15.7167, 46.3167), 'Majunga': (-15.7167, 46.3167),
    'Toamasina': (-18.1492, 49.4023), 'Tamatave': (-18.1492, 49.4023),
    'Toliara': (-23.3500, 43.6667), 'Tulear': (-23.3500, 43.6667),
    'Fianarantsoa': (-21.4333, 47.0833), 'Fianar': (-21.4333, 47.0833),
    'Nosy Be': (-13.3000, 48.2500), 'Nosy-Be': (-13.3000, 48.2500),
    'Sainte-Marie': (-16.999, 49.883), 'Nosy Boraha': (-16.999, 49.883),
    'SAVA': (-14.2667, 50.1667), 
    'Ampefy': (-19.0333, 46.7333),
    'Antsirabe': (-19.8667, 47.0333),
    'Isalo': (-22.5833, 45.3667), 'Ranohira': (-22.5833, 45.3667),
    'Andasibe': (-18.9333, 48.4167),
    'Morondava': (-20.2833, 44.2833),
    'Fort-Dauphin': (-25.0333, 46.9833), 'Tolagnaro': (-25.0333, 46.9833)
}

def normalize_tags(item):
    raw_text = (item.get('type', '') + ' ' + item.get('nom', '') + ' ' + item.get('description', '')).lower()
    existing_tags = [t.lower() for t in item.get('tags', [])]
    raw_text += ' '.join(existing_tags)
    new_tags = set()
    if 'plage' in raw_text or 'mer' in raw_text or 'lagon' in raw_text: new_tags.add('Plage')
    if 'nature' in raw_text or 'parc' in raw_text or 'lémurien' in raw_text or 'randonnée' in raw_text: new_tags.add('Nature')
    if 'culture' in raw_text or 'ville' in raw_text or 'histoire' in raw_text: new_tags.add('Culture')
    if 'manger' in raw_text or 'restaurant' in raw_text or 'bar' in raw_text: new_tags.add('Manger')
    if 'dormir' in raw_text or 'hôtel' in raw_text or 'lodge' in raw_text: new_tags.add('Dormir')
    if not new_tags: new_tags.add('Culture')
    return list(new_tags)

def load_js_array(filepath):
    if not os.path.exists(filepath): return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        try:
            start = content.index('[')
            end = content.rindex(']') + 1
            return json.loads(content[start:end])
        except: return []

def process():
    print("🚀 Démarrage REPARATION BACKUP (FINAL_RESTORED)...")
    
    # 1. Chargement SEUL du backup
    legacy = load_js_array(INPUT_LIEUX_OLD)
    print(f"📊 Source Backup: {len(legacy)} items")

    # 2. Pas de fusion, on garde le backup pur
    final_list = legacy
    
    # 3. Nettoyage et GPS
    gps_fixed_count = 0
    
    for i, item in enumerate(final_list):
        # ID unique simple (RENUMBERING FORCED to fix duplicates)
        item['id'] = i + 1 
        # if 'id' not in item: item['id'] = 2000 + i # DISABLED
        item['tags'] = normalize_tags(item)
        
        # GPS FIX
        if 'lat' not in item or 'lng' not in item:
            ville = item.get('ville', '').strip()
            coords = None
            for city_key, val in CITY_COORDINATES.items():
                if city_key.lower() in ville.lower():
                    coords = val
                    break
            base_lat, base_lng = coords if coords else (-18.7669, 46.8691)
            item['lat'] = base_lat + random.uniform(-0.015, 0.015)
            item['lng'] = base_lng + random.uniform(-0.015, 0.015)
            gps_fixed_count += 1

    js_content = f"const LIEUX_DATA = {json.dumps(final_list, indent=4, ensure_ascii=False)};"
    
    print(f"📊 Données prêtes : {len(final_list)} lieux.")

    # ECRITURE MULTIPLE
    success_count = 0
    for path in TARGET_FILES:
        try:
            folder = os.path.dirname(path)
            if folder and not os.path.exists(folder): continue
            with open(path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print(f"✅ ÉCRIT : {path}")
            success_count += 1
        except Exception as e:
            print(f"⚠️ Échec sur {path}")

    print(f"🏁 TERMINÉ. Backup restauré et réparé à {success_count} endroits.")

if __name__ == "__main__":
    process()
