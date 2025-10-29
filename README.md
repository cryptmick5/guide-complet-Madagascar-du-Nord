*(ou utilise le bouton “Fork/Download ZIP” sur GitHub)*

2. **Uploader/committer tes fichiers suivants :**
- `index.html`
- `icon-512.jpg` (icone PWA haute résolution)
- `icon-192.jpg` (icône notifications/app)
- `manifest-with-svg.json` (manifest PWA)
- (+ tout fichier CSS/JS/image nécessaires)

3. **Déployer sur GitHub Pages :**
- Va dans les réglages du repo : **Settings > Pages**
- Source : sélectionne la branche `main` puis dossier `/root` (pas `/docs`)
- Ton site sera servi à l’adresse :  
  `https://<ton_user>.github.io/guide-complet-Madagascar-du-Nord/`

## 📲 Activation Progressive Web App (PWA)

- Manifest : vérifie que le fichier `manifest-with-svg.json` est bien référencé dans le `<head>` de ton index.html (renomme en `manifest.json` si besoin)
- Icônes : place bien tes fichiers `icon-192.jpg` et `icon-512.jpg` à la racine
- Teste sur mobile ou Chrome :  
« Ajouter à l’écran d’accueil » ou + options PWA s’affichent

## 🛠️ Dépannage courant (troubleshooting)

- **Problèmes d’icônes/app name ?**
Vérifie que les noms/paths dans manifest.json sont corrects et les images présentes à la racine.

- **Mise à jour invisible ?**
Forcer le refresh du cache navigateur (Ctrl+F5), vider cache, ou re-déployer.

- **404 GitHub Pages ?**
Vérifie la présence d’un fichier `.nojekyll` (empêche le build Jekyll par défaut sur Pages).

- **Fichier CSS/JS non trouvé ?**
Vérifie que les chemins dans index.html sont bons et que les fichiers existent après le push.

## 🚧 Contribution & Personnalisation

- Pour ajouter de nouvelles villes, spots ou pages, édite `index.html` section par section puis commit.
- Toute PR, bugfix ou amélioration design/contenu est bienvenue sur ce dépôt !

## 📝 Contact & Licence

Projet open-source par [cryptmick5](https://github.com/cryptmick5)  
Licence MIT

---

**Pour assistance avancée ou correction express, utilise les issues GitHub ou mentionne-moi sur la plateforme.**
