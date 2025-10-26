/* script.js - Version corrigée et complète
   Place ce fichier à la racine (même dossier que index.html)
*/
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js initialisé");

  // Sélecteurs
  const navLinks = document.querySelectorAll("nav .nav-link");
  const sections = {
    itineraire: document.getElementById("itineraire"),
    spots: document.getElementById("spots"),
    gallery: document.getElementById("gallery"),
    infos: document.getElementById("infos"),
    carte: document.getElementById("carte"),
    faq: document.getElementById("faq")
  };
  const themeBtn = document.getElementById("theme-toggle");

  // --- Helper : fade in ---
  const showWithFade = (el) => {
    el.style.opacity = 0;
    el.style.display = "";
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
    el.style.opacity = 1;
  };

  // --- Contenu (texte, images de secours publiques si assets vides) ---
  // URL de fallback (images libres)
  const FALLBACKS = {
    antananarivo: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=60",
    nosybe: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60",
    majunga: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=60",
    diego: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=60",
    lemur: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=60",
    baobab: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=60"
  };

  // Vérifie si une image locale existe (essayée via création d'un objet Image)
  const imageExists = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  // Remplissage Itinéraires
  const renderItineraires = () => {
    sections.itineraire.innerHTML = `
      <h2>Itinéraires par destination</h2>
      <div class="itineraire-card">
        <h3>Antananarivo</h3>
        <ul>
          <li>1j → Andasibe & Lémuriens (≈ 50€)</li>
          <li>1j → Ambohimanga UNESCO (≈ 10€)</li>
          <li>2-3j → Antsirabe & Lacs (≈ 100€)</li>
        </ul>
        <h3>Majunga</h3>
        <ul>
          <li>1j → Cirque Rouge & Lac Sacré (≈ 20€)</li>
          <li>2j → Grottes d'Anjohibe (≈ 60€)</li>
        </ul>
        <h3>Nosy Be</h3>
        <ul>
          <li>Nosy Iranja — excursion journée (≈ 50€)</li>
          <li>Nosy Komba — lémuriens & artisans</li>
        </ul>
      </div>
    `;
  };

  // Spots locaux
  const renderSpots = () => {
    sections.spots.innerHTML = `
      <h2>Spots Locaux</h2>
      <div class="spot-card">
        <ul>
          <li>Marché Analakely — gargottes et street food</li>
          <li>Allée des Baobabs — lever/ coucher de soleil magiques</li>
          <li>Plage d'Andilana (Nosy Be) — eau turquoise</li>
          <li>Parc national d'Andasibe — lémuriens et forêt humide</li>
        </ul>
      </div>
    `;
  };

  // Galerie (async pour tester disponibilités locales)
  const renderGallery = async () => {
    const items = [
      { file: "assets/images/antananarivo.jpg", alt: "Antananarivo", fallback: FALLBACKS.antananarivo, title: "Antananarivo" },
      { file: "assets/images/nosybe.jpg", alt: "Nosy Be", fallback: FALLBACKS.nosybe, title: "Nosy Be" },
      { file: "assets/images/majunga.jpg", alt: "Majunga", fallback: FALLBACKS.majunga, title: "Majunga" },
      { file: "assets/images/diego-suarez.jpg", alt: "Diego Suarez", fallback: FALLBACKS.diego, title: "Diego Suarez" },
      { file: "assets/images/lemur.jpg", alt: "Lémurien", fallback: FALLBACKS.lemur, title: "Lémurien" }
    ];

    let html = `<h2>Galerie Madagascar</h2><div class="gallery-grid">`;
    for (const it of items) {
      const exists = await imageExists(it.file);
      const src = exists ? it.file : it.fallback;
      html += `
        <div class="card">
          <img loading="lazy" src="${src}" alt="${it.alt}" onerror="this.src='${it.fallback}'">
          <h3>${it.title}</h3>
          <p>${it.alt}</p>
        </div>
      `;
    }
    html += `</div>`;
    sections.gallery.innerHTML = html;
  };

  // Infos pratiques
  const renderInfos = () => {
    sections.infos.innerHTML = `
      <h2>Infos Pratiques</h2>
      <ul>
        <li>Visa : souvent disponible à l'arrivée (vérifier avant départ)</li>
        <li>Santé : moustiquaires, protection anti-paludisme si zones à risque</li>
        <li>Monnaie : Ariary (MGA) — taux indicatif : 1€ ≈ 5 200 Ar</li>
        <li>Saison : avril → novembre (saison sèche conseillée)</li>
      </ul>
    `;
  };

  // FAQ
  const renderFAQ = () => {
    sections.faq.innerHTML = `
      <h2>FAQ & Glossaire</h2>
      <ul>
        <li><strong>Comment obtenir le visa ?</strong> - Contrôler selon nationalité avant départ.</li>
        <li><strong>Quel budget ?</strong> - Dépend du confort ; prévoir extra transports.</li>
        <li><strong>Que signifie "Fady" ?</strong> - Interdits ou tabous locaux, respecte-les.</li>
      </ul>
    `;
  };

  // Carte (initialisation Leaflet si présent)
  let mapInitialised = false;
  const initMap = () => {
    if (mapInitialised) return;
    if (typeof L === "undefined") {
      console.warn("Leaflet non chargé — vérifie la balise <script> pour leaflet.");
      sections.carte.innerHTML = `<h2>Carte</h2><p>Leaflet non disponible. Vérifie que la dépendance est chargée.</p>`;
      return;
    }
    const mapDiv = document.querySelector("#map");
    if (!mapDiv) {
      sections.carte.innerHTML = `<h2>Carte</h2><div id="map" style="height:350px;"></div>`;
    }
    // petite attente pour s'assurer que l'élément est en DOM
    setTimeout(() => {
      try {
        const map = L.map('map').setView([-18.8792, 47.5079], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: "© OpenStreetMap" }).addTo(map);
        const villes = [
          { name:"Antananarivo", lat:-18.8792, lon:47.5079 },
          { name:"Majunga", lat:-15.7167, lon:46.3167 },
          { name:"Diego Suarez", lat:-12.276, lon:49.311 },
          { name:"Nosy Be", lat:-13.3989, lon:48.2768 }
        ];
        villes.forEach(v => L.marker([v.lat, v.lon]).addTo(map).bindPopup(v.name));
        mapInitialised = true;
      } catch (err) {
        console.error("Erreur initialisation carte :", err);
        sections.carte.innerHTML = `<h2>Carte</h2><p>Impossible d'initialiser la carte : ${err.message}</p>`;
      }
    }, 100);
  };

  // Remplissage initial (vide les sections d'abord puis remplit)
  const prepareAll = async () => {
    // vider pour éviter affichage incohérent
    Object.values(sections).forEach(s => { if (s) s.innerHTML = ""; });

    renderItineraires();
    renderSpots();
    await renderGallery();
    renderInfos();
    renderFAQ();
    // carte : laisser vide tant que l'utilisateur ne clique pas, mais créer div pour Leaflet
    if (sections.carte) sections.carte.innerHTML = `<div id="map" style="height:350px;"></div>`;
  };

  // Navigation : on se base sur les href (#itineraire, #spots, #gallery, #infos, #carte, #faq)
  const activateNav = (targetId) => {
    // masque toutes les sections
    Object.keys(sections).forEach(key => {
      const s = sections[key];
      if (!s) return;
      if (key === targetId) {
        showWithFade(s);
      } else {
        s.style.display = "none";
      }
    });
    // si on affiche la carte, init
    if (targetId === "carte") initMap();
  };

  // Add listeners to nav links
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // remove active
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const href = link.getAttribute("href") || "";
      const id = href.replace("#", "");
      // correspondance : index.html utilise 'itineraire' (singulier), 'spots', 'gallery', 'infos', 'carte', 'faq'
      activateNav(id);
      // scroll top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Theme toggle (bouton existant dans HTML)
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    // On applique classes dark aussi aux cartes si besoin
    document.querySelectorAll('.card, .itineraire-card, .spot-card').forEach(el => el.classList.toggle('dark'));
  });

  // Lancement initial : remplissage + affichage itineraire
  prepareAll().then(() => {
    // montre par défaut 'itineraire' (le bouton nav correspondant devrait être actif)
    // si aucun nav active, active le premier
    const active = document.querySelector("nav .nav-link.active");
    if (active) {
      const id = (active.getAttribute("href") || "").replace("#", "") || "itineraire";
      activateNav(id);
    } else {
      // active le premier lien
      const first = document.querySelector("nav .nav-link");
      if (first) {
        first.classList.add("active");
        const id = (first.getAttribute("href") || "").replace("#", "") || "itineraire";
        activateNav(id);
      } else {
        activateNav("itineraire");
      }
    }
  });

  // Si l'URL a un hash (ex: #carte) : ouvrir directement la section
  if (location.hash) {
    const h = location.hash.replace("#", "");
    const matching = Array.from(navLinks).find(n => (n.getAttribute("href")||"").replace("#","") === h);
    if (matching) {
      matching.click();
    }
  }
});
