/* ============================================
   MAP LOGIC (LEAFLET)
   Handles Map initialization, markers, clustering, and geolocation.
   Depends on: global LIEUX_DATA, L (Leaflet)
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

// ============================================
// INITIALIZATION
// ============================================

window.initMap = function () {
    // Basic setup
    window.leafletMap = L.map('map').setView([-18.8792, 47.5079], 6);

    // Public export for debugging
    const map = window.leafletMap;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    markersLayer = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });

    // Auto-Center Popup Logic (Smart Pan)
    map.on('popupopen', function (e) {
        const popup = e.popup;
        if (!popup) return;

        // Small delay to ensure layout is computed
        setTimeout(() => {
            if (popup._container && popup._latlng) {
                const px = map.project(popup._latlng); // Marker position in pixels
                const popupHeight = popup._container.clientHeight;

                // Center popup vertically (adjusted for popup height)
                px.y -= (popupHeight / 2) + 30;

                map.panTo(map.unproject(px), { animate: true, duration: 0.5 });
            }
        }, 10);
    });

    updateMapMarkers();
    map.addLayer(markersLayer);

    // Filtres Change Listeners (Redundant if toggleFilter handles it, but good for safety)
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

    // Requires getActiveFilters/matchesFilters from app.js
    if (typeof getActiveFilters !== 'function' || typeof matchesFilters !== 'function') {
        console.warn("Map filtering functions missing. Loading all.");
    }

    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { provinces: [], types: [], prix: [], favorites: false };

    const filteredLieux = window.LIEUX_DATA.filter(lieu => {
        if (!lieu.nom) return false;
        if (typeof matchesFilters === 'function') return matchesFilters(lieu, filters);
        return true;
    });

    filteredLieux.forEach(lieu => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: lieu.spotLocal ? '📍' : '📌',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });

        const marker = L.marker([lieu.lat, lieu.lng], { icon });

        // Helper for Emoji
        const cityEmoji = (typeof getVilleEmoji === 'function') ? getVilleEmoji(lieu.ville) : '📍';
        const isFav = (typeof isFavorite === 'function') ? isFavorite(lieu.id) : false;
        const bookmarkIcon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';
        const activeClass = isFav ? 'active' : '';

        const popupContent = `
            <div class="popup-wrapper">
                <div class="popup-image-container" style="background-image: url('${lieu.image}');">
                     <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite-popup-overlay ${activeClass}">
                        ${bookmarkIcon}
                    </button>
                    ${lieu.spotLocal ? '<div class="popup-type-badge" style="background:var(--laterite);">📍 Spot Local</div>' : `<div class="popup-type-badge">${lieu.type}</div>`}
                </div>
                <div class="popup-body">
                    <h3 class="popup-title">${lieu.nom}</h3>
                    <div class="popup-subtitle">
                        ${cityEmoji} ${lieu.ville}
                    </div>
                    
                    <div class="popup-meta">
                        <div class="popup-price">${lieu.prix || ''}</div>
                        <div class="popup-rating"><i class="fas fa-star"></i> ${lieu.note}</div>
                    </div>
                    
                    <button onclick="showLieuDetailsByID(${lieu.id})" class="btn-popup-details">
                        Voir détails <i class="fas fa-arrow-right" style="margin-left:6px; font-size:0.8em;"></i>
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);
        markersLayer.addLayer(marker);
    });
};

// ============================================
// SMART FILTERS
// ============================================

window.toggleFilter = function (chip, type) {
    // If called with (element, filterId) from old code, map it
    // Old code passed 'type' as the filterId string
    // Chip is the wrapper div usually.

    // Safety check for arguments
    if (!chip) return;

    const checkbox = chip.querySelector('input[type="checkbox"]');
    if (!checkbox) {
        // Fallback for old call style if chip is just the element and has no checkbox inside?
        // Actually the old code used document.getElementById('filter-' + filterId)
        // Let's assume the new HTML structure is used.
        return;
    }

    const isCity = ['antananarivo', 'antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa'].includes(type);
    const isCategory = ['explorer', 'manger', 'dodo', 'sortir', 'spot', 'favorites', 'budget1', 'budget2', 'budget3'].includes(type);

    // 1. SMART CITY LOGIC (Exclusive + Zoom)
    if (isCity) {
        // If clicking a city, uncheck all other cities first
        const allCities = ['antananarivo', 'antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa'];
        allCities.forEach(c => {
            if (c !== type) {
                const otherCb = document.getElementById(`filter-${c}`);
                const otherChip = otherCb ? otherCb.parentElement : null;
                if (otherCb) {
                    otherCb.checked = false;
                    if (otherChip) otherChip.classList.remove('active');
                }
            }
        });

        // Toggle the clicked one
        // If event target is NOT the checkbox (clicked on div), toggle it. 
        // If clicked on checkbox, it toggles itself.
        // We must check existing event? 'event' is available in inline calls.
        if (typeof event !== 'undefined' && event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }

        // Visual & Map Action
        if (checkbox.checked) {
            chip.classList.add('active');
            // ZOOM TO CITY
            if (CITY_COORDINATES[type] && window.leafletMap) {
                window.leafletMap.setView([CITY_COORDINATES[type][0], CITY_COORDINATES[type][1]], CITY_COORDINATES[type][2]);
            }
        } else {
            chip.classList.remove('active');
            if (window.leafletMap) window.leafletMap.setView([-18.766947, 46.869107], 6); // Back to Global
        }
    }

    // 2. SMART CATEGORY LOGIC (Exclusive)
    else if (isCategory) {
        // Uncheck all other categories
        const allCats = ['explorer', 'manger', 'dodo', 'sortir', 'spot', 'favorites'];
        allCats.forEach(c => {
            if (c !== type) {
                const otherCb = document.getElementById(`filter-${c}`);
                const otherChip = otherCb ? otherCb.parentElement : null;
                if (otherCb) {
                    otherCb.checked = false;
                    if (otherChip) otherChip.classList.remove('active');
                }
            }
        });

        // Force Check (Exclusive)
        if (typeof event !== 'undefined' && event.target !== checkbox) {
            // If we clicked div, we want to toggle. But here we enforce Radio behavior mostly?
            // Actually User wants standard toggle but with exclusive group.
            checkbox.checked = !checkbox.checked;
        }

        if (checkbox.checked) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }

        // Special case: if we just unchecked, we might want to ensure "Empty" state is handled (all shown)
        // updateMapMarkers handles empty filters as "Show All".
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
            btnLocate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Localisation...';

            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const map = window.leafletMap;

                if (map) {
                    map.setView([lat, lng], 13);

                    const userIcon = L.divIcon({
                        className: 'user-marker',
                        html: '<div style="background:#4285F4; width:16px; height:16px; border:3px solid white; border-radius:50%; box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    L.marker([lat, lng], { icon: userIcon })
                        .addTo(map)
                        .bindPopup("Vous êtes ici !")
                        .openPopup();
                }

                btnLocate.innerHTML = '<i class="fas fa-check"></i> Trouvé !';
                setTimeout(() => {
                    btnLocate.innerHTML = '<i class="fas fa-location-crosshairs"></i> Autour de moi';
                }, 2000);

            }, error => {
                alert("Erreur de localisation : " + error.message);
                btnLocate.innerHTML = '<i class="fas fa-location-crosshairs"></i> Autour de moi';
            });
        } else {
            alert("Votre navigateur ne supporte pas la géolocalisation.");
        }
    });
};
