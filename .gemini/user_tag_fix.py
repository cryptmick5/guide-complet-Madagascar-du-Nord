
import json
import os
import re

# PATHS
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
FILE_PATH = os.path.join(BASE_DIR, "data", "lieux.js")

def reparer_tags_selon_logique():
    if not os.path.exists(FILE_PATH):
        print(f"❌ Fichier introuvable: {FILE_PATH}")
        return

    print(f"Reading {FILE_PATH}...")
    # 1. On lit le fichier
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Robust Extraction: Find the array [ ... ]
    start = content.find('[')
    end = content.rfind(']')
    
    if start == -1 or end == -1:
        print("❌ Impossible de trouver le tableau JSON dans le fichier.")
        return

    json_str = content[start:end+1]

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"❌ Erreur de décodage JSON: {e}")
        return

    count = 0
    # 2. On boucle sur chaque fiche (LA LOGIQUE)
    for item in data:
        # On commence avec une liste vide ou existante
        tags = set() 
        
        # --- LOGIQUE A : VILLE (Si ville = X alors Tag = Y) ---
        ville = (item.get('ville') or "").lower()
        if 'antananarivo' in ville: tags.add('Tana')
        elif 'antsiranana' in ville or 'diego' in ville: tags.add('Diego')
        elif 'mahajanga' in ville: tags.add('Majunga')
        elif 'toamasina' in ville: tags.add('Tamatave')
        elif 'toliara' in ville: tags.add('Tuléar')
        elif 'fianarantsoa' in ville: tags.add('Fianar')
        elif 'nosy be' in ville: tags.add('Nosy Be')
        # If no match, maybe keep original city? 
        # User script didn't say so, but usually good practice. 
        # But I must stick to USER script logic strictly.
        # User script: if match -> add tag. Only.

        # --- LOGIQUE B : BUDGET (Si prix < X alors Tag = €) ---
        try:
            prix_txt = str(item.get('prix', '')).replace(' ', '')
            # Handle 'prixNum' if available for better accuracy, but user used 'prix' txt.
            # I will check if prixNum available first as fallback/priority if prix text is weird? 
            # No, user code regex searches digits in text.
            
            if 'Gratuit' in prix_txt or not prix_txt: 
                tags.add('€')
            else:
                # On récupère juste le chiffre (ex: "10 000" -> 10000)
                m = re.search(r'\d+', prix_txt)
                if m:
                    prix_val = int(m.group())
                    if prix_val <= 25000: tags.add('€') # User said <= 25000
                    elif prix_val <= 100000: tags.add('€€') # User said <= 100000
                    else: tags.add('€€€')
                else: 
                     # No digits found
                     tags.add('€')
        except:
            tags.add('€') # Par défaut si erreur

        # --- LOGIQUE C : CATEGORIE (Si type contient X alors Tag = Y) ---
        infos_completes = (str(item.get('type', '')) + " " + str(item.get('description', ''))).lower()
        
        if any(x in infos_completes for x in ['plage', 'parc', 'rando', 'nature', 'réserve']): 
            tags.add('Explorer')
        if any(x in infos_completes for x in ['restaurant', 'manger', 'cuisine', 'dîner', 'snack', 'pizzeria']): 
            tags.add('Manger')
        if any(x in infos_completes for x in ['hotel', 'hôtel', 'lodge', 'dormir', 'bivouac', 'camping']): 
            tags.add('Dormir')
        if any(x in infos_completes for x in ['bar', 'club', 'sortir', 'ambiance', 'disco']): 
            tags.add('Sortir')
        
        # Si c'est un spot local
        # Handle string 'true' or boolean True
        sl = item.get('spotLocal')
        if sl is True or str(sl).lower() == 'true':
            tags.add('Spots')
            
        # Ensure Primary Tag (User: "CHAQUE fiche... possède OBLIGATOIREMENT les tags")
        # Ensure we don't end up with empty tags?
        # User script logic essentially ensures at least budget tag.

        # On sauvegarde les nouveaux tags calculés
        item['tags'] = list(tags)
        
        # User didn't ask to update 'categorie' or 'prix' fields, just TAGS.
        # But 'app.js' might rely on 'categorie'.
        # I should probably sync 'categorie' to the primary tag found?
        # User script DOES NOT do this. I will strictly FOLLOW User script.
        
        count += 1

    # 3. On réécrit le fichier proprement
    # User requested 'window.LIEUX_DATA ='
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    
    print(f"✅ FINI : {count} fiches mises à jour avec les bons tags !")

if __name__ == "__main__":
    reparer_tags_selon_logique()
