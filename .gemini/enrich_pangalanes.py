
import json
import os

DATA_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"

def enrich_pangalanes():
    if not os.path.exists(DATA_PATH): return

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.replace('window.LIEUX_DATA =', '').strip().rstrip(';')
        data = json.loads(json_str)

    # Find ID 631 or Name "Canal des Pangalanes"
    found = False
    for item in data:
        if item.get('nom') == "Canal des Pangalanes" or item.get('id') == 631:
            item['conseil'] = "Pour une expérience authentique, optez pour une balade en pirogue traditionnelle au coucher du soleil. Les reflets sur l'eau sont magiques."
            item['acces'] = "Port fluvial de Toamasina (Zone Ivondro). accessible en taxi ou tuk-tuk."
            item['horaires'] = "Départs toute la journée, idéalement le matin."
            item['duree'] = "Demi-journée ou journée complète"
            item['siteWeb'] = "" # Pas de site web spécifique
            
            # Ensure "Explorer" is in tags if missing
            if 'Explorer' not in item['tags']:
                item['tags'].insert(0, 'Explorer')
            
            found = True
            break
    
    if found:
        with open(DATA_PATH, 'w', encoding='utf-8') as f:
            f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
        print("✅ SUCCESS: Pangalanes enriched with Conseil, Acces, Horaires.")
    else:
        print("❌ ERROR: Pangalanes not found.")

if __name__ == "__main__":
    enrich_pangalanes()
