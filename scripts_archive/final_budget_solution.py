#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOLUTION FINALE : Injection des boutons budget via script séparé
=================================================================
Puisque l'injection dans initCityPages() ne fonctionne pas,
on va créer un script séparé qui s'exécute après le chargement du DOM.
"""

import os

SCRIPT_FILE = "js/budget-buttons-injector.js"
HTML_FILE = "index.html"
BACKUP_DIR = ".gemini/backups"

def create_injector_script():
    """Crée un script JavaScript autonome pour injecter les boutons"""
    
    js_code = '''/**
 * BUDGET BUTTONS INJECTOR
 * Injecte automatiquement les boutons de filtre budget sur les pages de villes
 */

(function() {
    'use strict';
    
    console.log('🔧 Budget Buttons Injector: Starting...');
    
    function injectBudgetButtons() {
        console.log('🔍 Searching for city pages...');
        
        // Chercher toutes les sections de pages qui pourraient avoir des filtres
        const pages = document.querySelectorAll('[id^="page-"]');
        console.log(`Found ${pages.length} page sections`);
        
        pages.forEach(page => {
            const pageId = page.id;
            const cityKey = pageId.replace('page-', '');
            
            // Skip non-city pages
            if (['carte', 'itineraires', 'spots', 'langue', 'outils', 'accueil'].includes(cityKey)) {
                return;
            }
            
            // Chercher div.nav-pills dans cette page
            const navPills = page.querySelector('.nav-pills');
            
            if (!navPills) {
                console.log(`⚠️ No .nav-pills found in ${pageId}`);
                return;
            }
            
            // Vérifier si déjà injecté
            if (page.querySelector('.budget-pills-container')) {
                console.log(`ℹ️ Budget buttons already exist in ${pageId}`);
                return;
            }
            
            console.log(`✅ Injecting budget buttons for: ${cityKey}`);
            
            // Créer le conteneur
            const container = document.createElement('div');
            container.className = 'budget-pills-container';
            container.style.cssText = 'margin-top: 16px; margin-bottom: 20px;';
            
            // Titre
            const title = document.createElement('div');
            title.className = 'filter-title';
            title.style.cssText = 'font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; text-align: center;';
            title.innerHTML = '<i class="fas fa-wallet"></i> Budget';
            container.appendChild(title);
            
            // Conteneur des pilules
            const pills = document.createElement('div');
            pills.className = 'nav-pills';
            pills.style.justifyContent = 'center';
            
            // Créer les 3 boutons
            const budgets = [
                { level: '1', label: '€', desc: '(- 25k)', icon: 'fa-coins' },
                { level: '2', label: '€€', desc: '(25k-80k)', icon: 'fa-money-bill-wave' },
                { level: '3', label: '€€€', desc: '(+ 80k)', icon: 'fa-gem' }
            ];
            
            budgets.forEach(b => {
                const btn = document.createElement('button');
                btn.className = 'budget-btn nav-pill';
                btn.setAttribute('data-level', b.level);
                btn.onclick = function() { 
                    if (typeof toggleProvinceBudget === 'function') {
                        toggleProvinceBudget(cityKey, b.level, this); 
                    } else {
                        console.error('toggleProvinceBudget function not found!');
                    }
                };
                btn.innerHTML = `<i class="fas ${b.icon}"></i> ${b.label} <span style="font-size: 0.75rem; opacity: 0.8;">${b.desc}</span>`;
                pills.appendChild(btn);
            });
            
            container.appendChild(pills);
            
            // Insérer après nav-pills
            navPills.parentNode.insertBefore(container, navPills.nextSibling);
            
            console.log(`✅ Budget buttons injected successfully for: ${cityKey}`);
        });
        
        console.log('✅ Budget Buttons Injector: Complete!');
    }
    
    // Exécuter quand le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBudgetButtons);
    } else {
        // DOM déjà chargé
        injectBudgetButtons();
    }
    
    // Également s'exécuter au changement de navigation (au cas où)
    setTimeout(injectBudgetButtons, 1000);
    setTimeout(injectBudgetButtons, 3000);
    
})();
'''
    
    return js_code


def inject_script_in_html():
    """Ajoute le script dans le HTML"""
    
    print("\n" + "="*60)
    print("SOLUTION FINALE : INJECTION VIA SCRIPT SÉPARÉ")
    print("="*60 + "\n")
    
    # 1. Créer le script JavaScript
    print("1️⃣ Création du script injector...")
    os.makedirs("js", exist_ok=True)
    
    with open(SCRIPT_FILE, 'w', encoding='utf-8') as f:
        f.write(create_injector_script())
    
    print(f"   ✅ Script créé : {SCRIPT_FILE}\n")
    
    # 2. Modifier le HTML pour inclure le script
    print("2️⃣ Modification du HTML...")
    
    if not os.path.exists(HTML_FILE):
        print(f"   ❌ Fichier non trouvé : {HTML_FILE}")
        return False
    
    os.makedirs(BACKUP_DIR, exist_ok=True)
    backup_path = os.path.join(BACKUP_DIR, "index.html.backup_final_fix")
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"   📦 Backup créé : {backup_path}")
    
    # Vérifier si le script n'est pas déjà inclus
    if 'budget-buttons-injector.js' in html:
        print("   ℹ️ Script déjà inclus dans le HTML\n")
    else:
        # Ajouter le script juste avant </body>
        script_tag = '\n    <script src="js/budget-buttons-injector.js"></script>\n'
        html = html.replace('</body>', script_tag + '</body>')
        
        with open(HTML_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("   ✅ Script ajouté au HTML\n")
    
    print("="*60)
    print("✅ SOLUTION DÉPLOYÉE !")
    print("="*60)
    print("\n📊 Ce qui a été fait :")
    print("   • Script autonome créé : js/budget-buttons-injector.js")
    print("   • Script chargé dans index.html")
    print("   • Les boutons seront créés automatiquement au chargement")
    
    print("\n💡 Test maintenant :")
    print("   1. Rechargez COMPLÈTEMENT le navigateur (Ctrl+Shift+R)")
    print("   2. Ouvrez la console (F12)")
    print("   3. Allez sur n'importe quelle ville")
    print("   4. Vous DEVRIEZ voir dans la console :")
    print("      🔧 Budget Buttons Injector: Starting...")
    print("      ✅ Injecting budget buttons for: [nom-ville]")
    print("   5. Les boutons € €€ €€€ devraient apparaître\n")
    
    return True


if __name__ == "__main__":
    success = inject_script_in_html()
    if not success:
        exit(1)
