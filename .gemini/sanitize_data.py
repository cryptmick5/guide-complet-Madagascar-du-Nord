
import json
import os
import re

# Chemin du fichier
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
FILE_PATH = os.path.join(BASE_DIR, 'data', 'lieux.js')

def sanitize_data():
    if not os.path.exists(FILE_PATH):
        print(f"❌ Fichier introuvable: {FILE_PATH}")
        return

    print(f"Reading {FILE_PATH}...")
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # Nettoyage pour lire le JSON
        # Locate array start [ ... ]
        start = content.find('[')
        end = content.rfind(']')
        if start == -1 or end == -1:
             print("❌ JSON array not found")
             return
             
        json_str = content[start:end+1]
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"❌ Erreur lecture JSON: {e}")
            return

    count = 0
    for item in data:
        # On nettoie TOUS les champs texte dangereux
        for key in ['description', 'nom', 'acces', 'conseil', 'type']:
            if key in item and isinstance(item[key], str):
                # 1. Remplace l'apostrophe code (') par l'apostrophe texte (’)
                # 2. Enlève les retours à la ligne qui cassent le JS
                original = item[key]
                clean = original.replace("'", "’").replace('"', "").replace('\n', ' ').replace('\r', '')
                item[key] = clean
        count += 1

    # Sauvegarde
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    
    print(f"✅ SUCCÈS : {count} lieux nettoyés (apostrophes et guillemets corrigés) !")

if __name__ == "__main__":
    sanitize_data()
