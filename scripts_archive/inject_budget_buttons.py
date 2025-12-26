#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
INJECTION DES BOUTONS BUDGET (€, €€, €€€)
===========================================
PROBLÈME IDENTIFIÉ : Les boutons de filtre budget n'existent PAS dans le HTML.
Le JavaScript attend des boutons qui ne sont jamais créés !

SOLUTION : Injecter automatiquement les boutons budget dans toutes les pages de villes.
"""

import re
import os
from pathlib import Path

# Configuration
HTML_FILE = "index.html"
BACKUP_DIR = ".gemini/backups"

# Mapping des villes (nom dans page-id → nom pour onclick)
CITIES = {
    'antsiranana': 'Antsiranana',
    'mahajanga': 'Mahajanga', 
    'toamasina': 'Toamasina',
    'toliara': 'Toliara',
    'fianarantsoa': 'Fianarantsoa',
    'antananarivo': 'Antananarivo'
}

def generate_budget_html(city_key):
    """Génère le HTML des boutons budget pour une ville donnée"""
    
    budget_html = f'''
        <!-- 💰 FILTRES BUDGET (Auto-généré par inject_budget_buttons.py) -->
        <div class="budget-pills-container" style="margin-top: 16px; margin-bottom: 20px;">
            <div class="filter-title" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; text-align: center;">
                <i class="fas fa-wallet"></i> Budget
            </div>
            <div class="nav-pills" style="justify-content: center;">
                <button class="budget-btn nav-pill" data-level="1" onclick="toggleProvinceBudget('{city_key}', '1', this)">
                    <i class="fas fa-coins"></i> € <span style="font-size: 0.75rem; opacity: 0.8;">(- 25k Ar)</span>
                </button>
                <button class="budget-btn nav-pill" data-level="2" onclick="toggleProvinceBudget('{city_key}', '2', this)">
                    <i class="fas fa-money-bill-wave"></i> €€ <span style="font-size: 0.75rem; opacity: 0.8;">(25k-80k)</span>
                </button>
                <button class="budget-btn nav-pill" data-level="3" onclick="toggleProvinceBudget('{city_key}', '3', this)">
                    <i class="fas fa-gem"></i> €€€ <span style="font-size: 0.75rem; opacity: 0.8;">(+ 80k Ar)</span>
                </button>
            </div>
        </div>
'''
    return budget_html.strip()


def find_filter_insertion_points(html_content):
    """
    Trouve tous les endroits où insérer les boutons budget.
    On cherche les sections de pages de villes qui ont des filtres de catégories.
    """
    
    insertions = []
    
    # Pattern: chercher les sections avec id="page-{city}" qui contiennent des nav-pills
    # On va chercher juste après la première div.nav-pills de chaque section
    
    for city_key in CITIES.keys():
        # Chercher la section de cette ville
        page_pattern = rf'<section[^>]*id=["\']page-{city_key}["\'][^>]*>(.*?)</section>'
        page_match = re.search(page_pattern, html_content, re.DOTALL | re.IGNORECASE)
        
        if page_match:
            page_content = page_match.group(1)
            page_start = page_match.start(1)
            
            # Chercher la première occurrence de </div> après une div avec class="nav-pills"
            # qui contient des boutons de filtres (Explorer, Manger, etc.)
            nav_pills_pattern = r'<div[^>]*class=["\'][^"\']*nav-pills[^"\']*["\'][^>]*>.*?</div>'
            nav_match = re.search(nav_pills_pattern, page_content, re.DOTALL)
            
            if nav_match:
                # Position absolue dans le HTML complet
                insertion_pos = page_start + nav_match.end()
                insertions.append((insertion_pos, city_key))
                print(f"✅ Trouvé point d'insertion pour {city_key} à la position {insertion_pos}")
    
    return insertions


def inject_budget_buttons():
    """
    Fonction principale qui injecte les boutons budget dans le HTML
    """
    
    print("\n" + "="*60)
    print("INJECTION DES BOUTONS BUDGET DANS HTML")
    print("="*60 + "\n")
    
    # Vérifier que le fichier existe
    if not os.path.exists(HTML_FILE):
        print(f"❌ Erreur : {HTML_FILE} introuvable")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "index.html.backup_budget")
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        original_html = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_html)
    
    print(f"📦 Backup créé : {backup_path}\n")
    
    # Trouver les points d'insertion
    print("🔍 Recherche des sections de villes...")
    insertions = find_filter_insertion_points(original_html)
    
    if not insertions:
        print("❌ Aucune section de ville trouvée !")
        print("💡 Vérifiez que index.html contient des sections avec id='page-{city}'")
        return False
    
    print(f"\n📍 {len(insertions)} points d'insertion trouvés\n")
    
    # Trier par position décroissante pour insérer du bas vers le haut
    # (évite de décaler les positions)
    insertions.sort(reverse=True)
    
    # Injecter les boutons
    modified_html = original_html
    injected_count = 0
    
    for pos, city_key in insertions:
        budget_html = generate_budget_html(city_key)
        
        # Insérer à la position
        modified_html = modified_html[:pos] + "\n" + budget_html + "\n" + modified_html[pos:]
        injected_count += 1
        print(f"✅ Boutons budget injectés pour : {city_key}")
    
    # Écrire le fichier modifié
    with open(HTML_FILE, 'w', encoding='utf-8') as f:
        f.write(modified_html)
    
    print(f"\n{'='*60}")
    print(f"✅ INJECTION RÉUSSIE !")
    print(f"{'='*60}")
    print(f"\n📊 Résumé :")
    print(f"   • {injected_count} sections modifiées")
    print(f"   • Fichier mis à jour : {HTML_FILE}")
    print(f"   • Backup : {backup_path}")
    
    print(f"\n💡 Prochaines étapes :")
    print(f"   1. Rechargez le navigateur (F5)")
    print(f"   2. Naviguez vers une page de ville (ex: Diego-Suarez)")
    print(f"   3. Vous devriez voir les boutons € €€ €€€ sous les filtres")
    print(f"   4. Testez-les pour vérifier le filtrage")
    
    return True


if __name__ == "__main__":
    success = inject_budget_buttons()
    if not success:
        print("\n⚠️ ÉCHEC : Vérifiez les erreurs ci-dessus")
        exit(1)
