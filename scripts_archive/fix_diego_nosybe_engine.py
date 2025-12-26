import re

file_path = r'c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\js\app.js'

# New Robust Engine Code (Consolidated)
engine_code = """
// ============================================
// 9. MOTEUR DE VUE PREMIUM (V7 FINAL)
// ============================================

// A. Création Carte Premium (Sécurisée)
window.createLieuCard = function (lieu, category = '') {
    if (!category) category = lieu.categorie || 'Explorer';
    
    // Détection Prix
    let prixAffich = lieu.prix || '';
    if (prixAffich === 'Gratuit' || prixAffich === '0') prixAffich = '<span style="color:#2ecc71">Gratuit</span>';
    
    // Badges & Favoris
    const isFav = (window.isFavorite && window.isFavorite(lieu.id));
    const activeClass = isFav ? 'active' : '';
    const icon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';
    
    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    const badgeText = isMustSee ? 'Incontournable' : lieu.type;

    // Tags
    const tagsHtml = (lieu.tags || []).slice(0, 3).map(t => 
        `<span style="background:rgba(0,0,0,0.04); padding:3px 8px; border-radius:4px; font-size:0.7rem; color:#666; border:1px solid #eee;">${t}</span>`
    ).join('');

    // Escapes
    const safeName = (lieu.nom || '').replace(/"/g, '&quot;');
    const safeVille = (lieu.ville || '').replace(/"/g, '&quot;');
    const safeImage = lieu.image || 'images/placeholders/default.jpg';

    return `
        <article class="lieu-card" onclick="showLieuDetailsByID(${lieu.id})"
                 style="position: relative; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(0,0,0,0.05); cursor: pointer; display: flex; flex-direction: column;">
            
            <div style="position: relative; height: 180px; overflow: hidden;">
                <img src="${safeImage}" alt="${safeName}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='images/placeholder.jpg'">
                
                <div style="position: absolute; top: 10px; left: 10px; ${badgeStyle} padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                    ${badgeText}
                </div>

                <div onclick="event.stopPropagation(); toggleLieuFavorite(${lieu.id}, this, event)" class="${activeClass}"
                     style="position: absolute; top: 10px; right: 10px; background: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); color: ${isFav ? '#e74c3c' : '#bdc3c7'}; font-size: 1rem;">
                     ${icon}
                </div>
            </div>
            
            <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 700; color: #2c3e50; line-height: 1.4;">${lieu.nom}</h3>
                
                <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
                    ${tagsHtml}
                </div>
                
                <p style="margin: 0 0 15px 0; font-size: 0.85rem; color: #7f8c8d; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${lieu.description}
                </p>
                
                <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; color: #e67e22; font-size: 0.95rem;">${prixAffich}</div>
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #f1c40f; font-weight: 700; background: #fffcf0; padding: 2px 6px; border-radius: 4px;">
                        <i class="fas fa-star"></i> ${lieu.note}
                    </div>
                </div>
            </div>
        </article>
    `;
};


// B. Moteur de Filtre Centralisé (Diego & Nosy Be & autres)
window.filterProvinceItems = function(filterType, city, btnElement) {
    console.log("🚀 ENGINE V7 : Filter=" + filterType + " | City=" + city);

    // 1. UI Buttons
    if (btnElement) {
        const parent = btnElement.parentElement;
        if(parent) {
            parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    // 2. Data Source
    const data = window.LIEUX_DATA || [];
    if (data.length === 0) console.warn("⚠️ LIEUX_DATA vide !");

    // 3. Normalisation Arg Villes (Pour matching data)
    // Diego-Suarez dans Data, Antsiranana dans Code/ID
    const targetCityLower = city.toLowerCase();
    
    // 4. Filtrage
    const filtered = data.filter(item => {
        const itemVille = (item.ville || "").toLowerCase();
        let cityMatch = false;

        // Logique stricte mais tolérante
        if (itemVille.includes(targetCityLower)) cityMatch = true;
        if (targetCityLower.includes(itemVille) && itemVille.length > 3) cityMatch = true;

        // Aliases explicites
        if (targetCityLower.includes('antsiranana') && itemVille.includes('diego')) cityMatch = true;
        if (targetCityLower.includes('diego') && itemVille.includes('antsiranana')) cityMatch = true;
        
        if (targetCityLower.includes('nosy') && itemVille.includes('nosy')) cityMatch = true;

        if (targetCityLower.includes('tulear') && itemVille.includes('toliara')) cityMatch = true;
        if (targetCityLower.includes('toliara') && itemVille.includes('tulear')) cityMatch = true;

        if (targetCityLower.includes('tamatave') && itemVille.includes('toamasina')) cityMatch = true;
        if (targetCityLower.includes('toamasina') && itemVille.includes('tamatave')) cityMatch = true;
        
        if (targetCityLower.includes('majunga') && itemVille.includes('mahajanga')) cityMatch = true;
        if (targetCityLower.includes('mahajanga') && itemVille.includes('majunga')) cityMatch = true;

        if (!cityMatch) return false;

        // Filtre Tag
        if (filterType === 'all') return true;
        
        // Mapping Tags
        let tagTarget = filterType;
        if (filterType === 'low') tagTarget = '€'; // budget_1 ? non data uses prices mostly or budget tags. Let's check logic.
        // Data has tags: "budget_1", "budget_2", "budget_3" OR "€", "€€" ?
        // Look at data: "budget_1"
        if (filterType === 'low' || filterType === '€') tagTarget = 'budget_1';
        if (filterType === 'mid' || filterType === '€€') tagTarget = 'budget_2';
        if (filterType === 'high' || filterType === '€€€') tagTarget = 'budget_3';

        // Tag matching
        if (!item.tags) return false;
        
        // Match exact or partial? Array includes.
        // Data tags are capitalized "Explorer", "Manger" etc.
        // UI sends 'explorer' (lowercase).
        // Let's lowercase everything for check
        const itemTagsLow = item.tags.map(t => t.toLowerCase());
        return itemTagsLow.includes(tagTarget.toLowerCase()) || 
               (item.type && item.type.toLowerCase() === tagTarget.toLowerCase());
    });

    console.log(`📊 ${filtered.length} résultats trouvés.`);

    // 5. Injection DOM
    // Identification Conteneur ID
    let container = null;
    
    // Essais successifs d'IDs
    const candidates = [
        'grid-' + city,
        'grid-' + city.replace(/ /g, ''),
        'grid-' + city.replace(/-/g, ''),
        'grid-' + city.split(' ')[0]
    ];
    
    // Aliases IDs
    if (targetCityLower.includes('diego') || targetCityLower.includes('antsiranana')) candidates.push('grid-Antsiranana');
    if (targetCityLower.includes('nosy')) candidates.push('grid-NosyBe');
    if (targetCityLower.includes('tana')) candidates.push('grid-Antananarivo');
    if (targetCityLower.includes('tamatave') || targetCityLower.includes('toamasina')) candidates.push('grid-Toamasina');
    if (targetCityLower.includes('majunga') || targetCityLower.includes('mahajanga')) candidates.push('grid-Mahajanga');
    if (targetCityLower.includes('tulear') || targetCityLower.includes('toliara')) candidates.push('grid-Toliara');

    for (let id of candidates) {
        const el = document.getElementById(id);
        if (el) { container = el; break; }
    }

    if (!container) {
        console.error("❌ CRITIQUE: Aucun conteneur trouvé pour " + city);
        return;
    }

    // Reset et Remplissage
    container.innerHTML = '';
    
    // Style de Grille Force
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    container.style.gap = '20px';

    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">Aucun lieu pour ce filtre.</div>';
        return;
    }

    filtered.forEach(item => {
        container.insertAdjacentHTML('beforeend', window.createLieuCard(item));
    });
};
"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strategy: Replace the previous `window.filterProvinceItems` and `window.createLieuCard` blocks.
    # Since there are multiple, duplicate definitions, we should try to identify the range of Lines 1466 (Start of patch) to the end of the file or similar.
    # Looking at the `view_file` output:
    # 1466: // --- PATCH FILTRES (TAGS) ---
    # ... down to ...
    # 1700+
    
    # We will simply append the NEW engine at the VERY END of the file, ensuring it overrides everything previous.
    # AND we will try to comment out the specific block around 1467-1570 to avoid confusion, though defining it later works in JS.
    
    # Actually, appending to end is safest to guarantee it "wins".
    
    new_content = content + "\n\n" + engine_code
    
    # Also fix the init call in navigateToPage to be CLEAN
    # Search for the block we injected earlier
    # if (targetId.toLowerCase().includes('antsiranana')...
    
    patch_trigger = """
        // ⚡ FORCE PREMIUM ENGINE TRIGGER (Mirroring Diego & Nosy Be)
        // Corrected to use explicit "Diego-Suarez" key for data matching
        if (targetId.toLowerCase().includes('antsiranana') || targetId.toLowerCase().includes('diego')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Diego-Suarez'); }, 100);
        }
        if (targetId.toLowerCase().includes('nosybe') || targetId.toLowerCase().includes('nosy-be')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Nosy Be'); }, 100);
        }
    """
    
    # We'll rely on our previous knowledge of where we inserted it.
    # Regex replace the block we inserted in step 866.
    
    old_trigger_pattern = r"(?s)// ⚡ FORCE PREMIUM ENGINE TRIGGER.*?\}\);"
    # This might match too much or little.
    
    # Let's just append the engine. The engine handles aliases so 'Antsiranana' call WILL work now because I added:
    # if (targetCityLower.includes('antsiranana') && itemVille.includes('diego')) cityMatch = true;
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("✅ Appended Robust V7 Engine to js/app.js")

except Exception as e:
    print(f"❌ Error: {e}")
