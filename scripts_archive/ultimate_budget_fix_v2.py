#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ULTIMATE FIX V2 : INJECTION DIRECTE DES BOUTONS BUDGET
=======================================================
Approche simple : Ajouter le code d'injection directement dans initCityPages()
"""

import re
import os

# Configuration
APP_JS_FILE = "js/app.js"
BACKUP_DIR = ".gemini/backups"


def create_injection_code():
    """Code JavaScript à injecter dans initCityPages"""
    return '''
    // ✨ AUTO-INJECT BUDGET BUTTONS (Added by ultimate_budget_fix_v2.py)
    document.querySelectorAll('.province-section, .page-section').forEach(section => {
        if (!section.id.startsWith('page-')) return;
        
        const cityKey = section.id.replace('page-', '');
        const navPills = section.querySelector('.nav-pills');
        
        if (!navPills || section.querySelector('.budget-pills-container')) return;
        
        // Create budget buttons container
        const budgetContainer = document.createElement('div');
        budgetContainer.className = 'budget-pills-container';
        budgetContainer.style.cssText = 'margin-top: 16px; margin-bottom: 20px;';
        
        // Title
        const title = document.createElement('div');
        title.className = 'filter-title';
        title.style.cssText = 'font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; text-align: center;';
        title.innerHTML = '<i class="fas fa-wallet"></i> Budget';
        budgetContainer.appendChild(title);
        
        // Pills container
        const pills = document.createElement('div');
        pills.className = 'nav-pills';
        pills.style.justifyContent = 'center';
        
        // Create 3 buttons
        const budgets = [
            { level: '1', label: '€', desc: '(- 25k)', icon: 'fa-coins' },
            { level: '2', label: '€€', desc: '(25k-80k)', icon: 'fa-money-bill-wave' },
            { level: '3', label: '€€€', desc: '(+ 80k)', icon: 'fa-gem' }
        ];
        
        budgets.forEach(b => {
            const btn = document.createElement('button');
            btn.className = 'budget-btn nav-pill';
            btn.setAttribute('data-level', b.level);
            btn.onclick = function() { toggleProvinceBudget(cityKey, b.level, this); };
            btn.innerHTML = `<i class="fas ${b.icon}"></i> ${b.label} <span style="font-size: 0.75rem; opacity: 0.8;">${b.desc}</span>`;
            pills.appendChild(btn);
        });
        
        budgetContainer.appendChild(pills);
        navPills.parentNode.insertBefore(budgetContainer, navPills.nextSibling);
        
        console.log(`✅ Budget buttons injected for: ${cityKey}`);
    });
'''


def inject_into_init_city_pages():
    """Injecte le code dans la fonction initCityPages"""
    
    print("\n" + "="*60)
    print("🔧 ULTIMATE FIX V2 : INJECTION BOUTONS BUDGET")
    print("="*60 + "\n")
    
    if not os.path.exists(APP_JS_FILE):
        print(f"❌ Fichier non trouvé : {APP_JS_FILE}")
        return False
    
    # Backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "app.js.backup_v2")
    
    with open(APP_JS_FILE, 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"📦 Backup créé : {backup_path}\n")
    
    # Vérifier si déjà injecté
    if 'AUTO-INJECT BUDGET BUTTONS' in js_content:
        print("⚠️ Code déjà injecté précédemment. Nettoyage...")
        # Supprimer l'ancien code
        pattern = r'// ✨ AUTO-INJECT BUDGET BUTTONS.*?\}\);'
        js_content = re.sub(pattern, '', js_content, flags=re.DOTALL)
    
    # Trouver la fin de initCityPages (juste avant le }; final)
    # On cherche window.initCityPages = function () { ... };
    pattern = r'(window\.initCityPages\s*=\s*function\s*\([^)]*\)\s*\{(?:(?!\n\};).)*)'
    
    match = re.search(pattern, js_content, re.DOTALL)
    
    if not match:
        print("❌ Fonction initCityPages non trouvée")
        return False
    
    # Trouver le dernier }); de la fonction
    # On cherche après updatePremiumInfo
    search_start = match.start()
    search_text = js_content[search_start:]
    
    # Chercher la ligne updatePremiumInfo(getCityNameFromKey(cityKey), cityKey);
    update_pattern = r'(updatePremiumInfo\([^;]+\);)'
    update_match = re.search(update_pattern, search_text)
    
    if not update_match:
        print("❌ updatePremiumInfo non trouvé")
        return False
    
    # Injecter après cette ligne, avant le });
    injection_pos = search_start + update_match.end()
    
    # Trouver le prochain }); qui ferme la boucle forEach
    next_section = js_content[injection_pos:injection_pos+200]
    closing = next_section.find('});')
    
    if closing == -1:
        print("❌ Fermture de forEach non trouvée")
        return False
    
    # Position finale d'injection (juste avant le });)
    final_pos = injection_pos + closing
    
    # Injecter le code
    injection_code = "\n" + create_injection_code()
    modified_js = js_content[:final_pos] + injection_code + "\n    " + js_content[final_pos:]
    
    # Écrire le fichier
    with open(APP_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(modified_js)
    
    print("✅ Code injecté avec succès !\n")
    print("="*60)
    print("✅ RÉPARATION TERMINÉE !")
    print("="*60)
    print("\n📊 Modifications :")
    print("   • Code d'injection ajouté dans initCityPages()")
    print("   • Les boutons budget seront créés automatiquement")
    print("   • Pour toutes les pages de villes (6 provinces)")
    
    print("\n💡 Test :")
    print("   1. Rechargez le navigateur (Ctrl+Shift+R)")
    print("   2. Ouvrez la console (F12)")
    print("   3. Allez sur une page de ville")
    print("   4. Vous devriez voir: '✅ Budget buttons injected for: ...'")
    print("   5. Les boutons € €€ €€€ apparaissent sous les filtres\n")
    
    return True


if __name__ == "__main__":
    success = inject_into_init_city_pages()
    if not success:
        exit(1)
