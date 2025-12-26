#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔧 AJOUT SITE WEB AUX FICHES TOAMASINA
Ajoute un lien siteWeb à toutes les fiches Toamasina
"""

import json
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
LIEUX_FILE = PROJECT_ROOT / 'data' / 'lieux.js'

def load_lieux_data():
    """Charge les données depuis lieux.js"""
    with open(LIEUX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.LIEUX_DATA\s*=\s*(\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Impossible de trouver window.LIEUX_DATA")
    
    return json.loads(match.group(1)), content

def add_website_to_toamasina():
    """Ajoute un site web Google Maps aux fiches Toamasina"""
    
    print("🌐 AJOUT SITE WEB - FICHES TOAMASINA")
    print("=" * 80)
    
    data, original_content = load_lieux_data()
    
    modified_count = 0
    
    # Pour chaque fiche Toamasina (IDs 641-670)
    for lieu in data:
        if lieu['id'] >= 641 and lieu['id'] <= 670:
            # Si pas de siteWeb, ajouter un lien Google Maps
            if 'siteWeb' not in lieu or not lieu.get('siteWeb'):
                # Créer un lien Google Maps de recherche
                nom_encoded = lieu['nom'].replace(' ', '+')
                ville_encoded = lieu.get('ville', 'Toamasina').replace(' ', '+')
                lieu['siteWeb'] = f"https://www.google.com/maps/search/{nom_encoded}+{ville_encoded}"
                modified_count += 1
    
    print(f"✅ {modified_count} fiches enrichies avec siteWeb")
    
    # Sauvegarder
    print("\n💾 Sauvegarde...")
    
    match = re.search(r'(window\.LIEUX_DATA\s*=\s*)\[.*\];', original_content, re.DOTALL)
    if not match:
        print("   ❌ Erreur: Impossible de trouver window.LIEUX_DATA")
        return False
    
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    new_content = original_content[:match.start(1)] + match.group(1) + new_json + ';' + original_content[match.end():]
    
    with open(LIEUX_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("   ✅ Fichier lieux.js mis à jour")
    print("\n✅ TERMINÉ !")
    print("\n📝 Changements:")
    print(f"   • {modified_count} liens Google Maps ajoutés")
    print("   • Bouton X maintenant fonctionnel (app.js modifié)")
    print("\n🔄 Rechargez (Ctrl+Shift+R) et testez !")
    
    return True

if __name__ == '__main__':
    add_website_to_toamasina()
