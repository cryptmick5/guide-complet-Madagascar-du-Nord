document.addEventListener("DOMContentLoaded", () => {
  // Sélection des liens de navigation et des sections
  const navLinks = document.querySelectorAll("nav .nav-link");
  const themeBtn = document.getElementById("theme-toggle");
  const sections = {
    itineraire: document.getElementById("itineraire"),
    spots: document.getElementById("spots"),
    gallery: document.getElementById("gallery"),
    infos: document.getElementById("infos"),
    carte: document.getElementById("carte"),
    faq: document.getElementById("faq")
  };

  // Helper fade-in (animation douce)
  const showWithFade = el => {
    Object.values(sections).forEach(sec => { if (sec) sec.style.display = "none"; });
    el.style.opacity = 0;
    el.style.display = "";
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, fill: "forwards" });
    setTimeout(() => { el.style.opacity = 1; }, 280);
  };

  // Remplissage du contenu dynamique
  sections.itineraire.innerHTML = `
    <h2>Itinéraires par destination</h2>
    <div class="itineraire-card">
      <h3>Antananarivo</h3>
      <ul>
        <li>Andasibe & Lémuriens (1j, ≈ 50€)</li>
        <li>Ambohimanga UNESCO (1j, ≈ 10€)</li>
        <li>Antsirabe & Lacs (2-3j, ≈ 100€)</li>
      </ul>
      <h3>Majunga</h3>
      <ul>
        <li>Cirque Rouge & Lac Sacré (1j, ≈ 20€)</li>
        <li>Grottes d’Anjohibe (2j, ≈ 60€)</li>
      </ul>
      <h3>Nosy Be</h3>
      <ul>
        <li>Nosy Iranja journée (≈ 50€)</li>
        <li>Nosy Komba — lémuriens & artisans</li>
      </ul>
    </div>
  `;

  sections.spots.innerHTML = `
    <h2>Spots Locaux</h2>
    <div class="spot-card">
      <ul>
        <li>Marché Analakely — street food</li>
        <li>Allée des Baobabs — lever/coucher de soleil</li>
        <li>Plage d'Andilana (Nosy Be)</li>
        <li>Parc d'Andasibe — lémuriens</li>
      </ul>
    </div>
  `;

  // Galerie d'images (fallback public si asset absent)
  const FALLBACKS = [
    { file: "assets/images/antananarivo.jpg", alt: "Antananarivo", fallback: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=60", title: "Antananarivo" },
    { file: "assets/images/nosybe.jpg", alt: "Nosy Be", fallback: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=60", title: "Nosy Be" },
    { file: "assets/images/majunga.jpg", alt: "Majunga", fallback: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=1200&q=60", title: "Majunga" },
    { file: "assets/images/diego-suarez.jpg", alt: "Diego Suarez", fallback: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=60", title: "Diego Suarez" },
    { file: "assets/images/lemur.jpg", alt: "Lémurien", fallback: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=60", title: "Lémurien" }
  ];
  const makeGallery = async () => {
    let html = `<h2>Galerie Madagascar</h2><div class="gallery-grid">`;
    for (const it of FALLBACKS) {
      let src = it.file;
      try {
        await new Promise((res, rej) => {
          const img = new Image();
          img.src = it.file;
          img.onload = () => res();
          img.onerror = () => rej();
        });
      } catch {
        src = it.fallback;
      }
      html += `
        <div class="card">
          <img loading="lazy" src="${src}" alt="${it.alt}" onerror="this.src='${it.fallback}'">
          <h3>${it.title}</h3>
        </div>
      `;
    }
    html += `</div>`;
    sections.gallery.innerHTML = html;
  };

  sections.infos.innerHTML = `
    <h2>Infos Pratiques</h2>
    <ul>
      <li>Visa disponible à l'arrivée (vérifier selon nationalité)</li>
      <li>Santé : moustiquaires, prévention paludisme</li>
      <li>Monnaie : Ariary (MGA), 1€ ≈ 5200 Ar</li>
      <li>Saison sèche = avril → novembre</li>
    </ul>
  `;

  sections.faq.innerHTML = `
    <h2>FAQ & Glossaire</h2>
    <ul>
      <li><strong>Comment obtenir le visa ?</strong> — selon nationalité, voir conditions officielles.</li>
      <li><strong>Quel budget ?</strong> — dépend des choix, prévoir extra transports.</li>
      <li><strong>Que signifie "Fady" ?</strong> — tabou ou interdit local à respecter en visite.</li>
    </ul>
  `;

  // Carte interactive Leaflet
  let mapInitialised = false;
  const initMap = () => {
    if (mapInitialised) return;
    if (typeof L === "undefined") {
      sections.carte.innerHTML = `<h2>Carte</h2><p>Leaflet non disponible. Vérifie la balise &lt;script&gt; dans index.html.</p>`;
      return;
    }
    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
      sections.carte.innerHTML = `<div id="map" style="height:350px;"></div>`;
    }
    setTimeout(() => {
      try {
        const map = L.map('map').setView([-18.8792, 47.5079], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: "© OpenStreetMap" }).addTo(map);
        [
          { name: "Antananarivo", lat: -18.8792, lon: 47.5079 },
          { name: "Majunga", lat: -15.7167, lon: 46.3167 },
          { name: "Diego Suarez", lat: -12.276, lon: 49.311 },
          { name: "Nosy Be", lat: -13.3989, lon: 48.2768 }
        ].forEach(v => L.marker([v.lat, v.lon]).addTo(map).bindPopup(v.name));
        mapInitialised = true;
      } catch (err) {
        sections.carte.innerHTML = `<h2>Carte</h2><p>Erreur lors de l'initialisation : ${err.message}</p>`;
      }
    }, 100);
  };

  // Navigation
  const activateNav = id => {
    Object.keys(sections).forEach(key => {
      if (sections[key]) sections[key].style.display = (key === id ? "" : "none");
    });
    if (id === "gallery") makeGallery();
    if (id === "carte") initMap();
    showWithFade(sections[id]);
  };

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const id = link.getAttribute("href").replace("#", "");
      activateNav(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Thème clair/sombre
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.querySelectorAll('.card, .itineraire-card, .spot-card').forEach(el => el.classList.toggle('dark'));
  });

  // Affichage par défaut à l’ouverture
  activateNav("itineraire");
  navLinks[0].classList.add("active");
  // ouverture directe si hash dans l’URL
  if (location.hash) {
    const h = location.hash.replace("#", "");
    const matching = Array.from(navLinks).find(n => n.getAttribute("href").replace("#", "") === h);
    if (matching) matching.click();
  }
});
