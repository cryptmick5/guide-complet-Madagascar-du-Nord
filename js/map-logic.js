
/* MAP LOGIC - VERSION SÉCURISÉE & FILTRES */
const CITY_COORDINATES={'antananarivo':[-18.8792,47.5079,12],'antsiranana':[-12.2797,49.2917,12],'mahajanga':[-15.7167,46.3167,12],'toamasina':[-18.1492,49.4023,12],'toliara':[-23.3500,43.6667,12],'fianarantsoa':[-21.4333,47.0833,12]};
window.leafletMap=null;let markersLayer=null;

// FONCTION CRITIQUE : Nettoie tout ce qui peut casser le HTML
function safeStr(str) {
    if (!str) return '';
    // Echappe les apostrophes et guillemets pour éviter le bug "Unexpected identifier display"
    return String(str)
        .replace(/'/g, "\\'").replace(/"/g, '&quot;')
        .replace(/\n/g, ' ');
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
