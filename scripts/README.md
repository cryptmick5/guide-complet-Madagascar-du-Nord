# 🚀 Script de Standardisation Automatique des Fiches

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Configuration](#configuration)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)

---

## 🎯 Vue d'ensemble

Ce script **standardise automatiquement** toutes les fiches de lieux du site Gasikara Explorer en une seule exécution.

**Modèle de référence**: Montagne d'Ambre

### Ce que le script fait :

✅ **Normalise** toutes les propriétés des fiches
✅ **Ajoute** les informations manquantes (horaires, périodes, conseils)
✅ **Génère** des galeries photos (minimum 4 images)
✅ **Complète** les infos pratiques (À prévoir, Meilleure période)
✅ **Standardise** les tags et budgets
✅ **Crée** un backup automatique avant toute modification
✅ **Génère** un rapport détaillé avec logs

---

## 📦 Installation

### Prérequis
- Node.js 14+ installé
- Accès au dossier du projet

### Étape 1: Vérifier Node.js
```bash
node --version
```

Si ce n'est pas installé, téléchargez depuis [nodejs.org](https://nodejs.org)

### Étape 2: Initialiser (si ce n'est pas déjà fait)
```bash
cd c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord
npm init -y
```

---

## 🎬 Utilisation

### Mode TEST (recommandé en premier)

Ce mode **affiche** ce qui serait modifié **sans rien changer**.

```bash
node scripts/standardize-fiches.js
```

Le script tournera en mode TEST par défaut. Vous verrez:
- Quelles fiches seront modifiées
- Quels changements seront appliqués
- Un rapport complet **sans modifier les fichiers**

### Mode PRODUCTION

⚠️ **ATTENTION**: Ce mode modifie les fichiers réellement.

1. **Ouvrez** `scripts/standardize-fiches.js`
2. **Changez** la ligne 20:
   ```javascript
   testMode: false  // Au lieu de 'true'
   ```
3. **Exécutez**:
   ```bash
   node scripts/standardize-fiches.js
   ```

---

## ⚙️ Configuration

### Fichier: `scripts/standardize-fiches.js` (lignes 14-22)

```javascript
const CONFIG = {
    // Chemin vers le fichier de données
    dataPath: './data/lieux.js',
    
    // Backup avant modification
    backupPath: './data/_backups/lieux_backup_' + Date.now() + '.js',
    
    // Log des modifications
    logPath: './logs/standardization_' + Date.now() + '.log',
    
    // Mode test (true = affiche seulement, false = modifie)
    testMode: true  // ⚠️ CHANGER À false POUR PRODUCTION
};
```

### Options modifiables:

| Option | Description | Valeur par défaut |
|--------|-------------|-------------------|
| `testMode` | Mode de simulation | `true` |
| `dataPath` | Fichier source | `./data/lieux.js` |
| `backupPath` | Dossier backup | `./data/_backups/...` |
| `logPath` | Fichier de log | `./logs/...` |

---

## ✨ Fonctionnalités

### 1. Normalisation des Données

Le script ajoute/complète:

- ✅ `nom`: Nom du lieu
- ✅ `description`: Description complète
- ✅ `categorie`: Type normalisé
- ✅ `ville`: Localisation
- ✅ `prix`: Prix d'entrée/repas
- ✅ `note`: Note /5
- ✅ `duree`: Temps de visite estimé
- ✅ `image`: Image principale
- ✅ `galerie_photos`: Min. 4 images
- ✅ `lat`/`lng`: Coordonnées GPS
- ✅ `tags`: Tags incluant budget

### 2. Infos Pratiques Complètes

#### Horaires (adaptatifs selon type)
```javascript
{
    lundi_vendredi: "8h-17h",
    weekend: "8h-17h"
}
```

#### Meilleure Période
```javascript
{
    saison_ideale: "Mai à Octobre (saison sèche)",
    eviter: "Janvier-Mars (pluies intenses)"
}
```

#### À Prévoir
```javascript
{
    equipement: ["Chaussures", "Eau", "Crème solaire"],
    conseils: "Guide local recommandé"
}
```

### 3. Conseil du Local

Génère automatiquement un conseil pertinent selon le type de lieu:

- **Restaurant**: Conseils sur timing, réservation
- **Nature**: Horaires idéaux, équipement
- **Plage**: Affluence, sécurité
- etc.

### 4. Galerie Photos

Garantit **minimum 4 images** par fiche:
- Si < 4 images: duplique l'image principale
- Format standardisé: `{ url, alt }`

### 5. Tags & Budget

Ajoute automatiquement:
- Tag de catégorie principale
- Tag de budget (`budget_1`, `budget_2`, `budget_3`)

---

## 🔒 Sécurité

### Backup Automatique

Le script crée **toujours** un backup avant modification:

```
data/_backups/lieux_backup_1704196800000.js
```

Le timestamp garantit l'unicité.

### Mode TEST

Le mode TEST permet de **vérifier** sans risque:
- Aucun fichier modifié
- Rapport complet généré
- Log détaillé des changements prévus

### Logs Détaillés

Chaque exécution génère un log complet:

```
logs/standardization_1704196800000.log
```

Contenu:
- Date et heure
- Mode d'exécution
- Détail de chaque fiche
- Erreurs éventuelles
- Statistiques finales

---

## 📊 Rapport de Sortie

### Écran Console

```
🚀 DÉMARRAGE DE LA STANDARDISATION MASSIVE

====================================
Mode: ⚡ PRODUCTION (modifications actives)
====================================

📂 Chargement des données...
✅ 250 fiches chargées

💾 Création du backup...
✅ Backup créé: ./data/_backups/lieux_backup_1704196800000.js

🔄 Standardisation en cours...

[1/250] Traitement: Montagne d'Ambre
✅ Montagne d'Ambre standardisé avec succès

[2/250] Traitement: Pain de Sucre
✅ Pain de Sucre standardisé avec succès

...

✅ Standardisation terminée:
   - Succès: 248 fiches
   - Erreurs: 2 fiches

💾 Sauvegarde des modifications...
✅ Fichier sauvegardé: ./data/lieux.js

📝 Log sauvegardé: ./logs/standardization_1704196800000.log

====================================
📊 RÉSUMÉ FINAL
====================================
Total traité: 250 fiches
Succès: 248 ✅
Erreurs: 2 ❌
Taux de réussite: 99.2%
====================================

✨ Standardisation terminée avec succès !
📂 Backup disponible: ./data/_backups/lieux_backup_1704196800000.js
📝 Log disponible: ./logs/standardization_1704196800000.log
```

---

## 🐛 Dépannage

### Erreur: "Cannot find module 'fs'"

✅ **Solution**: Node.js n'est pas installé ou pas à jour
```bash
node --version  # Doit être 14+
```

### Erreur: "LIEUX_DATA not found"

✅ **Solution**: Le chemin vers `lieux.js` est incorrect
- Vérifiez `CONFIG.dataPath`
- Assurez-vous que le fichier existe

### Erreur: "ENOENT: no such file or directory"

✅ **Solution**: Créez les dossiers manquants
```bash
mkdir -p data/_backups logs
```

---

## 📝 Notes Importantes

1. **Toujours tester avant**: Lancez en mode TEST d'abord
2. **Vérifiez les backups**: Un backup est créé à chaque exécution
3. **Consultez les logs**: En cas d'erreur, vérifiez le fichier de log
4. **Une exécution suffit**: Le script traite toutes les fiches en une fois

---

## 🎯 Prochaines Étapes

Après standardisation:

1. ✅ Vérifiez le site en local
2. ✅ Testez quelques fiches manuellement
3. ✅ Consultez le rapport de log
4. ✅ Commitez les changements (Git)

---

## 📞 Support

En cas de problème:
- Consultez les logs générés
- Vérifiez le backup automatique
- Relancez en mode TEST pour diagnostiquer

---

**Créé pour Gasikara Explorer**
Version 2026.1 - Modèle: Montagne d'Ambre
