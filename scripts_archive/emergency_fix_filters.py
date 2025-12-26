import json
import os
import re

# =======================================================
# 1. MISE À JOUR DES DONNÉES (GARANTIE DES TAGS)
# =======================================================
DATA_PATH = 'data/lieux.js'

def update_data_tags():
    if not os.path.exists(DATA_PATH): 
        print(f"❌ '{DATA_PATH}' not found.")
        return
    
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # Nettoyage pour lecture
        # Remove comments if any (simple)
        # content = re.sub(r'//.*', '', content)
        json_str = re.sub(r'^(const|var|let|window\.)\s*\w+\s*=\s*', '', content).strip().rstrip(';')
        try:
            data = json.loads(json_str)
        except Exception as e:
            print(f"❌ Erreur lecture JSON data: {e}")
            # Try to find array start/end if regex failed
            try:
                start = content.find('[')
                end = content.rfind(']') + 1
                if start != -1 and end != -1:
                    data = json.loads(content[start:end])
                else:
                    return
            except:
                return

    count = 0
    for item in data:
        # On initialise les tags
        tags = set(item.get('tags', []))
        
        # Analyse du contenu
        txt = (str(item.get('nom', '')) + " " + str(item.get('type', '')) + " " + str(item.get('description', ''))).lower()
        ville = (item.get('ville') or "").lower()
        
        # --- MAPPING STRICT (Boutons UI -> Tags Data) ---
        
        # 1. VILLES
        if 'nosy be' in ville or 'nosy-be' in ville: tags.add('Nosy Be')
        elif 'antananarivo' in ville or 'tana' in ville: tags.add('Tana')
        elif 'antsiranana' in ville or 'diego' in ville: tags.add('Diego')
        elif 'mahajanga' in ville or 'majunga' in ville: tags.add('Majunga')
        elif 'toamasina' in ville or 'tamatave' in ville: tags.add('Tamatave')
        elif 'toliara' in ville or 'tuléar' in ville or 'tulear' in ville: tags.add('Tuléar')
        elif 'fianarantsoa' in ville or 'fianar' in ville: tags.add('Fianar')

        # 2. CATÉGORIES
        if any(x in txt for x in ['resto', 'manger', 'dîner', 'déjeuner', 'pizza', 'cuisine']): tags.add('Manger')
        if any(x in txt for x in ['hotel', 'hôtel', 'lodge', 'dormir', 'hébergement', 'bungalow']): tags.add('Dormir')
        if any(x in txt for x in ['bar', 'club', 'sortir', 'ambiance', 'nuit', 'cabaret', 'karaoke']): tags.add('Sortir')
        if any(x in txt for x in ['plage', 'parc', 'nature', 'rando', 'visite', 'culture', 'monument', 'musée', 'baobab']): tags.add('Explorer')
        if item.get('spotLocal') is True or 'spot' in txt: tags.add('Spots')

        # 3. BUDGET
        try:
            p = str(item.get('prix', ''))
            if 'Gratuit' in p or not p or p == '0': tags.add('€')
            else:
                # Extract clean number
                val_str = re.sub(r'[^\d]', '', p)
                if val_str:
                    val = int(val_str)
                    if val <= 25000: tags.add('€')
                    elif val <= 100000: tags.add('€€')
                    else: tags.add('€€€')
                else:
                    tags.add('€')
        except: tags.add('€')

        item['tags'] = list(tags)
        count += 1

    # Écriture avec window.LIEUX_DATA (CRUCIAL)
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    print(f"✅ DATA : {count} fiches mises à jour avec les tags des filtres.")

# =======================================================
# 2. PATCH DU MOTEUR DE FILTRE (js/app.js)
# =======================================================
APP_PATH = 'js/app.js'

def patch_app_js():
    if not os.path.exists(APP_PATH):
        print("❌ app.js introuvable")
        return

    # Nouvelle fonction de filtrage qui utilise les TAGS
    new_filter_logic = """
// --- PATCH FILTRES (TAGS) ---
window.filterProvinceItems = function(filterType, city, btnElement) {
    console.log("🔍 Filtre activé :", filterType, "pour", city);

    // 1. Gestion Visuelle des Boutons
    if (btnElement) {
        const parent = btnElement.parentElement;
        parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
        btnElement.classList.add('active');
    }

    // 2. Récupération des données
    const data = window.LIEUX_DATA || [];
    // Clean city name for Grid ID
    const cityKey = city.replace(' ', '').replace('-', ''); 
    // Logic to match grid IDs: grid-NosyBe, grid-Mahajanga, grid-Antsiranana
    // Note: The HTML might use 'grid-Antsiranana' even for 'Diego-Suarez' page logic if mapped.
    // Let's rely on finding any container that matches
    
    let container = document.getElementById('grid-' + city);
    if (!container) container = document.getElementById('grid-' + city.replace(' ', ''));
    if (!container) container = document.getElementById('grid-' + city.replace('-', ''));
    
    // Fallback for known mappings
    if (!container) {
         if (city.includes('Diego')) container = document.getElementById('grid-Antsiranana');
         if (city.includes('Tamatave')) container = document.getElementById('grid-Toamasina');
         if (city.includes('Majunga')) container = document.getElementById('grid-Mahajanga');
         if (city.includes('Tana')) container = document.getElementById('grid-Antananarivo');
         if (city.includes('Tuléar')) container = document.getElementById('grid-Toliara');
         if (city.includes('Fianar')) container = document.getElementById('grid-Fianarantsoa');
    }

    if (!container) {
        console.warn("❌ Container introuvable pour : " + city);
        return;
    }
    
    const targetContainer = container;

    // 3. Filtrage Intelligent via TAGS
    const filtered = data.filter(item => {
        // Filtre Ville (Doit correspondre à la page)
        const itemVille = (item.ville || "").toLowerCase();
        const pageVille = city.toLowerCase();
        
        let cityMatch = false;
        // Robust matching
        if (pageVille.includes('nosy') && itemVille.includes('nosy')) cityMatch = true;
        else if ((pageVille.includes('diego') || pageVille.includes('antsiranana')) && (itemVille.includes('diego') || itemVille.includes('antsiranana'))) cityMatch = true;
        else if ((pageVille.includes('majunga') || pageVille.includes('mahajanga')) && (itemVille.includes('majunga') || itemVille.includes('mahajanga'))) cityMatch = true;
        else if ((pageVille.includes('tana') || pageVille.includes('antananarivo')) && (itemVille.includes('antananarivo') || itemVille.includes('tana'))) cityMatch = true;
        else if ((pageVille.includes('tamatave') || pageVille.includes('toamasina')) && (itemVille.includes('toamasina') || itemVille.includes('tamatave'))) cityMatch = true;
        else if ((pageVille.includes('fianar') || pageVille.includes('fianarantsoa')) && (itemVille.includes('fianarantsoa') || itemVille.includes('fianar'))) cityMatch = true;
        else if ((pageVille.includes('tuléar') || pageVille.includes('toliara')) && (itemVille.includes('toliara') || itemVille.includes('tuléar'))) cityMatch = true;
        
        // Final fallback
        if (!cityMatch && itemVille.includes(pageVille)) cityMatch = true;

        if (!cityMatch) return false;

        // Filtre Catégorie/Budget
        if (filterType === 'all') return true;
        
        // Mapping Bouton -> Tag
        let tagRecherche = filterType;
        if (filterType === 'explorer') tagRecherche = 'Explorer';
        if (filterType === 'manger') tagRecherche = 'Manger';
        if (filterType === 'dodo') tagRecherche = 'Dormir';
        if (filterType === 'sortir') tagRecherche = 'Sortir';
        if (filterType === 'spot') tagRecherche = 'Spots';
        if (filterType === 'low') tagRecherche = '€';
        if (filterType === 'mid') tagRecherche = '€€';
        if (filterType === 'high') tagRecherche = '€€€';

        // Vérification
        return (item.tags && item.tags.includes(tagRecherche));
    });

    console.log("Items trouvés :", filtered.length);

    // 4. Affichage
    targetContainer.innerHTML = ''; // Clear previous
    
    if (filtered.length === 0) {
        targetContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;">Aucun lieu trouvé pour ce filtre 🤷‍♂️</div>';
        return;
    }

    filtered.forEach(item => {
        // Use existing createLieuCard if available to keep style consistent, else fallback
        let cardHTML = '';
        if (window.createLieuCard) {
             cardHTML = window.createLieuCard(item);
             // createLieuCard returns string, we need to append
             targetContainer.insertAdjacentHTML('beforeend', cardHTML);
        } else {
            // Fallback
            const card = document.createElement('div');
            card.className = 'lieu-card';
            card.innerHTML = `<h3>${item.nom}</h3><p>${item.type}</p>`;
            targetContainer.appendChild(card);
        }
    });
};
"""

    # On ajoute la fonction à la fin du fichier app.js
    with open(APP_PATH, 'a', encoding='utf-8') as f:
        f.write("\n" + new_filter_logic)
    
    print("✅ APP : Logique de filtrage injectée dans js/app.js")

# EXECUTION
update_data_tags()
patch_app_js()
