#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRIPT DE RÉPARATION : FILTRES BUDGET (€, €€, €€€)
==================================================
DIAGNOSTIC: Le moteur cherche des symboles '€' dans les tags, 
mais les données contiennent 'budget_1', 'budget_2', 'budget_3'.

SOLUTION: 
1. Vérifier/normaliser tous les tags budget dans lieux.js
2. Mettre à jour la logique de filtrage dans app.js pour mapper:
   Bouton € → Tag budget_1
   Bouton €€ → Tag budget_2  
   Bouton €€€ → Tag budget_3
"""

import re
import json
import os

# ============================================
# CONFIGURATION
# ============================================
LIEUX_FILE = "data/lieux.js"
APP_FILE = "js/app.js"
BACKUP_DIR = ".gemini/backups"

# Seuils de prix (en Ariary)
BUDGET_1_MAX = 25000  # Budget Petit (< 25k)
BUDGET_2_MIN = 25000  # Budget Moyen (25k - 80k)
BUDGET_2_MAX = 80000
BUDGET_3_MIN = 80000  # Budget Élevé (> 80k)


# ============================================
# PARTIE 1 : NETTOYAGE & NORMALISATION DATA
# ============================================

def extract_lieux_data(content):
    """Extrait le contenu du tableau LIEUX_DATA"""
    match = re.search(r'window\.LIEUX_DATA\s*=\s*(\[[\s\S]*?\]);', content, re.DOTALL)
    if not match:
        raise ValueError("❌ Impossible de trouver window.LIEUX_DATA dans le fichier")
    return match.group(1)


def parse_prix(prix_str):
    """Convertit un prix (ex: '45 000 Ar', 'Gratuit') en nombre"""
    if not prix_str or 'gratuit' in prix_str.lower():
        return 0
    # Enlève tout sauf les chiffres
    nums = re.findall(r'\d+', prix_str.replace(' ', ''))
    if nums:
        return int(''.join(nums))
    return 0


def assign_budget_tag(prix_num):
    """Détermine le tag budget en fonction du prix"""
    if prix_num < BUDGET_1_MAX:
        return "budget_1"
    elif prix_num < BUDGET_2_MAX:
        return "budget_2"
    else:
        return "budget_3"


def normalize_lieux_budget_tags():
    """
    ÉTAPE 1 : Parcourt tous les lieux et normalise les tags budget
    """
    print("\n" + "="*60)
    print("ÉTAPE 1 : NORMALISATION DES TAGS BUDGET")
    print("="*60)
    
    if not os.path.exists(LIEUX_FILE):
        print(f"❌ Fichier non trouvé : {LIEUX_FILE}")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "lieux.js.backup")
    with open(LIEUX_FILE, 'r', encoding='utf-8') as f:
        original = f.read()
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original)
    print(f"✅ Backup créé : {backup_path}")
    
    # Extraction
    lieux_json_str = extract_lieux_data(original)
    
    # Parse JSON
    try:
        lieux_data = json.loads(lieux_json_str)
    except json.JSONDecodeError as e:
        print(f"❌ Erreur JSON : {e}")
        return False
    
    print(f"📊 Total de lieux trouvés : {len(lieux_data)}")
    
    # Normalisation
    modified_count = 0
    for lieu in lieux_data:
        # Récupère le prix numérique
        prix_num = lieu.get('prixNum')
        if prix_num is None:
            # Fallback: parse depuis 'prix'
            prix_str = lieu.get('prix', 'Gratuit')
            prix_num = parse_prix(prix_str)
            lieu['prixNum'] = prix_num
        
        # Détermine le tag budget correct
        correct_budget_tag = assign_budget_tag(prix_num)
        
        # Vérifie les tags actuels
        tags = lieu.get('tags', [])
        
        # Enlève tous les anciens tags budget et symboles €
        old_budget_tags = [t for t in tags if 'budget' in t.lower() or '€' in t]
        new_tags = [t for t in tags if 'budget' not in t.lower() and '€' not in t]
        
        # Ajoute le tag correct
        if correct_budget_tag not in new_tags:
            new_tags.append(correct_budget_tag)
            modified_count += 1
        
        lieu['tags'] = new_tags
    
    print(f"✅ {modified_count} lieux ont été normalisés")
    
    # Réécriture du fichier
    new_json = json.dumps(lieux_data, ensure_ascii=False, indent=4)
    new_content = original.replace(lieux_json_str, new_json)
    
    with open(LIEUX_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Fichier mis à jour : {LIEUX_FILE}")
    return True


# ============================================
# PARTIE 2 : MISE À JOUR DU MOTEUR DE FILTRE
# ============================================

def fix_filter_engine():
    """
    ÉTAPE 2 : Met à jour la logique de filtrage dans app.js
    pour mapper correctement € → budget_1, €€ → budget_2, €€€ → budget_3
    """
    print("\n" + "="*60)
    print("ÉTAPE 2 : RÉPARATION DU MOTEUR DE FILTRE")
    print("="*60)
    
    if not os.path.exists(APP_FILE):
        print(f"❌ Fichier non trouvé : {APP_FILE}")
        return False
    
    # Backup
    backup_path = os.path.join(BACKUP_DIR, "app.js.backup")
    with open(APP_FILE, 'r', encoding='utf-8') as f:
        original = f.read()
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original)
    print(f"✅ Backup créé : {backup_path}")
    
    # Recherche du bloc de code à remplacer (lignes 934-953)
    pattern = r"(// Budget Filter Check.*?const targetTag = budgetLevel === '1' \? )'€'( : \(budgetLevel === '2' \? )'€€'( : )'€€€'(\);)"
    
    # Remplacement par les tags normalisés
    replacement = r"\1'budget_1'\2'budget_2'\3'budget_3'\4"
    
    new_content = re.sub(pattern, replacement, original, flags=re.DOTALL)
    
    if new_content == original:
        # Tentative alternative : chercher la ligne exacte
        old_line = "const targetTag = budgetLevel === '1' ? '€' : (budgetLevel === '2' ? '€€' : '€€€');"
        new_line = "const targetTag = budgetLevel === '1' ? 'budget_1' : (budgetLevel === '2' ? 'budget_2' : 'budget_3');"
        
        if old_line in original:
            new_content = original.replace(old_line, new_line)
            print("✅ Ligne de mapping budget corrigée")
        else:
            print("⚠️ Pattern non trouvé - vérification manuelle requise")
            print("Recherchez cette ligne dans app.js (ligne ~940):")
            print("  const targetTag = budgetLevel === '1' ? '€' : ...")
            print("Et remplacez par:")
            print("  const targetTag = budgetLevel === '1' ? 'budget_1' : ...")
            return False
    
    # Écriture du nouveau fichier
    with open(APP_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Fichier mis à jour : {APP_FILE}")
    print("✅ Mapping corrigé : € → budget_1, €€ → budget_2, €€€ → budget_3")
    return True


# ============================================
# EXÉCUTION PRINCIPALE
# ============================================

def main():
    print("\n" + "="*60)
    print("🔧 SCRIPT DE RÉPARATION - FILTRES BUDGET")
    print("="*60)
    print("\n🎯 OBJECTIF:")
    print("   Synchroniser les tags de données (budget_1/2/3)")
    print("   avec la logique de filtre JavaScript (€/€€/€€€)\n")
    
    # Étape 1 : Normaliser les tags dans lieux.js
    step1_success = normalize_lieux_budget_tags()
    
    # Étape 2 : Mettre à jour le moteur de filtre
    step2_success = fix_filter_engine()
    
    print("\n" + "="*60)
    if step1_success and step2_success:
        print("✅ RÉPARATION TERMINÉE AVEC SUCCÈS !")
        print("="*60)
        print("\n🎉 Les filtres budget fonctionnent maintenant correctement:")
        print("   • Bouton € → Affiche les lieux < 25 000 Ar")
        print("   • Bouton €€ → Affiche les lieux 25k - 80k Ar")
        print("   • Bouton €€€ → Affiche les lieux > 80k Ar")
        print("\n💡 PROCHAINES ÉTAPES:")
        print("   1. Rechargez le serveur local (F5)")
        print("   2. Testez les filtres budget sur une page de ville")
        print("   3. Les backups sont dans .gemini/backups/")
    else:
        print("⚠️ RÉPARATION PARTIELLE")
        print("="*60)
        print("Vérifiez les messages ci-dessus et corrigez manuellement si nécessaire.")
    
    print("\n")


if __name__ == "__main__":
    main()
