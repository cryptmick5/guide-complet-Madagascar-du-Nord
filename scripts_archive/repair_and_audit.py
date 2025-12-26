import json
import os
import re

DATA_PATH = 'data/lieux.js'

def run_repair_and_audit():
    if not os.path.exists(DATA_PATH):
        print(f"❌ '{DATA_PATH}' introuvable.")
        return

    print("🚀 Démarrage de la réparation et de l'audit...")

    # --- 1. LECTURE ROBUSTE ---
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # Nettoyage de l'en-tête JS pour isoler le JSON
        json_str = re.sub(r'^(const|var|let|window\.)\s*\w+\s*=\s*', '', content).strip().rstrip(';')
        try:
            data = json.loads(json_str)
        except Exception as e:
            print(f"❌ Erreur critique lecture JSON: {e}")
            return

    count_updates = 0
    missing_images = []

    # --- 2. TRAITEMENT ITEM PAR ITEM ---
    for item in data:
        # A. Nettoyage Syntaxe (Anti-Crash)
        # On parcourt les champs texte pour supprimer sauts de ligne et espaces superflus
        for key in ['nom', 'description', 'conseil', 'acces', 'type', 'ville']:
            if key in item and isinstance(item[key], str):
                # Supprime les sauts de ligne qui cassent le JS
                cleaned = item[key].replace('\r\n', ' ').replace('\n', ' ').strip()
                # Note: json.dumps échappera les guillemets automatiquement.
                # Pour les apostrophes, JSON standard les accepte, mais on peut les uniformiser si besoin.
                item[key] = cleaned
        
        # B. Normalisation des TAGS (Re-application stricte)
        tags = set(item.get('tags', []))
        
        # Analyse textuelle pour auto-tag
        txt = (str(item.get('nom', '')) + " " + str(item.get('type', '')) + " " + str(item.get('description', ''))).lower()
        ville = (item.get('ville') or "").lower()
        
        # Mapping Ville
        if 'nosy be' in ville or 'nosy-be' in ville: tags.add('Nosy Be')
        elif 'antananarivo' in ville or 'tana' in ville: tags.add('Tana')
        elif 'antsiranana' in ville or 'diego' in ville: tags.add('Diego')
        elif 'mahajanga' in ville or 'majunga' in ville: tags.add('Majunga')
        elif 'toamasina' in ville or 'tamatave' in ville: tags.add('Tamatave')
        elif 'toliara' in ville or 'tuléar' in ville or 'tulear' in ville: tags.add('Tuléar')
        elif 'fianarantsoa' in ville or 'fianar' in ville: tags.add('Fianar')

        # Mapping Catégorie
        if any(x in txt for x in ['resto', 'manger', 'dîner', 'déjeuner', 'pizza', 'cuisine', 'repas']): tags.add('Manger')
        if any(x in txt for x in ['hotel', 'hôtel', 'lodge', 'dormir', 'hébergement', 'bungalow', 'gîte', 'chambre']): tags.add('Dormir')
        if any(x in txt for x in ['bar', 'club', 'sortir', 'ambiance', 'nuit', 'cabaret', 'karaoke', 'danse']): tags.add('Sortir')
        if any(x in txt for x in ['plage', 'parc', 'nature', 'rando', 'visite', 'culture', 'monument', 'musée', 'baobab', 'lémurien', 'cascade']): tags.add('Explorer')
        if item.get('spotLocal') is True or 'spot' in txt: tags.add('Spots')

        # Mapping Budget
        try:
            p = str(item.get('prix', ''))
            if 'Gratuit' in p or not p or p == '0': tags.add('€')
            else:
                val_str = re.sub(r'[^\d]', '', p)
                if val_str:
                    val = int(val_str)
                    if val <= 25000: tags.add('€')
                    elif val <= 100000: tags.add('€€')
                    else: tags.add('€€€')
                else: tags.add('€')
        except: tags.add('€')

        item['tags'] = list(tags)

        # C. Audit Image (Sans modification)
        img_path = item.get('image', '')
        if img_path:
            # Gestion des chemins Windows/Unix
            local_path = img_path.replace('/', os.sep)
            if not os.path.exists(local_path):
                missing_images.append(f"{img_path} (ID: {item.get('id')} - {item.get('nom')})")
        else:
            missing_images.append(f"AUCUNE IMAGE (ID: {item.get('id')} - {item.get('nom')})")

        count_updates += 1

    # --- 3. ÉCRITURE SÉCURISÉE ---
    # On force le format window.LIEUX_DATA = ...
    # json.dumps(..., ensure_ascii=False) garantit que les accents restent lisibles
    # et échappe correctement les caractères spéciaux JSON.
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")

    print(f"✅ {count_updates} fiches nettoyées et sauvegardées.")
    
    # --- 4. RAPPORT FINAL ---
    print("\n⚠️ IMAGES MANQUANTES À AGOUTER MANUELLEMENT :")
    if not missing_images:
        print("Aucune ! Tout est clean ✨")
    else:
        for m in missing_images:
            print(f"- {m}")

if __name__ == "__main__":
    run_repair_and_audit()
