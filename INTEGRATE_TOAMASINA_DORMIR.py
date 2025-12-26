#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎯 INTÉGRATION SÉCURISÉE TOAMASINA - Phase 2: DORMIR
Intègre les 15 fiches hébergements dans lieux.js de manière sécurisée.
"""

import json
import re
import shutil
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent
LIEUX_FILE = PROJECT_ROOT / 'data' / 'lieux.js'
NEW_DATA_FILE = PROJECT_ROOT / 'toamasina_dormir.json'

def create_backup():
    """Crée un backup de lieux.js"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = PROJECT_ROOT / f'data/lieux_backup_{timestamp}.js'
    shutil.copy2(LIEUX_FILE, backup_file)
    print(f"✅ Backup créé: {backup_file.name}")
    return backup_file

def load_lieux_data():
    """Charge les données depuis lieux.js"""
    with open(LIEUX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'window\.LIEUX_DATA\s*=\s*(\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Impossible de trouver window.LIEUX_DATA")
    
    return json.loads(match.group(1)), content

def load_new_locations():
    """Charge les nouvelles fiches depuis le JSON"""
    with open(NEW_DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def validate_location(loc):
    """Valide qu'une fiche a tous les champs requis"""
    required = ['nom', 'ville', 'description', 'tags', 'prix', 'prixNum', 'lat', 'lng', 'note', 'type']
    for field in required:
        if field not in loc:
            return False, f"Champ manquant: {field}"
    
    if 'toamasina' not in loc['tags']:
        return False, "Tag 'toamasina' manquant"
    
    if 'dormir' not in loc['tags']:
        return False, "Tag 'dormir' manquant"
    
    budget_tags = [t for t in loc['tags'] if t.startswith('budget_')]
    if len(budget_tags) != 1:
        return False, f"Doit avoir exactement 1 tag budget, trouvé {len(budget_tags)}"
    
    return True, "OK"

def integrate_locations():
    """Intègre les nouvelles fiches dans lieux.js"""
    
    print("🎯 INTÉGRATION TOAMASINA - PHASE 2: DORMIR")
    print("=" * 80)
    
    # 1. Backup
    backup_file = create_backup()
    
    # 2. Charger données existantes
    print("\n📂 Chargement données existantes...")
    existing_data, original_content = load_lieux_data()
    print(f"   Fiches existantes: {len(existing_data)}")
    
    # 3. Charger nouvelles fiches
    print("\n📥 Chargement nouvelles fiches...")
    new_locations = load_new_locations()
    print(f"   Nouvelles fiches: {len(new_locations)}")
    
    # 4. Validation
    print("\n✓ Validation des fiches...")
    valid_count = 0
    errors = []
    for i, loc in enumerate(new_locations, 1):
        is_valid, msg = validate_location(loc)
        if is_valid:
            valid_count += 1
        else:
            errors.append(f"  Fiche {i} ({loc.get('nom', 'SANS NOM')}): {msg}")
    
    if errors:
        print(f"   ❌ {len(errors)} erreurs détectées:")
        for error in errors:
            print(error)
        return False
    
    print(f"   ✅ {valid_count}/{len(new_locations)} fiches valides")
    
    # 5. Attribuer IDs et images
    print("\n🔢 Attribution des IDs et chemins images...")
    next_id = max(lieu['id'] for lieu in existing_data) + 1
    for i, loc in enumerate(new_locations):
        loc['id'] = next_id + i
        # Image placeholder
        loc['image'] = 'images/placeholder-hotel.jpg'
    
    print(f"   Premier ID: {next_id}")
    print(f"   Dernier ID: {next_id + len(new_locations) - 1}")
    
    # 6. Fusionner
    print("\n🔗 Fusion des données...")
    merged_data = existing_data + new_locations
    print(f"   Total après fusion: {len(merged_data)} fiches")
    
    # 7. Sauvegarder
    print("\n💾 Sauvegarde dans lieux.js...")
    
    match = re.search(r'(window\.LIEUX_DATA\s*=\s*)\[.*\];', original_content, re.DOTALL)
    if not match:
        print("   ❌ Erreur: Impossible de trouver window.LIEUX_DATA")
        return False
    
    new_json = json.dumps(merged_data, ensure_ascii=False, indent=2)
    new_content = original_content[:match.start(1)] + match.group(1) + new_json + ';' + original_content[match.end():]
    
    with open(LIEUX_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("   ✅ Fichier lieux.js mis à jour")
    
    # 8. Statistiques finales
    print("\n" + "=" * 80)
    print("📊 RÉSUMÉ")
    print("=" * 80)
    print(f"   Fiches AVANT: {len(existing_data)}")
    print(f"   Fiches AJOUTÉES: {len(new_locations)}")
    print(f"   Fiches APRÈS: {len(merged_data)}")
    print(f"   Backup: {backup_file.name}")
    print("\n✅ Phase 2 terminée !")
    print(f"\n📊 PROGRESSION TOAMASINA: 30/65 fiches créées")
    print("   ✅ Manger: 15/15")
    print("   ✅ Dormir: 15/15")
    print("   ⏳ Explorer: 0/20")
    print("   ⏳ Sortir: 0/10")
    print("   ⏳ Spots: 0/5")
    
    return True

if __name__ == '__main__':
    success = integrate_locations()
    exit(0 if success else 1)
