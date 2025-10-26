// --- Sélecteurs des éléments de navigation ---
const navLinks = document.querySelectorAll("nav a");
const main = document.querySelector("main");

// --- Thème clair/sombre ---
const toggleTheme = document.querySelector(".toggle-theme");
toggleTheme?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleTheme.textContent = document.body.classList.contains("dark-mode") ? "🌞" : "🌙";
});

// --- Contenu de chaque section ---
const sections = {
  itinéraires: `
    <h2>🗺️ Itinéraires</h2>
    <p>Explore les plus belles routes de Madagascar :</p>
    <ul>
      <li><strong>RN7</strong> — De Tana à Tuléar, un voyage entre hauts plateaux et océan.</li>
      <li><strong>RN2</strong> — Vers Toamasina, entre forêts tropicales et cascades.</li>
      <li><strong>Nosy Be</strong> — L'île parfumée, entre plages et plongées paradisiaques.</li>
    </ul>
  `,
  "spots locaux": `
    <h2>📸 Spots Locaux</h2>
    <p>Découvre quelques lieux incontournables :</p>
    <div class="gallery">
      <img src="assets/images/baobabs.jpg" alt="Allée des Baobabs">
      <img src="assets/images/nosybe.jpg" alt="Plage de Nosy Be">
      <img src="assets/images/tsingy.jpg" alt="Tsingy de Bemaraha">
    </div>
  `,
  "galerie": `
    <h2>🖼️ Galerie</h2>
    <p>Une sélection d'images pour t'inspirer avant ton voyage.</p>
    <div class="gallery-placeholder">[Galerie en cours de création]</div>
  `,
  "infos pratiques": `
    <h2>ℹ️ Infos Pratiques</h2>
    <ul>
      <li>Langue : Malgache & Français</li>
      <li>Monnaie : Ariary (MGA)</li>
      <li>Prise électrique : Type C & E (comme en France)</li>
      <li>Visa : Disponible à l'arrivée pour la plupart des nationalités</li>
    </ul>
  `,
  "carte": `
    <h2>🗺️ Carte</h2>
    <p>Carte interactive à venir (Google Maps ou OpenStreetMap).</p>
  `,
  "faq": `
    <h2>❓ FAQ</h2>
    <p>Quelques réponses rapides :</p>
    <ul>
      <li><strong>Quand partir ?</strong> — D'avril à octobre, pendant la saison sèche.</li>
      <li><strong>Est-ce dangereux ?</strong> — Globalement non, mais reste prudent la nuit.</li>
      <li><strong>Comment se déplacer ?</strong> — Taxi-brousse, chauffeur privé, ou location de 4x4.</li>
    </ul>
  `
};

// --- Gestion du clic sur les onglets ---
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    navLinks.forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    const sectionName = link.textContent.trim().toLowerCase();
    main.innerHTML = sections[sectionName] || "<p>Section en construction...</p>";
  });
});

// --- Affichage par défaut ---
main.innerHTML = sections["itinéraires"];
