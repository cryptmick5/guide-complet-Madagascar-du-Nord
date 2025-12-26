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
    

    // ✨ AUTO-INJECT BUDGET BUTTONS (Added by ultimate_budget_fix_v2.py)
    document.querySelectorAll('.province-section, .page-section').forEach(section => {
        if (!section.id.startsWith('page-')) return;
        
        const cityKey = section.id.replace('page-', '');
        const navPills = section.querySelector('.nav-pills');
        
        if (!navPills || section.querySelector('.budget-pills-container')) return;
        
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
            btn.onclick = function() { toggleProvinceBudget(cityKey, b.level, this); };
            btn.innerHTML = `<i class="fas ${b.icon}"></i> ${b.label} <span style="font-size: 0.75rem; opacity: 0.8;">${b.desc}</span>`;
            pills.appendChild(btn);
        });
        
        budgetContainer.appendChild(pills);
        navPills.parentNode.insertBefore(budgetContainer, navPills.nextSibling);
        
        console.log(`✅ Budget buttons injected for: ${cityKey}`);
    });

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
        'Andasibe': 'Toamasina', 'Sainte-Marie': 'Toamasina', 'Mananara': 'Toamasina',
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
    // Populate
    let count = 0;
    window.LIEUX_DATA.forEach(lieu => {
        let v = lieu.ville ? lieu.ville.trim() : 'Inconnu';

        // NORD LOGIC: Both Diego and Nosy Be go to Antsiranana (The Hub)
        // But we keep original 'v' in data attributes for filtering
        let gridId = citiesStub[v] || citiesStub[Object.keys(citiesStub).find(k => k.toLowerCase() === v.toLowerCase())];

        // Specific overrides for the "Nord" Page Hub
        if (v === 'Diego-Suarez') gridId = 'Antsiranana';
        // if (v === 'Nosy Be' || v === 'Nosy-Be') gridId = 'Antsiranana'; // REMOVED: Nosy Be is now independent

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
    console.log(`Rendered ${count} locations across city grids. Limits removed.`);

    // Auto-Init Switch if on North Page
    // initNorthSwitch(); // REMOVED: Nosy Be is independent
}

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
            const activeBudgetBtn = container.querySelector('.budget-btn.active');
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
            item.parentElement.style.display = 'grid'; // Grid Item wrapper
            item.style.display = 'flex'; // Card itself
            count++;
        } else {
            item.parentElement.style.display = 'none';
            item.style.display = 'none';
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
    container.querySelectorAll('.budget-btn').forEach(b => b.classList.remove('active'));

    if (!isActive) {
        btn.classList.add('active');
    }

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
    const displayTags = (lieu.tags || []).slice(0, 3).map(t => `<span class="card-tag" style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:12px; font-size:0.7rem; color:var(--text-secondary); border:1px solid var(--border-color);">${t}</span>`).join('');

    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    const badgeText = isMustSee ? 'Incontournable' : lieu.type;

    // 3. Template (Rich & Premium)
    return `
        <article class="lieu-card" 
                 data-id="${lieu.id}" 
                 data-category="${category}" 
                 data-tags="${tagsString}" 
                 data-type="${lieu.type}" 
                 data-ville="${lieu.ville}"
                 style="position: relative; cursor: pointer; display: flex; flex-direction: column; background: var(--bg-card); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s; border: 1px solid var(--border-color);">
            
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
                <div class="lieu-badge" style="position: absolute; bottom: 10px; left: 10px; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${badgeStyle}">${badgeText}</div>
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
                <div class="lieu-tags" style="display: flex; gap: 6px; flex-wrap: wrap;">${displayTags}</div>

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
    <div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;">
        <div class="modal-content fade-in-up">
            
            <!-- 1. HERO HEADER (Fixed with fallback & 100% min-height) -->
            <div class="modal-hero-header" style="min-height: 200px; background: var(--bg-secondary); position: relative;">
                <img src="${lieu.image}" alt="${lieu.nom}" class="modal-hero-img" 
                     style="width: 100%; height: 250px; object-fit: cover;"
                     onerror="this.onerror=null; this.src=''; this.parentElement.style.background='linear-gradient(135deg, var(--laterite), var(--noir))'; this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:3rem;\'><i class=\'fas fa-image\'></i></div>' + this.parentElement.innerHTML;">
                
                <!-- Close Button: FORCED POSITION & Z-INDEX -->
                <button class="btn-close-modal-overlay" onclick="window.closeLieuModal();" 
                        style="position: absolute; top: 15px; right: 15px; z-index: 99999; background: white; border: none; border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary);">
                    <i class="fas fa-times" style="font-size: 1.2rem;"></i>
                </button>
                
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
            ${lieu.conseil ? `
            <div class="modal-conseil-block">
                <div class="modal-conseil-title"><i class="fas fa-lightbulb"></i> Conseil du Local</div>
                <p class="modal-conseil-text">${lieu.conseil}</p>
            </div>
            ` : ''}

            <!-- 6. FOOTER ACTIONS -->
            <div class="modal-footer-actions">
                <div class="modal-section-title">ACCÈS</div>
                
                ${lieu.acces ? `<p style="color:var(--text-secondary); margin-bottom:12px; font-size:0.9rem;">${lieu.acces}</p>` : ''}

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
                     <button class="btn-action secondary" onclick="locateOnMap(${lieu.lat}, ${lieu.lng})"
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
window.filterProvinceItems = function (filterType, city, btnElement) {
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


// --- FIX: SECURE CARD GENERATION ---
window.createLieuCard = function (lieu, category = '') {
    // 1. Logic & Safety
    if (!category) category = lieu.categorie || 'Explorer';

    const prixClass = (lieu.prixNum === 0) ? 'gratuit' : (lieu.prixNum < 10000) ? 'abordable' : 'premium';
    const isFav = (window.isFavorite && window.isFavorite(lieu.id));
    const activeClass = isFav ? 'active' : '';
    const icon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';

    // 2. Data Preparation
    // Escape quotes in strings to avoid HTML breakage
    const escapeAttr = (s) => String(s || '').replace(/"/g, '&quot;');
    const escapeJs = (s) => String(s || '').replace(/'/g, "\'");

    const tagsString = (lieu.tags || []).join(',');
    const displayTags = (lieu.tags || []).slice(0, 3).map(t =>
        `<span class="card-tag" style="background:rgba(0,0,0,0.05); padding:2px 8px; border-radius:12px; font-size:0.7rem; color:var(--text-secondary); border:1px solid var(--border-color);">${t}</span>`
    ).join('');

    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    const badgeText = isMustSee ? 'Incontournable' : lieu.type;

    // 3. Template (Rich & Premium)
    // NOTE: Onclick handlers use QUOTED strings for safety
    return `
        <article class="lieu-card" 
                 data-id="${lieu.id}" 
                 data-tags="${escapeAttr(tagsString)}" 
                 data-ville="${escapeAttr(lieu.ville)}"
                 style="position: relative; cursor: pointer; display: flex; flex-direction: column; background: var(--bg-card); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm); transition: transform 0.2s; border: 1px solid var(--border-color);">
            
            <div class="badge-location" style="position: absolute; top: 10px; left: 10px; z-index: 5; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                <i class="fas fa-map-marker-alt" style="margin-right:4px;"></i> ${lieu.ville}
            </div>

            <button onclick="toggleLieuFavorite(${lieu.id}, this, event)" class="btn-favorite ${activeClass}" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 5; background: white; border-radius: 50%; width: 32px; height: 32px; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                ${icon}
            </button>
            
            <div class="lieu-image" onclick="showLieuDetailsByID(${lieu.id})" style="position: relative; height: 180px; overflow: hidden;">
                <img src="${lieu.image}" alt="${escapeAttr(lieu.nom)}" loading="lazy" onerror="this.src='images/placeholder.jpg'" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
                <div class="lieu-badge" style="position: absolute; bottom: 10px; left: 10px; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${badgeStyle}">${badgeText}</div>
            </div>
            
            <div class="lieu-content" onclick="showLieuDetailsByID(${lieu.id})" style="padding: 15px; flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div class="lieu-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin: 0;">
                    <h3 class="lieu-title" style="margin: 0; font-size: 1.1rem; color: var(--text-primary); line-height: 1.3; font-weight: 700;">${lieu.nom}</h3>
                    <div class="lieu-rating" style="display: flex; align-items: center; gap: 4px; font-size: 0.85rem; color: var(--text-primary); background: var(--bg-body); padding: 2px 6px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <i class="fas fa-star" style="color: #f1c40f; font-size: 0.8rem;"></i> ${lieu.note}
                    </div>
                </div>

                <div class="lieu-tags" style="display: flex; gap: 6px; flex-wrap: wrap;">${displayTags}</div>

                <p class="lieu-desc" style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5;">${lieu.description}</p>

                <div class="lieu-footer" style="margin-top: auto; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-top: 1px solid var(--border-color);">
                     <div style="font-weight: 700; color: #b03030;">${lieu.prix || ''}</div>
                </div>
            </div>
        </article>
    `;
};


// --- PATCH FINAL : FILTRES BUDGET & VILLES ---
window.filterProvinceItems = function (filterType, city, btnElement) {
    console.log("🔍 Filtre activé:", filterType);

    // 1. Visuel Bouton
    if (btnElement) {
        const parent = btnElement.parentElement;
        parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
        btnElement.classList.add('active');
    }

    // 2. Mapping du Tag
    let tagVise = filterType; // Par défaut (ex: 'Explorer')

    // Traduction des codes boutons vers les Tags réels
    if (['low', '€', 'pas cher'].includes(filterType)) tagVise = '€';
    if (['mid', '€€', 'moyen'].includes(filterType)) tagVise = '€€';
    if (['high', '€€€', 'luxe'].includes(filterType)) tagVise = '€€€';
    if (filterType === 'dodo') tagVise = 'Dormir';
    if (filterType === 'spot') tagVise = 'Spots';

    // 3. Filtrage
    const data = window.LIEUX_DATA || [];
    const filtered = data.filter(item => {
        // Filtre Ville (Approximatif pour gérer Diego/Antsiranana)
        const vItem = (item.ville || "").toLowerCase();
        const vPage = city.toLowerCase();

        let villeOk = false;
        if (vItem.includes(vPage)) villeOk = true;
        else if (vPage.includes('diego') && vItem.includes('antsiranana')) villeOk = true;
        else if (vPage.includes('nosy') && vItem.includes('nosy')) villeOk = true;
        else if (vPage.includes('tana') && vItem.includes('antananarivo')) villeOk = true;
        else if (vPage.includes('amneville')) villeOk = true; // Fallback pour tests
        else if (vPage.includes('majunga') && vItem.includes('mahajanga')) villeOk = true;

        if (!villeOk) return false;

        // Filtre Tag
        if (filterType === 'all') return true;
        return (item.tags && item.tags.includes(tagVise));
    });

    // 4. Rendu
    // On essaie de trouver le conteneur de grille
    let container = document.getElementById('grid-' + city.replace(/ /g, ''));

    // Fallback ID pour noms composés (ex: grid-Diego)
    if (!container) {
        const simpleName = city.split(' ')[0].replace('-', '');
        container = document.querySelector(`[id^='grid-${simpleName}']`) || document.getElementById('grid-' + simpleName);
    }

    if (container) {
        container.innerHTML = '';
        if (filtered.length === 0) {
            container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;opacity:0.6">Aucun lieu trouvé pour ce budget/catégorie 🤷‍♂️</div>';
        }
        filtered.forEach(item => {
            // Utilisation de la fonction existante secure si dispo, sinon fallback manuel
            if (window.createLieuCard) {
                container.innerHTML += window.createLieuCard(item);
            } else {
                const card = document.createElement('div');
                card.className = 'lieu-card';
                card.setAttribute('onclick', `window.openLieuModal ? window.openLieuModal(${item.id}) : console.log('Modal missing')`);
                card.innerHTML = `
                    <div class="card-image" style="background-image: url('${item.image}');">
                        <span class="badge-type">${item.type}</span>
                    </div>
                    <div class="card-content">
                        <h3>${item.nom}</h3>
                        <div class="card-meta"><span>📍 ${item.ville}</span><span>⭐ ${item.note}</span></div>
                        <div class="card-price" style="margin-top:5px;font-weight:bold;color:#d35400">${item.prix}</div>
                    </div>`;
                container.appendChild(card);
            }
        });

        // Réattacher les événements si nécessaire (createLieuCard retourne une string HTML)
        // Pas besoin si onclick est inline.
    } else {
        console.warn("❌ Container Grille introuvable pour la ville:", city);
    }
};


// --- MOTEUR D'AFFICHAGE UNIVERSEL (V4 - FIX DISPARITION) ---
window.filterProvinceItems = function (filterType, city, btnElement) {
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
            card.onclick = function () {
                console.log("Clic sur", item.nom);
                if (window.openLieuModal) window.openLieuModal(item.id);
                else if (window.openModalSafe) window.openModalSafe(item);
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


// --- MOTEUR RENDU V7 (DESIGN PREMIUM + LOGIQUE ROBUSTE) ---
window.filterProvinceItems = function (filterType, city, btnElement) {
    console.log("⚙️ ENGINE : Filtre =", filterType, "/ Ville =", city);

    // 1. UI BOUTONS
    if (btnElement) {
        const parent = btnElement.parentElement;
        if (parent) {
            parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    // 2. CIBLAGE CONTENEUR (Algorithme "Best Match")
    // On nettoie le nom de la ville pour trouver l'ID (ex: "Nosy Be" -> "grid-NosyBe")
    let safeCity = city.replace(/ /g, '').replace(/-/g, '');
    let container = document.getElementById('grid-' + city) ||
        document.getElementById('grid-' + safeCity) ||
        document.getElementById('grid-' + city.split(' ')[0]);

    // Fallback : Prendre la première grille visible
    if (!container) {
        const section = document.querySelector('section:not([style*="display: none"]) .lieux-grid');
        if (section) container = section;
    }

    if (!container) return console.error("❌ CRITIQUE : Aucune grille trouvée pour l'injection.");

    // RESET GRILLE (Force le CSS Grid)
    container.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; padding: 20px 0;";
    container.innerHTML = '';

    // 3. LOGIQUE DE FILTRAGE
    const data = window.LIEUX_DATA || [];
    let targetTag = filterType;

    // Traduction UI -> Data
    const map = {
        'manger': 'Manger', 'resto': 'Manger',
        'dodo': 'Dormir', 'dormir': 'Dormir',
        'explorer': 'Explorer', 'nature': 'Explorer',
        'sortir': 'Sortir', 'bar': 'Sortir',
        'spot': 'Spots', 'spots': 'Spots',
        // Prix (Mapping vers les codes sûrs)
        'low': 'budget_1', '€': 'budget_1',
        'mid': 'budget_2', '€€': 'budget_2',
        'high': 'budget_3', '€€€': 'budget_3'
    };
    if (map[filterType]) targetTag = map[filterType];

    const filtered = data.filter(item => {
        // Match Ville (Approximatif)
        const vItem = (item.ville || "").toLowerCase();
        const vPage = city.toLowerCase();
        let cityMatch = vItem.includes(vPage) || vPage.includes(vItem);

        // Exceptions manuelles
        if (vPage.includes('diego') && vItem.includes('antsiranana')) cityMatch = true;
        if (vPage.includes('tana') && vItem.includes('antananarivo')) cityMatch = true;
        if (vPage.includes('nosy') && vItem.includes('nosy')) cityMatch = true;

        if (!cityMatch) return false;
        if (filterType === 'all') return true;
        return (item.tags && item.tags.includes(targetTag));
    });

    console.log(`📊 ${filtered.length} résultats.`);

    // 4. RENDU VISUEL (CSS INJECTÉ POUR STABILITÉ)
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:50px;color:#666;font-size:1.2rem;">Aucun résultat pour cette sélection 😕</div>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'lieu-card';
        // CSS CARTE : Ombre, Arrondi, Transition
        card.style.cssText = "background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: transform 0.3s ease; cursor: pointer; border: 1px solid rgba(0,0,0,0.05);";

        // Image
        const img = item.image || 'images/placeholders/default.jpg';

        // Badge Prix Visuel
        let priceIcon = '€';
        if (item.tags.includes('budget_2')) priceIcon = '€€';
        if (item.tags.includes('budget_3')) priceIcon = '€€€';

        card.innerHTML = `
            <div style="height: 220px; width: 100%; position: relative; overflow: hidden;">
                <div style="width:100%; height:100%; background-image: url('${img}'); background-size: cover; background-position: center; transition: transform 0.5s;"></div>
                <span style="position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.95); padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 800; color: #333; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    ${item.type}
                </span>
            </div>
            
            <div style="padding: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 1.25rem; font-weight: 700; color: #2c3e50; line-height: 1.4;">${item.nom}</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 0.9rem; color: #7f8c8d;">
                    <span><i class="fas fa-map-marker-alt" style="color:#e74c3c; margin-right:5px;"></i> ${item.ville}</span>
                    <span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 6px; font-weight: bold;">⭐ ${item.note}</span>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: #27ae60; font-size: 1.1rem;">${item.prix || ''}</span>
                    <span style="font-size: 0.9rem; color: #bdc3c7; font-weight:600; border: 1px solid #eee; padding: 4px 8px; border-radius: 4px;">${priceIcon}</span>
                </div>
            </div>
        `;

        // Interaction Hover
        card.onmouseenter = function () {
            this.style.transform = 'translateY(-8px)';
            this.querySelector('div[style*="background-image"]').style.transform = 'scale(1.05)';
        };
        card.onmouseleave = function () {
            this.style.transform = 'translateY(0)';
            this.querySelector('div[style*="background-image"]').style.transform = 'scale(1)';
        };

        // Click Modal
        card.onclick = () => {
            if (window.openLieuModal) window.openLieuModal(item.id);
        };

        container.appendChild(card);
    });
};



// ============================================
// 9. MOTEUR DE VUE PREMIUM (V7 FINAL)
// ============================================

// A. Création Carte Premium (Sécurisée)
window.createLieuCard = function (lieu, category = '') {
    if (!category) category = lieu.categorie || 'Explorer';

    // Détection Prix
    let prixAffich = lieu.prix || '';
    if (prixAffich === 'Gratuit' || prixAffich === '0') prixAffich = '<span style="color:#2ecc71">Gratuit</span>';

    // Badges & Favoris
    const isFav = (window.isFavorite && window.isFavorite(lieu.id));
    const activeClass = isFav ? 'active' : '';
    const icon = isFav ? '<i class="fa-solid fa-bookmark"></i>' : '<i class="fa-regular fa-bookmark"></i>';

    const isMustSee = lieu.type === 'Incontournable' || (lieu.tags && lieu.tags.includes('Incontournable'));
    const badgeStyle = isMustSee ? 'background: #d35400; color: white;' : 'background: rgba(0,0,0,0.6); color: white;';
    const badgeText = isMustSee ? 'Incontournable' : lieu.type;

    // Tags
    const tagsHtml = (lieu.tags || []).slice(0, 3).map(t =>
        `<span style="background:var(--bg-primary); padding:3px 8px; border-radius:4px; font-size:0.7rem; color:var(--text-secondary); border:1px solid var(--border-color);">${t}</span>`
    ).join('');

    // Escapes
    const safeName = (lieu.nom || '').replace(/"/g, '&quot;');
    const safeVille = (lieu.ville || '').replace(/"/g, '&quot;');
    const safeImage = lieu.image || 'images/placeholders/default.jpg';

    return `
        <article class="lieu-card" onclick="showLieuDetailsByID(${lieu.id})"
                 style="position: relative; background: var(--bg-secondary); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s; border: 1px solid var(--border-color); cursor: pointer; display: flex; flex-direction: column;">
            
            <div style="position: relative; height: 180px; overflow: hidden;">
                <img src="${safeImage}" alt="${safeName}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onerror="this.src='images/placeholder.jpg'">
                
                <div style="position: absolute; top: 10px; left: 10px; ${badgeStyle} padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                    ${badgeText}
                </div>

                <div onclick="event.stopPropagation(); toggleLieuFavorite(${lieu.id}, this, event)" class="${activeClass}"
                     style="position: absolute; top: 10px; right: 10px; background: var(--bg-secondary); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); color: ${isFav ? 'var(--premium)' : 'var(--text-secondary)'}; font-size: 1rem;">
                     ${icon}
                </div>
            </div>
            
            <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); line-height: 1.4;">${lieu.nom}</h3>
                
                <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
                    ${tagsHtml}
                </div>
                
                <p style="margin: 0 0 15px 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${lieu.description}
                </p>
                
                <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; color: var(--abordable); font-size: 0.95rem;">${prixAffich}</div>
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 0.8rem; color: #f1c40f; font-weight: 700; background: var(--bg-primary); padding: 2px 6px; border-radius: 4px;">
                        <i class="fas fa-star"></i> ${lieu.note}
                    </div>
                </div>
            </div>
        </article>
    `;
};


// B. Moteur de Filtre Centralisé (Diego & Nosy Be & autres)
window.filterProvinceItems = function (filterType, city, btnElement) {
    console.log("🚀 ENGINE V7 : Filter=" + filterType + " | City=" + city);

    // 1. UI Buttons
    if (btnElement) {
        const parent = btnElement.parentElement;
        if (parent) {
            parent.querySelectorAll('.nav-pill').forEach(el => el.classList.remove('active'));
            btnElement.classList.add('active');
        }
    }

    // 2. Data Source
    const data = window.LIEUX_DATA || [];
    if (data.length === 0) console.warn("⚠️ LIEUX_DATA vide !");

    // 3. Normalisation Arg Villes (Pour matching data)
    // Diego-Suarez dans Data, Antsiranana dans Code/ID
    const targetCityLower = city.toLowerCase();

    // 4. Filtrage
    const filtered = data.filter(item => {
        const itemVille = (item.ville || "").toLowerCase();
        let cityMatch = false;

        // Logique stricte mais tolérante
        if (itemVille.includes(targetCityLower)) cityMatch = true;
        if (targetCityLower.includes(itemVille) && itemVille.length > 3) cityMatch = true;

        // Aliases explicites
        if (targetCityLower.includes('antsiranana') && itemVille.includes('diego')) cityMatch = true;
        if (targetCityLower.includes('diego') && itemVille.includes('antsiranana')) cityMatch = true;

        if (targetCityLower.includes('nosy') && itemVille.includes('nosy')) cityMatch = true;

        if (targetCityLower.includes('tulear') && itemVille.includes('toliara')) cityMatch = true;
        if (targetCityLower.includes('toliara') && itemVille.includes('tulear')) cityMatch = true;

        if (targetCityLower.includes('tamatave') && itemVille.includes('toamasina')) cityMatch = true;
        if (targetCityLower.includes('toamasina') && itemVille.includes('tamatave')) cityMatch = true;

        if (targetCityLower.includes('majunga') && itemVille.includes('mahajanga')) cityMatch = true;
        if (targetCityLower.includes('mahajanga') && itemVille.includes('majunga')) cityMatch = true;

        if (!cityMatch) return false;

        // Filtre Tag
        if (filterType === 'all') return true;

        // Mapping Tags
        let tagTarget = filterType;
        if (filterType === 'low') tagTarget = '€'; // budget_1 ? non data uses prices mostly or budget tags. Let's check logic.
        // Data has tags: "budget_1", "budget_2", "budget_3" OR "€", "€€" ?
        // Look at data: "budget_1"
        if (filterType === 'low' || filterType === '€') tagTarget = 'budget_1';
        if (filterType === 'mid' || filterType === '€€') tagTarget = 'budget_2';
        if (filterType === 'high' || filterType === '€€€') tagTarget = 'budget_3';

        // Tag matching
        if (!item.tags) return false;

        // Match exact or partial? Array includes.
        // Data tags are capitalized "Explorer", "Manger" etc.
        // UI sends 'explorer' (lowercase).
        // Let's lowercase everything for check
        const itemTagsLow = item.tags.map(t => t.toLowerCase());
        return itemTagsLow.includes(tagTarget.toLowerCase()) ||
            (item.type && item.type.toLowerCase() === tagTarget.toLowerCase());
    });

    console.log(`📊 ${filtered.length} résultats trouvés.`);

    // 5. Injection DOM
    // Identification Conteneur ID
    let container = null;

    // Essais successifs d'IDs
    const candidates = [
        'grid-' + city,
        'grid-' + city.replace(/ /g, ''),
        'grid-' + city.replace(/-/g, ''),
        'grid-' + city.split(' ')[0]
    ];

    // Aliases IDs
    if (targetCityLower.includes('diego') || targetCityLower.includes('antsiranana')) candidates.push('grid-Antsiranana');
    if (targetCityLower.includes('nosy')) candidates.push('grid-NosyBe');
    if (targetCityLower.includes('tana')) candidates.push('grid-Antananarivo');
    if (targetCityLower.includes('tamatave') || targetCityLower.includes('toamasina')) candidates.push('grid-Toamasina');
    if (targetCityLower.includes('majunga') || targetCityLower.includes('mahajanga')) candidates.push('grid-Mahajanga');
    if (targetCityLower.includes('tulear') || targetCityLower.includes('toliara')) candidates.push('grid-Toliara');

    for (let id of candidates) {
        const el = document.getElementById(id);
        if (el) { container = el; break; }
    }

    if (!container) {
        console.error("❌ CRITIQUE: Aucun conteneur trouvé pour " + city);
        return;
    }

    // Reset et Remplissage
    container.innerHTML = '';

    // Style de Grille Force
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    container.style.gap = '20px';

    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">Aucun lieu pour ce filtre.</div>';
        return;
    }

    filtered.forEach(item => {
        container.insertAdjacentHTML('beforeend', window.createLieuCard(item));
    });
};
