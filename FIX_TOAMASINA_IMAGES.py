#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔧 CORRECTION FICHES TOAMASINA
Corrige les chemins d'images et les caractères spéciaux
"""

import json
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
LIEUX_FILE = PROJECT_ROOT / 'data' / 'lieux.js'

# Image placeholder par défaut
DEFAULT_IMAGES = {
    'manger': 'images/placeholder-restaurant.jpg',
    'dormir': 'images/placeholder-hotel.jpg',
    'explorer': 'images/placeholder-nature.jpg',
    'sortir': 'images/placeholder-bar.jpg',
    'spots': 'images/placeholder-spot.jpg',
}

def load_lieux_data():
    """Charge les données depuis lieux.js"""
    with open(LIEUX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.LIEUX_DATA\s*=\s*(\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Impossible de trouver window.LIEUX_DATA")
    
    return json.loads(match.group(1)), content

def fix_toamasina_locations():
    """Corrige les fiches Toamasina problématiques"""
    
    print("🔧 CORRECTION FICHES TOAMASINA")
    print("=" * 80)
    
    # Charger les données
    data, original_content = load_lieux_data()
    
    fixed_count = 0
    toamasina_ids = []
    
    # Corriger chaque fiche Toamasina (IDs 641-655)
    for lieu in data:
        if lieu['id'] >= 641 and lieu['id'] <= 655:
            toamasina_ids.append(lieu['id'])
            
            # Corriger le chemin d'image
            if 'tags' in lieu:
                category = None
                if 'manger' in lieu['tags']:
                    category = 'manger'
                elif 'dormir' in lieu['tags']:
                    category = 'dormir'
                elif 'explorer' in lieu['tags']:
                    category = 'explorer'
                elif 'sortir' in lieu['tags']:
                    category = 'sortir'
                elif 'spots' in lieu['tags']:
                    category = 'spots'
                
                if category and category in DEFAULT_IMAGES:
                    lieu['image'] = DEFAULT_IMAGES[category]
                    fixed_count += 1
    
    print(f"✅ {fixed_count} fiches corrigées (IDs: {min(toamasina_ids)}-{max(toamasina_ids)})")
    
    # Sauvegarder
    print("\n💾 Sauvegarde...")
    
    match = re.search(r'(window\.LIEUX_DATA\s*=\s*)\[.*\];', original_content, re.DOTALL)
    if not match:
        print("   ❌ Erreur: Impossible de trouver window.LIEUX_DATA")
        return False
    
    # Générer le nouveau JSON
    new_json = json.dumps(data, ensure_ascii=False, indent=2)
    
    # Remplacer
    new_content = original_content[:match.start(1)] + match.group(1) + new_json + ';' + original_content[match.end():]
    
    # Écrire
    with open(LIEUX_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("   ✅ Fichier lieux.js mis à jour")
    print("\n✅ CORRECTION TERMINÉE !")
    print("\n🔄 Rechargez la page (Ctrl+Shift+R) pour voir les changements")
    
    return True

if __name__ == '__main__':
    success = fix_toamasina_locations()
    exit(0 if success else 1)
