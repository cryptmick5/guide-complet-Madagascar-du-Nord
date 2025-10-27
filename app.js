// ATTENTION : Ce fichier s'appelle app.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Madagascar Guide - Démarrage');
    
    // 1. Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) targetSection.classList.add('active');
        
        const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        
        localStorage.setItem('activeSection', sectionId);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
        });
    });

    // Restaurer section
    const savedSection = localStorage.getItem('activeSection') || 'carte';
    showSection(savedSection);

    // 2. Thème sombre/clair
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    // 3. Carte Interactive
    try {
        const map = L.map('map').setView([-18.8792, 47.5079], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Points d'intérêt
        const points = [
            { name: 'Antananarivo', coords: [-18.8792, 47.5079], type: 'villes' },
            { name: 'Majunga', coords: [-15.7167, 46.3167], type: 'villes' },
            { name: 'Diego Suarez', coords: [-12.2787, 49.2917], type: 'villes' },
            { name: 'Nosy Be', coords: [-13.3167, 48.2667], type: 'villes' },
            { name: 'Parc Andasibe', coords: [-18.9333, 48.4167], type: 'parcs' },
            { name: 'Cirque Rouge', coords: [-15.7300, 46.3400], type: 'parcs' },
            { name: 'Mer d\'Émeraude', coords: [-12.2800, 49.3800], type: 'plages' },
            { name: 'Nosy Iranja', coords: [-13.5333, 48.0833], type: 'plages' }
        ];

        let allMarkers = [];

        points.forEach(point => {
            const marker = L.marker(point.coords)
                .addTo(map)
                .bindPopup(`<strong>${point.name}</strong>`);
            marker.type = point.type;
            allMarkers.push(marker);
        });

        // Filtres
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        function filterMarkers(filter) {
            allMarkers.forEach(marker => {
                if (filter === 'all' || marker.type === filter) {
                    map.addLayer(marker);
                } else {
                    map.removeLayer(marker);
                }
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterMarkers(this.getAttribute('data-filter'));
            });
        });

        // Recherche
        const searchInput = document.getElementById('mapSearch');
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            allMarkers.forEach(marker => {
                const content = marker.getPopup().getContent().toLowerCase();
                if (content.includes(searchTerm)) {
                    map.addLayer(marker);
                } else {
                    map.removeLayer(marker);
                }
            });
        });

    } catch (error) {
        console.error('Erreur carte:', error);
    }

    // 4. Service Worker (PWA)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('✅ Service Worker OK'))
            .catch(error => console.log('❌ Service Worker:', error));
    }

    console.log('✅ Application prête !');
});
