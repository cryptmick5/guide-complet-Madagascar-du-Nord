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
      Item€/jourMGA/jourRemarque
      Hébergement local841,600Chambre simple, confort basique
      Transport taxi-brousse10–2052–104kPar étape
      Excursion/parc10–7052k–364kTsingy/Makay = +
      Repas marché2–410–20kBrochette zébu, mofo, ranon'ampango
      Dépenses confort10+52k+Souvenirs, guide privé, etc.
    </table>
    <div class="note">Astuce smart : Privilégier la basse saison pour négocier chaque prix… et multiplier les rencontres authentiques !</div>
  </div>
  `;
  
// ------ SPOTS LOCAUX PREMIUM ------
  sections.spots.innerHTML = `
  <h2>Spots Locaux Premium <span class="star">★★★★★</span></h2>
  <div class="spot-card">
    Antananarivo & Hautes Terres
    <ul>
      <li><b>Marché Analakely <span class="star">★★★★☆</span></b> — Temple du street-food, couleurs et ambiance (Brochette zébu 3 500 Ar, mofo gasy 700 Ar)</li>
      <li>Quartier Ambohijatovo <span class="star">★★★☆☆</span> — Bars locaux, nuit animée, rencontres "à la malgache"</li>
      <li>Lac Anosy <span class="star">★★★☆☆</span> — Lieu de balade avec panorama sur la ville</li>
      <li>Ambatolampy <span class="star">★★★☆☆</span> — Fonderie traditionnelle, artisanat</li>
    </ul>
    Majunga & Côte Ouest
    <ul>
      <li>Plage du Grand Pavois <span class="star">★★★★★</span> — Soleil, Paillotes, coucher de soleil mémorable (rhum arrangé 2 500 Ar)</li>
      <li>Cirque Rouge <span class="star">★★★☆☆</span> — Site géologique et photo unique</li>
      <li>Village Tanambao <span class="star">★★★★☆</span> — Marché, artisanat, goûter cuisine "Vezo"</li>
      <li>Lac Sacré <span class="star">★★★☆☆</span> — Visite avec guide local (entrée 7 000 Ar)</li>
      <li>Grottes d'Anjohibe <span class="star">★★★★☆</span> — Expérience hors tourisme classique</li>
    </ul>
    Nosy Be & Archipel
    <ul>
      <li>Plage d'Andilana <span class="star">★★★★★</span> — Eau turquoise, snorkeling (location matos 10 000 Ar)</li>
      <li>Réserve Lokobe <span class="star">★★★☆☆</span> — Lémuriens et jungle (entrée 25 000 Ar)</li>
      <li>Marché Hell-Ville <span class="star">★★★★☆</span> — Fruits tropicaux, rencontres locales</li>
      <li>Nosy Sakatia <span class="star">★★★☆☆</span> — Spot tortues, plongée</li>
      <li>Nosy Komba <span class="star">★★★★☆</span> — Village artisanal, lémuriens</li>
    </ul>
    Diego Suarez & Nord
    <ul>
      <li>Trois Baies <span class="star">★★★★★</span> — Balade à pied ou VTT, plages désertes</li>
      <li>Pain de Sucre <span class="star">★★★★☆</span> — Vue sur la baie, spot photo idéal</li>
      <li>Montagne d'Ambre <span class="star">★★★★☆</span> — Parc sous la brume, cascade secrète</li>
      <li>Marché de Ramena <span class="star">★★★☆☆</span> — Produits de la mer, vie locale</li>
      <li>Parc Ankarana <span class="star">★★★★★</span> — Tsingy, grottes, expérience unique</li>
    </ul>
    Est, Centre & Spots secrets
    <ul>
      <li>Canal des Pangalanes <span class="star">★★★★☆</span> — Pirogue au lever du soleil (expérience locale)</li>
      <li>Cascade Ivoloina <span class="star">★★★☆☆</span> — Fraîcheur des Hauts Plateaux, entrée 4 000 Ar</li>
      <li>Village Ambositra <span class="star">★★★★☆</span> — Sculpteurs de bois Zafimaniry, souvenirs uniques</li>
      <li>Atelier Betsileo <span class="star">★★★☆☆</span> — Tissage raphia, démonstration (achat direct artisan)</li>
      <li>Foulpointe <span class="star">★★★☆☆</span> — Plage "no tourisme", petit resto local conseillé</li>
    </ul>
    <div class="note">Astuces locals : Demander toujours le "prix mora mora" (celui des locaux) et ne pas hésiter à négocier — le sourire fait tout ! Pour chaque région, privilégie les marchés du matin et demande les histoires ou légendes locales aux anciens…</div>
  </div>`;
  sections.gallery.innerHTML = `
  <h2>Galerie Madagascar Premium <span class="star">★★★★★</span></h2>
  <div class="gallery-grid">
    <div class="card">
      <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=900&q=60" alt="Marché Tana">
      <h3>Marché d'Antananarivo</h3>
      <p>Couleurs, vie locale, street-food et ambiance unique</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=60" alt="Allée des Baobabs">
      <h3>Allée des Baobabs, Morondava</h3>
      <p>Photo iconique au coucher du soleil – spot à ne pas manquer</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=60" alt="Plage Nosy Be">
      <h3>Plage d'Andilana, Nosy Be</h3>
      <p>Lagon turquoise, snorkeling & détente, paillotes locales</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=900&q=60" alt="Lémurien">
      <h3>Lémurien en liberté</h3>
      <p>Rencontré au Parc Ranomafana, photo matinale</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=60" alt="Diego Suarez">
      <h3>Trois Baies de Diego Suarez</h3>
      <p>Randonnée sportive, vues spectaculaires, plages secrètes</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1502920514313-52581002a659?w=900&q=60" alt="Majunga">
      <h3>Plage Grand Pavois, Majunga</h3>
      <p>Paillotes, rhum arrangé, coucher de soleil</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1444065381814-865dc9da92c0?w=900&q=60" alt="Parc Isalo">
      <h3>Parc National Isalo</h3>
      <p>Randos, piscines naturelles, paysages “western”</p>
    </div>
    <div class="card">
      <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?w=900&q=60" alt="Artisanat">
      <h3>Artisanat Betsileo</h3>
      <p>Tissage raphia, couleurs, sculpteurs du bois Zafimaniry</p>
    </div>
  </div>
  <div class="note">Astuce photo : Pour des images vibrantes, privilégie le lever et coucher du soleil & sollicite les sourires locaux ! <br>
    Pour poster la tienne : <a href="mailto:contact@madagascar-guide.premium">contact@madagascar-guide.premium</a>
  </div>
`;
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
