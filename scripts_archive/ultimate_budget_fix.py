#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ULTIMATE FIX : INJECTION DES BOUTONS BUDGET DANS LES PAGES DE VILLES
======================================================================
PROBLÈME : Les boutons budget n'existent PAS sur les pages de villes générées dynamiquement.
SOLUTION : Modifier le JavaScript pour qu'il crée automatiquement ces boutons lors de
           l'initialisation des pages de villes.
"""

import re
import os
import json

# Configuration
APP_JS_FILE = "js/app.js"
BACKUP_DIR = ".gemini/backups"

# Villes concernées
CITIES = ['antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa', 'antananarivo']


def create_budget_buttons_injection_code():
    """
    Génère le code JavaScript qui crée les boutons budget
    """
    
    js_code = '''
    // ============================================
    // INJECTION AUTOMATIQUE DES BOUTONS BUDGET
    // ============================================
    function injectBudgetButtons(containerSelector, cityKey) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.warn(`Container not found: ${containerSelector}`);
            return;
        }
        
        // Vérifier si les boutons existent déjà
        if (container.querySelector('.budget-pills-container')) {
            return; // Déjà injectés
        }
        
        // Chercher la div des filtres de catégories (.nav-pills)
        const navPills = container.querySelector('.nav-pills');
        if (!navPills) {
            console.warn(`Nav pills not found in ${containerSelector}`);
            return;
        }
        
        // Créer le conteneur des boutons budget
        const budgetContainer = document.createElement('div');
        budgetContainer.className = 'budget-pills-container';
        budgetContainer.style.marginTop = '16px';
        budgetContainer.style.marginBottom = '20px';
        
        // Titre
        const title = document.createElement('div');
        title.className = 'filter-title';
        title.style.fontSize = '0.85rem';
        title.style.fontWeight = '600';
        title.style.color = 'var(--text-secondary)';
        title.style.marginBottom = '10px';
        title.style.textAlign = 'center';
        title.innerHTML = '<i class="fas fa-wallet"></i> Budget';
        budgetContainer.appendChild(title);
        
        // Conteneur des boutons
        const pillsDiv = document.createElement('div');
        pillsDiv.className = 'nav-pills';
        pillsDiv.style.justifyContent = 'center';
        
        // Créer les 3 boutons
        const budgets = [
            { level: '1', label: '€', desc: '(- 25k Ar)', icon: 'fa-coins' },
            { level: '2', label: '€€', desc: '(25k-80k)', icon: 'fa-money-bill-wave' },
            { level: '3', label: '€€€', desc: '(+ 80k Ar)', icon: 'fa-gem' }
        ];
        
        budgets.forEach(budget => {
            const btn = document.createElement('button');
            btn.className = 'budget-btn nav-pill';
            btn.setAttribute('data-level', budget.level);
            btn.onclick = function() { toggleProvinceBudget(cityKey, budget.level, this); };
            btn.innerHTML = `
                <i class="fas ${budget.icon}"></i> ${budget.label} 
                <span style="font-size: 0.75rem; opacity: 0.8;">${budget.desc}</span>
            `;
            pillsDiv.appendChild(btn);
        });
        
        budgetContainer.appendChild(pillsDiv);
        
        // Insérer après les filtres de catégories
        navPills.parentNode.insertBefore(budgetContainer, navPills.nextSibling);
        
        console.log(`✅ Boutons budget injectés pour ${cityKey}`);
    }
'''
    return js_code


def find_init_city_pages_function(js_content):
    """
    Trouve la fonction initCityPages() dans le JavaScript
    """
    # Chercher window.initCityPages = function
    pattern = r'(window\.initCityPages\s*=\s*function\s*\([^)]*\)\s*\{)'
    match = re.search(pattern, js_content)
    
    if match:
        return match.start(1), match.end(1)
    
    return None, None


def inject_budget_button_calls(js_content):
    """
    Injecte les appels à injectBudgetButtons() dans initCityPages()
    """
    
    # D'abord, injecter la fonction helper avant initCityPages
    start_pos, end_pos = find_init_city_pages_function(js_content)
    
    if start_pos is None:
        print("❌ Fonction initCityPages() non trouvée")
        return js_content, False
    
    # Injecter la fonction helper juste avant initCityPages
    helper_code = create_budget_buttons_injection_code()
    js_content = js_content[:start_pos] + helper_code + "\n" + js_content[start_pos:]
    
    # Maintenant, injecter les appels dans initCityPages
    # On va chercher la fin de initCityPages et injecter juste avant
    
    # Pattern pour trouver la fin de la fonction initCityPages
    # On cherche la ligne avec updatePremiumInfo et on injecte après
    pattern = r'(updatePremiumInfo\([^)]+\);)'
    
    # Trouver toutes les occurrences après initCityPages
    offset = start_pos + len(helper_code)
    remaining = js_content[offset:]
    
    injections = []
    for city in CITIES:
        city_name = city.capitalize()
        # Chercher updatePremiumInfo pour cette ville
        city_pattern = rf'(updatePremiumInfo\([^,]+,\s*["\']' + city + r'["\'].*?\);)'
        match = re.search(city_pattern, remaining)
        
        if match:
            # Injecter après cette ligne
            inject_code = f"\n        // Inject budget buttons for {city_name}\n        setTimeout(() => injectBudgetButtons('#page-{city}', '{city}'), 100);"
            pos = offset + match.end()
            injections.append((pos, inject_code))
    
    # Injecter dans l'ordre inverse pour ne pas décaler les positions
    injections.sort(reverse=True)
    for pos, code in injections:
        js_content = js_content[:pos] + code + js_content[pos:]
    
    return js_content, len(injections) > 0


def main():
    print("\n" + "="*60)
    print("🔧 ULTIMATE FIX : INJECTION BOUTONS BUDGET")
    print("="*60 + "\n")
    
    if not os.path.exists(APP_JS_FILE):
        print(f"❌ Fichier non trouvé : {APP_JS_FILE}")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "app.js.backup_final")
    
    with open(APP_JS_FILE, 'r', encoding='utf-8') as f:
        original_js = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_js)
    
    print(f"📦 Backup créé : {backup_path}\n")
    
    # Modifier le JavaScript
    print("🔧 Modification du JavaScript...")
    modified_js, success = inject_budget_button_calls(original_js)
    
    if not success:
        print("❌ Échec de l'injection")
        return False
    
    # Écrire le fichier modifié
    with open(APP_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(modified_js)
    
    print("✅ JavaScript modifié avec succès !\n")
    
    print("="*60)
    print("✅ RÉPARATION TERMINÉE !")
    print("="*60)
    print("\n📊 Modifications apportées :")
    print("   • Fonction helper injectBudgetButtons() ajoutée")
    print("   • Appels automatiques lors de l'init des pages de villes")
    print("   • Boutons budget créés dynamiquement pour chaque ville")
    
    print("\n💡 Prochaines étapes :")
    print("   1. Rechargez le navigateur (F5 ou Ctrl+Shift+R)")
    print("   2. Naviguez vers une page de ville (ex: Antsiranana)")
    print("   3. Vous devriez voir les boutons € €€ €€€")
    print("   4. Testez le filtrage en cliquant sur les boutons\n")
    
    return True


if __name__ == "__main__":
    success = main()
    if not success:
        exit(1)
