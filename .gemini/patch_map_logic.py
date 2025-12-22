
import os

# Le fichier à remplacer
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
FILE_PATH = os.path.join(BASE_DIR, 'js', 'map-logic.js')

# Le nouveau code JavaScript (Version corrigée et sécurisée)
js_content = """
/* ============================================
   MAP LOGIC (LEAFLET) - VERSION CORRIGÉE
   Handles Map initialization, markers, clustering, and geolocation.
   ============================================ */

const CITY_COORDINATES = {
    'antananarivo': [-18.8792, 47.5079, 12],
    'antsiranana': [-12.2797, 49.2917, 12],
    'mahajanga': [-15.7167, 46.3167, 12],
    'toamasina': [-18.1492, 49.4023, 12],
    'toliara': [-23.3500, 43.6667, 12],
    'fianarantsoa': [-21.4333, 47.0833, 12]
};

window.leafletMap = null;
let markersLayer = null;

// Fonction utilitaire pour échapper les apostrophes (ANTI-CRASH)
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\\\'"); 
}

// ============================================
// INITIALIZATION
// ============================================

window.initMap = function () {
    console.log("🚀 Initialisation de la carte...");
    
    // Basic setup
    window.leafletMap = L.map('map').setView([-18.8792, 47.5079], 6);
    const map = window.leafletMap;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    markersLayer = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50
    });

    // Auto-Center Popup Logic
    map.on('popupopen', function (e) {
        const popup = e.popup;
        if (!popup) return;
        setTimeout(() => {
            if (popup._container && popup._latlng) {
                const px = map.project(popup._latlng);
                const popupHeight = popup._container.clientHeight;
                px.y -= (popupHeight / 2) + 30;
                map.panTo(map.unproject(px), { animate: true, duration: 0.5 });
            }
        }, 10);
    });

    map.addLayer(markersLayer);
    
    // Charger les marqueurs une première fois
    updateMapMarkers();

    // Ecouteurs redondants (sécurité)
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateMapMarkers);
    });
};

// ============================================
// MARKERS & CLUSTERS
// ============================================

window.updateMapMarkers = function () {
    if (!markersLayer) return;
    markersLayer.clearLayers();

    // Récupération des filtres
    const filters = (typeof getActiveFilters === 'function') 
        ? getActiveFilters() 
        : { provinces: [], types: [], prix: [], favorites: false };

    // Si getActiveFilters renvoie tout vide, on s'assure d'afficher tout le monde
    // (C'est géré par le fait que les tableaux vides = pas de filtre actif)

    const allData = window.LIEUX_DATA || [];
    console.log(`[Map] Données totales : ${allData.length}`);

    const filteredLieux = allData.filter(lieu => {
        if (!lieu.tags) return true;

        const activeProvinces = filters.provinces || [];
        const activeTypes = filters.types || [];
        const activePrices = filters.prix || [];

        // 1. Filtre Province (OU)
        if (activeProvinces.length > 0) {
            // Mapping des IDs de checkbox vers les Tags réels
            const mapProv = {
                'antananarivo': 'Tana',
                'antsiranana': 'Diego',
                'mahajanga': 'Majunga',
                'toamasina': 'Tamatave',
                'toliara': 'Tuléar',
                'fianarantsoa': 'Fianar'
            };
            
            const hasProvince = activeProvinces.some(p => {
                const tagAttendu = mapProv[p] || p; // Cherche "Tana" si filtre est "antananarivo"
                return lieu.tags.includes(tagAttendu);
            });
            if (!hasProvince) return false;
        }

        // 2. Filtre Catégorie (OU)
        if (activeTypes.length > 0) {
            const hasType = activeTypes.some(t => {
                let tag = t;
                if (tag === 'dodo') tag = 'Dormir';
                if (tag === 'spot') tag = 'Spots';
                // Comparaison insensible à la casse
                return lieu.tags.some(lt => lt.toLowerCase() === tag.toLowerCase());
            });
            if (!hasType) return false;
        }

        // 3. Filtre Prix (OU)
        if (activePrices.length > 0) {
            const mapPrix = { 'budget1': '€', 'budget2': '€€', 'budget3': '€€€' };
            const hasPrice = activePrices.some(ap => {
                const tagAttendu = mapPrix[ap] || ap;
                return lieu.tags.includes(tagAttendu);
            });
            if (!hasPrice) return false;
        }

        return true;
    });

    console.log(`[Map] Lieux affichés après filtre : ${filteredLieux.length}`);

    filteredLieux.forEach((lieu) => {
        if (!lieu.lat || !lieu.lng) return;

        const icon = L.divIcon({
            className: 'custom-marker',
            html: lieu.spotLocal ? '📍' : '📌',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        const marker = L.marker([lieu.lat, lieu.lng], { icon });

        // --- SÉCURISATION DES DONNÉES POPUP ---
        const safeImage = escapeHtml(lieu.image || 'images/placeholders/default.jpg');
        const safeNom = escapeHtml(lieu.nom);
        const safeId = String(lieu.id); // On force en string pour éviter les bugs
        
        // Emoji Ville
        let cityEmoji = '📍';
        if (typeof getVilleEmoji === 'function') cityEmoji = getVilleEmoji(lieu.ville);

        // Favoris
        let isFav = false;
        if (typeof isFavorite === 'function') isFav = isFavorite(lieu.id);
        const bookmarkIcon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';
        const activeClass = isFav ? 'active' : '';

        // Contenu HTML du Popup (Notez les guillemets simples échappés autour des variables)
        const popupContent = `
            <div class="popup-wrapper">
                <div class="popup-image-container" style="background-image: url('${safeImage}');">
                    <button onclick="toggleLieuFavorite('${safeId}', this, event)" class="btn-favorite-popup-overlay ${activeClass}">
                        ${bookmarkIcon}
                    </button>
                    ${lieu.spotLocal ? 
                        `<div class="popup-type-badge" style="background:var(--laterite);">📍 Spot Local</div>` : 
                        `<div class="popup-type-badge">${lieu.type}</div>`
                    }
                </div>
                
                <div class="popup-body">
                    <h3 class="popup-title">${safeNom}</h3>
                    <div class="popup-subtitle">
                       ${cityEmoji} ${lieu.ville}
                    </div>
                    
                    <div class="popup-meta">
                        <div class="popup-price">${lieu.prix || ''}</div>
                        <div class="popup-rating"><i class="fas fa-star"></i> ${lieu.note}</div>
                    </div>

                    <button onclick="showLieuDetailsByID('${safeId}')" class="btn-popup-details">
                        Voir détails <i class="fas fa-arrow-right" style="margin-left:6px; font-size:0.8em;"></i>
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        
        // AJOUT : Clic direct sur le marqueur pour ouvrir aussi (plus robuste sur mobile)
        marker.on('click', function() {
             // On peut décommenter ceci si on veut ouvrir la modale direct au lieu du popup
             // showLieuDetailsByID(safeId); 
        });

        markersLayer.addLayer(marker);
    });
};

// ============================================
// SMART FILTERS
// ============================================

window.toggleFilter = function (chip, type) {
    if (!chip) return;
    const checkbox = chip.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    const isCity = ['antananarivo', 'antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa'].includes(type);
    const isCategory = ['explorer', 'manger', 'dodo', 'sortir', 'spot', 'favorites', 'budget1', 'budget2', 'budget3'].includes(type);

    // 1. Logique Ville (Exclusif + Zoom)
    if (isCity) {
        // Décoche les autres villes
        ['antananarivo', 'antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa'].forEach(c => {
            if (c !== type) {
                const otherCb = document.getElementById(`filter-${c}`);
                if (otherCb) {
                    otherCb.checked = false;
                    if(otherCb.parentElement) otherCb.parentElement.classList.remove('active');
                }
            }
        });

        // Toggle checkbox si clic sur le chip
        if (typeof event !== 'undefined' && event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }

        // Zoom
        if (checkbox.checked) {
            chip.classList.add('active');
            if (CITY_COORDINATES[type] && window.leafletMap) {
                window.leafletMap.setView([CITY_COORDINATES[type][0], CITY_COORDINATES[type][1]], CITY_COORDINATES[type][2]);
            }
        } else {
            chip.classList.remove('active');
            if (window.leafletMap) window.leafletMap.setView([-18.8792, 47.5079], 6); // Reset zoom
        }
    }
    
    // 2. Logique Catégorie (Exclusif pour simplifier)
    else if (isCategory) {
        // Décoche les autres catégories du même groupe si besoin
        const allCats = ['explorer', 'manger', 'dodo', 'sortir', 'spot', 'favorites'];
        if (allCats.includes(type)) {
             allCats.forEach(c => {
                if (c !== type) {
                    const otherCb = document.getElementById(`filter-${c}`);
                    if (otherCb) {
                        otherCb.checked = false;
                        if(otherCb.parentElement) otherCb.parentElement.classList.remove('active');
                    }
                }
            });
        }

        if (typeof event !== 'undefined' && event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }

        if (checkbox.checked) chip.classList.add('active');
        else chip.classList.remove('active');
    }

    updateMapMarkers();
};

// ============================================
// GEOLOCATION
// ============================================

window.initGeolocation = function () {
    const btnLocate = document.getElementById('btnLocateMe');
    if (!btnLocate) return;

    btnLocate.addEventListener('click', () => {
        if ("geolocation" in navigator) {
            btnLocate.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const map = window.leafletMap;
                if (map) {
                    map.setView([lat, lng], 13);
                    L.marker([lat, lng]).addTo(map).bindPopup("Vous êtes ici").openPopup();
                }
                btnLocate.innerHTML = '<i class="fas fa-check"></i>';
            }, error => {
                alert("Erreur GPS: " + error.message);
                btnLocate.innerHTML = '<i class="fas fa-location-crosshairs"></i>';
            });
        } else {
            alert("GPS non supporté");
        }
    });
};
"""

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("✅ SUCCÈS : map-logic.js a été patché contre les erreurs de syntaxe (Apostrophes & IDs) !")
