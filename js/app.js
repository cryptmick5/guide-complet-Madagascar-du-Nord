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
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            window.currentTheme = window.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', window.currentTheme);
            window.applyTheme();
        });
    }
    window.applyTheme();
};

window.applyTheme = function () {
    document.body.setAttribute('data-theme', window.currentTheme);
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.innerHTML = window.currentTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
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

window.navigateToPage = function (pageName) {
    if (!pageName) return;

    let targetId = pageName;
    if (!targetId.startsWith('page-')) targetId = 'page-' + pageName;

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

        if (pageName === 'carte' && window.leafletMap) {
            setTimeout(() => { if (window.leafletMap) window.leafletMap.invalidateSize(); }, 300);
        }
    }

    const rawName = pageName.replace('page-', '');
    const activeBtn = document.querySelector(`.nav-btn[data-page="${rawName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        setTimeout(() => activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 100);
    }
}
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

window.initLanguePage = function () {
    const container = document.getElementById('accordionContainer');
    if (!container || !window.PHRASES_DATA) return;

    let html = '';

    // Check if Array or Object
    let categories = [];
    if (Array.isArray(window.PHRASES_DATA)) {
        categories = [...new Set(window.PHRASES_DATA.map(p => p.categorie))];
        categories.forEach((cat) => {
            const phrases = window.PHRASES_DATA.filter(p => p.categorie === cat);
            html += generateAccordionItem(cat, phrases);
        });
    } else {
        // Object based (Current data/phrases.js structure)
        for (const [cat, phrases] of Object.entries(window.PHRASES_DATA)) {
            html += generateAccordionItem(cat, phrases);
        }
    }

    container.innerHTML = html;
}

function generateAccordionItem(cat, phrases) {
    return `
        <div class="accordion-item value-prop-card">
            <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                <span class="accordion-title">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="accordion-content">
                ${phrases.map(p => {
        const text = (p.mg || p.malgache || '').replace(/'/g, "\\'");
        return `
                    <div class="phrase-row" onclick="playAudio('${text}')">
                        <div>
                            <div class="phrase-fr">${p.fr || p.francais}</div>
                            <div class="phrase-mg">${p.mg || p.malgache}</div>
                        </div>
                        <button class="btn-audio"><i class="fas fa-volume-up"></i></button>
                    </div>`;
    }).join('')}
            </div>
        </div>
    `;
}

window.playAudio = function (text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Indonesian sounds closest to Malagasy in generic TTS
        // Try to find a better voice if available
        // const voices = speechSynthesis.getVoices();
        // utterance.voice = voices.find(v => v.lang.includes('mg')) || utterance.voice; 

        speechSynthesis.cancel(); // Stop valid audio
        speechSynthesis.speak(utterance);
    } else {
        alert("Audio non supporté sur cet appareil.");
    }
}

/* ============================================
   6. SPOTS & DATA RECOVERY
   ============================================ */
window.initSpotsPage = function () {
    const spotsContainer = document.getElementById('spotsContainer');
    if (!spotsContainer) return;

    // Filter logic: spotLocal = true OR type = 'Spot Local' OR is 'Incontournable' BUT not displayed in main lists
    // Simplified: Just show everything tagged "Spot Local"
    const spots = window.LIEUX_DATA.filter(l => l.spotLocal === true || l.categorie === 'Spot Local');

    if (spots.length === 0) {
        spotsContainer.innerHTML = "<p style='text-align:center;'>Aucun spot secret trouvé pour le moment.</p>";
    } else {
        spotsContainer.innerHTML = spots.map(lieu => createLieuCard(lieu, 'spot')).join('');
    }
}

/* ============================================
   7. PROVINCE & CITY PAGES (RESTORED logic)
   ============================================ */

window.initCityPages = function () {
    // 1. HYDRATION: Populate grids with data from LIEUX_DATA
    renderCityData();

    // 2. Filter logic for ALL province sections
    document.querySelectorAll('.province-section, .page-section').forEach(section => {
        // Exclude non-city sections like home/outils if they have this class, but usually they are specific
        if (!section.id.startsWith('page-')) return;

        const cityKey = section.id.replace('page-', ''); // e.g., 'diego', 'nosybe'

        // Find filter buttons within this section
        const btnAll = section.querySelector('.filter-btn[data-filter="all"]') || section.querySelector('.nav-pill');
        if (btnAll) {
            // Initialize with 'All'
            filterProvinceItems('all', getCityNameFromKey(cityKey), btnAll);
        }

        // Update premium info (weather etc)
        updatePremiumInfo(getCityNameFromKey(cityKey), cityKey);
    });
};

/* ============================================
   NEW: HYDRATION LOGIC (Fixing Empty Pages)
   ============================================ */
window.renderCityData = function () {
    if (!window.LIEUX_DATA) return;

    // Clear all grids first
    // Note: Keys match the 'ville' property in data/lieux.js OR mapped via logic
    const citiesStub = {
        'Diego-Suarez': 'Antsiranana',
        'Antsiranana': 'Antsiranana',
        'Nosy Be': 'NosyBe',
        'Mahajanga': 'Mahajanga',
        'Antananarivo': 'Antananarivo',
        'Toamasina': 'Toamasina',
        'Fianarantsoa': 'Fianarantsoa',
        'Toliara': 'Toliara'
    };

    // Clean containers
    Object.values(citiesStub).forEach(id => {
        const el = document.getElementById(`grid-${id}`);
        if (el) el.innerHTML = '';
    });

    // Populate
    let count = 0;
    window.LIEUX_DATA.forEach(lieu => {
        // Normalize Ville Name
        let v = lieu.ville ? lieu.ville.trim() : 'Inconnu';

        // Map ville name to Grid ID
        let gridId = citiesStub[v] || citiesStub[Object.keys(citiesStub).find(k => k.toLowerCase() === v.toLowerCase())];

        // Specific overrides
        if (v === 'Diego-Suarez') gridId = 'Antsiranana';
        if (v === 'Nosy Be' || v === 'Nosy-Be') gridId = 'NosyBe';

        // Target Grid
        if (gridId) {
            const grid = document.getElementById(`grid-${gridId}`);
            if (grid) {
                const card = createLieuCard(lieu);
                grid.insertAdjacentHTML('beforeend', card);
                count++;
            } else {
                console.warn(`Grid not found for ID: grid-${gridId} (Ville: ${v})`);
            }
        } else {
            console.warn(`No Grid ID mapped for city: ${v}`);
        }
    });
    console.log(`Rendered ${count} locations across city grids.`);
}



window.filterProvinceItems = function (cityKey, filterType, btn) {
    // 1. UI Update
    const container = document.getElementById(`page-${cityKey}`);
    if (!container) return;

    container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // 2. Filter Logic
    const items = container.querySelectorAll('.lieu-card');
    let count = 0;

    items.forEach(item => {
        const cat = item.dataset.category || '';
        let isMatch = false;

        if (filterType === 'all') isMatch = true;
        // Mapping simple text to categories
        else if (filterType === 'voir' && (cat === 'Nature' || cat === 'Plage' || cat === 'Culture' || cat === 'Incontournable' || cat === 'Spot Local')) isMatch = true;
        else if (filterType === 'manger' && (cat === 'Restaurant' || cat === 'Bar')) isMatch = true;
        else if (filterType === 'dormir' && (cat === 'Hotel' || cat === 'Lodge' || cat === 'Guesthouse')) isMatch = true;
        else if (filterType === 'sortir' && (cat === 'Bar' || cat === 'Club' || cat === 'Karaoke')) isMatch = true;

        // Budget Filter Check (Global or local var?)
        // For simplicity in restoration, we respect the category filter primarily. 
        // If needed, check selected budget buttons too.
        if (isMatch) {
            // Check budget if active
            const activeBudgetBtn = container.querySelector('.budget-btn.active');
            if (activeBudgetBtn) {
                const budgetLevel = activeBudgetBtn.dataset.level; // 1, 2, 3
                const itemPrice = parseInt(item.querySelector('.lieu-prix').className.includes('gratuit') ? 0 : (item.querySelector('.lieu-prix').className.includes('abordable') ? 1 : 2));
                // (Simplification: exact match not enforced strictly to avoid empty results, but "premium" filters high prices)
                // Let's implement strict if budget is selected
            }
        }

        if (isMatch) {
            item.style.display = 'flex'; // or grid? default is flex for cards in some layouts, but list uses grid.
            // Check parent container style. Usually cards are in a grid. 
            // Better: reset style to empty to pick up CSS grid/flex
            item.style.display = '';
            item.parentElement.style.display = 'grid'; // Ensure parent is visible
            count++;
        } else {
            item.style.display = 'none';
        }
    });

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
    container.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('active'));

    if (!isActive) {
        btn.classList.add('active');
    }

    // Re-run filter based on current active category
    const activeCatBtn = container.querySelector('.filter-btn.active');
    const filterType = activeCatBtn ? activeCatBtn.dataset.filter : 'all';
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
    const prixClass = lieu.prixNum === 0 ? 'gratuit' : lieu.prixNum < 10000 ? 'abordable' : 'premium';
    const activeClass = window.isFavorite(lieu.id) ? 'active' : '';
    const icon = window.isFavorite(lieu.id) ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';

    return `
        <article class="lieu-card" data-id="${lieu.id}" data-category="${category}" style="position: relative; cursor: pointer; display: flex;">
            <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite ${activeClass}">
                ${icon}
            </button>
            <div class="lieu-image" onclick="showLieuDetailsByID(${lieu.id})">
                <img src="${lieu.image}" alt="${lieu.nom}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
                <div class="lieu-badge">${lieu.type}</div>
            </div>
            <div class="lieu-content" onclick="showLieuDetailsByID(${lieu.id})">
                <div class="lieu-header">
                    <h3 class="lieu-title">${lieu.nom}</h3>
                    <div class="lieu-rating"><i class="fas fa-star"></i> ${lieu.note}</div>
                </div>
                <p class="lieu-desc">${lieu.description}</p>
                <div class="lieu-footer">
                   <span class="lieu-ville"><i class="fas fa-map-marker-alt"></i> ${lieu.ville}</span>
                   <span class="lieu-prix ${prixClass}">${lieu.prix}</span>
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

    const html = `
    <div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;">
        <div class="modal-content fade-in-up">
            <button class="btn-close-modal" onclick="closeLieuModal()"><i class="fas fa-times"></i></button>
            
            <div class="modal-image-container" style="background-image: url('${lieu.image}'); height: 250px; background-size: cover; background-position: center;">
                <div class="modal-gradient-overlay"></div>
                <div class="modal-header-content" style="position: absolute; bottom: 20px; left: 20px; right: 20px; color: white;">
                    <div class="modal-badges" style="display:flex; gap:10px; margin-bottom:10px;">
                        <span class="badge-type" style="background:var(--laterite);">${lieu.type}</span>
                        ${lieu.spotLocal ? '<span class="badge-type" style="background:#f39c12;">Spot Local</span>' : ''}
                    </div>
                    <h2 style="font-size: 1.8rem; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${lieu.nom}</h2>
                    <div style="display:flex; align-items:center; gap:10px; margin-top:5px; font-size: 0.9rem; opacity: 0.9;">
                        <span><i class="fas fa-map-marker-alt"></i> ${lieu.ville}</span>
                        <span><i class="fas fa-star" style="color:#f1c40f;"></i> ${lieu.note}</span>
                    </div>
                </div>
                <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite-modal ${activeClass}" style="position:absolute; top:20px; right:20px; background:white; color:var(--laterite); width:40px; height:40px; border-radius:50%; border:none; box-shadow:0 4px 6px rgba(0,0,0,0.2); font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                    ${favIcon}
                </button>
            </div>

            <div class="modal-body" style="padding: 25px;">
                <div class="modal-info-row" style="display:flex; justify-content:space-between; margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid var(--border-color);">
                    <div class="info-item">
                        <span style="display:block; font-size:0.8rem; color:var(--text-secondary);">Budget</span>
                        <span style="font-weight:600; color:var(--laterite);">${lieu.prix}</span>
                    </div>
                    <div class="info-item">
                        <span style="display:block; font-size:0.8rem; color:var(--text-secondary);">Catégorie</span>
                        <span style="font-weight:600;">${(lieu.tags && lieu.tags.length) ? lieu.tags[0] : 'Général'}</span>
                    </div>
                     <div class="info-item">
                        <span style="display:block; font-size:0.8rem; color:var(--text-secondary);">Sécurité</span>
                        <span style="font-weight:600; color:var(--success);">Sûr</span>
                    </div>
                </div>

                <p class="modal-desc" style="font-size: 1.1rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 25px;">
                    ${lieu.description}
                </p>

                <!-- CONTACT INFO SECTION (New) -->
                ${(lieu.telephone || lieu.website || lieu.adresse) ? `
                <div style="background:var(--bg-secondary); padding:15px; border-radius:12px; margin-bottom:20px; font-size:0.95rem;">
                    <h4 style="margin:0 0 10px 0; font-size:1rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px;">Infos Pratiques</h4>
                    
                    ${lieu.adresse ? `
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                        <i class="fas fa-map-pin" style="color:var(--laterite); width:20px; text-align:center;"></i>
                        <span>${lieu.adresse}</span>
                    </div>` : ''}

                    ${lieu.telephone ? `
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                        <i class="fas fa-phone" style="color:var(--secondary-color); width:20px; text-align:center;"></i>
                        <a href="tel:${lieu.telephone}" style="color:var(--text-primary); text-decoration:none; font-weight:600;">${lieu.telephone}</a>
                    </div>` : ''}

                    ${lieu.website ? `
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-globe" style="color:#3498db; width:20px; text-align:center;"></i>
                        <a href="${lieu.website.startsWith('http') ? lieu.website : 'https://' + lieu.website}" target="_blank" style="color:var(--text-primary); text-decoration:underline;">Visiter le site web</a>
                    </div>` : ''}
                </div>
                ` : ''}

                <div class="modal-actions" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <button class="btn-action primary" style="background:var(--laterite); color:white; border:none; padding:12px; border-radius:8px; font-weight:600;" onclick="locateOnMap(${lieu.lat}, ${lieu.lng})">
                        <i class="fas fa-location-arrow"></i> Y aller
                    </button>
                    ${lieu.type !== 'Restaurant' ? `
                    <button class="btn-action secondary" style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:12px; border-radius:8px; font-weight:600;" onclick="addToItineraryTemp(${lieu.id})">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>` : ''}
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
};

window.closeLieuModal = function () {
    const modal = document.getElementById('lieu-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
    document.body.style.overflow = '';
};

window.locateOnMap = function (lat, lng) {
    window.closeLieuModal();
    window.navigateToPage('carte');
    setTimeout(() => {
        if (window.leafletMap) {
            window.leafletMap.flyTo([lat, lng], 15);
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
    <div class="logistique-container">
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
                results.innerHTML = matching.slice(0, 5).map(l => `<div onclick="window.showLieuDetailsByID(${l.id}); document.getElementById('searchResults').style.display='none';" style="padding:10px; cursor:pointer;">${l.nom}</div>`).join('');
                results.style.display = 'block';
            });
            document.addEventListener('click', (e) => {
                if (!input.contains(e.target) && !results.contains(e.target)) results.style.display = 'none';
            });
        }
    });
});
/* ============================================
   8. THEME MANAGER (Dark/Light)
   ============================================ */
window.initTheme = function () {
    const toggleBtn = document.getElementById('themeToggle');
    // If button missing, maybe just set theme based on system/storage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (toggleBtn) toggleBtn.textContent = currentTheme === 'dark' ? '🌙' : '☀️';

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
}
