import os

APP_PATH = 'js/app.js'

def patch_display_engine():
    if not os.path.exists(APP_PATH):
        print("❌ app.js introuvable")
        return

    # Nouvelle logique ultra-robuste
    js_code = """
// --- MOTEUR D'AFFICHAGE UNIVERSEL (V4 - FIX DISPARITION) ---
window.filterProvinceItems = function(filterType, city, btnElement) {
    console.group("🚀 DEBUG FILTRE : " + filterType);
    
    // 1. GESTION DES BOUTONS (VISUEL)
    if (btnElement) {
        const parent = btnElement.parentElement;
        if (parent) {
            parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    // 2. RECHERCHE INTELLIGENTE DU CONTENEUR
    // On essaie toutes les variantes possibles de l'ID
    let container = document.getElementById('grid-' + city); // ex: grid-Nosy Be
    if (!container) container = document.getElementById('grid-' + city.replace(/ /g, '')); // grid-NosyBe
    if (!container) container = document.getElementById('grid-' + city.replace(/ /g, '-')); // grid-Nosy-Be
    if (!container) container = document.getElementById('grid-' + city.split(' ')[0]); // grid-Nosy
    
    // FALLBACK ULTIME : On cherche la grille active dans la section visible
    if (!container) {
        console.warn("⚠️ Recherche par ID échouée. Tentative par classe...");
        const visibleSection = document.querySelector('section.active') || document.querySelector('section:not([style*="display: none"])');
        if (visibleSection) {
            container = visibleSection.querySelector('.lieux-grid');
        }
    }

    if (!container) {
        console.error("❌ CRITIQUE : Impossible de trouver où afficher les résultats !");
        console.groupEnd();
        return; // On arrête tout pour ne pas casser la page
    }
    
    console.log("✅ Conteneur trouvé :", container.id || container.className);

    // 3. FILTRAGE DES DONNÉES
    const data = window.LIEUX_DATA || [];
    let targetTag = filterType;
    
    // Mapping robuste
    if (['manger', 'resto'].includes(filterType)) targetTag = 'Manger';
    else if (['dodo', 'dormir'].includes(filterType)) targetTag = 'Dormir';
    else if (['explorer', 'nature', 'plage'].includes(filterType)) targetTag = 'Explorer';
    else if (['sortir', 'bar'].includes(filterType)) targetTag = 'Sortir';
    else if (['spot', 'spots'].includes(filterType)) targetTag = 'Spots';
    else if (['low', '€'].includes(filterType)) targetTag = '€';
    else if (['mid', '€€'].includes(filterType)) targetTag = '€€';
    else if (['high', '€€€'].includes(filterType)) targetTag = '€€€';

    const filtered = data.filter(item => {
        // Filtre Ville (très permissif)
        const vItem = (item.ville || "").toLowerCase();
        const vPage = city.toLowerCase();
        let cityMatch = false;
        
        if (vItem.includes(vPage) || vPage.includes(vItem)) cityMatch = true;
        // Cas spéciaux
        if (vPage.includes('diego') && vItem.includes('antsiranana')) cityMatch = true;
        if (vPage.includes('tana') && vItem.includes('antananarivo')) cityMatch = true;
        if (vPage.includes('nosy') && vItem.includes('nosy')) cityMatch = true;
        
        if (!cityMatch) return false;

        // Filtre Tag
        if (filterType === 'all') return true;
        return (item.tags && item.tags.includes(targetTag));
    });

    console.log(`📊 ${filtered.length} résultats trouvés pour le tag "${targetTag}"`);

    // 4. GÉNÉRATION HTML
    container.innerHTML = ''; // On vide proprement
    
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;font-size:1.2rem;">Aucun lieu trouvé pour ce filtre 😕</div>';
    } else {
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'lieu-card';
            // Sécurisation du clic pour ouvrir la modale
            card.onclick = function() { 
                console.log("Clic sur", item.nom);
                if(window.openLieuModal) window.openLieuModal(item.id);
                else if(window.openModalSafe) window.openModalSafe(item);
                else console.error("Fonction Modal introuvable");
            };
            
            card.innerHTML = `
                <div class="card-image" style="background-image: url('${item.image || 'images/placeholders/default.jpg'}');">
                    <span class="badge-type">${item.type}</span>
                </div>
                <div class="card-content">
                    <h3>${item.nom}</h3>
                    <div class="card-meta">
                        <span>📍 ${item.ville}</span>
                        <span>⭐ ${item.note}</span>
                    </div>
                    <div class="card-price" style="margin-top:5px;font-weight:bold;color:#d35400">${item.prix || ''}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }
    console.groupEnd();
};
"""
    with open(APP_PATH, 'a', encoding='utf-8') as f:
        f.write("\n" + js_code)
    print("✅ MOTEUR D'AFFICHAGE RÉPARÉ : Recherche de conteneur ultra-permissive activée.")

patch_display_engine()
