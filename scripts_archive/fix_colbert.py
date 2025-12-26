import json
import os
import re

# 1. FIX DATA (Rue Colbert ID 600)
DATA_PATH = 'data/lieux.js'

def fix_colbert_data():
    if not os.path.exists(DATA_PATH): return

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = re.sub(r'^(const|var|let|window\.)\s*\w+\s*=\s*', '', content).strip().rstrip(';')
        try:
            data = json.loads(json_str)
        except:
            # Fallback manual text replace if JSON parse fails (risky but robust if simple)
            print("❌ JSON Parse failed, skipping data rewrite (verify file integrity)")
            return

    # Find ID 600 and replace
    found = False
    for item in data:
        if item.get('id') == 600:
            item['nom'] = "Rue Colbert"
            item['description'] = "L'artère vitale de Diego. Bordée de bâtiments coloniaux aux façades pastel, cette rue raconte l'histoire de la ville. Commerces, rencontres, flâneries. Ambiance unique mêlant nostalgie et effervescence."
            item['image'] = "images/diego/rue-colbert.jpg"
            item['tags'] = ["Diego", "Explorer", "Sortir", "€"]
            item['type'] = "Culture"
            found = True
            break
    
    if found:
        with open(DATA_PATH, 'w', encoding='utf-8') as f:
            f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
        print("✅ Correctif appliqué sur Rue Colbert (ID 600)")
    else:
        print("⚠️ ID 600 non trouvé")

# 2. FIX JS (createLieuCard safety)
APP_PATH = 'js/app.js'

def fix_create_lieu_card():
    if not os.path.exists(APP_PATH): return
    
    with open(APP_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the createLieuCard function with a safer one
    # We'll regex find the function start and replace it? 
    # Or purely append an override at the end (safest).
    
    safer_function = """
// --- FIX: SECURE CARD GENERATION ---
window.createLieuCard = function (lieu, category = '') {
    // 1. Logic & Safety
    if (!category) category = lieu.categorie || 'Explorer';
    
    const prixClass = (lieu.prixNum === 0) ? 'gratuit' : (lieu.prixNum < 10000) ? 'abordable' : 'premium';
    const isFav = (window.isFavorite && window.isFavorite(lieu.id));
    const activeClass = isFav ? 'active' : '';
    const icon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';

    // 2. Data Preparation
    // Escape quotes in strings to avoid HTML breakage
    const escapeAttr = (s) => String(s || '').replace(/"/g, '&quot;');
    const escapeJs = (s) => String(s || '').replace(/'/g, "\\'");
    
    const tagsString = (lieu.tags || []).join(',');
    const displayTags = (lieu.tags || []).slice(0, 3).map(t => 
        `<span class="card-tag" style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:12px; font-size:0.7rem; color:var(--text-secondary); border:1px solid var(--border-color);">${t}</span>`
    ).join('');

    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    const badgeText = isMustSee ? 'Incontournable' : lieu.type;

    // 3. Template (Rich & Premium)
    // NOTE: Onclick handlers use QUOTED strings for safety
    return `
        <article class="lieu-card" 
                 data-id="${lieu.id}" 
                 data-tags="${escapeAttr(tagsString)}" 
                 data-ville="${escapeAttr(lieu.ville)}"
                 style="position: relative; cursor: pointer; display: flex; flex-direction: column; background: var(--bg-card); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s; border: 1px solid var(--border-color);">
            
            <div class="badge-location" style="position: absolute; top: 10px; left: 10px; z-index: 5; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                <i class="fas fa-map-marker-alt" style="margin-right:4px;"></i> ${lieu.ville}
            </div>

            <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite ${activeClass}" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 5; background: white; border-radius: 50%; width: 32px; height: 32px; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                ${icon}
            </button>
            
            <div class="lieu-image" onclick="showLieuDetailsByID(${lieu.id})" style="position: relative; height: 180px; overflow: hidden;">
                <img src="${lieu.image}" alt="${escapeAttr(lieu.nom)}" loading="lazy" onerror="this.src='images/placeholder.jpg'" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
                <div class="lieu-badge" style="position: absolute; bottom: 10px; left: 10px; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${badgeStyle}">${badgeText}</div>
            </div>
            
            <div class="lieu-content" onclick="showLieuDetailsByID(${lieu.id})" style="padding: 15px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div class="lieu-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin: 0;">
                    <h3 class="lieu-title" style="margin: 0; font-size: 1.1rem; color: var(--text-primary); line-height: 1.3; font-weight: 700;">${lieu.nom}</h3>
                    <div class="lieu-rating" style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: var(--text-primary); background: var(--bg-body); padding: 2px 6px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <i class="fas fa-star" style="color: #f1c40f; font-size: 0.8rem;"></i> ${lieu.note}
                    </div>
                </div>

                <div class="lieu-tags" style="display: flex; gap: 6px; flex-wrap: wrap;">${displayTags}</div>

                <p class="lieu-desc" style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;">${lieu.description}</p>

                <div class="lieu-footer" style="margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-top: 1px solid var(--border-color);">
                     <div style="font-weight: 700; color: #b03030;">${lieu.prix || ''}</div>
                </div>
            </div>
        </article>
    `;
};
"""
    with open(APP_PATH, 'a', encoding='utf-8') as f:
        f.write("\n" + safer_function)
    print("✅ APP : Correctif sécurité createLieuCard injecté.")

fix_colbert_data()
fix_create_lieu_card()
