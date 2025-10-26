document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script chargé avec succès");

  const main = document.querySelector("main") || document.querySelector("#main");
  const navLinks = document.querySelectorAll("nav a");

  if (!main) {
    console.error("❌ Impossible de trouver la balise <main>");
    return;
  }

  // --- Contenu de chaque onglet ---
  const sections = {
    itinéraires: `
      <section>
        <h2>🗺️ Itinéraires</h2>
        <p>Découvrez trois parcours magnifiques à travers Madagascar :</p>
        <ul>
          <li><strong>RN7</strong> — D'Antananarivo à Tuléar : Hautes Terres, parcs nationaux, plages.</li>
          <li><strong>RN5A</strong> — De Diego Suarez à Nosy Be : paysages côtiers et forêts tropicales.</li>
          <li><strong>RN2</strong> — Vers Toamasina : cascades, forêts et villages typiques.</li>
        </ul>
      </section>
    `,
    "spots locaux": `
      <section>
        <h2>📍 Spots Locaux</h2>
        <p>Les lieux les plus populaires du nord de Madagascar :</p>
        <div class="gallery">
          <img src="assets/images/baobabs.jpg" alt="Allée des Baobabs">
          <img src="assets/images/nosybe.jpg" alt="Plage de Nosy Be">
          <img src="assets/images/tsingy.jpg" alt="Tsingy de Bemaraha">
        </div>
      </section>
    `,
    galerie: `
      <section>
        <h2>🖼️ Galerie</h2>
        <p>Photos du voyage — bientôt disponibles.</p>
      </section>
    `,
    "infos pratiques": `
      <section>
        <h2>ℹ️ Infos Pratiques</h2>
        <ul>
          <li>Langue : malgache et français</li>
          <li>Monnaie : Ariary (MGA)</li>
          <li>Visa : disponible à l'arrivée</li>
          <li>Période idéale : avril à octobre</li>
        </ul>
      </section>
    `,
    carte: `
      <section>
        <h2>🗺️ Carte</h2>
        <p>Une carte interactive sera intégrée ici prochainement.</p>
      </section>
    `,
    faq: `
      <section>
        <h2>❓ FAQ</h2>
        <ul>
          <li><strong>Quand partir ?</strong> Avril à octobre.</li>
          <li><strong>Comment se déplacer ?</strong> Taxi-brousse, chauffeur privé ou location.</li>
          <li><strong>Est-ce sûr ?</strong> Oui, mais évite de circuler la nuit hors des villes.</li>
        </ul>
      </section>
    `
  };

  // --- Fonction d'affichage d'une section ---
  const afficherSection = (nom) => {
    const contenu = sections[nom.toLowerCase()] || "<p>Section en construction...</p>";
    main.innerHTML = contenu;
  };

  // --- Navigation entre les onglets ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      afficherSection(link.textContent.trim());
    });
  });

  // --- Affichage par défaut ---
  afficherSection("itinéraires");
});
