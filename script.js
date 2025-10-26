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
    <strong>Itinéraire complet : Antananarivo → Tuléar (900km, 8 à 12 jours)</strong>
    <ul>
      <li><b>Antananarivo</b> <span class="star">★★★★☆</span> — Capitale animée, marchés, palais, street food (budget: 10 € / 52 000 Ar par jour)</li>
      <li><b>Antsirabe</b> <span class="star">★★★☆☆</span> — Ville thermale, pousse-pousse, lacs volcaniques, artisans Zafimaniry (prix taxi-brousse: Tana-Antsirabe 7 €, nuitée 16 € chez habitant)</li>
      <li><b>Ambositra</b> <span class="star">★★★☆☆</span> — Capitale de la sculpture du bois, marché, randonnée Betsileo</li>
      <li><b>Ranomafana</b> <span class="star">★★★★★</span> — Parc national, sources chaudes, lémuriens, pont suspendu (entrée: 13 € / 67 000 Ar)</li>
      <li><b>Fianarantsoa</b> <span class="star">★★★☆☆</span> — Vignobles, vieille ville classée, train FCE (extra : atelier d'artisan!)</li>
      <li><b>Ambalavao</b> <span class="star">★★★★☆</span> — Tissage soie, réserve d’Anja (caméléons & lémuriens, entrée 6 €)</li>
      <li><b>Isalo</b> <span class="star">★★★★★</span> — Canyons, piscines naturelles, paysages de western (randonnée 1j : 35 € guide inclus)</li>
      <li><b>Tuléar</b> <span class="star">★★★☆☆</span> — Plages arides, vie marine, marchés de pêcheurs</li>
      <li><b>Ifaty & Mangily</b> <span class="star">★★★★☆</span> — Lagons préservés, plongée, villages Vezo (location pirogue : 10 € / 52 000 Ar)</li>
    </ul>
    <div>Conseils insider : Essayez la “koba” (gâteau cacahuète/banane) sur chaque place de marché ! Pour plus d’authenticité, faites de petits détours dans les villages Betsileo pour observer la vie rurale et la fabrication du rhum local.</div>
  </div>
  <h2>Circuit Nord (Diego Suarez – Nosy Be – Mitsio) <span class="star">★★★★★</span></h2>
  <div class="itineraire-card">
    <strong>Parcours Aventure & Plages (7 à 12 jours, mix véhicule et bateau)</strong>
    <ul>
      <li><b>Diego Suarez</b> <span class="star">★★★★☆</span> — Baie des Français, Trois baies, Pain de Sucre (excursion: 10 €, sport: kitesurf)</li>
      <li><b>Montagne d’Ambre</b> <span class="star">★★★☆☆</span> — Parc luxuriant, cascade, camion-brousse d’accès</li>
      <li><b>Parc Ankarana</b> <span class="star">★★★★★</span> — Tsingy, grottes, faune unique, ponts suspendus</li>
      <li><b>Nosy Be & archipel</b> <span class="star">★★★★★</span> — Plages de rêve, plongée (baptême 48 €), marchés d’Hell-Ville, gastronomie fruits de mer</li>
      <li><b>Nosy Komba & Nosy Iranja</b> <span class="star">★★★★☆</span> — Excursions bateau (journée à 20–30 € tout inclus), lagons, lémuriens, villages pêcheurs</li>
      <li><b>Archipel Mitsio</b> <span class="star">★★★★☆</span> — Île privée, snorkeling, authenticité (accès en pirogue/speedboat)</li>
    </ul>
    <div>🌞 <strong>Bonus local :</strong> Partez à l’aube autour de Diego pour croiser les pêcheurs Vezo, immortaliser la lumière magique sur les baies et goûter un “mokary” (beignet local) sur le port.</div>
  </div>
  <h2>Hors sentiers : Centre, Pangalanes & Makay <span class="star">★★★★☆</span></h2>
  <div class="itineraire-card">
    <ul>
      <li><b>Canal des Pangalanes</b> <span class="star">★★★★☆</span> — Pirogue, villages sur pilotis, artisanat, rencontre Betsimisaraka</li>
      <li><b>Makay</b> <span class="star">★★★★★</span> — Trekking aventure (difficulté : élevé), circuits 3 à 8 jours (agence locale recommandée pour sécurité)</li>
      <li><b>Ivoloina, Foulpointe, Ambila</b> <span class="star">★★★☆☆</span> — Cascades cachées, plages désertes, ambiance “no tourisme”</li>
      <li><b>Bonus</b> <span class="star">★★★★★</span> — demandez un guide local pour découvrir les danses “salegy” et cuisines traditionnelles là où aucun touriste ne va !</li>
    </ul>
  </div>
  <div class="budget">
    <strong>Tableau budget 👇 (par personne, version 2025 : taux 1 € ≈ 5 200 Ar)</strong>
    <table>
      <tr><th>Item</th><th>€/jour</th><th>MGA/jour</th><th>Remarque</th></tr>
      <tr><td>Hébergement local</td><td>8</td><td>41,600</td><td>Chambre simple, confort basique</td></tr>
      <tr><td>Transport taxi-brousse</td><td>10–20</td><td>52–104k</td><td>Par étape</td></tr>
      <tr><td>Excursion/parc</td><td>10–70</td><td>52k–364k</td><td>Tsingy/Makay = +</td></tr>
      <tr><td>Repas marché</td><td>2–4</td><td>10–20k</td><td>Brochette zébu, mofo, ranon’ampango</td></tr>
      <tr><td>Dépenses confort</td><td>10+</td><td>52k+</td><td>Souvenirs, guide privé, etc.</td></tr>
    </table>
    <div class="note"><b>Astuce smart :</b> Privilégier la basse saison pour négocier chaque prix… et multiplier les rencontres authentiques !</div>
  </div>
  `;

  // ------ Les autres sections restent à enrichir : premium à venir ! ------
  sections.spots.innerHTML = `<h2>Spots locaux premium à venir…</h2>`;
  sections.gallery.innerHTML = `<h2>Galerie premium à venir…</h2>`;
  sections.infos.innerHTML = `<h2>Infos pratiques premium à venir…</h2>`;
  sections.carte.innerHTML = `<h2>Carte interactive premium à venir…</h2>`;
  sections.faq.innerHTML = `<h2>FAQ & glossaire premium à venir…</h2>`;

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
