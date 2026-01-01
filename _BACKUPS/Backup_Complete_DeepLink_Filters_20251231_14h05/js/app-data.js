
/* =========================================================================
   APP DATA LOADER - ULTRA GUIDE MADAGASCAR
   ========================================================================= */

// Global storage for compatibility
window.LIEUX_DATA = window.LIEUX_DATA || [];
window.ZONES_DATA = window.ZONES_DATA || {};
window.ITINERAIRES_DATA = window.ITINERAIRES_DATA || {};
window.BUDGETS_DATA = window.BUDGETS_DATA || {};

async function initData() {
    console.log("Initializing Data...");
    try {
        // 1. Load Zones Data
        const zonesResp = await fetch('data/zones_data.json');
        const zonesJson = await zonesResp.json();
        window.ZONES_DATA = zonesJson.zones;

        // Flatten for map.js compatibility - DISABLED to preserve data/lieux.js fixes
        // window.LIEUX_DATA = [];
        // Object.values(window.ZONES_DATA).forEach(zone => {
        //     if (zone.lieux) {
        //         window.LIEUX_DATA = window.LIEUX_DATA.concat(zone.lieux);
        //     }
        // });
        if (!window.LIEUX_DATA || window.LIEUX_DATA.length === 0) {
            console.warn("⚠️ LIEUX_DATA empty after load. Falling back to Zones?");
            // Optional fallback if needed, but for now Trust lieux.js
        }

        // 2. Load Itineraries
        const itinResp = await fetch('data/itineraires.json?v=' + new Date().getTime());
        window.ITINERAIRES_DATA = await itinResp.json();

        // 3. Load Budgets
        const budgetResp = await fetch('data/budgets.json');
        window.BUDGETS_DATA = await budgetResp.json();

        console.log(`Data Loaded: ${window.LIEUX_DATA.length} locations.`);

        // 4. Render UI if containers exist
        renderPremiumUI('Diego-Suarez'); // Default or detect
        renderGlobalGrids(); // Populate Tout/Explorer

        return true;
    } catch (error) {
        console.error("CRITICAL: Failed to load data", error);
        return false;
    }
}

// --- SHARED CARD GENERATOR - 2026 MODERN DESIGN ---
function createLieuCard(lieu) {
    const createBudgetBadge = (price) => {
        if (!price) return '';
        const num = parseInt(price.replace(/\D/g, '')) || 0;

        let level = 'low';
        let symbol = '€';
        let label = 'Éco';

        const isResto = ['Restaurant', 'Bar', 'Snack'].includes(lieu.type);

        if (isResto) {
            if (num > 50000) { level = 'high'; symbol = '€€€'; label = 'Premium'; }
            else if (num > 20000) { level = 'mid'; symbol = '€€'; label = 'Confort'; }
        } else {
            if (num > 180000) { level = 'high'; symbol = '€€€'; label = 'Premium'; }
            else if (num > 60000) { level = 'mid'; symbol = '€€'; label = 'Confort'; }
        }

        if (num === 0) return '<span class="badge-budget-2026 budget-low">Gratuit</span>';

        return `<span class="badge-budget-2026 budget-${level}" title="${label}">${symbol}</span>`;
    };

    const imagePath = lieu.image || 'https://placehold.co/600x400?text=No+Image';
    const isFavorite = window.favorites && window.favorites.includes(lieu.id);
    const favoriteClass = isFavorite ? 'active' : '';
    const favoriteIcon = isFavorite ? 'fa-solid' : 'fa-regular';

    // Détecter si c'est Incontournable
    const isIncontournable = lieu.type === 'Incontournable' ||
        (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeTypeClass = isIncontournable ? 'incontournable' : '';

    return `
        <article class="lieu-card-2026" data-id="${lieu.id}" data-type="${lieu.type}" data-ville="${lieu.ville}">
            <!-- Image Section avec overlay premium -->
            <div class="card-image-2026">
                <img src="${imagePath}" alt="${lieu.nom}" loading="lazy">
                
                <!-- Badges overlay (haut) -->
                <div class="badges-overlay-2026">
                    <span class="badge-type-2026 ${badgeTypeClass}">${lieu.type}</span>
                    ${createBudgetBadge(lieu.prix)}
                </div>
                
                <!-- Badge ville (bas gauche) -->
                <div class="badge-ville-2026">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${lieu.ville}</span>
                </div>
                
                <!-- Bouton favori (haut droite) -->
                <button class="btn-favorite-2026 ${favoriteClass}" data-lieu-id="${lieu.id}" aria-label="Ajouter aux favoris">
                    <i class="${favoriteIcon} fa-bookmark"></i>
                </button>
                
                <!-- Note si disponible -->
                ${lieu.note ? `
                <div class="card-rating-2026">
                    <i class="fas fa-star"></i>
                    <span>${lieu.note}</span>
                </div>
                ` : ''}
            </div>
            
            <!-- Info Bar Horizontale (style référence moderne) -->
            <div class="card-info-bar-2026">
                <div class="info-item-2026">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="info-label">Lieu</span>
                    <span class="info-value">${lieu.ville}</span>
                </div>
                
                <div class="info-divider-2026"></div>
                
                <div class="info-item-2026">
                    <i class="fas fa-wallet"></i>
                    <span class="info-label">Prix</span>
                    <span class="info-value">${lieu.prix || 'Gratuit'}</span>
                </div>
                
                <div class="info-divider-2026"></div>
                
                <div class="info-item-2026">
                    <i class="fas fa-star"></i>
                    <span class="info-label">Note</span>
                    <span class="info-value">${lieu.note || '-'}</span>
                </div>
                
                <div class="info-divider-2026"></div>
                
                <div class="info-item-2026">
                    <i class="fas fa-clock"></i>
                    <span class="info-label">Durée</span>
                    <span class="info-value">${lieu.duree || 'Variable'}</span>
                </div>
            </div>
            
            <!-- Content (Titre + Description) -->
            <div class="card-content-2026">
                <h3 class="card-title-2026">${lieu.nom}</h3>
                <p class="card-description-2026">${lieu.description || 'Découvrez ce lieu unique à Madagascar...'}</p>
            </div>
        </article>
    `;
}

// --- EXPLORER FILTER LOGIC ---
window.currentExplorerFilter = 'all';

// function renderProvinceFilter() { Removed - Moved to HTML }

window.filterExplorerByZone = function (zoneKey, btn) {
    // Update Active State
    document.querySelectorAll('.province-filter-container .filter-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    window.currentExplorerFilter = zoneKey;
    const container = document.getElementById('explorer-container'); // DIRECT TARGET

    if (!container || !window.LIEUX_DATA) return;

    let filtered = window.LIEUX_DATA;

    if (zoneKey !== 'all') {
        if (zoneKey === 'SAVA') {
            filtered = filtered.filter(l => ['Sambava', 'Antalaha', 'Vohémar'].includes(l.ville));
        } else if (zoneKey === 'Ankarana') {
            // Ankarana often listed under Ambilobe or specific Parks
            filtered = filtered.filter(l => l.ville === 'Ambilobe' || l.nom.includes('Ankarana') || l.description.includes('Ankarana'));
        } else {
            // Direct Match (Diego, Nosy Be, Mahajanga)
            filtered = filtered.filter(l => l.ville === zoneKey);
        }
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; flex:1; color:var(--text-secondary); padding:40px;">Aucun lieu trouvé dans cette zone pour le moment.</p>`;
    } else {
        container.innerHTML = filtered.map(lieu => createLieuCard(lieu)).join('');
    }
};

function renderGlobalGrids() {
    const allContainer = document.getElementById('all-lieux-container');
    const explorerContainer = document.getElementById('explorer-container');

    if (!window.LIEUX_DATA || window.LIEUX_DATA.length === 0) return;

    // Generate all cards once
    const allCards = window.LIEUX_DATA.map(lieu => createLieuCard(lieu)).join('');

    if (allContainer) allContainer.innerHTML = allCards;

    // Explorer: Just Grid (Filter is now HTML Native)
    if (explorerContainer) {
        explorerContainer.innerHTML = allCards;
    }
}

// Generic Toggle Function exposed to Window
window.togglePremiumAccordion = function (header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.fa-chevron-down, .fa-chevron-up');

    if (content) {
        content.classList.toggle('active');
    }
    if (icon) {
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    }
};

function renderPremiumUI(zoneName, provinceKey) {
    const zone = window.ZONES_DATA[zoneName];
    if (!zone) return;

    // Suffix for unique IDs
    const suffix = provinceKey ? `-${provinceKey}` : '';

    // Helper for Price Tags (Local scope if needed specific logic, or use shared)
    const getPriceTag = (price) => {
        if (!price) return '';
        const num = parseInt(price.replace(/\D/g, '')) || 0;
        if (num < 20000) return '<span class="badge-price">€</span>';
        if (num < 50000) return '<span class="badge-price">€€</span>';
        return '<span class="badge-price">€€€</span>';
    };

    // --- RENDER LOGISTIQUE (Accordion) ---
    const logistiqueContainer = document.getElementById(`logistique-container${suffix}`);
    if (logistiqueContainer && zone.logistique) {
        const { route_etat, transport_conseil } = zone.logistique;
        const { description_fun, securite_level, conseil_securite } = zone.infos;

        logistiqueContainer.innerHTML = `
            <div class="logistique-header fade-in-up" onclick="window.togglePremiumAccordion(this)">
                <h3><i class="fas fa-truck-monster"></i> Logistique "Brousse"</h3>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="logistique-content active">
                <div class="logistique-item fade-in-up stagger-delay-1">
                    <div class="logistique-label">L'avis Grok</div>
                    <div class="logistique-text">"${description_fun}"</div>
                </div>
                <div class="logistique-item fade-in-up stagger-delay-2">
                    <div class="logistique-label">État de la Route</div>
                    <div class="logistique-text">${route_etat}</div>
                </div>
                <div class="logistique-item fade-in-up stagger-delay-2">
                    <div class="logistique-label">Conseil Transport</div>
                    <div class="logistique-text">${transport_conseil}</div>
                </div>
                 <div class="logistique-item fade-in-up stagger-delay-3">
                    <div class="logistique-label">Sécurité (${securite_level})</div>
                    <div class="logistique-text">${conseil_securite}</div>
                </div>
                <!-- Budget Estimatif (Premium Addition) -->
                 <div class="logistique-item fade-in-up stagger-delay-3" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top:10px; padding-top:10px;">
                    <div class="logistique-label"><i class="fas fa-wallet"></i> Budget Estimatif</div>
                    <div class="logistique-text" style="font-size:0.9em;">
                        <strong>Backpacker:</strong> 60k Ar/j | <strong>Confort:</strong> 150k Ar/j
                    </div>
                </div>
            </div>
        `;
    }

    // --- RENDER GASTRONOMIE (Accordion Premium) ---
    const gastroContainer = document.getElementById(`gastronomie-container${suffix}`);
    if (gastroContainer && zone.lieux) {
        const restos = zone.lieux
            .filter(l => l.type === 'Restaurant' && l.note >= 4.5) // Broaden slightly to ensure content
            .sort((a, b) => b.note - a.note)
            .slice(0, 5); // Top 5

        if (restos.length > 0) {
            let cardsHtml = '';
            restos.forEach(resto => {
                // Use Custom Card for Gastro Highlights (or shared if similar)
                // Using custom structure to match previous CSS for Gastro, but adding Tags
                cardsHtml += `
                    <div class="gastro-card">
                        <div class="gastro-image" style="background-image: url('${resto.image}'); position:relative; background-size: cover; background-position: center;">
                             <span class="gastro-badge">${resto.note} <i class="fas fa-star"></i></span>
                        </div>
                        <div class="gastro-details">
                            <h4 class="gastro-title">${resto.nom}</h4>
                            <div class="gastro-meta">
                                ${getPriceTag(resto.prix)}
                                <span class="badge-type"><i class="fas fa-utensils"></i> ${resto.type}</span>
                            </div>
                            <p class="gastro-desc">${resto.description}</p>
                            <div style="margin-top:5px; font-size:0.85rem; color:var(--text-secondary);">
                                <i class="fas fa-money-bill-wave"></i> ${resto.prix}
                            </div>
                        </div>
                    </div>
                `;
            });

            gastroContainer.innerHTML = `
                <div class="logistique-header" onclick="window.togglePremiumAccordion(this)">
                     <h3><i class="fas fa-utensils"></i> Nos Pépites Gourmandes</h3>
                     <i class="fas fa-chevron-down"></i>
                </div>
                <div class="logistique-content">
                    <div class="gastro-grid">${cardsHtml}</div>
                </div>
            `;
        }
    }
}

function toggleLogistique() {
    const content = document.getElementById('logistique-content');
    const icon = document.getElementById('logistique-icon');
    if (content) {
        content.classList.toggle('active');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    }
}

function toggleGastro() {
    const content = document.getElementById('gastro-content');
    const icon = document.getElementById('gastro-icon');
    if (content) {
        content.classList.toggle('active');
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    }
}

// Auto-init handled by main script via promise
window.renderPremiumUI = renderPremiumUI;

/* =========================================================================
   NEW EXPLORER FILTER LOGIC (Zone + Budget) - OVERRIDES
   ========================================================================= */
window.currentExplorerZone = 'all';
window.currentExplorerBudget = null; // 'low', 'mid', 'high' or null

// 1. Zone Filter Handler
window.filterExplorerByZone = function (zoneKey, btn) {
    // UI: Update active state for Zones only
    const container = document.querySelector('.province-filter-container');
    if (container) {
        // Remove active from all ZONE buttons (first 6)
        // Heuristic: check if onclick contains filterExplorerByZone
        const zoneBtns = Array.from(container.querySelectorAll('.filter-pill')).filter(b => b.getAttribute('onclick').includes('filterExplorerByZone'));
        zoneBtns.forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');

    window.currentExplorerZone = zoneKey;
    applyExplorerFilters();
};

// 2. Budget Filter Handler
window.toggleBudgetFilter = function (level, btn) {
    // UI: Toggle active state
    if (window.currentExplorerBudget === level) {
        // Deselect logic
        window.currentExplorerBudget = null;
        if (btn) btn.classList.remove('active');
    } else {
        // Select logic
        window.currentExplorerBudget = level;
        // Remove active from other budget buttons
        const container = document.querySelector('.province-filter-container');
        if (container) {
            const budgetBtns = Array.from(container.querySelectorAll('.filter-pill')).filter(b => b.getAttribute('onclick').includes('toggleBudgetFilter'));
            budgetBtns.forEach(b => b.classList.remove('active'));
        }
        if (btn) btn.classList.add('active');
    }
    applyExplorerFilters();
};

// 3. Main Filter Application Logic
function applyExplorerFilters() {
    const container = document.getElementById('explorer-container');
    if (!container || !window.LIEUX_DATA) return;

    let filtered = window.LIEUX_DATA;

    // A. Filter by Zone
    const zoneKey = window.currentExplorerZone;
    if (zoneKey !== 'all') {
        if (zoneKey === 'SAVA') {
            filtered = filtered.filter(l => ['Sambava', 'Antalaha', 'Vohémar'].includes(l.ville));
        } else if (zoneKey === 'Ankarana') {
            filtered = filtered.filter(l => l.ville === 'Ambilobe' || l.nom.includes('Ankarana') || l.description.includes('Ankarana'));
        } else {
            filtered = filtered.filter(l => l.ville === zoneKey);
        }
    }

    // B. Filter by Budget
    const budgetLevel = window.currentExplorerBudget;
    if (budgetLevel) {
        filtered = filtered.filter(l => {
            const price = parseInt((l.prix || '').replace(/\D/g, '')) || 0;
            const isResto = ['Restaurant', 'Bar', 'Snack'].includes(l.type);

            // Re-use logic from createBudgetBadge to determine level
            let level = 'low';
            if (isResto) {
                if (price > 50000) level = 'high';
                else if (price > 20000) level = 'mid';
            } else {
                if (price > 180000) level = 'high';
                else if (price > 60000) level = 'mid';
            }
            return level === budgetLevel;
        });
    }

    // Render
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; flex:1; color:var(--text-secondary); padding:40px;">Aucun lieu trouvé avec ces filtres.</p>`;
    } else {
        container.innerHTML = filtered.map(lieu => createLieuCard(lieu)).join('');
    }
}

/* =========================================================================
   EVENT DELEGATION FOR 2026 CARDS - Modern Approach
   ========================================================================= */

// Use event delegation on document for all card interactions
document.addEventListener('click', function (e) {
    // Handle favorite button clicks
    if (e.target.closest('.btn-favorite-2026')) {
        e.stopPropagation(); // Prevent card click
        const btn = e.target.closest('.btn-favorite-2026');
        const lieuId = parseInt(btn.dataset.lieuId);

        if (typeof window.toggleLieuFavorite === 'function') {
            window.toggleLieuFavorite(lieuId, btn, e);
        }
        return;
    }

    // Handle card clicks to open modal
    const card = e.target.closest('.lieu-card-2026');
    if (card) {
        const lieuId = parseInt(card.dataset.id);

        // Open modal - check if openModal or openLieuModal exists
        if (typeof window.openModal === 'function') {
            window.openModal(lieuId);
        } else if (typeof window.openLieuModal === 'function') {
            // Find lieu object from LIEUX_DATA
            const lieu = window.LIEUX_DATA.find(l => l.id === lieuId);
            if (lieu) {
                window.openLieuModal(lieu);
            }
        }
    }
});
