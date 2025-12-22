
import json
import os
import re

# ==========================================
# 1. REPARATION DES DONNÉES (Tags & Nettoyage)
# ==========================================
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
DATA_PATH = os.path.join(BASE_DIR, 'data', 'lieux.js')

def repair_data():
    if not os.path.exists(DATA_PATH):
        print(f"❌ File not found: {DATA_PATH}")
        return
    
    print(f"reading {DATA_PATH}")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # Handle the JS variable assignment to get raw JSON
        # Find start of array
        start = content.find('[')
        end = content.rfind(']')
        if start == -1 or end == -1:
             print("❌ JSON array not found")
             return
        json_str = content[start:end+1]
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON data: {e}")
            return

    count = 0
    for item in data:
        # A. NETTOYAGE TEXTE (Anti-Crash)
        for key in ['nom', 'description', 'image', 'type', 'ville', 'prix']:
            if isinstance(item.get(key), str):
                # On enlève les retours à la ligne et on échappe les quotes pour le JS
                # But here we are processing for JSON dump later, so standard cleanup is enough.
                # The user script replaces \n with space and strip.
                item[key] = item[key].replace('\n', ' ').replace('\r', '').strip()

        # B. GÉNÉRATION FORCÉE DES TAGS
        tags = set()
        
        # Ville
        ville = (item.get('ville') or "").lower()
        if 'antananarivo' in ville: tags.add('Tana')
        elif 'antsiranana' in ville or 'diego' in ville: tags.add('Diego')
        elif 'mahajanga' in ville: tags.add('Majunga')
        elif 'toamasina' in ville: tags.add('Tamatave')
        elif 'toliara' in ville: tags.add('Tuléar')
        elif 'fianarantsoa' in ville: tags.add('Fianar')
        elif 'nosy be' in ville: tags.add('Nosy Be')

        # Budget
        try:
            prix_txt = str(item.get('prix', '')).replace(' ', '')
            if not prix_txt or 'Gratuit' in prix_txt: tags.add('€')
            else:
                m = re.search(r'\d+', prix_txt)
                if m:
                    val = int(m.group())
                    if val <= 25000: tags.add('€')
                    elif val <= 100000: tags.add('€€')
                    else: tags.add('€€€')
                else: tags.add('€')
        except: tags.add('€')

        # Catégorie (Basé sur tout le texte)
        full_text = (str(item.get('type')) + " " + str(item.get('nom')) + " " + str(item.get('description'))).lower()
        
        if any(x in full_text for x in ['plage', 'parc', 'rando', 'nature', 'réserve', 'lémurien', 'cascade', 'phare']): tags.add('Explorer')
        if any(x in full_text for x in ['restaurant', 'manger', 'cuisine', 'dîner', 'pizza', 'déjeuner', 'snack']): tags.add('Manger')
        if any(x in full_text for x in ['hotel', 'hôtel', 'lodge', 'dormir', 'bungalow']): tags.add('Dormir')
        if any(x in full_text for x in ['bar', 'club', 'sortir', 'ambiance', 'karaoke', 'nuit']): tags.add('Sortir')
        if item.get('spotLocal'): tags.add('Spots')

        # Conserver les tags existants pertinents (User logic said so)
        if item.get('tags'):
            for t in item['tags']: 
                # Avoid adding duplicates of categories if already added?
                # The set handles duplicates.
                tags.add(str(t))
            
        item['tags'] = list(tags)
        count += 1

    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    print(f"✅ DONNÉES : {count} fiches mises à jour (Tags + Nettoyage).")

# ==========================================
# 2. REPARATION DU CODE CARTE (Anti-Crash)
# ==========================================
JS_PATH = os.path.join(BASE_DIR, 'js', 'map-logic.js')

NEW_JS_CODE = """
/* MAP LOGIC - VERSION BLINDÉE ANTI-CRASH */
const CITY_COORDINATES={'antananarivo':[-18.8792,47.5079,12],'antsiranana':[-12.2797,49.2917,12],'mahajanga':[-15.7167,46.3167,12],'toamasina':[-18.1492,49.4023,12],'toliara':[-23.3500,43.6667,12],'fianarantsoa':[-21.4333,47.0833,12]};
window.leafletMap=null;let markersLayer=null;

// FONCTION VITALE : Nettoie les chaines pour le HTML
function safeStr(str) {
    if (!str) return '';
    // Remplace les apostrophes simples ET doubles pour ne pas casser le style="" ou onclick=""
    return String(str).replace(/'/g, "\\\\'").replace(/"/g, '&quot;').replace(/\\n/g, ' ');
}

window.initMap=function(){
    console.log("🚀 Map Start");
    window.leafletMap=L.map('map').setView([-18.8792,47.5079],6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(window.leafletMap);
    markersLayer=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:50});
    window.leafletMap.addLayer(markersLayer);
    
    updateMapMarkers(); // Charge tout au démarrage
    
    document.querySelectorAll('.filter-checkbox').forEach(cb=>cb.addEventListener('change',updateMapMarkers));
};

window.updateMapMarkers=function(){
    if(!markersLayer)return;
    markersLayer.clearLayers();
    
    // Récupération Filtres
    const checkboxes=document.querySelectorAll('.filter-checkbox:checked');
    const activeFilters=Array.from(checkboxes).map(cb=>cb.parentElement.innerText.trim()); // Récupère "Tana", "€", etc.
    
    const data=window.LIEUX_DATA||[];
    
    const filtered = data.filter(item => {
        if(activeFilters.length===0) return true; // Si aucun filtre, on montre tout
        if(!item.tags) return false;
        // Si l'item possède AU MOINS UN des tags actifs (Logique OU intelligente)
        // Wait, logic here says "some". Item must include activeFilter.
        // User logic: activeFilters.some(f => item.tags.includes(f)).
        // This effectively implies OR filtering across ALL toggles.
        // So checking "Tana" and "Manger" displays items that are "Tana" OR "Manger".
        // This is extremely permissive. Usually we want (Tana) AND (Manger).
        // But I MUST follow the provided user script logic.
        return activeFilters.some(f => item.tags.includes(f));
    });

    console.log(`Map: ${filtered.length} lieux affichés`);

    filtered.forEach(lieu => {
        if(!lieu.lat || !lieu.lng) return;
        
        const icon=L.divIcon({className:'custom-marker',html:lieu.spotLocal?'📍':'📌',iconSize:[24,24],iconAnchor:[12,24],popupAnchor:[0,-24]});
        const marker=L.marker([lieu.lat,lieu.lng],{icon});
        
        // SECURISATION TOTALE DES VARIABLES
        const sImg = safeStr(lieu.image || 'images/placeholders/default.jpg');
        const sNom = safeStr(lieu.nom);
        const sId = String(lieu.id);
        const sType = safeStr(lieu.type);
        const sVille = safeStr(lieu.ville);
        const sPrix = safeStr(lieu.prix);
        
        // Construction HTML avec guillemets doubles extérieurs et simples intérieurs protégés
        const html = `
            <div class="popup-wrapper">
                <div class="popup-image-container" style="background-image: url('${sImg}');">
                    <div class="popup-type-badge">${sType}</div>
                </div>
                <div class="popup-body">
                    <h3 class="popup-title">${sNom}</h3>
                    <div class="popup-subtitle">📍 ${sVille}</div>
                    <div class="popup-meta">
                        <div class="popup-price">${sPrix}</div>
                        <div class="popup-rating">⭐ ${lieu.note}</div>
                    </div>
                    <button onclick="showLieuDetailsByID('${sId}')" class="btn-popup-details">Voir détails</button>
                </div>
            </div>`;
            
        marker.bindPopup(html);
        marker.on('click', () => { /* Optionnel: Action au clic direct */ });
        markersLayer.addLayer(marker);
    });
};

// Filtres
window.toggleFilter=function(chip,type){
    if(!chip)return;
    const cb=chip.querySelector('input');
    if(event.target!==cb) cb.checked=!cb.checked;
    
    // Gestion visuelle simple
    if(cb.checked) chip.classList.add('active');
    else chip.classList.remove('active');
    
    // Zoom auto ville
    if(CITY_COORDINATES[type] && cb.checked) {
        window.leafletMap.setView([CITY_COORDINATES[type][0], CITY_COORDINATES[type][1]], CITY_COORDINATES[type][2]);
    }
    
    updateMapMarkers();
};

window.initGeolocation=function(){
    const btn=document.getElementById('btnLocateMe');
    if(btn) btn.addEventListener('click',()=>{
        navigator.geolocation.getCurrentPosition(p=>{
            window.leafletMap.setView([p.coords.latitude,p.coords.longitude],13);
            L.marker([p.coords.latitude,p.coords.longitude]).addTo(window.leafletMap).bindPopup("Vous").openPopup();
        });
    });
};
"""

def repair_map_logic():
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write(NEW_JS_CODE)
    print("✅ CODE : map-logic.js entièrement réécrit et sécurisé.")

if __name__ == "__main__":
    repair_data()
    repair_map_logic()
