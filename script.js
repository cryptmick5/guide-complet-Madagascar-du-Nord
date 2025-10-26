document.addEventListener("DOMContentLoaded", () => {
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
  const showWithFade = el => {
    Object.values(sections).forEach(sec => { if (sec) sec.style.display = "none"; });
    el.style.opacity = 0;
    el.style.display = "";
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, fill: "forwards" });
    setTimeout(() => { el.style.opacity = 1; }, 280);
  };
  // ----------------------- ITINERAIRES PREMIUM -------------------------
  sections.itineraire.innerHTML = `
  <h2>RN7 - La route emblématique du Sud <span class="star">★★★★★</span></h2>
  <div class="itineraire-card">
    Itinéraire complet : Antananarivo → Tuléar (900km, 8 à 12 jours)
    <ul>
      <li>Antananarivo <span class="star">★★★★☆</span> — Capitale animée, marchés, palais, street food (budget: 10 € / 52 000 Ar par jour)</li>
      <li>Antsirabe <span class="star">★★★☆☆</span> — Ville thermale, pousse-pousse, lacs volcaniques, artisans Zafimaniry (prix taxi-brousse: Tana-Antsirabe 7 €, nuitée 16 € chez habitant)</li>
      <li>Ambositra <span class="star">★★★☆☆</span> — Capitale de la sculpture du bois, marché, randonnée Betsileo</li>
      <li>Ranomafana <span class="star">★★★★★</span> — Parc national, sources chaudes, lémuriens, pont suspendu (entrée: 13 € / 67 000 Ar)</li>
      <li>Fianarantsoa <span class="star">★★★☆☆</span> — Vignobles, vieille ville classée, train FCE (extra : atelier d'artisan!)</li>
      <li>Ambalavao <span class="star">★★★★☆</span> — Tissage soie, réserve d'Anja (caméléons & lémuriens, entrée 6 €)</li>
      <li>Isalo <span class="star">★★★★★</span> — Canyons, piscines naturelles, paysages de western (randonnée 1j : 35 € guide inclus)</li>
      <li>Tuléar <span class="star">★★★☆☆</span> — Plages arides, vie marine, marchés de pêcheurs</li>
      <li>Ifaty & Mangily <span class="star">★★★★☆</span> — Lagons préservés, plongée, villages Vezo (location pirogue : 10 € / 52 000 Ar)</li>
    </ul>
    Conseils insider : Essayez la "koba" (gâteau cacahuète/banane) sur chaque place de marché ! Pour plus d'authenticité, faites de petits détours dans les villages Betsileo pour observer la vie rurale et la fabrication du rhum local.
  </div>
  
  <div class="budget">
    Tableau budget 👇 (par personne, version 2025 : taux 1 € ≈ 5 200 Ar)
    <table>
      <tr><th>Item</th><th>€/jour</th><th>MGA/jour</th><th>Remarque</th></tr>
      <tr><td>Hébergement local</td><td>8</td><td>41,600</td><td>Chambre simple, confort basique</td></tr>
      <tr><td>Transport taxi-brousse</td><td>10–20</td><td>52–104k</td><td>Par étape</td></tr>
      <tr><td>Excursion/parc</td><td>10–70</td><td>52k–364k</td><td>Tsingy/Makay = +</td></tr>
      <tr><td>Repas marché</td><td>2–4</td><td>10–20k</td><td>Brochette zébu, mofo, ranon'ampango</td></tr>
      <tr><td>Dépenses confort</td><td>10+</td><td>52k+</td><td>Souvenirs, guide privé, etc.</td></tr>
    </table>
    <div class="note">Astuce smart : Privilégier la basse saison pour négocier chaque prix… et multiplier les rencontres authentiques !</div>
  </div>
  `;
  
// ------ SPOTS LOCAUX PREMIUM ------
  sections.spots.innerHTML = `
  <h2>Spots Locaux Premium <span class="star">★★★★★</span></h2>
  <div class="spot-card">
    <h3>Antananarivo & Hautes Terres</h3>
    <ul>
      <li><b>Marché Analakely <span class="star">★★★★☆</span></b> — Temple du street-food, couleurs et ambiance (Brochette zébu 3 500 Ar, mofo gasy 700 Ar)</li>
      <li><b>Quartier Ambohijatovo</b> <span class="star">★★★☆☆</span> — Bars locaux, nuit animée, rencontres "à la malgache"</li>
      <li><b>Lac Anosy</b> <span class="star">★★★☆☆</span> — Lieu de balade avec panorama sur la ville</li>
      <li><b>Ambatolampy</b> <span class="star">★★★☆☆</span> — Fonderie traditionnelle, artisanat</li>
    </ul>
    <h3>Majunga & Côte Ouest</h3>
    <ul>
      <li><b>Plage du Grand Pavois</b> <span class="star">★★★★★</span> — Soleil, Paillotes, coucher de soleil mémorable (rhum arrangé 2 500 Ar)</li>
      <li><b>Cirque Rouge</b> <span class="star">★★★☆☆</span> — Site géologique et photo unique</li>
      <li><b>Village Tanambao</b> <span class="star">★★★★☆</span> — Marché, artisanat, goûter cuisine "Vezo"</li>
      <li><b>Lac Sacré</b> <span class="star">★★★☆☆</span> — Visite avec guide local (entrée 7 000 Ar)</li>
      <li><b>Grottes d'Anjohibe</b> <span class="star">★★★★☆</span> — Expérience hors tourisme classique</li>
    </ul>
    <h3>Nosy Be & Archipel</h3>
    <ul>
      <li><b>Plage d'Andilana</b> <span class="star">★★★★★</span> — Eau turquoise, snorkeling (location matos 10 000 Ar)</li>
      <li><b>Réserve Lokobe</b> <span class="star">★★★☆☆</span> — Lémuriens et jungle (entrée 25 000 Ar)</li>
      <li><b>Marché Hell-Ville</b> <span class="star">★★★★☆</span> — Fruits tropicaux, rencontres locales</li>
      <li><b>Nosy Sakatia</b> <span class="star">★★★☆☆</span> — Spot tortues, plongée</li>
      <li><b>Nosy Komba</b> <span class="star">★★★★☆</span> — Village artisanal, lémuriens</li>
    </ul>
    <h3>Diego Suarez & Nord</h3>
    <ul>
      <li><b>Trois Baies</b> <span class="star">★★★★★</span> — Balade à pied ou VTT, plages désertes</li>
      <li><b>Pain de Sucre</b> <span class="star">★★★★☆</span> — Vue sur la baie, spot photo idéal</li>
      <li><b>Montagne d'Ambre</b> <span class="star">★★★★☆</span> — Parc sous la brume, cascade secrète</li>
      <li><b>Marché de Ramena</b> <span class="star">★★★☆☆</span> — Produits de la mer, vie locale</li>
      <li><b>Parc Ankarana</b> <span class="star">★★★★★</span> — Tsingy, grottes, expérience unique</li>
    </ul>
    <h3>Est, Centre & Spots secrets</h3>
    <ul>
      <li><b>Canal des Pangalanes</b> <span class="star">★★★★☆</span> — Pirogue au lever du soleil (expérience locale)</li>
      <li><b>Cascade Ivoloina</b> <span class="star">★★★☆☆</span> — Fraîcheur des Hauts Plateaux, entrée 4 000 Ar</li>
      <li><b>Village Ambositra</b> <span class="star">★★★★☆</span> — Sculpteurs de bois Zafimaniry, souvenirs uniques</li>
      <li><b>Atelier Betsileo</b> <span class="star">★★★☆☆</span> — Tissage raphia, démonstration (achat direct artisan)</li>
      <li><b>Foulpointe</b> <span class="star">★★★☆☆</span> — Plage "no tourisme", petit resto local conseillé</li>
    </ul>
    <div class="note"><b>Astuces locals :</b> Demander toujours le "prix mora mora" (celui des locaux) et ne pas hésiter à négocier — le sourire fait tout ! Pour chaque région, privilégie les marchés du matin et demande les histoires ou légendes locales aux anciens…</div>
  </div>
`;
  sections.gallery.innerHTML = `Galerie premium à venir…`;
  sections.infos.innerHTML = `Infos pratiques premium à venir…`;
  sections.carte.innerHTML = `Carte interactive premium à venir…`;
  sections.faq.innerHTML = `FAQ & glossaire premium à venir…`;
  // ----------- Navigation et thème -------------
  const activateNav = id => {
    Object.keys(sections).forEach(key => {
      if (sections[key]) sections[key].style.display = (key === id ? "" : "none");
    });
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
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.querySelectorAll('.card, .itineraire-card, .spot-card').forEach(el => el.classList.toggle('dark'));
  });
  activateNav("itineraire");
  navLinks[0].classList.add("active");
  if (location.hash) {
    const h = location.hash.replace("#", "");
    const matching = Array.from(navLinks).find(n => n.getAttribute("href").replace("#", "") === h);
    if (matching) matching.click();
  }
});
