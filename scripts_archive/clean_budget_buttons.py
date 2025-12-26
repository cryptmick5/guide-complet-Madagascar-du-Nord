#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NETTOYAGE ET DIAGNOSTIC : Suppression des vieux boutons budget
===============================================================
"""

import re
import os

HTML_FILE = "index.html"
BACKUP_DIR = ".gemini/backups"

def remove_old_budget_buttons():
    """Cherche et supprime les vieux boutons budget dans le HTML"""
    
    print("\n" + "="*60)
    print("NETTOYAGE DES VIEUX BOUTONS BUDGET")
    print("="*60 + "\n")
    
    if not os.path.exists(HTML_FILE):
        print(f"❌ Fichier non trouvé : {HTML_FILE}")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "index.html.backup_clean")
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"📦 Backup créé : {backup_path}\n")
    
    # Chercher les patterns de boutons budget avec 'low', 'mid', 'high'
    patterns_to_remove = [
        r'<button[^>]*onclick=["\']toggleProvinceBudget\([^)]*["\']low["\'][^)]*\)["\'][^>]*>.*?</button>',
        r'<button[^>]*onclick=["\']toggleProvinceBudget\([^)]*["\']mid["\'][^)]*\)["\'][^>]*>.*?</button>',
        r'<button[^>]*onclick=["\']toggleProvinceBudget\([^)]*["\']high["\'][^)]*\)["\'][^>]*>.*?</button>',
    ]
    
    modified = False
    for pattern in patterns_to_remove:
        matches = re.findall(pattern, html, re.DOTALL | re.IGNORECASE)
        if matches:
            print(f"❌ Trouvé {len(matches)} vieux bouton(s) avec pattern")
            html = re.sub(pattern, '<!-- Old budget button removed -->', html, flags=re.DOTALL | re.IGNORECASE)
            modified = True
    
    if not modified:
        print("✅ Aucun vieux bouton trouvé dans le HTML")
    else:
        # Sauvegarder le HTML nettoyé
        with open(HTML_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ HTML nettoyé et sauvegardé\n")
    
    # Vérifier aussi les sections de pages qui pourraient être problématiques
    print("\n📊 Diagnostic :")
    print("   • Les boutons budget seront créés par app.js automatiquement")
    print("   • Paramètres corrects : cityKey + level ('1', '2', ou '3')")
    print("   • Vérifiez la console du navigateur pour voir les logs\n")
    
    return True


if __name__ == "__main__":
    remove_old_budget_buttons()
