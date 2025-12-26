import json
import os
import re

# --- CONFIGURATION ---
DATA_PATH = 'data/lieux.js'
APP_PATH = 'js/app.js'

# 1. NETTOYAGE DES DONNÉES (MODE SAFE TAGS)
def clean_data():
    if not os.path.exists(DATA_PATH): return print("❌ Data introuvable")
    
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = re.sub(r'^(const|var|let|window\.)\s*\w+\s*=\s*', '', content).strip().rstrip(';')
        try:
            data = json.loads(json_str)
        except:
            return print("❌ JSON Corrompu")

    count = 0
    for item in data:
        # Suppression des vieux tags prix, et nettoyage préventif
        # On garde les tags qui NE SONT PAS des indicateurs de prix ou de catégorie simplifiés qu'on va recréer
        old_tags_to_remove = ['€', '€€', '€€€', 'low', 'mid', 'high', 'budget_1', 'budget_2', 'budget_3']
        item['tags'] = [t for t in item.get('tags', []) if t not in old_tags_to_remove]
        
        # Analyse du prix pour réattribution stricte
        raw_price = str(item.get('prix', '')).lower().replace(' ', '').replace('ar', '')
        # Extraction brute des chiffres
        digits = re.sub(r'\D', '', raw_price)
        val = int(digits) if digits else 0
        
        # Attribution Tag Sûr (Backend Logic)
        new_tag = 'budget_1'
        if val > 80000: new_tag = 'budget_3'      # Luxe (> 80k)
        elif val > 25000: new_tag = 'budget_2'    # Moyen (25k - 80k)
        else: new_tag = 'budget_1'                # Pas cher (< 25k ou Gratuit)
        
        item['tags'].append(new_tag)
        count += 1

    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    print(f"✅ DATA : {count} fiches normalisées (budget_1/2/3).")

# 2. MOTEUR D'AFFICHAGE (MODE DESIGN FORCÉ)
def rewrite_display_engine():
    if not os.path.exists(APP_PATH): return print("❌ App.js introuvable")
    
    js_code = """
// --- MOTEUR RENDU V7 (DESIGN PREMIUM + LOGIQUE ROBUSTE) ---
window.filterProvinceItems = function(filterType, city, btnElement) {
    console.log("⚙️ ENGINE : Filtre =", filterType, "/ Ville =", city);

    // 1. UI BOUTONS
    if (btnElement) {
        const parent = btnElement.parentElement;
        if (parent) {
            parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    // 2. CIBLAGE CONTENEUR (Algorithme "Best Match")
    // On nettoie le nom de la ville pour trouver l'ID (ex: "Nosy Be" -> "grid-NosyBe")
    let safeCity = city.replace(/ /g, '').replace(/-/g, '');
    let container = document.getElementById('grid-' + city) || 
                    document.getElementById('grid-' + safeCity) ||
                    document.getElementById('grid-' + city.split(' ')[0]);

    // Fallback : Prendre la première grille visible
    if (!container) {
        const section = document.querySelector('section:not([style*="display: none"]) .lieux-grid');
        if (section) container = section;
    }

    if (!container) return console.error("❌ CRITIQUE : Aucune grille trouvée pour l'injection.");

    // RESET GRILLE (Force le CSS Grid)
    container.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; padding: 20px 0;";
    container.innerHTML = '';

    // 3. LOGIQUE DE FILTRAGE
    const data = window.LIEUX_DATA || [];
    let targetTag = filterType;

    // Traduction UI -> Data
    const map = {
        'manger': 'Manger', 'resto': 'Manger',
        'dodo': 'Dormir', 'dormir': 'Dormir',
        'explorer': 'Explorer', 'nature': 'Explorer',
        'sortir': 'Sortir', 'bar': 'Sortir',
        'spot': 'Spots', 'spots': 'Spots',
        // Prix (Mapping vers les codes sûrs)
        'low': 'budget_1', '€': 'budget_1',
        'mid': 'budget_2', '€€': 'budget_2',
        'high': 'budget_3', '€€€': 'budget_3'
    };
    if (map[filterType]) targetTag = map[filterType];

    const filtered = data.filter(item => {
        // Match Ville (Approximatif)
        const vItem = (item.ville || "").toLowerCase();
        const vPage = city.toLowerCase();
        let cityMatch = vItem.includes(vPage) || vPage.includes(vItem);
        
        // Exceptions manuelles
        if (vPage.includes('diego') && vItem.includes('antsiranana')) cityMatch = true;
        if (vPage.includes('tana') && vItem.includes('antananarivo')) cityMatch = true;
        if (vPage.includes('nosy') && vItem.includes('nosy')) cityMatch = true;

        if (!cityMatch) return false;
        if (filterType === 'all') return true;
        return (item.tags && item.tags.includes(targetTag));
    });

    console.log(`📊 ${filtered.length} résultats.`);

    // 4. RENDU VISUEL (CSS INJECTÉ POUR STABILITÉ)
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:#666;font-size:1.2rem;">Aucun résultat pour cette sélection 😕</div>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lieu-card';
        // CSS CARTE : Ombre, Arrondi, Transition
        card.style.cssText = "background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: transform 0.3s ease; cursor: pointer; border: 1px solid rgba(0,0,0,0.05);";
        
        // Image
        const img = item.image || 'images/placeholders/default.jpg';
        
        // Badge Prix Visuel
        let priceIcon = '€';
        if (item.tags.includes('budget_2')) priceIcon = '€€';
        if (item.tags.includes('budget_3')) priceIcon = '€€€';

        card.innerHTML = `
            <div style="height: 220px; width: 100%; position: relative; overflow: hidden;">
                <div style="width:100%; height:100%; background-image: url('${img}'); background-size: cover; background-position: center; transition: transform 0.5s;"></div>
                <span style="position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.95); padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 800; color: #333; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    ${item.type}
                </span>
            </div>
            
            <div style="padding: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; font-weight: 700; color: #2c3e50; line-height: 1.4;">${item.nom}</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 0.9rem; color: #7f8c8d;">
                    <span><i class="fas fa-map-marker-alt" style="color:#e74c3c; margin-right:5px;"></i> ${item.ville}</span>
                    <span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 6px; font-weight: bold;">⭐ ${item.note}</span>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: #27ae60; font-size: 1.1rem;">${item.prix || ''}</span>
                    <span style="font-size: 0.9rem; color: #bdc3c7; font-weight:600; border: 1px solid #eee; padding: 4px 8px; border-radius: 4px;">${priceIcon}</span>
                </div>
            </div>
        `;

        // Interaction Hover
        card.onmouseenter = function() { 
            this.style.transform = 'translateY(-8px)';
            this.querySelector('div[style*="background-image"]').style.transform = 'scale(1.05)';
        };
        card.onmouseleave = function() { 
            this.style.transform = 'translateY(0)';
            this.querySelector('div[style*="background-image"]').style.transform = 'scale(1)';
        };

        // Click Modal
        card.onclick = () => { 
            if(window.openLieuModal) window.openLieuModal(item.id);
        };

        container.appendChild(card);
    });
};
"""
    with open(APP_PATH, 'a', encoding='utf-8') as f:
        f.write("\n" + js_code)
    print("✅ APP : Moteur Rendu V7 (Premium + CSS Inline) injecté.")

if __name__ == "__main__":
    clean_data()
    rewrite_display_engine()
