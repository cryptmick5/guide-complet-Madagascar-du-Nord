
import json
import os
import re

# ==========================================
# 1. REPARATION DES DONNÉES (FUSION DES TAGS)
# ==========================================
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
DATA_PATH = os.path.join(BASE_DIR, 'data', 'lieux.js')

def repair_data_merge():
    if not os.path.exists(DATA_PATH): 
        print(f"❌ Fichier data introuvable: {DATA_PATH}")
        return
    
    print(f"Reading {DATA_PATH}...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # On nettoie pour avoir du JSON pur
        # Find array start [ and end ]
        start = content.find('[')
        end = content.rfind(']')
        if start == -1: 
             print("❌ JSON array missing")
             return
        json_str = content[start:end+1]
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"❌ Erreur JSON data: {e}")
            return

    count = 0
    for item in data:
        # A. NETTOYAGE TEXTE (Anti-Crash JS)
        # On enlève les retours à la ligne et on nettoie les espaces
        for key in ['nom', 'description', 'image', 'type', 'conseil', 'ville', 'prix']:
            if isinstance(item.get(key), str):
                item[key] = item[key].replace('\n', ' ').replace('\r', '').strip()

        # B. GÉNÉRATION DES NOUVEAUX TAGS (OBLIGATOIRES)
        # On commence par récupérer les tags EXISTANTS pour ne pas les perdre
        current_tags = set(item.get('tags', []))
        
        # 1. VILLES (Ajout du tag court)
        ville = (item.get('ville') or "").lower()
        if 'antananarivo' in ville: current_tags.add('Tana')
        elif 'antsiranana' in ville or 'diego' in ville: current_tags.add('Diego')
        elif 'mahajanga' in ville: current_tags.add('Majunga')
        elif 'toamasina' in ville: current_tags.add('Tamatave')
        elif 'toliara' in ville: current_tags.add('Tuléar')
        elif 'fianarantsoa' in ville: current_tags.add('Fianar')
        elif 'nosy be' in ville: current_tags.add('Nosy Be')

        # 2. BUDGET (Ajout du tag symbole)
        try:
            prix_txt = str(item.get('prix', '')).replace(' ', '')
            if not prix_txt or 'Gratuit' in prix_txt: current_tags.add('€')
            else:
                match = re.search(r'\d+', prix_txt)
                if match:
                    val = int(match.group())
                    if val <= 25000: current_tags.add('€')
                    elif val <= 100000: current_tags.add('€€')
                    else: current_tags.add('€€€')
                else:
                    current_tags.add('€')
        except: current_tags.add('€')

        # 3. CATÉGORIES (Ajout du tag Filtre "Explorer", "Manger"...)
        # On analyse tout le texte de la fiche pour savoir quoi ajouter
        full_text = (str(item.get('type')) + " " + str(item.get('nom')) + " " + str(item.get('description'))).lower()
        
        # Si ça parle de nature -> On ajoute "Explorer" (sans supprimer Nature)
        if any(x in full_text for x in ['plage', 'parc', 'rando', 'nature', 'réserve', 'lémurien', 'cascade', 'phare', 'culture', 'incontournable']): 
            current_tags.add('Explorer')
        
        if any(x in full_text for x in ['restaurant', 'manger', 'cuisine', 'dîner', 'pizza', 'déjeuner', 'gastronomie', 'snack']): 
            current_tags.add('Manger')
        
        if any(x in full_text for x in ['hotel', 'hôtel', 'lodge', 'dormir', 'bungalow', 'resort', 'hébergement']): 
            current_tags.add('Dormir')
        
        if any(x in full_text for x in ['bar', 'club', 'sortir', 'ambiance', 'karaoke', 'nuit']): 
            current_tags.add('Sortir')
        
        if item.get('spotLocal'): current_tags.add('Spots')

        # On sauvegarde la liste fusionnée
        item['tags'] = list(current_tags)
        count += 1

    # Ecriture du fichier propre
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
    print(f"✅ DONNÉES : {count} fiches mises à jour (Tags fusionnés + Nettoyage).")

# ==========================================
# 2. REPARATION DU CODE CARTE (Anti-Crash Display)
# ==========================================
JS_PATH = os.path.join(BASE_DIR, 'js', 'map-logic.js')

NEW_JS_CODE = """
/* MAP LOGIC - VERSION SÉCURISÉE & FILTRES */
const CITY_COORDINATES={'antananarivo':[-18.8792,47.5079,12],'antsiranana':[-12.2797,49.2917,12],'mahajanga':[-15.7167,46.3167,12],'toamasina':[-18.1492,49.4023,12],'toliara':[-23.3500,43.6667,12],'fianarantsoa':[-21.4333,47.0833,12]};
window.leafletMap=null;let markersLayer=null;

// FONCTION CRITIQUE : Nettoie tout ce qui peut casser le HTML
function safeStr(str) {
    if (!str) return '';
    // Echappe les apostrophes et guillemets pour éviter le bug "Unexpected identifier display"
    return String(str)
        .replace(/'/g, "\\\\'").replace(/"/g, '&quot;')
        .replace(/\\n/g, ' ');
}

window.initMap=function(){
    console.log("🚀 Map Start");
    window.leafletMap=L.map('map').setView([-18.8792,47.5079],6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(window.leafletMap);
    markersLayer=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:50});
    window.leafletMap.addLayer(markersLayer);
    
    updateMapMarkers(); // Affiche tout par défaut
    
    document.querySelectorAll('.filter-checkbox').forEach(cb=>cb.addEventListener('change',updateMapMarkers));
};

window.updateMapMarkers=function(){
    if(!markersLayer)return;
    markersLayer.clearLayers();
    
    // 1. Récupération des filtres actifs (Texte du bouton)
    const checkboxes=document.querySelectorAll('.filter-checkbox:checked');
    const activeFilters=Array.from(checkboxes).map(cb=>cb.parentElement.innerText.trim()); 
    
    const data=window.LIEUX_DATA||[];
    
    // 2. Filtrage
    const filtered = data.filter(item => {
        if(activeFilters.length===0) return true; // Aucun filtre = Tout montrer
        if(!item.tags) return false;
        
        // Si l'item a au moins un des tags demandés, on le garde
        return activeFilters.some(f => item.tags.includes(f));
    });

    console.log(`Map: ${filtered.length} lieux affichés`);

    filtered.forEach(lieu => {
        if(!lieu.lat || !lieu.lng) return;
        
        const icon=L.divIcon({className:'custom-marker',html:lieu.spotLocal?'📍':'📌',iconSize:[24,24],iconAnchor:[12,24],popupAnchor:[0,-24]});
        const marker=L.marker([lieu.lat,lieu.lng],{icon});
        
        // 3. Variables Sécurisées (Anti-Crash)
        const sImg = safeStr(lieu.image || 'images/placeholders/default.jpg');
        const sNom = safeStr(lieu.nom);
        const sId = String(lieu.id);
        const sType = safeStr(lieu.type);
        const sVille = safeStr(lieu.ville);
        const sPrix = safeStr(lieu.prix);
        
        // 4. HTML Popup
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
        markersLayer.addLayer(marker);
    });
};

// Logique Boutons Filtres
window.toggleFilter=function(chip,type){
    if(!chip)return;
    const cb=chip.querySelector('input');
    if(event.target!==cb) cb.checked=!cb.checked;
    
    if(cb.checked) chip.classList.add('active');
    else chip.classList.remove('active');
    
    // Zoom Ville
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

def apply_fixes():
    # 1. Mise à jour des tags (Fusion)
    repair_data_merge()
    # 2. Remplacement du code buggé
    with open(JS_PATH, 'w', encoding='utf-8') as f:
        f.write(NEW_JS_CODE)
    print("✅ CODE : map-logic.js sécurisé et données fusionnées.")

if __name__ == "__main__":
    apply_fixes()
