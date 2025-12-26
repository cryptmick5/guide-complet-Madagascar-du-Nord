#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CORRECTION DÉFINITIVE : Remplacement des boutons budget dans le HTML
=====================================================================
Les boutons existent déjà mais avec les mauvais paramètres.
Ce script va les corriger tous d'un coup.
"""

import re
import os

HTML_FILE = "index.html"
BACKUP_DIR = ".gemini/backups"

# Mapping ville complète → clé
CITY_MAPPING = {
    'Antananarivo': 'antananarivo',
    'Antsiranana': 'antsiranana',
    'Nosy Be': 'nosybe',
    'Fianarantsoa': 'fianarantsoa',
    'Mahajanga': 'mahajanga',
    'Toamasina': 'toamasina',
    'Toliara': 'toliara'
}

# Mapping level ancien → nouveau
LEVEL_MAPPING = {
    'low': '1',
    'mid': '2',
    'high': '3'
}


def fix_all_budget_buttons():
    """Corrige tous les boutons budget dans le HTML"""
    
    print("\n" + "="*60)
    print("🔧 CORRECTION DÉFINITIVE DES BOUTONS BUDGET")
    print("="*60 + "\n")
    
    if not os.path.exists(HTML_FILE):
        print(f"❌ Fichier non trouvé : {HTML_FILE}")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "index.html.backup_ultimate")
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"📦 Backup créé : {backup_path}\n")
    
    # Compter les boutons avant
    count_before = len(re.findall(r"toggleProvinceBudget\('(low|mid|high)'", html))
    print(f"🔍 Trouvé {count_before} boutons à corriger\n")
    
    # Corriger chaque combinaison ville/level
    count_fixed = 0
    
    for ville_complete, ville_key in CITY_MAPPING.items():
        for old_level, new_level in LEVEL_MAPPING.items():
            # Pattern à rechercher
            old_pattern = rf"toggleProvinceBudget\('{old_level}', '{ville_complete}', this\)"
            # Nouveau code
            new_code = f"toggleProvinceBudget('{ville_key}', '{new_level}', this)"
            
            # Compter les occurrences
            count = html.count(old_pattern)
            if count > 0:
                html = html.replace(old_pattern, new_code)
                print(f"   ✅ {ville_complete} - {old_level}→{new_level} : {count} bouton(s)")
                count_fixed += count
    
    # Écrire le fichier corrigé
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n{'='*60}")
    print(f"✅ CORRECTION TERMINÉE !")
    print(f"{'='*60}")
    print(f"\n📊 Résumé :")
    print(f"   • {count_fixed} boutons corrigés")
    print(f"   • Paramètres mis à jour :")
    print(f"     - 'low' → '1' (cityKey)")
    print(f"     - 'mid' → '2' (cityKey)")
    print(f"     - 'high' → '3' (cityKey)")
    print(f"     - Noms de villes → clés (ex: 'Nosy Be' → 'nosybe')")
    
    print(f"\n💡 Test maintenant :")
    print(f"   1. Rechargez le navigateur (Ctrl+Shift+R)")
    print(f"   2. Allez sur n'importe quelle page de province")
    print(f"   3. Cliquez sur € ou €€")
    print(f"   4. Les filtres devraient FONCTIONNER ! ✨\n")
    
    return True


if __name__ == "__main__":
    success = fix_all_budget_buttons()
    if not success:
        exit(1)
