/* ============================================
   APP LOGIC (RESTORED & PREMIUM)
   Handles Navigation, Data Loading, UI interaction, Pages, Modals.
   ============================================ */

// Global State
window.currentTheme = 'light';
window.exchangeRate = 4250;
window.favorites = [];
window.checklist = [];

// ============================================
// 1. INITIALIZATION & DATA
// ============================================

window.initData = function () {
    return new Promise((resolve) => {
        // Validation des globales
        if (typeof LIEUX_DATA === 'undefined' || typeof ITINERAIRES_DATA === 'undefined') {
            console.error("Critical Data Missing!");
            return;
        }

        // Globals ensure
        window.LIEUX_DATA = LIEUX_DATA;
        window.ITINERAIRES_DATA = ITINERAIRES_DATA;
        // Phrases fallback
        window.PHRASES_DATA = typeof PHRASES_DATA !== 'undefined' ? PHRASES_DATA : {};
        // Checklist fallback
        window.CHECKLIST_ITEMS = typeof CHECKLIST_ITEMS !== 'undefined' ? CHECKLIST_ITEMS : [
            { id: 'passeport', text: 'Passeport (validité 6 mois)' },
            { id: 'visa', text: 'Visa (à l\'arrivée ou e-visa)' },
            { id: 'billet', text: 'Billets d\'avion imprimés' },
            { id: 'cash', text: 'Euros en espèces (pour le change)' },
            { id: 'vete_leger', text: 'Vêtements légers (coton/lin)' },
            { id: 'pull', text: 'Un pull léger (soirées/avion)' },
            { id: 'chaussure', text: 'Chaussures de marche confortables' },
            { id: 'maillot', text: 'Maillot de bain & Serviette' },
            { id: 'pharmacie', text: 'Trousse à pharmacie (base + antipalu)' },
            { id: 'moustique', text: 'Répulsif moustique (Zone Tropiques)' },
            { id: 'creme', text: 'Crème solaire (SPF 50)' },
            { id: 'lunettes', text: 'Lunettes de soleil & Chapeau' },
            { id: 'adaptateur', text: 'Adaptateur universel (optionnel)' },
            { id: 'batterie', text: 'Batterie externe (Powerbank)' },
            { id: 'lampe', text: 'Lampe torche / Frontale (coupures)' }
        ];

        // Load LocalStorage
        try {
            if (typeof localStorage !== 'undefined') {
                window.currentTheme = localStorage.getItem('theme') || 'light';
                window.exchangeRate = parseFloat(localStorage.getItem('exchangeRate')) || 4250;
                window.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                window.checklist = JSON.parse(localStorage.getItem('checklist')) || [];
            }
        } catch (e) {
            console.warn("LS Error", e);
        }

        resolve();
    });
};

/* ============================================
   2. THEME & UTILS
   ============================================ */
window.initTheme = function () {
    console.log("🌓 Init Theme v2 (Robust)...");
    const themeBtn = document.getElementById('theme-toggle') ||
        document.getElementById('themeToggle') ||
        document.querySelector('.theme-toggle');

    if (themeBtn) {
        // Clone to remove old listeners if any (optional but safer for re-init)
        const newBtn = themeBtn.cloneNode(true);
        themeBtn.parentNode.replaceChild(newBtn, themeBtn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleTheme();
        });
        console.log("✅ Theme Button Connected.");
    } else {
        console.warn("❌ Theme Button NOT found.");
    }

    // Initial Load
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

    window.applyTheme();
};

window.toggleTheme = function () {
    window.currentTheme = window.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', window.currentTheme);
    window.applyTheme();
};

window.applyTheme = function () {
    const theme = window.currentTheme;
    const body = document.body;
    const docEl = document.documentElement;

    // 1. Attribute for Variable Scoping
    docEl.setAttribute('data-theme', theme);

    // 2. Classes for Specific Overrides
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        docEl.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        docEl.classList.remove('dark-mode');
    }

    // 3. Update Icon
    const themeBtn = document.getElementById('theme-toggle') ||
        document.getElementById('themeToggle') ||
        document.querySelector('.theme-toggle');

    if (themeBtn) {
        themeBtn.innerHTML = theme === 'light'
            ? '<i class="fas fa-moon"></i>' // Lune pour aller vers la nuit
            : '<i class="fas fa-sun"></i>'; // Soleil pour aller vers le jour
    }
};

window.isFavorite = function (id) {
    return window.favorites.includes(id);
};

window.toggleLieuFavorite = function (id, btn, event) {
    if (event) event.stopPropagation();
    const index = window.favorites.indexOf(id);
    if (index === -1) {
        window.favorites.push(id);
        if (btn) btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
        if (btn) btn.classList.add('active');
        if (navigator.vibrate) navigator.vibrate(10); // Haptic
    } else {
        window.favorites.splice(index, 1);
        if (btn) btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
        if (btn) btn.classList.remove('active');
    }
    localStorage.setItem('favorites', JSON.stringify(window.favorites));
};

/* ============================================
   3. NAVIGATION & UI CORE
   ============================================ */

window.navigateToHomeDestinations = function () {
    console.log("🔄 Navigation Fluide: Retour Destinations...");

    // 1. Hide all sections (Manual Toggle to avoid ScrollTo(0,0))
    document.querySelectorAll('.page-section').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
        const vid = el.querySelector('video');
        if (vid) vid.pause();
    });

    // 2. Show Home
    const home = document.getElementById('page-accueil');
    if (home) {
        home.style.display = 'block';
        home.classList.add('active');

        // 3. Fluid scroll to anchor
        // Small delay to ensure layout is painted
        setTimeout(() => {
            const target = document.getElementById('home-destinations');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 10);
    }

    // 4. Update Nav State
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const homeBtn = document.querySelector('.nav-btn[data-page="accueil"]');
    if (homeBtn) homeBtn.classList.add('active');
}

window.initNavigation = function () {
    const navBtns = document.querySelectorAll('.nav-btn');
    const shortcuts = document.querySelectorAll('.shortcut-card');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateToPage(page);
        });
    });

    shortcuts.forEach(card => {
        card.addEventListener('click', () => {
            const page = card.dataset.goto;
            navigateToPage(page);
        });
    });
}

// Global Context Tracker
window.previousPageContext = null;

window.navigateToPage = function (pageName) {
    if (!pageName) return;

    let targetId = pageName;
    if (!targetId.startsWith('page-')) targetId = 'page-' + pageName;

    // --- CONTEXT TRACKING START ---
    // Capture CURRENT active page before switching
    const currentSection = document.querySelector('.page-section.active');
    if (currentSection) {
        const currentId = currentSection.id;
        // Only track if coming FROM a Province page (not Carte, not Accueil)
        // Exception: If we are already on Carte, don't overwrite context
        if (currentId !== 'page-carte' && currentId !== 'page-accueil' && currentId.startsWith('page-')) {
            window.previousPageContext = currentId;
        } else if (currentId === 'page-accueil') {
            // Reset if coming from Home
            window.previousPageContext = null;
        }
    }
    // --- CONTEXT TRACKING END ---

    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
        // Stop videos if any
        const video = section.querySelector('video');
        if (video) video.pause();
    });

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const newSection = document.getElementById(targetId);
    if (newSection) {
        newSection.style.display = 'block';
        newSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (pageName === 'carte') { // Logic for Map Page
            if (window.leafletMap) {
                setTimeout(() => { if (window.leafletMap) window.leafletMap.invalidateSize(); }, 300);
            }

            // SHOW BACK BUTTON IF CONTEXT EXISTS
            const btnContainer = document.getElementById('btn-back-context-container');
            const btnLabel = document.getElementById('btn-back-context-label');

            if (window.previousPageContext && btnContainer && btnLabel) {
                // Determine Label
                let niceName = "Province";
                if (window.previousPageContext.includes('antsiranana')) niceName = "Diego";
                else if (window.previousPageContext.includes('nosybe')) niceName = "Nosy Be";
                else if (window.previousPageContext.includes('mahajanga')) niceName = "Majunga";
                else if (window.previousPageContext.includes('toamasina')) niceName = "Tamatave";
                else if (window.previousPageContext.includes('toliara')) niceName = "Tuléar";
                else if (window.previousPageContext.includes('fianarantsoa')) niceName = "Fianar";
                else if (window.previousPageContext.includes('antananarivo')) niceName = "Tana";
                else if (window.previousPageContext.includes('saintemarie')) niceName = "Ste Marie";

                btnLabel.innerText = `Retour à ${niceName}`;
                btnContainer.style.display = 'block';
            } else if (btnContainer) {
                btnContainer.style.display = 'none';
            }

        } else {
            // If navigating away from map to anything else (except via back), reset context? 
            // Actually, navigateToPage is called by menu too.
            // If I click "Accueil" from Map, context should probably clear or just be ignored next time.
        }

        // GSAP: Refresh animations for new page content
        setTimeout(() => {
            if (window.GasikaraAnimations) {
                window.GasikaraAnimations.refresh();
            }
        }, 100);

        // SPECIAL NORD LOGIC RE-TRIGGER
        // ⚡ FORCE PREMIUM ENGINE TRIGGER (Mirroring Diego & Nosy Be)
        if (targetId.toLowerCase().includes('antsiranana') || targetId.toLowerCase().includes('diego')) {
            setTimeout(() => { if (window.filterProvinceItems) window.filterProvinceItems('all', 'Antsiranana'); }, 50);
        }
        if (targetId.toLowerCase().includes('nosybe') || targetId.toLowerCase().includes('nosy-be')) {
            setTimeout(() => { if (window.filterProvinceItems) window.filterProvinceItems('all', 'Nosy Be'); }, 50);
        }
        if (targetId.toLowerCase().includes('mahajanga') || targetId.toLowerCase().includes('majunga')) {
            setTimeout(() => { if (window.filterProvinceItems) window.filterProvinceItems('all', 'Mahajanga'); }, 50);
        }
        if (targetId.toLowerCase().includes('toliara') || targetId.toLowerCase().includes('tulear')) {
            setTimeout(() => { if (window.filterProvinceItems) window.filterProvinceItems('all', 'Toliara'); }, 50);
        }
        if (targetId.toLowerCase().includes('toamasina') || targetId.toLowerCase().includes('tamatave')) {
            setTimeout(() => { if (window.filterProvinceItems) window.filterProvinceItems('all', 'Toamasina'); }, 50);
        }
    }

    const rawName = pageName.replace('page-', '');
    const activeBtn = document.querySelector(`.nav-btn[data-page="${rawName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        setTimeout(() => activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
    }
};

// Implement Back Navigation Function
window.navigateBack = function () {
    if (window.previousPageContext) {
        // Strip 'page-' to get the clean name for navigateToPage
        const rawPage = window.previousPageContext.replace('page-', '');
        window.navigateToPage(rawPage);
    } else {
        window.navigateToPage('accueil');
    }
};
// Alias
window.showSection = window.navigateToPage;

/* ============================================
   3. CIRCUITS & TIMELINE (RESTORED PREMIUM)
   ============================================ */

window.initItinerariesPage = function () {
    const container = document.getElementById('itineraires-list');
    if (!container) return;
    const circuits = window.ITINERAIRES_DATA ? Object.values(window.ITINERAIRES_DATA) : [];

    container.innerHTML = circuits.map((c, i) => `
        <div class="lieu-card fade-in-up hover-lift" onclick="showItineraryDetail('${c.id}')" style="cursor:pointer; animation-delay: ${i * 0.1}s;">
             <div class="lieu-image" style="${c.image ? `background-image: url('${c.image}'); background-size: cover; background-position: center;` : `background: linear-gradient(to bottom right, var(--laterite), var(--foret)); display:flex; align-items:center; justify-content:center; color:white; font-size:3rem;`}">
                ${!c.image ? '<i class="fas fa-route"></i>' : ''}
             </div>
             <div class="lieu-content">
                <h3 class="lieu-title">${c.nom}</h3>
                <div class="lieu-meta"><span class="badge-type">${c.duree}</span><span class="lieu-prix">${c.budget || 'Variable'}</span></div>
                <p class="lieu-desc">${c.description}</p>
                <button class="btn-details">Voir le programme</button>
             </div>
        </div>
    `).join('');
}

window.showItineraryDetail = function (id) {
    const list = document.getElementById('itineraires-list');
    const detail = document.getElementById('itineraire-detail');
    const content = document.getElementById('itineraire-content');
    const mainBanner = document.querySelector('#page-itineraires > .premium-banner-tout');

    const circuits = window.ITINERAIRES_DATA || {};
    let circuit = Object.values(circuits).find(c => c.id === id);
    if (!circuit) return;

    // View toggle
    list.style.display = 'none';
    if (mainBanner) mainBanner.style.display = 'none';
    detail.style.display = 'block';

    // 1. BANNER & HEADER
    let html = `
        <div class="circuit-detail-banner city-header" style="background-image: url('${circuit.image}');">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <h2 class="city-title" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${circuit.nom}</h2>
                <p class="city-desc" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3); opacity: 0.9;">${circuit.description}</p>
            </div>
            <button onclick="backToItineraries()" class="btn-back-floating"><i class="fas fa-arrow-left"></i></button>
        </div>

        <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
            <!-- META INFO -->
            <div style="display:flex; gap:15px; margin-bottom:25px; flex-wrap:wrap; justify-content: center;">
                <span class="meta-tag"><i class="far fa-clock"></i> ${circuit.duree}</span>
                <span class="meta-tag"><i class="fas fa-shield-alt"></i> Sécurité: ${circuit.infos.securite_level}</span>
                <span class="meta-tag"><i class="fas fa-sun"></i> ${(circuit.logistique_generale || {}).saison_ideale || 'Toute année'}</span>
            </div>

            <!-- LE MOT DU GUIDE (COLLAPSIBLE) -->
            <div class="logistique-container" style="margin-top:0;">
                <div class="logistique-header" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('.fa-chevron-down').classList.toggle('fa-chevron-up');">
                    <h3><i class="fas fa-signature"></i> Le Mot du Guide</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="logistique-content active">
                     <p class="logistique-text">"${circuit.infos.description_fun}"</p>
                     <div style="margin-top:15px; border-top:1px dashed rgba(0,0,0,0.1); padding-top:10px;">
                         <div style="margin-bottom:6px;"><strong><i class="fas fa-road"></i> Route:</strong> ${(circuit.logistique_generale || {}).route_etat || 'Variable'}</div>
                         <div><strong><i class="fas fa-car-side"></i> Véhicule:</strong> ${(circuit.logistique_generale || {}).vehicule_conseil || '4x4 Recommandé'}</div>
                     </div>
                </div>
            </div>

            <!-- BUDGET SELECTOR -->
            ${circuit.budgets ? `
            <h3 style="margin-top:30px; margin-bottom:15px; font-family:var(--font-display);">Options de Voyage</h3>
            <div class="budget-selector">
                <div id="budget-btn-eco" class="budget-option" onclick="switchCircuitBudget('${id}', 'eco')">
                    <span class="budget-label">Eco / Backpacker</span>
                </div>
                <div id="budget-btn-standard" class="budget-option active" onclick="switchCircuitBudget('${id}', 'standard')">
                    <span class="budget-label">Confort Standard</span>
                </div>
                <div id="budget-btn-premium" class="budget-option" onclick="switchCircuitBudget('${id}', 'premium')">
                    <span class="budget-label">Luxe Premium</span>
                </div>
            </div>
            <div style="background:var(--bg-secondary); padding:20px; border-radius:12px; border:1px solid var(--border-color); box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span id="budget-price-display" class="budget-price" style="font-size:2rem; color:var(--laterite); font-weight:800;">${(circuit.budgets.standard || {}).price || '-'}</span>
                    <span style="font-size:0.9rem; color:var(--text-secondary);">/ personne (base 2)</span>
                </div>
                <p id="budget-desc-display" style="margin-bottom:15px; color:var(--text-primary); font-size:1.05rem;">${(circuit.budgets.standard || {}).desc || ''}</p>
                <ul id="budget-inclusions" style="list-style:none; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.9rem;">
                    ${(circuit.budgets.standard && circuit.budgets.standard.inclus ? circuit.budgets.standard.inclus.map(item => `<li><i class="fas fa-check" style="color:var(--success);"></i> ${item}</li>`).join('') : '')}
                </ul>
            </div>
            ` : ''}

            <!-- TIMELINE (CORE) -->
            <h3 style="margin-top:40px; margin-bottom:20px; font-family:var(--font-display);">Programme Détaillé</h3>
            <div class="timeline-container">
    `;

    // 2. TIMELINE STEPS GENERATION
    if (circuit.etapes) {
        circuit.etapes.forEach(step => {
            // Logic Bar
            let logicBarHtml = '';
            if (step.logistique) {
                logicBarHtml = `
                    <div class="logic-bar">
                        <div class="logic-point start"><span class="logic-label">Départ</span><span class="logic-val">${step.logistique.depart || ''}</span></div>
                        <div class="logic-arrow"><i class="fas fa-arrow-right"></i><span class="logic-dist">${step.logistique.duree_totale_transport || ''}</span></div>
                        <div class="logic-point end"><span class="logic-label">Arrivée</span><span class="logic-val">${step.logistique.arrivee || ''}</span></div>
                    </div>`;
            }

            // Transports
            let transportHtml = '';
            if (step.transports_details) {
                transportHtml = '<div class="transport-detail-row">';
                step.transports_details.forEach(t => {
                    let icon = 'fa-car';
                    if (t.type.toLowerCase().includes('bateau')) icon = 'fa-ship';
                    if (t.type.toLowerCase().includes('marche')) icon = 'fa-hiking';
                    if (t.type.toLowerCase().includes('avion')) icon = 'fa-plane';
                    transportHtml += `<div class="transport-pill"><i class="fas ${icon}"></i> <span>${t.type} (${t.duree})</span></div>`;
                });
                transportHtml += '</div>';
            }

            // Accomodations Grid
            let accomHtml = '';
            if (step.hebergement_options) {
                accomHtml = window.getAccomGridHtml(step.hebergement_options);
            }

            // Step HTML
            html += `
                <div class="timeline-step">
                    <div class="timeline-marker"></div>
                    <div class="timeline-header">
                        <span class="timeline-day">Jour ${step.jour}</span>
                        <h4 class="timeline-title">${step.titre}</h4>
                    </div>
                    
                    ${logicBarHtml}
                    
                    <div class="timeline-content expert-desc">
                        ${step.description_expert || step.description}
                    </div>
                    
                    <!-- IMANQUABLES -->
                    ${step.incontournables ? `
                        <div class="step-section-title"><i class="fas fa-eye"></i> Les Immanquables</div>
                        <div class="incontournables-tags">
                            ${step.incontournables.map(i => {
                if (typeof i === 'object' && i.id) return `<span class="visi-tag clickable" onclick="window.showLieuDetailsByID(${i.id})"><i class="fas fa-eye"></i> ${i.label || i.nom}</span>`;
                return `<span class="visi-tag">${i}</span>`;
            }).join('')}
                        </div>
                    ` : ''}

                    ${transportHtml}

                    <!-- ACCORDEONS (DODO, MIAM, TIPS) -->
                    <div style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">
                        ${step.hebergement_options ? `
                        <div class="step-accordion">
                            <div class="step-accordion-header" onclick="window.toggleStepAccordion(this)">
                                <div class="step-accordion-title">
                                    <span><i class="fas fa-bed"></i> Où poser ses valises ?</span>
                                    <span class="preview-text">${window.getAccomPreviewText(step.hebergement_options)}</span>
                                </div>
                                <i class="fas fa-chevron-down Chevron"></i>
                            </div>
                            <div class="step-accordion-body">${accomHtml}</div>
                        </div>` : ''}

                        ${step.gourmandise ? `
                        <div class="step-accordion culinary">
                            <div class="step-accordion-header" onclick="window.toggleStepAccordion(this)">
                                <div class="step-accordion-title"><span><i class="fas fa-utensils"></i> Instant Gourmand</span></div>
                                <i class="fas fa-chevron-down Chevron"></i>
                            </div>
                            <div class="step-accordion-body"><div class="accordion-inner-content" style="padding:15px;">${step.gourmandise}</div></div>
                        </div>` : ''}

                        ${step.astuce ? `
                        <div class="step-accordion astuce">
                            <div class="step-accordion-header" onclick="window.toggleStepAccordion(this)">
                                <div class="step-accordion-title"><span><i class="fas fa-lightbulb"></i> Le Conseil Expert</span></div>
                                <i class="fas fa-chevron-down Chevron"></i>
                            </div>
                            <div class="step-accordion-body"><div class="accordion-inner-content" style="padding:15px;">${step.astuce}</div></div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        });
    }

    html += `</div></div>`; // End container
    content.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.backToItineraries = function () {
    document.getElementById('itineraires-list').style.display = 'grid';
    document.getElementById('itineraire-detail').style.display = 'none';
    const mainBanner = document.querySelector('#page-itineraires > .premium-banner-tout');
    if (mainBanner) mainBanner.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helpers Timeline
window.toggleStepAccordion = function (header) {
    header.parentElement.classList.toggle('open');
};

window.getAccomPreviewText = function (options) {
    if (!options) return '';
    if (typeof options === 'object' && !Array.isArray(options)) {
        let names = [];
        for (const [k, v] of Object.entries(options)) {
            let n = (typeof v === 'object' && v.text) ? v.text : v;
            names.push(n.split('(')[0].trim());
        }
        return names.join(' • ');
    }
    return 'Voir les options';
};

window.getAccomGridHtml = function (options) {
    if (!options) return '';
    let html = '<div class="accom-grid">';
    if (typeof options === 'object' && !Array.isArray(options)) {
        for (const [key, val] of Object.entries(options)) {
            let icon = key === 'premium' ? 'fa-gem' : (key === 'standard' ? 'fa-hotel' : 'fa-campground');
            let label = key === 'premium' ? 'Luxe' : (key === 'standard' ? 'Confort' : 'Eco');
            let name = val;
            let clickAttr = '';
            let classExtra = '';
            if (typeof val === 'object' && val.id) {
                name = val.text;
                clickAttr = `onclick="window.showLieuDetailsByID(${val.id})"`;
                classExtra = 'clickable-card';
            }
            html += `
                <div class="accom-card ${key} ${classExtra}" ${clickAttr}>
                    <div class="accom-icon"><i class="fas ${icon}"></i></div>
                    <div class="accom-info"><span class="accom-cat">${label}</span><span class="accom-name">${name}</span></div>
                </div>`;
        }
    }
    html += '</div>';
    return html;
};

window.switchCircuitBudget = function (circuitId, level) {
    const circuit = Object.values(window.ITINERAIRES_DATA).find(c => c.id === circuitId);
    if (!circuit || !circuit.budgets || !circuit.budgets[level]) return;

    document.querySelectorAll('.budget-option').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById(`budget-btn-${level}`);
    if (btn) btn.classList.add('active');

    const data = circuit.budgets[level];
    const priceDisplay = document.getElementById('budget-price-display');
    const descDisplay = document.getElementById('budget-desc-display');
    const incDisplay = document.getElementById('budget-inclusions');

    if (priceDisplay) priceDisplay.textContent = data.price;
    if (descDisplay) descDisplay.textContent = data.desc;
    if (incDisplay && data.inclus) {
        incDisplay.innerHTML = data.inclus.map(item => `<li><i class="fas fa-check" style="color:var(--success);"></i> ${item}</li>`).join('');
    }
}

window.showLieuDetailsByID = function (id) {
    const lieu = window.LIEUX_DATA.find(l => l.id == id);
    if (lieu) {
        openLieuModal(lieu);
    } else {
        console.warn("Lieu not found for ID:", id);
    }
}

/* ============================================
   4. OUTILS (TAXI & CHECKLIST)
   ============================================ */

window.initOutilsPage = function () {
    initTaxiTool();
    initChecklist(); // New persistent checklist

    // Currency Converter
    const amountInput = document.getElementById('amountInput');
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('convertedResult');
    const rateInput = document.getElementById('exchangeRateInput');

    if (rateInput) rateInput.value = window.exchangeRate;

    if (convertBtn && amountInput && resultDiv) {
        convertBtn.addEventListener('click', () => {
            const ariary = parseFloat(amountInput.value);
            const rate = parseFloat(rateInput ? rateInput.value : window.exchangeRate);
            if (!isNaN(ariary) && !isNaN(rate)) {
                window.exchangeRate = rate;
                localStorage.setItem('exchangeRate', rate);
                const euros = (ariary / rate).toFixed(2);
                resultDiv.textContent = `${ariary.toLocaleString()} Ar ≈ ${euros} €`;
                resultDiv.style.color = 'var(--text-primary)';
            }
        });
    }
}

function initTaxiTool() {
    const btnCalcTaxi = document.getElementById('btnCalcTaxi');
    const selFrom = document.getElementById('taxiFrom');
    const selTo = document.getElementById('taxiTo');
    const resultDiv = document.getElementById('taxiResult');

    // Populate Selects
    const cities = ["Antananarivo", "Diego-Suarez", "Mahajanga", "Toamasina", "Fianarantsoa", "Toliara", "Nosy Be", "Ambanja", "Antsirabe"];
    if (selFrom && selTo) {
        const opts = cities.map(c => `<option value="${c}">${c}</option>`).join('');
        selFrom.innerHTML = opts;
        selTo.innerHTML = opts;
        selTo.value = "Diego-Suarez"; // default
    }

    if (btnCalcTaxi && selFrom && selTo && resultDiv) {
        btnCalcTaxi.addEventListener('click', () => {
            const from = selFrom.value;
            const to = selTo.value;

            if (from === to) {
                resultDiv.innerHTML = "<p style='color:red; text-align:center;'>Tu es déjà arrivé ! Choisis une autre destination. 😂</p>";
                resultDiv.classList.remove('hidden');
                return;
            }

            // Humor (Grok Style)
            const remarks = [
                "Zay ! Tu es pressé ou tu veux admirer le paysage ?",
                "En Taxi-Brousse, le temps est une notion abstraite... 😂",
                "Prépare ta playlist, ça va être long (mais beau) !",
                "Astuce : Prends la place devant si tu tiens à tes genoux.",
                "Mora Mora... on arrive quand on arrive."
            ];
            const randomRemark = remarks[Math.floor(Math.random() * remarks.length)];

            // Mock Data
            let dist = Math.floor(Math.random() * 800) + 100;
            let hours = Math.floor(dist / 50);
            let price = dist * 100;

            resultDiv.innerHTML = `
                <div style="background:var(--bg-secondary); padding:10px; border-radius:8px; margin-bottom:15px; border-left:4px solid var(--laterite); font-style:italic;">
                    "${randomRemark}"
                </div>

                <div class="result-row">
                    <div class="result-item">
                        <span class="result-label">Durée Estimée</span>
                        <span class="result-value" id="resDuration">${hours}h ${Math.floor(Math.random() * 60)}min</span>
                    </div>
                </div>

                <div class="result-divider" style="height: 1px; background: rgba(0,0,0,0.1); margin: 15px 0;"></div>

                <div id="resPriceContainer" class="price-tiers-container">
                    <div class="price-tier">
                        <div class="price-tier-name">Taxi-Brousse</div>
                        <div class="price-tier-amount">${(price * 10).toLocaleString()} Ar</div>
                    </div>
                     <div class="price-tier featured">
                        <div class="price-tier-name">Cotisse / VIP</div>
                        <div class="price-tier-amount">${(price * 25).toLocaleString()} Ar</div>
                    </div>
                     <div class="price-tier">
                        <div class="price-tier-name">Location 4x4</div>
                        <div class="price-tier-amount">${(price * 150).toLocaleString()} Ar</div>
                    </div>
                </div>

                <div class="mt-20">
                    <span class="result-note">⚠️ Tarifs indicatifs (Lite / Premium / VIP)</span>
                </div>

                <div id="companiesSection" class="companies-section">
                    <h4 style="font-family: 'Playfair Display', serif; color: var(--text-primary); margin-bottom: 15px;">Compagnies Recommandées</h4>
                    <div id="companiesList" class="companies-list">
                        <div class="company-card">
                            <div class="company-logo">🚐</div>
                            <div><strong>Cotisse Transport</strong><br><span style="font-size:0.8rem; color:#666;">Premium & Wi-Fi</span></div>
                        </div>
                        <div class="company-card">
                            <div class="company-logo">🚌</div>
                            <div><strong>Kofmad</strong><br><span style="font-size:0.8rem; color:#666;">Fiable & Rapide</span></div>
                        </div>
                    </div>
                </div>
            `;

            resultDiv.classList.remove('hidden');
        });
    }
}

function initChecklist() {
    const listContainer = document.getElementById('checklistContainer');
    if (!listContainer || !window.CHECKLIST_ITEMS) return;

    function renderChecklist() {
        listContainer.innerHTML = window.CHECKLIST_ITEMS.map(item => {
            const isChecked = window.checklist.includes(item.id);
            return `
                <div class="checklist-item ${isChecked ? 'completed' : ''}" onclick="toggleCheckItem('${item.id}')">
                    <i class="fas ${isChecked ? 'fa-check-circle' : 'fa-circle'}" style="color:${isChecked ? 'var(--success)' : '#ccc'}"></i>
                    <span>${item.text}</span>
                </div>
            `;
        }).join('');
    }
    renderChecklist();
    window.renderChecklist = renderChecklist; // export
}

window.toggleCheckItem = function (id) {
    const idx = window.checklist.indexOf(id);
    if (idx === -1) {
        window.checklist.push(id);
        // Haptic feedback if supported
        if (navigator.vibrate) navigator.vibrate(10);
    } else {
        window.checklist.splice(idx, 1);
    }
    localStorage.setItem('checklist', JSON.stringify(window.checklist));
    if (window.renderChecklist) window.renderChecklist();
}


/* ============================================
   5. LANGUE & TTS (RESTORED)
   ============================================ */

// ============================================
// 5. LANGUE & TTS (RESTORED w/ PREMIUM DROPDOWN)
// ============================================

window.initLanguePage = function () {
    const container = document.getElementById('accordionContainer');
    if (!container || !window.PHRASES_DATA) return;

    // Clear container
    container.innerHTML = '';

    // Create Search Bar with Dropdown Container
    const searchHtml = `
        <div class="search-container-2026" style="margin-bottom: 30px;">
            <div class="search-wrapper-2026">
                <i class="fas fa-search search-icon-left"></i>
                <input type="text" id="langSearch" class="search-input-2026" autocomplete="off" 
                       placeholder="Rechercher une expression (ex: Bonjour, Eau...)" 
                       oninput="filterLanguages(this.value)" 
                       onfocus="filterLanguages(this.value)">
                
                <!-- DROPDOWN RESULTS CONTAINER -->
                <div id="langSearchResults" class="search-results-2026"></div>
            </div>
        </div>
    `;
    container.innerHTML = searchHtml;

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const wrapper = document.querySelector('.search-wrapper-2026');
        const dropdown = document.getElementById('langSearchResults');
        if (wrapper && !wrapper.contains(e.target) && dropdown) {
            dropdown.classList.remove('active');
        }
    });

    // Create Categories Container
    const gridContainer = document.createElement('div');
    gridContainer.id = 'langGridContainer';
    gridContainer.className = 'lang-sections-wrapper';
    container.appendChild(gridContainer);

    let html = '';

    // Normalize Data pairs
    let dataEntries = [];
    if (Array.isArray(window.PHRASES_DATA)) {
        dataEntries = window.PHRASES_DATA;
    } else {
        dataEntries = Object.entries(window.PHRASES_DATA);
    }

    dataEntries.forEach(([cat, phrases]) => {
        html += `
            <div class="accordion-item-2026">
                <div class="accordion-header-2026" onclick="this.parentElement.classList.toggle('active')">
                    <span class="accordion-title-2026">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                
                <div class="accordion-content-2026">
                   <div class="accordion-inner-padding">
                        <div class="language-grid-2026">
                            ${phrases.map((p, index) => {
            const uniqueId = `btn-audio-${cat.replace(/\s+/g, '-')}-${index}`;
            const audioFile = p.audio || '';
            const safeAudio = audioFile.replace(/'/g, "\\'");

            return `
                                <div class="language-card-2026" onclick="playAudio('${safeAudio}', '${uniqueId}')">
                                    <div class="language-content">
                                        <div class="lang-fr">${p.fr || p.francais}</div>
                                        <div class="lang-phonetic">${p.phonetic || ''}</div>
                                        <div class="lang-mg">${p.mg || p.malgache}</div>
                                    </div>
                                    <div id="${uniqueId}" class="btn-play-audio-2026">
                                        <i class="fas fa-play"></i>
                                    </div>
                                </div>`;
        }).join('')}
                        </div>
                   </div>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = html;
}

// Global filter function (Dropdown Logic)
window.filterLanguages = function (query) {
    const term = query.toLowerCase().trim();
    const dropdown = document.getElementById('langSearchResults');
    if (!dropdown) return;

    if (!term) {
        dropdown.classList.remove('active');
        return;
    }

    // Flatten Search
    let allPhrases = [];
    Object.entries(window.PHRASES_DATA).forEach(([cat, phrases]) => {
        phrases.forEach((p, idx) => {
            allPhrases.push({ ...p, cat, idx });
        });
    });

    const matches = allPhrases.filter(p => {
        return (p.fr && p.fr.toLowerCase().includes(term)) ||
            (p.mg && p.mg.toLowerCase().includes(term));
    });

    if (matches.length === 0) {
        dropdown.innerHTML = `
            <div class="search-result-item" style="cursor:default;">
                <div class="search-result-info">
                    <h4 style="color:white;">Aucun résultat</h4>
                    <p>Essayez un autre mot...</p>
                </div>
            </div>`;
    } else {
        dropdown.innerHTML = matches.map(p => {
            const uniqueId = `search-drop-${p.idx}`;
            const audioFile = p.audio || '';
            const safeAudio = audioFile.replace(/'/g, "\\'");

            // Use item styling similar to Home search but adapted for Audio
            return `
                <div class="search-result-item" onclick="playAudio('${safeAudio}', '${uniqueId}'); event.stopPropagation();">
                    <div class="search-result-thumb" style="background:var(--laterite-2026); display:flex; align-items:center; justify-content:center;">
                        <i class="fas fa-volume-up" style="color:white;"></i>
                    </div>
                    <div class="search-result-info">
                        <h4 style="color:white;">${p.fr || p.francais}</h4>
                        <p style="color:#ccc;">${p.mg || p.malgache} <span style="font-size:0.75em; opacity:0.6">(${p.cat})</span></p>
                    </div>
                    <div id="${uniqueId}" style="margin-left:auto; color:var(--laterite-2026);">
                        <i class="fas fa-play-circle" style="font-size:1.5rem;"></i>
                    </div>
                </div>`;
        }).join('');
    }

    dropdown.classList.add('active');
}

// Global Audio State
window.currentAudio = null;
window.currentBtnId = null;

window.playAudio = function (filename, btnId) {
    if (!filename) {
        alert("Audio indisponible.");
        return;
    }

    // Stop currently playing
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.currentTime = 0;

        // Reset previous UI
        if (window.currentBtnId) {
            const prevBtns = document.querySelectorAll(`[id="${window.currentBtnId}"]`);
            prevBtns.forEach(btn => {
                if (btn.classList.contains('btn-play-audio-2026')) {
                    btn.classList.remove('playing');
                    btn.innerHTML = '<i class="fas fa-play"></i>';
                } else {
                    // Dropdown icon reset
                    btn.innerHTML = '<i class="fas fa-play-circle" style="font-size:1.5rem;"></i>';
                }
            });
        }
    }

    const audioPath = `audio/${filename}`;
    const audio = new Audio(audioPath);

    // UI Update for CURRENT target
    const clickedBtn = document.getElementById(btnId);
    if (clickedBtn) {
        if (clickedBtn.classList.contains('btn-play-audio-2026')) {
            clickedBtn.classList.add('playing');
            clickedBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            // Dropdown style
            clickedBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>';
        }
    }

    audio.play().then(() => {
        // Playing
        if (clickedBtn && !clickedBtn.classList.contains('btn-play-audio-2026')) {
            clickedBtn.innerHTML = '<i class="fas fa-stop-circle" style="font-size:1.5rem;"></i>';
        }
    }).catch(e => {
        console.error("Audio error", e);
        if (clickedBtn) {
            clickedBtn.classList.remove('playing');
            clickedBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        }
    });

    audio.onended = function () {
        if (clickedBtn) {
            if (clickedBtn.classList.contains('btn-play-audio-2026')) {
                clickedBtn.classList.remove('playing');
                clickedBtn.innerHTML = '<i class="fas fa-play"></i>';
            } else {
                clickedBtn.innerHTML = '<i class="fas fa-play-circle" style="font-size:1.5rem;"></i>';
            }
        }
        window.currentAudio = null;
        window.currentBtnId = null;
    };

    window.currentAudio = audio;
    window.currentBtnId = btnId;
}


/* ============================================
   X. CIRCUITS & ITINERAIRES (RESTORED)
   ============================================ */
/* ============================================
   X. CIRCUITS & ITINERAIRES (RESTORED & ENHANCED)
   ============================================ */
window.initItinerariesPage = function () {
    const listContainer = document.getElementById('itineraires-list');
    if (!listContainer) return;

    if (!window.ITINERAIRES_DATA) {
        listContainer.innerHTML = '<p style="padding:20px; text-align:center;">Chargement des circuits...</p>';
        return;
    }

    // Always convert to array for consistent indexing
    const itineraries = Array.isArray(window.ITINERAIRES_DATA) ? window.ITINERAIRES_DATA : Object.values(window.ITINERAIRES_DATA);

    listContainer.innerHTML = itineraries.map((itin, index) => {
        // Safe Property Access
        const title = itin.nom || itin.titre || 'Circuit Inconnu';
        // Get generic price or range
        const price = itin.budgets && itin.budgets.standard ? itin.budgets.standard.price : (itin.budget || 'Sur devis');
        // Image Fallback
        const img = itin.image || 'images/placeholders/default.jpg';

        return `
        <article class="lieu-card" onclick="showItineraryDetails(${index})" style="cursor: pointer;">
            <div class="lieu-image" style="height:200px; position:relative;">
                <img src="${img}" alt="${title}" 
                     style="width:100%; height:100%; object-fit:cover;"
                     onerror="this.src='images/placeholders/default.jpg'">
                <div class="lieu-badge" style="position:absolute; bottom:10px; left:10px; background:var(--laterite); color:white; padding:4px 12px; border-radius:4px; font-weight:bold;">
                    ${itin.duree}
                </div>
            </div>
            <div class="lieu-content" style="padding:15px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <h3 style="margin:0; font-size:1.1rem; color:var(--text-primary); font-family:var(--font-display);">${title}</h3>
                    <span style="background:var(--bg-secondary); padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:600;">${price}</span>
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${itin.description}
                </p>
                <button class="btn-action-primary" style="width:100%;">Voir le détail</button>
            </div>
        </article>
        `;
    }).join('');
};

window.showItineraryDetails = function (index) {
    // Critical: Re-derive array to match the index passed from initItinerariesPage
    const itineraries = Array.isArray(window.ITINERAIRES_DATA) ? window.ITINERAIRES_DATA : Object.values(window.ITINERAIRES_DATA);
    const itin = itineraries[index];

    if (!itin) {
        console.error("Itinerary not found for index:", index);
        return;
    }

    const list = document.getElementById('itineraires-list');
    const detail = document.getElementById('itineraire-detail');
    const content = document.getElementById('itineraire-content');

    if (!list || !detail || !content) return;

    // Safe Data Extraction
    const title = itin.nom || itin.titre || 'Détails du Circuit';
    const price = itin.budgets && itin.budgets.standard ? itin.budgets.standard.price : (itin.budget || 'Sur devis');
    const descFull = itin.description_full || itin.description;

    // Logistique Data (FAQ)
    const logistique = itin.logistique_generale || {};
    const infos = itin.infos || {};

    // 1. Build Stages Accordion (Premium Timeline Style)
    let stagesHtml = '<div class="timeline-container">';
    let routePoints = []; // For the map (unused now but kept for safety if ref needed later, or remove)

    // Note: Old routePoints map removed in favor of visual timeline

    if (itin.etapes && Array.isArray(itin.etapes)) {
        stagesHtml += itin.etapes.map((step, dayIdx) => {
            const stepTitle = typeof step === 'string' ? step : (step.titre || `Jour ${step.jour}`);
            const stepDesc = typeof step === 'string' ? '' : (step.description_expert || step.description || ''); // Prefer Expert Desc
            const stepLogistique = (typeof step === 'object' && step.logistique) ? step.logistique : null;

            // Image Lookup for Thumbnail & Content
            let stepImage = 'images/placeholders/default.jpg';
            let firstLieuId = null;
            let locationName = "Voir Lieu";

            if (typeof step === 'object' && step.lieux_ids && step.lieux_ids.length > 0) {
                firstLieuId = step.lieux_ids[0];
                // Ensure LIEUX_DATA is available
                const allLieux = window.LIEUX_DATA || [];
                const lieu = allLieux.find(l => l.id == firstLieuId); // Coercive check (string vs int)

                if (lieu) {
                    if (lieu.image) stepImage = lieu.image;
                    locationName = lieu.ville || lieu.nom;
                } else {
                    console.warn(`Itineraire Debug: Lieu ID ${firstLieuId} not found in LIEUX_DATA (${allLieux.length} items).`);
                }
            }

            // More details for Accordion Content
            let detailsHtml = '';
            if (stepLogistique) {
                detailsHtml += `<div style="margin-top:15px; font-size:0.85rem; color:var(--text-secondary); background:rgba(0,0,0,0.03); padding:12px; border-radius:8px;">
                     ${step.gourmandise ? `<div style="margin-bottom:6px; color:var(--laterite);"><i class="fas fa-utensils"></i> <strong>Gourmandise:</strong> ${step.gourmandise}</div>` : ''}
                    ${stepLogistique.depart ? `<div><strong><i class="fas fa-plane-departure"></i> Départ:</strong> ${stepLogistique.depart}</div>` : ''}
                    ${stepLogistique.arrivee ? `<div><strong><i class="fas fa-map-marker-alt"></i> Arrivée:</strong> ${stepLogistique.arrivee}</div>` : ''}
                    ${stepLogistique.duree_totale_transport ? `<div><strong><i class="fas fa-stopwatch"></i> Trajet:</strong> ${stepLogistique.duree_totale_transport}</div>` : ''}
                 </div>`;
            }
            if (typeof step === 'object' && step.hebergement_options) {
                const heb = step.hebergement_options;
                const hebText = typeof heb === 'string' ? heb : (heb.standard || heb.premium?.text || '');
                if (hebText) detailsHtml += `<div style="margin-top:8px; font-size:0.85rem; color:var(--text-primary);"><i class="fas fa-bed"></i> <strong>Dodo:</strong> ${hebText}</div>`;
            }

            // Image Click Handler (Safe)
            const imageClickAction = firstLieuId ? `onclick="event.stopPropagation(); window.showLieuDetailsByID(${firstLieuId})"` : '';
            const cardClickAction = firstLieuId ? `onclick="window.showLieuDetailsByID(${firstLieuId})"` : '';

            // Incontournables List
            let incHtml = '';
            if (step.incontournables && Array.isArray(step.incontournables)) {
                incHtml = `
                    <div style="margin-top:12px;">
                        <strong style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:var(--laterite);">À ne pas manquer:</strong>
                        <ul style="margin:5px 0 0 20px; font-size:0.9rem; color:var(--text-secondary);">
                            ${step.incontournables.map(i => `<li>${typeof i === 'string' ? i : i.label}</li>`).join('')}
                        </ul>
                    </div>`;
            }

            return `
            <div class="timeline-step">
                <div class="timeline-marker"></div>
                <div class="timeline-card">
                    <!-- HEADER -->
                    <div class="timeline-header" onclick="this.parentElement.parentElement.classList.toggle('active')">
                        <div class="timeline-day">J${step.jour || dayIdx + 1}</div>
                        <div class="timeline-title">${stepTitle}</div>
                        
                        <!-- Thumbnail (Clickable) -->
                        <div class="timeline-thumb-container" ${imageClickAction} title="Voir le lieu">
                            <img src="${stepImage}" class="timeline-thumb" alt="Etape" onerror="this.style.display='none'">
                        </div>
                        
                        <i class="fas fa-chevron-down timeline-chevron"></i>
                    </div>

                    <!-- CONTENT -->
                    <div class="timeline-content">
                        <div class="timeline-body">
                            <div class="timeline-body-text">
                                <p style="margin-bottom:10px; font-style:italic;">"${step.astuce || 'Profitez de cette étape...'}"</p>
                                <p style="margin-bottom:10px;">${stepDesc}</p>
                                ${incHtml}
                                ${detailsHtml}
                            </div>

                            <!-- Large Image (Clickable) -->
                            <div class="timeline-body-image-container" ${cardClickAction}>
                                <img src="${stepImage}" class="timeline-body-image" alt="Visualisation Etape" onerror="this.src='images/placeholders/default.jpg'">
                                <div class="timeline-body-image-overlay">
                                    <i class="fas fa-map-pin"></i> ${locationName}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');
        stagesHtml += '</div>'; // End container
    }

    // 2. Generate CSS Map (Timeline Style)
    // Redundant with new Timeline UI - ensuring clean state
    let mapHtml = '';
    // Legacy code removed


    // 3. Build FAQ / Accordion
    const faqHtml = `
        <div class="accordion-item-2026" style="margin-top:20px;">
           <div class="accordion-header-2026" onclick="this.parentElement.classList.toggle('active')">
               <span class="accordion-title-2026"><i class="fas fa-info-circle"></i> Infos Pratiques & FAQ</span>
               <i class="fas fa-chevron-down"></i>
           </div>
           <div class="accordion-content-2026">
                <div class="accordion-inner-padding">
                    <ul style="list-style:none; padding:0; margin:0;">
                         ${logistique.saison_ideale ? `<li style="margin-bottom:10px;"><strong><i class="fas fa-sun"></i> Saison Idéale:</strong> ${logistique.saison_ideale}</li>` : ''}
                        ${logistique.vehicule_conseil ? `<li style="margin-bottom:10px;"><strong><i class="fas fa-car-side"></i> Transport:</strong> ${logistique.vehicule_conseil}</li>` : ''}
                        ${logistique.route_etat ? `<li style="margin-bottom:10px;"><strong><i class="fas fa-road"></i> État de la route:</strong> ${logistique.route_etat}</li>` : ''}
                        ${infos.securite_level ? `<li style="margin-bottom:10px;"><strong><i class="fas fa-shield-alt"></i> Sécurité:</strong> ${infos.securite_level}</li>` : ''}
                        ${infos.description_fun ? `<li style="margin-top:15px; font-style:italic; color:var(--laterite);">"${infos.description_fun}"</li>` : ''}
                    </ul>
                </div>
           </div>
        </div>
    `;

    // 4. Render Full View
    content.innerHTML = `
        <div class="itin-header" style="margin-bottom:20px;">
            <img src="${itin.image || 'images/placeholders/default.jpg'}" style="width:100%; height:250px; object-fit:cover; border-radius:12px; margin-bottom:15px; box-shadow:var(--shadow-sm);">
            
            <h2 style="color:var(--laterite); margin-bottom:10px; font-family:var(--font-display);">${title}</h2>
            
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-bottom:20px; font-size:0.95rem; color:var(--text-secondary);">
                <span class="badge-pill"><i class="fas fa-clock"></i> ${itin.duree}</span>
                <span class="badge-pill"><i class="fas fa-wallet"></i> ${price}</span>
                <span class="badge-pill"><i class="fas fa-users"></i> Familial & Aventure</span>
            </div>

            <p style="font-size:1rem; line-height:1.6; margin-bottom:25px;">${descFull}</p>

            <div id="itinerary-dynamic-map" style="height: 400px; width: 100%; border-radius: 12px; margin-bottom: 25px; box-shadow: var(--shadow-sm); z-index: 1; border:1px solid var(--border-color);"></div>

            ${faqHtml}
        </div>
        
        <div class="itin-stages">
            <h3 style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:20px;">Itinéraire Jour par Jour</h3>
            ${stagesHtml}
        </div>
        
        <div style="margin-top:30px; text-align:center;">
             <button class="btn-action-primary" onclick="alert('Réservation bientôt disponible !')" style="padding:15px 30px; font-size:1.1rem; box-shadow:var(--shadow-md);">
                <i class="fas fa-paper-plane"></i> Demander un Devis Gratuit
             </button>
        </div>
    `;

    // Swap Views
    list.style.display = 'none';
    detail.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 5. Initialize Dynamic Map
    setTimeout(() => {
        if (window.initItineraryMap) {
            window.initItineraryMap(itin.etapes);
        }
    }, 100); // Short delay to ensure DOM is ready
};

window.backToItineraries = function () {
    const list = document.getElementById('itineraires-list');
    const detail = document.getElementById('itineraire-detail');
    if (list && detail) {
        detail.style.display = 'none';
        list.style.display = 'grid'; // Grid!
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

/* ============================================
   6. SPOTS & DATA RECOVERY
   ============================================ */
window.initSpotsPage = function () {
    const spotsContainer = document.getElementById('spotsContainer');
    if (!spotsContainer) return;

    console.log("🔍 INIT SPOT PAGE (STRICT MODE)...");
    if (!window.LIEUX_DATA) {
        console.warn("❌ LIUEX_DATA missing in initSpotsPage");
        return;
    }

    // 🔒 STRICT FILTER: ONLY Secret/Authentic Spots
    // Must have 'secret_spot' tag (added by surgical update)
    const spots = window.LIEUX_DATA.filter(l =>
        l.tags && l.tags.includes('secret_spot')
    );

    console.log(`🕵️ Spots Page: Found ${spots.length} authentic secret spots.`);

    if (spots.length === 0) {
        spotsContainer.innerHTML = "<div style='text-align:center; padding:40px; color:var(--text-secondary);'>Aucun spot secret trouvé (Tag missing?).</div>";
    } else {
        spotsContainer.innerHTML = spots.map(lieu => {
            // Force Type Display for Card
            lieu._forceDisplayType = "Spot Local";
            return createLieuCard(lieu, 'spot');
        }).join('');
    }

    // GSAP
    if (window.GasikaraAnimations) window.GasikaraAnimations.init();
}

/**
 * Filter Spots by Region (Ville)
 * @param {string} region - Name of the city/province (e.g. 'Diego-Suarez') or 'all'
 * @param {HTMLElement} btn - The button element clicked
 */
window.filterSpotsByRegion = function (region, btn) {
    // 1. Update UI (Active Button)
    if (btn) {
        const container = btn.closest('.province-filter-container');
        if (container) {
            container.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    }

    // 2. Filter Items in DOM
    const spotsContainer = document.getElementById('spotsContainer');
    if (!spotsContainer) return;

    const cards = spotsContainer.querySelectorAll('.lieu-card');

    // Animate Out
    // We can just hide/show for simplicity or better, filter logic
    let count = 0;

    cards.forEach(card => {
        // Use data-ville for reliable filtering
        const itemVille = (card.dataset.ville || '').toLowerCase().trim();
        const regionKey = region.toLowerCase();

        let show = false;
        if (regionKey === 'all') {
            show = true;
        } else {
            // Check inclusions directly against the data attribute
            if (itemVille.includes(regionKey)) {
                show = true;
            }
            // Mappings (Handle variations in naming)
            if (regionKey === 'antananarivo' && itemVille.includes('tana')) show = true;
            if (regionKey === 'mahajanga' && itemVille.includes('majunga')) show = true;
            if (regionKey === 'toamasina' && itemVille.includes('tamatave')) show = true;
            if (regionKey === 'toliara' && (itemVille.includes('tuléar') || itemVille.includes('tulear'))) show = true;
            if (regionKey === 'fianarantsoa' && itemVille.includes('fianar')) show = true;
        }

        if (show) {
            card.style.display = 'block';
            card.style.animation = `fadeInUp 0.3s ease forwards ${count * 0.05}s`;
            count++;
        } else {
            card.style.display = 'none';
        }
    });

    // Optional: Show empty state if count === 0
}

/* ============================================
   7. PROVINCE & CITY PAGES (RESTORED logic)
   ============================================ */

window.initCityPages = function () {
    // 1. HYDRATION: Populate grids with data from LIEUX_DATA
    renderCityData();

    // 2. Filter logic for ALL province sections
    const citySections = document.querySelectorAll('.province-section, .page-section');

    citySections.forEach(section => {
        // Exclude non-city sections like home/outils
        if (!section.id.startsWith('page-')) return;
        const cityKey = section.id.replace('page-', ''); // e.g., 'diego', 'nosybe'

        // Skip "special" pages that use page- logic but aren't cities
        const ignored = ['circuit', 'itineraires', 'langue', 'outils', 'carte', 'spots'];
        if (ignored.some(k => cityKey.includes(k))) return;

        // A. Init Filters
        const btnAll = section.querySelector('.nav-pill'); // Default first pill
        if (btnAll) {
            filterProvinceItems(cityKey, 'all', btnAll);
        }

        // B. Update premium info
        updatePremiumInfo(getCityNameFromKey(cityKey), cityKey);

        // C. Inject Budget Buttons (Only if missing)
        const navPills = section.querySelector('.nav-pills');
        if (navPills && !section.querySelector('.budget-pills-container')) {
            // Create budget buttons container
            const budgetContainer = document.createElement('div');
            budgetContainer.className = 'budget-pills-container';
            budgetContainer.style.cssText = 'margin-top: 16px; margin-bottom: 20px;';

            // Title
            const title = document.createElement('div');
            title.className = 'filter-title';
            title.style.cssText = 'font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 10px; text-align: center;';
            title.innerHTML = '<i class="fas fa-wallet"></i> Budget';
            budgetContainer.appendChild(title);

            // Pills container
            const pills = document.createElement('div');
            pills.className = 'nav-pills';
            pills.style.justifyContent = 'center';

            // Create 3 buttons
            const budgets = [
                { level: '1', label: '€', desc: '(- 25k)', icon: 'fa-coins' },
                { level: '2', label: '€€', desc: '(25k-80k)', icon: 'fa-money-bill-wave' },
                { level: '3', label: '€€€', desc: '(+ 80k)', icon: 'fa-gem' }
            ];

            budgets.forEach(b => {
                const btn = document.createElement('button');
                btn.className = 'budget-btn nav-pill';
                btn.setAttribute('data-level', b.level);
                btn.onclick = function () { toggleProvinceBudget(cityKey, b.level, this); };
                btn.innerHTML = `<i class="fas ${b.icon}"></i> ${b.label} <span style="font-size: 0.75rem; opacity: 0.8;">${b.desc}</span>`;
                pills.appendChild(btn);
            });

            budgetContainer.appendChild(pills);
            navPills.parentNode.insertBefore(budgetContainer, navPills.nextSibling);
        }
    });
};

/* ============================================
   NEW: HYDRATION LOGIC (Fixing Empty Pages)
   ============================================ */
window.renderCityData = function () {
    // --- SECURITY FALLBACK START (AXIS A) ---
    // Si la fonction reçoit des données vides, on force l'usage de la réserve globale.
    let data = window.LIEUX_DATA;
    if (!data || data.length === 0) {
        console.warn("⚠️ Data vide détectée. Bascule sur la réserve globale...");
        // Tente de récupérer les données injectées précédemment
        data = window.LIEUX_DATA || window.initData || [];
    }
    console.log("🔥 AFFICHAGE EN COURS : " + (data ? data.length : 0) + " fiches.");
    // --- SECURITY FALLBACK END ---

    console.log("1. Fonction Render appelée.");
    // Log container check
    const checkId = 'grid-Mahajanga';
    const containerCheck = document.getElementById(checkId);
    console.log(`2. Test Target ID '${checkId}' found?`, containerCheck);

    if (!window.LIEUX_DATA) return;

    // DEBUG: INVENTAIRE STRICT (173 Items Required)
    console.log("🔥 INVENTAIRE TOTAL :", window.LIEUX_DATA.length);
    if (window.LIEUX_DATA.length !== 173) {
        console.error(`🚨 ALERT: DATA MISMATCH. FOUND ${window.LIEUX_DATA.length} (Expected 173)`);
    } else {
        console.log("✅ DATA INTEGRITY VERIFIED: 173 ITEMS.");
    }


    // Clear all grids first
    // Note: Keys match the 'ville' property in data/lieux.js OR mapped via logic
    const citiesStub = {
        'Diego-Suarez': 'Antsiranana',
        'Antsiranana': 'Antsiranana',
        'Nosy Be': 'NosyBe', 'Nosy-Be': 'NosyBe',
        'Mahajanga': 'Mahajanga', 'Majunga': 'Mahajanga',
        'Antananarivo': 'Antananarivo', 'Tana': 'Antananarivo',
        'Toamasina': 'Toamasina', 'Tamatave': 'Toamasina',
        'Fianarantsoa': 'Fianarantsoa', 'Fianar': 'Fianarantsoa',
        'Toliara': 'Toliara', 'Tuléar': 'Toliara', 'Tulear': 'Toliara',
        // MISSING CITIES MAPPED TO HUBS
        'Isalo': 'Toliara', 'Ifaty': 'Toliara', 'Anakao': 'Toliara',
        'Andasibe': 'Toamasina', 'Mananara': 'Toamasina',
        'Sainte-Marie': 'Saintemarie', 'Ile aux Nattes': 'Saintemarie', // New Independent Hub
        'Ankarana': 'Antsiranana', 'Sambava': 'Antsiranana', 'Antalaha': 'Antsiranana', 'Vohémar': 'Antsiranana', 'Ambilobe': 'Antsiranana',
        // NEW ORPHANS
        'Ampefy': 'Antananarivo', 'Antsirabe': 'Antananarivo',
        'Anivorano': 'Antsiranana', 'Ambanja': 'Antsiranana',
        'Ramena': 'Antsiranana', 'Joffreville': 'Antsiranana'
    };

    // Clean containers
    Object.values(citiesStub).forEach(id => {
        const el = document.getElementById(`grid-${id}`);
        if (el) el.innerHTML = '';
    });

    // Populate
    let count = 0;
    if (!window.LIEUX_DATA || window.LIEUX_DATA.length === 0) {
        console.warn("⚠️ LIEUX_DATA is empty in renderCityData!");
    } else {
        window.LIEUX_DATA.forEach(lieu => {
            let v = lieu.ville ? lieu.ville.trim() : 'Inconnu';

            // NORD LOGIC: Both Diego and Nosy Be go to Antsiranana (The Hub) - Logic Adjusted
            // Using citiesStub for mapping
            let stubKey = Object.keys(citiesStub).find(k => k.toLowerCase() === v.toLowerCase());
            let gridId = citiesStub[v] || (stubKey ? citiesStub[stubKey] : null);

            // Specific overrides for consistency with index.html IDs
            if (v === 'Diego-Suarez') gridId = 'Antsiranana';
            if (v === 'Nosy Be' || v === 'Nosy-Be') gridId = 'NosyBe';

            // Target Grid
            if (gridId) {
                const grid = document.getElementById(`grid-${gridId}`);
                if (grid) {
                    if (typeof window.createLieuCard === 'function') {
                        const card = window.createLieuCard(lieu);
                        grid.insertAdjacentHTML('beforeend', card);
                        count++;
                    } else {
                        console.error("createLieuCard missing!", lieu);
                    }
                } else {
                    // console.warn(`Grid not found for ID: grid-${gridId} (Ville: ${v})`);
                }
            }
        });
    }
    console.log(`✅ Rendered ${count} locations across city grids.`);

    // ✨ GSAP: Re-initialize animations after cards are rendered
    if (window.GasikaraAnimations && typeof window.GasikaraAnimations.init === 'function') {
        window.GasikaraAnimations.init();
    }
}

// Helper for mapped names
window.getCityNameFromKey = function (key) {
    const map = {
        'antananarivo': 'Antananarivo',
        'antsiranana': 'Diego-Suarez',
        'nosybe': 'Nosy Be',
        'mahajanga': 'Mahajanga',
        'toamasina': 'Toamasina',
        'fianarantsoa': 'Fianarantsoa',
        'toliara': 'Toliara',
        'saintemarie': 'Sainte Marie'
    };
    return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

/* ============================================
   8. THEME MANAGER (Dark/Light)
   ============================================ */




window.filterProvinceItems = function (cityKey, filterType, btn) {
    console.log(`🔍 Filter Triggered: City=${cityKey}, Type=${filterType}`);

    // 1. UI Update
    const container = document.getElementById(`page-${cityKey}`);
    if (!container) {
        console.error(`❌ Container not found: page-${cityKey}`);
        return;
    }

    // Fix: Toggle active on nav-pills
    // We want to deactivate all "category" buttons, but keep "budget" buttons.
    // Budget buttons call 'toggleProvinceBudget'. Category buttons call 'filterProvinceItems'.

    const allPills = container.querySelectorAll('.nav-pill');
    allPills.forEach(b => {
        const onClickFn = b.getAttribute('onclick') || '';
        if (onClickFn.includes('filterProvinceItems')) {
            b.classList.remove('active');
        }
    });

    if (btn) btn.classList.add('active');

    // 2. Filter Logic
    const items = container.querySelectorAll('.lieu-card');
    console.log(`found ${items.length} items to filter in ${cityKey}`);
    let count = 0;

    items.forEach(item => {
        const rawTags = (item.dataset.tags || '').toLowerCase(); // e.g., "explorer,tana,€"
        const tags = rawTags.split(',');
        let isMatch = false;

        // Normalization for filters
        if (filterType === 'all') isMatch = true;

        // Categories (Check if tag exists)
        else if (filterType === 'voir' || filterType === 'explorer') isMatch = tags.includes('explorer');
        else if (filterType === 'manger') isMatch = tags.includes('manger');
        else if (filterType === 'dodo' || filterType === 'dormir') isMatch = tags.includes('dormir');
        else if (filterType === 'sortir') isMatch = tags.includes('sortir');
        else if (filterType === 'spot') isMatch = tags.includes('spots');

        // Debug
        // console.log(`Item: ${item.dataset.id} | Tags: ${rawTags} | Match: ${isMatch}`);

        // Budget Filter Check 
        if (isMatch) {
            // Check if a budget button is active locally
            const activeBudgetBtn = container.querySelector('[data-level].active');
            if (activeBudgetBtn) {
                const budgetLevel = activeBudgetBtn.dataset.level; // 1='€', 2='€€', 3='€€€'
                const targetTag = budgetLevel === '1' ? 'budget_1' : (budgetLevel === '2' ? 'budget_2' : 'budget_3');

                // If it doesn't match the specific budget, hide it (Strict filtering)
                /* 
                   Wait, budget logic in `toggleProvinceBudget` typically works by *showing* items.
                   Here we must intersect. 
                   If budget 1 is active, item MUST have '€'.
                   But wait, `item.dataset.tags` stores symbols e.g. "€".
                   `toLowerCase` turns it to "€".
                */
                if (!tags.includes(targetTag.toLowerCase())) {
                    isMatch = false;
                }
            }
        }

        if (isMatch) {
            item.style.display = 'flex'; // Show card
            count++;
        } else {
            item.style.display = 'none'; // Hide card
        }
    });
    console.log(`✅ Filter Result: ${count} visible items.`);

    // 3. Empty State
    const emptyMsg = container.querySelector('.empty-state-msg');
    if (count === 0) {
        if (!emptyMsg) {
            const msg = document.createElement('div');
            msg.className = 'empty-state-msg';
            msg.style.gridColumn = '1/-1';
            msg.style.padding = '40px';
            msg.style.textAlign = 'center';
            msg.innerHTML = '<i class="fas fa-search" style="font-size:3rem; color:var(--text-secondary); margin-bottom:15px;"></i><p>Aucune pépite trouvée dans cette catégorie.</p>';
            const grid = container.querySelector('.lieux-grid');
            if (grid) grid.appendChild(msg);
        } else {
            emptyMsg.style.display = 'block';
        }
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
    }
};

window.toggleProvinceBudget = function (cityKey, level, btn) {
    const container = document.getElementById(`page-${cityKey}`);
    if (!container) return;

    // Toggle logic
    const isActive = btn.classList.contains('active');
    container.querySelectorAll('[data-level], .budget-btn').forEach(b => b.classList.remove('active'));

    // Always activate the clicked button (even if was already active)
    btn.classList.add('active');

    // Re-run filter based on current active category
    const activeCatBtn = container.querySelector('.nav-pill.active'); // Was .filter-btn
    // Extract filter type from button logic or text
    let filterType = 'all';
    if (activeCatBtn) {
        const txt = activeCatBtn.innerText.toLowerCase().trim();
        if (txt.includes('explorer')) filterType = 'explorer';
        else if (txt.includes('manger')) filterType = 'manger';
        else if (txt.includes('dormir')) filterType = 'dormir';
        else if (txt.includes('sortir')) filterType = 'sortir';
        else if (txt.includes('spots')) filterType = 'spot';
        else if (txt.includes('tout')) filterType = 'all';
    }

    // IMPORTANT: Call filter AFTER button state is updated
    filterProvinceItems(cityKey, filterType, activeCatBtn);
};

function getCityNameFromKey(key) {
    const map = { 'diego': 'Diego-Suarez', 'nosybe': 'Nosy Be', 'majunga': 'Majunga', 'tamatave': 'Tamatave', 'fianar': 'Fianarantsoa', 'tulear': 'Tuléar' };
    return map[key] || key;
}

/* ============================================
   CORE UI: CARDS & MODULES (Continued)
   ============================================ */

window.createLieuCard = function (lieu, category = '') {
    // 1. Logic & Safety
    // Use the normalized category from data first
    if (!category) {
        category = lieu.categorie || 'Explorer'; // Default fallback
    }

    const prixClass = lieu.prixNum === 0 ? 'gratuit' : lieu.prixNum < 10000 ? 'abordable' : 'premium';
    const activeClass = window.isFavorite(lieu.id) ? 'active' : '';
    const icon = window.isFavorite(lieu.id) ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';

    // 2. Data Preparation
    const tagsString = (lieu.tags || []).join(',');
    const displayTags = (lieu.tags || [])
        .filter(t => !t.startsWith('budget_')) // Exclure budget_X des tags visuels
        .slice(0, 3)
        .map(t => `<span class="card-tag" style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:12px; font-size:0.7rem; color:var(--text-secondary); border:1px solid var(--border-color);">${t}</span>`)
        .join('');

    // Ajouter le badge budget VISUEL (€ €€ €€€)
    let budgetBadge = '';
    const budgetTag = (lieu.tags || []).find(t => t.startsWith('budget_'));
    if (budgetTag === 'budget_1') budgetBadge = '<span class="budget-visual" style="background:#27ae60; color:white; padding:3px 8px; border-radius:8px; font-size:0.75rem; font-weight:700;">€</span>';
    else if (budgetTag === 'budget_2') budgetBadge = '<span class="budget-visual" style="background:#f39c12; color:white; padding:3px 8px; border-radius:8px; font-size:0.75rem; font-weight:700;">€€</span>';
    else if (budgetTag === 'budget_3') budgetBadge = '<span class="budget-visual" style="background:#e74c3c; color:white; padding:3px 8px; border-radius:8px; font-size:0.75rem; font-weight:700;">€€€</span>';

    const displayTagsWithBudget = budgetBadge ? displayTags + budgetBadge : displayTags;

    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));

    // Determine Badge Text
    let badgeText = isMustSee ? 'Incontournable' : (lieu._forceDisplayType || lieu.type);

    // Determine Badge Style & Icon
    let badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    let badgeIcon = '';

    // SPECIAL: Spot Local Styling (Red + Icon)
    if (badgeText === 'Spot Local' || (lieu.tags && lieu.tags.includes('secret_spot') && !isMustSee)) {
        // Force the text if it was generic 'Nature' etc but specifically identified as secret spot in context
        // But respect isMustSee priority if needed. Here we follow User's target: "vignette où il est écrit spot local"
        if (badgeText === 'Spot Local') {
            badgeStyle = 'background: #c0392b; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);';
            badgeIcon = '<i class="fas fa-fire-alt" style="margin-right:4px;"></i>';
        }
    }

    // 3. Template (Rich & Premium)
    return `
        <article class="lieu-card" 
                 data-id="${lieu.id}" 
                 data-category="${category}" 
                 data-tags="${tagsString}" 
                 data-type="${lieu.type}" 
                 data-ville="${lieu.ville}"
                 style="position: relative; cursor: pointer; display: flex; flex-direction: column; background: var(--bg-secondary); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s; border: 1px solid var(--border-color);">
            
            <!-- Badge Location (Top Left - REQUESTED) -->
            <div class="badge-location" style="position: absolute; top: 10px; left: 10px; z-index: 5; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; backdrop-filter: none;">
                <i class="fas fa-map-marker-alt" style="margin-right:4px;"></i> ${lieu.ville}
            </div>

            <!-- Favorite Button (Top Right) -->
            <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite ${activeClass}" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 5; background: white; border-radius: 50%; width: 32px; height: 32px; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                ${icon}
            </button>
            
            <!-- Image -->
            <div class="lieu-image" onclick="showLieuDetailsByID(${lieu.id})" style="position: relative; height: 180px; overflow: hidden;">
                <img src="${lieu.image}" alt="${lieu.nom.replace(/"/g, '&quot;')}" loading="lazy" onerror="this.src='images/placeholder.jpg'" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
                <!-- Type Badge (Bottom Left) -->
                <div class="lieu-badge" style="position: absolute; bottom: 10px; left: 10px; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${badgeStyle}">${badgeIcon}${badgeText}</div>
            </div>
            
            <!-- Content -->
            <div class="lieu-content" onclick="showLieuDetailsByID(${lieu.id})" style="padding: 15px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                
                <div class="lieu-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin: 0;">
                    <h3 class="lieu-title" style="margin: 0; font-size: 1.1rem; color: var(--text-primary); line-height: 1.3; font-weight: 700;">${lieu.nom}</h3>
                    <div class="lieu-rating" style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: var(--text-primary); background: var(--bg-body); padding: 2px 6px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <i class="fas fa-star" style="color: #f1c40f; font-size: 0.8rem;"></i> ${lieu.note}
                    </div>
                </div>

                <!-- Tags -->
                <div class="lieu-tags" style="display: flex; gap: 6px; flex-wrap: wrap;">${displayTagsWithBudget}</div>

                <!-- Desc -->
                <p class="lieu-desc" style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;">${lieu.description}</p>

                <!-- Footer -->
                <div class="lieu-footer" style="margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-top: 1px solid var(--border-color);">
                   <span class="lieu-ville" style="color: var(--text-secondary); display: none;">${lieu.ville}</span> <!-- Hidden as badge is on image -->
                   <span class="lieu-prix ${prixClass}" style="font-weight: 600;">${lieu.prix}</span>
                </div>
            </div>
        </article>
    `;
}
/* ============================================
   8. MODAL SYSTEM (CRASH FIX)
   ============================================ */

window.openLieuModal = function (lieu) {
    if (!lieu) return;

    // Remove existing if any
    const existing = document.getElementById('lieu-modal-overlay');
    if (existing) existing.remove();

    const isFav = window.isFavorite(lieu.id);
    const favIcon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';
    const activeClass = isFav ? 'active' : '';

    // Data Prep
    // PRIORITÉ BADGE : On cherche d'abord une Catégorie, sinon le Type, sinon le 1er tag
    const categoriesPrioritaires = ['Explorer', 'Manger', 'Dormir', 'Sortir', 'Spots'];
    let badgeType = (lieu.type || 'Général');

    if (lieu.tags && lieu.tags.length) {
        const catTag = lieu.tags.find(t => categoriesPrioritaires.includes(t));
        if (catTag) badgeType = catTag;
        else badgeType = lieu.tags[0];
    }

    // LOGIC BUTTONS (Strict Anti-Doublon)
    // 1. Is there a "Y aller" link? (Google Maps URL or similar)
    // Note: The data sometimes has 'y_aller' or 'google_maps' or we build it from lat/lng.
    // The requirement is: If Y aller exists (meaning EXTERNAL link intent), use RED button.
    // Else use "Voir sur la carte" (internal).
    // BUT: The user request says "Si y_aller existe". 
    // Let's assume 'y_aller' is a property we preserved or need to generate?
    // In our harvest script, we didn't explicitly ensure 'y_aller' key. 
    // However, existing data might not have it explicitly as a string URL for all.
    // Let's construct a Google Maps URL as the "Y aller" default since it's an app.
    // wait, "Voir sur carte" means INTERNAL map. "Y aller" means EXTERNAL (Google Maps).
    // Logic: ALWAYS offer Google Maps as "Y Aller" (Red)? 
    // User said: "SI y_aller existe". 
    // Let's check a data sample. "y_aller": undefined.
    // Maybe I should force the creation of the Red Button "Y Aller" that opens Google Maps 
    // AND hide the "Voir sur carte" if that's what the user wants?
    // "SI y_aller existe : Affiche UNIQUEMENT le bouton ROUGE... SI y_aller n'existe pas : Affiche le bouton standard."
    // This implies 'y_aller' is a specific field in the data. 
    // I will check if 'y_aller' is in the consolidated data. 
    // If not, I will rely on lat/lng to generate it? 
    // No, strictly follow "SI y_aller existe". If it's undefined, I show Standard.

    const hasYAller = lieu.y_aller && lieu.y_aller.trim() !== "";
    const hasWebsite = lieu.siteWeb && lieu.siteWeb.trim() !== "";

    // Grid Data
    const priceDisplay = lieu.prix || 'Gratuit';
    const noteDisplay = lieu.note || '-';
    const dureeDisplay = lieu.duree || 'Variable';
    const villeDisplay = lieu.ville || 'Madagascar';

    const html = `
    <div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;" onclick="if(event.target.id === 'lieu-modal-overlay') window.closeLieuModal();">
        <div class="modal-content fade-in-up" style="position:relative;">
            
            <!-- Close Button: MOVED OUTSIDE HEADER FOR Z-INDEX FIX -->
            <button class="btn-close-modal-overlay" id="modal-close-btn" onclick="window.closeLieuModal()"
                    style="position: absolute; top: 15px; right: 15px; z-index: 100000; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); pointer-events: auto;">
                <i class="fas fa-times" style="font-size: 1.2rem;"></i>
            </button>

            <!-- 1. HERO HEADER (Fixed with fallback & 100% min-height) -->
            <div class="modal-hero-header" style="min-height: 200px; background: var(--bg-secondary); position: relative;">
                <img src="${lieu.image}" alt="${lieu.nom}" class="modal-hero-img" 
                     style="width: 100%; height: 250px; object-fit: cover;"
                     onerror="this.onerror=null; this.src=''; this.parentElement.style.background='linear-gradient(135deg, var(--laterite), var(--noir))'; this.parentElement.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:3rem;&quot;><i class=&quot;fas fa-image&quot;></i></div>' + this.parentElement.innerHTML;">
                
                <div class="modal-gradient-overlay" style="position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to top, var(--bg-card), transparent); z-index:2;"></div>
            </div>

            <!-- 2. TITLE & HEADER -->
            <div class="modal-title-block">
                <h2 class="modal-main-title">${lieu.nom}</h2>
                <span class="modal-category-badge">${badgeType}</span>
                
                 <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite-modal ${activeClass}" 
                        style="position:absolute; top:15px; left:15px; background:white; color:var(--laterite); width:36px; height:36px; border-radius:50%; border:none; box-shadow:0 4px 6px rgba(0,0,0,0.2); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10;">
                    ${favIcon}
                </button>
            </div>

            <!-- 3. INFO GRID -->
            <div class="modal-info-grid">
                <div class="modal-info-box">
                    <span class="modal-info-label">Ville</span>
                    <span class="modal-info-value"><i class="fas fa-map-marker-alt icon-ville"></i> ${villeDisplay}</span>
                </div>
                <div class="modal-info-box">
                    <span class="modal-info-label">Prix</span>
                    <span class="modal-info-value"><i class="fas fa-wallet icon-prix"></i> ${priceDisplay}</span>
                </div>
                <div class="modal-info-box">
                    <span class="modal-info-label">Note</span>
                    <span class="modal-info-value"><i class="fas fa-star icon-note"></i> ${noteDisplay}</span>
                </div>
                <div class="modal-info-box">
                    <span class="modal-info-label">Durée</span>
                    <span class="modal-info-value"><i class="fas fa-clock icon-duree"></i> ${dureeDisplay}</span>
                </div>
            </div>

            <!-- 4. DESCRIPTION -->
            <div class="modal-description-text">
                ${lieu.description}
            </div>

            <!-- 5. CONSEIL -->
            <!-- 5. SECRET ACCESS / CONSEIL (Premium Accordion) -->
            ${(lieu.tags && lieu.tags.includes('secret_spot')) ? `
            <div class="accordion-item-2026" style="border: 1px solid var(--laterite); background: rgba(176, 48, 48, 0.04); margin-top: 20px;">
                <div class="accordion-header-2026" onclick="this.parentElement.classList.toggle('active')">
                    <span class="accordion-title-2026" style="color: var(--laterite); font-size: 1.1rem;">
                        <i class="fas fa-user-secret"></i> ACCÈS LOCAL UNIQUEMENT
                    </span>
                    <i class="fas fa-chevron-down" style="color: var(--laterite);"></i>
                </div>
                <div class="accordion-content-2026">
                    <div class="accordion-inner-padding" style="padding-top:0;">
                        <p style="font-size: 0.95rem; margin-bottom: 15px; color: var(--text-primary); border-bottom:1px solid rgba(176,48,48,0.1); padding-bottom:10px;">
                            Ce lieu est <strong style="color:var(--laterite)">inaccessible sans contact humain</strong>.
                        </p>

                        ${lieu.contactLocal ? `
                        <div style="display:flex; gap:10px; margin-bottom:12px; align-items:flex-start;">
                            <div style="background:var(--laterite); color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fas fa-address-card" style="font-size:0.9rem;"></i></div>
                            <div>
                                <div style="font-weight:700; color:var(--text-primary); font-size:0.9rem;">Contact Clé</div>
                                <div style="font-size:0.95rem; color:var(--text-secondary);">${lieu.contactLocal}</div>
                            </div>
                        </div>` : ''}

                        ${lieu.acces ? `
                        <div style="display:flex; gap:10px; margin-bottom:12px; align-items:flex-start;">
                            <div style="background:var(--bg-secondary); border:1px solid var(--laterite); color:var(--laterite); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fas fa-route" style="font-size:0.9rem;"></i></div>
                            <div>
                                <div style="font-weight:700; color:var(--text-primary); font-size:0.9rem;">Logistique</div>
                                <div style="font-size:0.95rem; color:var(--text-secondary);">${lieu.acces}</div>
                            </div>
                        </div>` : ''}

                        ${lieu.conseil ? `
                        <div style="display:flex; gap:10px; margin-bottom:12px; align-items:flex-start;">
                             <div style="background:var(--bg-secondary); border:1px solid var(--text-secondary); color:var(--text-secondary); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><i class="fas fa-lightbulb" style="font-size:0.9rem;"></i></div>
                            <div>
                                <div style="font-weight:700; color:var(--text-primary); font-size:0.9rem;">Conseil</div>
                                <div style="font-size:0.95rem; color:var(--text-secondary);">${lieu.conseil}</div>
                            </div>
                        </div>` : ''}

                        <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:15px; font-style:italic; background:rgba(0,0,0,0.05); padding:8px; border-radius:6px; text-align:center;">
                            ⚠️ Respectez strictement les protocoles locaux (Fady).
                        </div>
                    </div>
                </div>
            </div>
            ` : (lieu.conseil ? `
            <div class="modal-conseil-block">
                <div class="modal-conseil-title"><i class="fas fa-lightbulb"></i> Conseil du Local</div>
                <p class="modal-conseil-text">${lieu.conseil}</p>
            </div>
            ` : '')}

            <!-- 6. FOOTER ACTIONS -->
            <div class="modal-footer-actions">
                <div class="modal-section-title">ACCÈS & LOGISTIQUE</div>
                
                ${lieu.acces ? `
                <div class="standard-access-card" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 12px 15px; border-radius: 12px; margin-bottom: 15px; display: flex; align-items: flex-start; gap: 12px;">
                    <div style="background: rgba(0,0,0,0.05); color: var(--text-primary); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-route" style="font-size: 1rem;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); margin-bottom: 2px;">Comment y aller ?</div>
                        <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem; line-height: 1.4;">${lieu.acces}</p>
                    </div>
                </div>` : ''}

                <div class="modal-action-row" style="display:flex; flex-direction:column; gap:10px;">
                    <!-- ACTION LOGIC -->
                    ${hasYAller ? `
                    <!-- Button RED: Y Aller (External) -->
                    <button class="btn-action-red" onclick="window.open('${lieu.y_aller}', '_blank')" 
                            style="width:100%; padding:14px; background:var(--laterite); color:white; border:none; border-radius:12px; font-weight:700; cursor:pointer; font-family:var(--font-body);">
                        <i class="fas fa-location-arrow"></i> Y aller
                    </button>
                    ` : `
                    <!-- Button STANDARD: Voir sur carte (Internal) -->
                     <button class="btn-action secondary" onclick="locateOnMap(${lieu.id})"
                             style="width:100%; padding:14px; background:var(--bg-secondary); border:2px solid var(--border-color); color:var(--text-primary); border-radius:12px; font-weight:600; cursor:pointer;">
                          <i class="fas fa-map"></i> Voir sur la carte de l'app
                     </button>
                    `}

                    <!-- Button GREEN: Visiter Site Web (Always if exists) -->
                    ${hasWebsite ? `
                    <a href="${lieu.siteWeb}" target="_blank" class="btn-action-green" 
                       style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:#2E7D32; color:white; border-radius:12px; font-weight:600; text-decoration:none;">
                        <i class="fas fa-globe"></i> Visiter le site web
                    </a>
                    ` : ''}
                </div>
                
                ${lieu.horaires ? `
                <div style="margin-top:20px;">
                    <div class="modal-section-title">HORAIRES</div>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">${lieu.horaires}</p>
                </div>` : ''}

            </div>
            <div style="height:30px;"></div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    document.body.style.overflow = 'hidden';

    // Attacher l'event listener au bouton X IMMÉDIATEMENT après création
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeLieuModal);
    }

    // GSAP Animation: Animate modal opening
    const modal = document.getElementById('lieu-modal-overlay');
    if (modal && window.GasikaraAnimations) {
        window.GasikaraAnimations.openModal(modal);
    }
};

window.closeLieuModal = function () {
    const modal = document.getElementById('lieu-modal-overlay');
    if (modal) {
        // GSAP Animation: Animate modal closing (with callback)
        if (window.GasikaraAnimations) {
            window.GasikaraAnimations.closeModal(modal, () => {
                modal.remove();
                document.body.style.overflow = '';
            });
        } else {
            // Fallback without GSAP
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    } else {
        document.body.style.overflow = '';
    }
};

window.locateOnMap = function (id) {
    window.closeLieuModal();
    window.navigateToPage('carte');
    setTimeout(() => {
        if (window.openMapMarker) {
            window.openMapMarker(id);
        }
    }, 500);
};

window.addToItineraryTemp = function (id) {
    alert("Fonctionnalité 'Ajouter au circuit' bientôt disponible !");
};


// ... (Existing Province / Map logic can stay in Map-logic or here.
// Re-adding the updatePremiumInfo stub for full robustness as page needs it)

window.updatePremiumInfo = function (city, provinceKey) {
    // Fix ID syntax: Remove spaces
    const container = document.getElementById(`premium-container-${provinceKey}`);
    if (!container) return;

    const zoneData = (window.ZONES_DATA || {})[city];
    if (!zoneData) { container.innerHTML = ''; return; }

    // (Simplified Premium Info injection - robust fallback)
    let html = '';

    // Logistique
    if (zoneData.logistique) {
        const { route_etat, transport_conseil } = zoneData.logistique;
        html += `
    < div class="logistique-container" >
                 <div class="logistique-header" onclick="this.nextElementSibling.classList.toggle('active')">
                    <h3><i class="fas fa-truck-monster"></i> Infos Route (${city})</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="logistique-content">
                    <div class="logistique-item"><div>Route:</div><div>${route_etat}</div></div>
                    <div class="logistique-item"><div>Transport:</div><div>${transport_conseil}</div></div>
                </div>
            </div > `;
    }
    container.innerHTML = html;
}



/* ============================================
   MAIN ENTRY
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initData().then(() => {
        initTheme();
        if (typeof initMap === 'function') initMap();
        initLanguePage();
        initOutilsPage();
        if (typeof initCityPages === 'function') initCityPages();
        initItinerariesPage();
        initSpotsPage();
        if (typeof initModal === 'function') initModal();
        if (typeof initInstallPrompt === 'function') initInstallPrompt();
        if (typeof registerServiceWorker === 'function') registerServiceWorker();
        if (typeof initGeolocation === 'function') initGeolocation();
        if (window.initTheme) window.initTheme();

        // Search
        const input = document.getElementById('globalSearchInput');
        const results = document.getElementById('searchResults');
        if (input && results) {
            input.addEventListener('input', (e) => {
                const normalize = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const query = normalize(e.target.value.trim());
                if (query.length < 2) { results.style.display = 'none'; return; }
                const matching = window.LIEUX_DATA.filter(l => normalize(l.nom).includes(query));
                if (matching.length === 0) { results.innerHTML = '<div style="padding:10px;">Rien trouvé.</div>'; results.style.display = 'block'; return; }
                if (matching.length === 0) { results.innerHTML = '<div style="padding:10px;">Rien trouvé.</div>'; results.style.display = 'block'; return; }
                // SLICE REMOVED to show all results
                results.innerHTML = matching.map(l => `<div onclick="window.showLieuDetailsByID(${l.id}); document.getElementById('searchResults').style.display='none';" style="padding:10px; cursor:pointer;">${l.nom}</div>`).join('');
                results.style.display = 'block';
                results.style.display = 'block';
            });
            document.addEventListener('click', (e) => {
                if (!input.contains(e.target) && !results.contains(e.target)) results.style.display = 'none';
            });
        }
    });
});
/* ============================================
   9. FILTERS & UTILS (RESTORED MAP LOGIC)
   ============================================ */

window.initFilters = function () {
    // Only needed if we want to attach listeners dynamically, 
    // but map-logic.js handles map listeners on checkboxes.
    // This is for the City Page Chips.
};

window.getActiveFilters = function () {
    const filters = {
        provinces: [],
        types: [],
        prix: [],
        favorites: false
    };

    // 1. Province/City Filters (Map Page)
    document.querySelectorAll('.filter-checkbox[id^="filter-"]:checked').forEach(cb => {
        const type = cb.id.replace('filter-', '');
        // Cities
        if (['antananarivo', 'antsiranana', 'mahajanga', 'toamasina', 'toliara', 'fianarantsoa'].includes(type)) {
            filters.provinces.push(type);
        }
        // Types
        else if (['explorer', 'manger', 'dodo', 'sortir', 'spot'].includes(type)) {
            filters.types.push(type);
        }
    });

    // 2. Favorites
    const favCb = document.getElementById('filter-favorites');
    if (favCb && favCb.checked) filters.favorites = true;

    return filters;
};

window.matchesFilters = function (lieu, filters) {
    if (!lieu) return false;

    // 1. Favorites
    if (filters.favorites) {
        if (!window.isFavorite(lieu.id)) return false;
    }

    // 2. City Filter (Map Page)
    if (filters.provinces && filters.provinces.length > 0) {
        const lieuCity = (lieu.ville || '').toLowerCase();

        // Strict mapping for major hubs
        const mapCityToFilter = {
            'diego-suarez': 'antsiranana',
            'antsiranana': 'antsiranana',
            'nosy be': 'antsiranana',
            'nosy-be': 'antsiranana',
            'antananarivo': 'antananarivo', 'tana': 'antananarivo',
            'mahajanga': 'mahajanga', 'majunga': 'mahajanga',
            'toamasina': 'toamasina', 'tamatave': 'toamasina',
            'toliara': 'toliara', 'tuléar': 'toliara',
            'fianarantsoa': 'fianarantsoa'
        };

        const mappedLieu = mapCityToFilter[lieuCity] || lieuCity;
        if (!filters.provinces.includes(mappedLieu)) return false;
    }

    // 3. Type Filter (Using Normalized 'categorie')
    if (filters.types && filters.types.length > 0) {
        // Normalize the filter types (e.g. 'dodo' -> 'Dormir') if they differ
        // But usually filter buttons send 'manger', 'dormir', 'explorer', 'sortir', 'spot'
        // And our data now has 'Manger', 'Dormir', 'Explorer', 'Sortir', 'Spot'
        const normalizedLieuCat = (lieu.categorie || '').toLowerCase();

        // Map filter keys to data keys (just in case)
        const filterKeyMap = {
            'dodo': 'dormir'
        };

        const match = filters.types.some(t => {
            let ft = t.toLowerCase();
            if (filterKeyMap[ft]) ft = filterKeyMap[ft];

            return normalizedLieuCat === ft;
        });

        if (!match) return false;
    }

    return true;
};

/* ============================================
   8. THEME MANAGER (Dark/Light)
   ============================================ */
// Redundant initTheme removed.


// ============================================
// EMERGENCY FIX: FORCED UI LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Boutons de la Carte (.filter-chip-map)
    const mapFilters = document.querySelectorAll('.filter-chip-map');
    mapFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Gestion visuelle
            const parent = btn.parentElement;
            parent.querySelectorAll('.filter-chip-map').forEach(sib => sib.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 2. Boutons des Pages Villes (.nav-pill)
    const cityFilters = document.querySelectorAll('.nav-pill');
    cityFilters.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Retirer la classe active de tous les frères
            const parent = this.parentElement;
            parent.querySelectorAll('.nav-pill').forEach(sib => sib.classList.remove('active'));
            // Ajouter au cliqué
            this.classList.add('active');
        });
    });
});


// --- PATCH FILTRES (TAGS) ---



// --- FIX: SECURE CARD GENERATION ---



// --- PATCH FINAL : FILTRES BUDGET & VILLES ---



// --- MOTEUR D'AFFICHAGE UNIVERSEL (V4 - FIX DISPARITION) ---



// --- MOTEUR RENDU V7 (DESIGN PREMIUM + LOGIQUE ROBUSTE) ---




// ============================================
// 9. MOTEUR DE VUE PREMIUM (V7 FINAL)
// ============================================

// A. Création Carte Premium (Sécurisée)



// B. Moteur de Filtre Centralisé (Diego & Nosy Be & autres)



// INITIALISATION AU CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', function () {
    console.log(' App initialization starting...');

    // Load page city data and init filters 
    if (typeof initCityPages === 'function') {
        initCityPages();
        console.log(' initCityPages() called');
    } else {
        console.error(' initCityPages function not found!');
    }
});
// ============================================================================
// FORCED CARD REGENERATION - FIX FOR CACHE ISSUE
// ============================================================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔄 FORCING CARD REGENERATION TO FIX CACHE...');

    // Wait for data to load
    setTimeout(() => {
        if (window.LIEUX_DATA && window.renderCityData) {
            // Clear all grids first
            const grids = document.querySelectorAll('[id^="grid-"]');
            grids.forEach(grid => {
                grid.innerHTML = '';
            });

            // Regenerate with fresh data
            renderCityData();
            console.log('✅ Cards regenerated with fresh data');
        }
    }, 1000);
});

// ============================================================================
// GLOBAL SEARCH LOGIC (PREMIUM 2026)
// ============================================================================
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const resultsContainer = document.getElementById('searchResults');

    if (!searchInput || !resultsContainer) {
        console.warn('Global Search elements not found.');
        return;
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.remove('active');
        }
    });

    // Focus input -> show results if not empty
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
            resultsContainer.classList.add('active');
        }
    });

    // Input handler
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            resultsContainer.classList.remove('active');
            resultsContainer.innerHTML = '';
            return;
        }

        if (!window.LIEUX_DATA) return;

        // Filter Logic
        const matches = window.LIEUX_DATA.filter(item => {
            const name = (item.nom || '').toLowerCase();
            const city = (item.ville || '').toLowerCase();
            const tags = (item.tags || []).join(' ').toLowerCase();
            const type = (item.type || '').toLowerCase();

            return name.includes(query) ||
                city.includes(query) ||
                tags.includes(query) ||
                type.includes(query);
        }).slice(0, 10); // Limit to 10 results

        renderSearchResults(matches, resultsContainer);
    });
}

function renderSearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">Aucun résultat trouvé</div>';
        container.classList.add('active');
        return;
    }

    const html = results.map(item => `
        <div class="search-result-item" onclick="openLieuFromSearch(${item.id})">
            <img src="${item.image}" class="search-result-thumb" onerror="this.src='images/placeholders/default.jpg'">
            <div class="search-result-info">
                <h4>${item.nom}</h4>
                <p>${item.ville} • ${item.type}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
    container.classList.add('active');
}

window.openLieuFromSearch = function (id) {
    const item = window.LIEUX_DATA.find(i => i.id === id);
    if (item) {
        showLieuModalDirectly(item);
    }

    // Close search
    document.getElementById('searchResults').classList.remove('active');
    document.getElementById('globalSearchInput').value = '';
};

function showLieuModalDirectly(lieu) {
    const badgeType = lieu.type || 'Découverte';

    const isFav = window.favorites && window.favorites.includes(lieu.id);
    const favIcon = isFav ? '<i class="fas fa-heart text-red-500"></i>' : '<i class="far fa-heart"></i>';
    const activeClass = isFav ? 'active' : '';

    const hasYAller = lieu.y_aller && lieu.y_aller.trim() !== "";
    // const hasWebsite = lieu.siteWeb && lieu.siteWeb.trim() !== ""; // unused in this simplified modal

    const priceDisplay = lieu.prix || 'Gratuit';
    const noteDisplay = lieu.note || '-';
    // const dureeDisplay = lieu.duree || 'Variable'; // unused
    const villeDisplay = lieu.ville || 'Madagascar';

    const html = `
            <div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;" onclick="if(event.target.id === 'lieu-modal-overlay') window.closeLieuModal();">
                <div class="modal-content fade-in-up" style="position:relative;">
                    
                     <button class="btn-close-modal-overlay" id="modal-close-btn" onclick="window.closeLieuModal()"
                        style="position: absolute; top: 15px; right: 15px; z-index: 100000; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); pointer-events: auto;">
                        <i class="fas fa-times" style="font-size: 1.2rem;"></i>
                    </button>

                    <div class="modal-hero-header" style="min-height: 200px; background: var(--bg-secondary); position: relative;">
                        <img src="${lieu.image}" alt="${lieu.nom}" class="modal-hero-img" 
                             style="width: 100%; height: 250px; object-fit: cover;"
                             onerror="this.onerror=null; this.src='images/placeholders/default.jpg'">
                        <div class="modal-gradient-overlay" style="position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to top, var(--bg-secondary), transparent); z-index:2;"></div>
                    </div>

                    <div class="modal-title-block">
                        <h2 class="modal-main-title">${lieu.nom}</h2>
                        <span class="modal-category-badge">${badgeType}</span>
                        <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite-modal ${activeClass}" 
                                style="position:absolute; top:15px; left:15px; background:white; color:var(--laterite); width:36px; height:36px; border-radius:50%; border:none; box-shadow:0 4px 6px rgba(0,0,0,0.2); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10;">
                            ${favIcon}
                        </button>
                    </div>

                    <div class="modal-info-grid">
                        <div class="modal-info-box"><span class="modal-info-label">Ville</span><span class="modal-info-value">${villeDisplay}</span></div>
                        <div class="modal-info-box"><span class="modal-info-label">Prix</span><span class="modal-info-value">${priceDisplay}</span></div>
                        <div class="modal-info-box"><span class="modal-info-label">Note</span><span class="modal-info-value">${noteDisplay}</span></div>
                    </div>

                    <div class="modal-description-text">${lieu.description}</div>
                    
                    ${lieu.conseil ? `<div class="modal-conseil-block"><div class="modal-conseil-title">💡 Conseil du Local</div><p class="modal-conseil-text">${lieu.conseil}</p></div>` : ''}

                    <div class="modal-footer-actions">
                         <div class="modal-action-row" style="display:flex; flex-direction:column; gap:10px;">
                            ${hasYAller ? `<button class="btn-action-red" onclick="window.open('${lieu.y_aller}', '_blank')" style="width:100%; padding:14px; background:var(--laterite); color:white; border:none; border-radius:12px; font-weight:700;">Y aller</button>` :
            `<button class="btn-action secondary" onclick="locateOnMap(${lieu.id})" style="width:100%; padding:14px; background:var(--bg-secondary); border:2px solid var(--border-color); border-radius:12px; font-weight:600; cursor:pointer;"><i class="fas fa-map"></i> Voir sur la carte de l'app</button>`}
                        </div>
                    </div>
                    <div style="height:20px;"></div>
                </div>
            </div>
            `;
    document.body.insertAdjacentHTML('beforeend', html);
    document.body.style.overflow = 'hidden';

    // GSAP Animation if available
    const modal = document.getElementById('lieu-modal-overlay');
    if (modal && window.GasikaraAnimations) {
        window.GasikaraAnimations.openModal(modal);
    }
}

// Init when DOM is ready
// 9. INITIALIZATION ENTRY POINT
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 BOOTSTRAP: Starting Application...");

    // 1. Init Data (Async)
    await window.initData();
    console.log("✅ Data Loaded.");

    // 2. Init Theme
    window.initTheme();

    // 3. Init Pages
    window.initCityPages();       // Provinces buttons/grids
    window.initItinerariesPage(); // Circuits
    window.initSpotsPage();       // Spots
    window.initLanguePage();      // Langue
    window.initOutilsPage(); // Outils

    // 4. Init Global Search (Legacy)
    if (typeof initGlobalSearch === 'function') {
        initGlobalSearch();
    }

    // 5. Init Map (if map logic exists)
    if (typeof window.initMapLogic === 'function') {
        window.initMapLogic();
    } else {
        // Fallback or verify map-logic.js
        console.log("ℹ️ Map logic init skipped (check map-logic.js)");
    }

    console.log("🚀 Application Ready.");
});

// ============================================
// 6. DYNAMIC ITINERARY MAP
// ============================================
window.initItineraryMap = function (steps) {
    const container = document.getElementById('itinerary-dynamic-map');
    if (!container) return;

    // Cleanup previous map instance if exists
    if (window.itinMap) {
        window.itinMap.remove();
        window.itinMap = null;
    }

    // Initialize Map
    // Default center (Madagascar central)
    const map = L.map('itinerary-dynamic-map', {
        scrollWheelZoom: false // Prevent scrolling page intereference
    }).setView([-18.8792, 47.5079], 6);

    window.itinMap = map;

    // Tile Layer (Voyager - Premium Clean Look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Collect Data
    const routeCoords = [];

    if (steps && Array.isArray(steps)) {
        steps.forEach((step, idx) => {
            if (step.lieux_ids && step.lieux_ids.length > 0) {
                const lieuId = step.lieux_ids[0];
                const lieu = window.LIEUX_DATA ? window.LIEUX_DATA.find(l => l.id == lieuId) : null;

                if (lieu && lieu.lat && lieu.lng) {
                    const latLng = [lieu.lat, lieu.lng];
                    routeCoords.push(latLng);

                    // Add Marker (Numbered)
                    const icon = L.divIcon({
                        className: 'itin-marker',
                        html: `<div style="background:var(--laterite); color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem; border:2px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); z-index:100;">${idx + 1}</div>`,
                        iconSize: [28, 28],
                        iconAnchor: [14, 14],
                        popupAnchor: [0, -14]
                    });

                    const marker = L.marker(latLng, { icon: icon })
                        .bindPopup(`
                            <div style="font-family:var(--font-body); text-align:center;">
                                <strong style="color:var(--laterite);">Jour ${step.jour || idx + 1}</strong><br>
                                ${lieu.nom}
                            </div>
                        `);
                    marker.addTo(map);
                }
            }
        });
    }

    // Draw Route Polyline
    if (routeCoords.length > 1) {
        // Create a curved-like visual with simple polyline for now
        const polyline = L.polyline(routeCoords, {
            color: '#b03030', // var(--laterite)
            weight: 4,
            opacity: 0.8,
            lineJoin: 'round',
            dashArray: '10, 10' // Slight dashed effect for "Journey" feel
        }).addTo(map);

        // Fit Bounds with padding
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    } else if (routeCoords.length === 1) {
        map.setView(routeCoords[0], 10);
    }
};
