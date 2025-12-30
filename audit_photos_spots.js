const fs = require('fs');

console.log("🔍 AUDIT PHOTOS & SPOTS UNIQUES");
console.log("=".repeat(80));

// Charger lieux.js
const content = fs.readFileSync('data/lieux.js', 'utf-8');
global.window = {};
eval(content);
const lieux = window.LIEUX_DATA || LIEUX_DATA;

console.log(`✅ ${lieux.length} lieux chargés\n`);

// === 1. ANALYSE DES IMAGES ===
console.log("📸 ANALYSE DES IMAGES");
console.log("-".repeat(80));

const photosMissingByProvince = {};
const photosDuplicates = {};
const imageUsage = {};

lieux.forEach(lieu => {
    const ville = lieu.ville || "Non spécifié";
    const image = lieu.image || "";

    // Compter usage images
    if (image) {
        imageUsage[image] = (imageUsage[image] || 0) + 1;
    }

    // Photos manquantes
    if (!image || image.includes('placeholder') || image.includes('default')) {
        if (!photosMissingByProvince[ville]) photosMissingByProvince[ville] = [];
        photosMissingByProvince[ville].push({
            nom: lieu.nom,
            type: lieu.type,
            image: image || "VIDE"
        });
    }
});

// Identifier doublons
Object.entries(imageUsage).forEach(([img, count]) => {
    if (count > 1 && img) {
        photosDuplicates[img] = lieux.filter(l => l.image === img).map(l => ({
            nom: l.nom,
            ville: l.ville,
            type: l.type
        }));
    }
});

console.log(`\n❌ Photos manquantes: ${Object.values(photosMissingByProvince).flat().length}`);
console.log(`🔄 Photos dupliquées: ${Object.keys(photosDuplicates).length} images`);

// === 2. ANALYSE DES SPOTS UNIQUES ===
console.log("\n\n🎯 ANALYSE DES SPOTS UNIQUES");
console.log("-".repeat(80));

const spotsByProvince = {};
lieux.forEach(lieu => {
    const isSpot =
        lieu.type === "Spot Local" ||
        lieu.spotLocal === true ||
        (lieu.tags && lieu.tags.includes("spots"));

    if (isSpot) {
        const ville = lieu.ville || "Non spécifié";
        if (!spotsByProvince[ville]) spotsByProvince[ville] = [];
        spotsByProvince[ville].push({
            nom: lieu.nom,
            type: lieu.type,
            description: lieu.description || ""
        });
    }
});

const totalSpots = Object.values(spotsByProvince).flat().length;
console.log(`\n✅ Total spots uniques trouvés: ${totalSpots}`);

// === 3. GÉNÉRATION DU RAPPORT ===
let rapport = `# 📊 Audit Photos & Spots Uniques - ${new Date().toLocaleDateString()}\n\n`;
rapport += `## Résumé Exécutif\n\n`;
rapport += `- **Total lieux**: ${lieux.length}\n`;
rapport += `- **Photos manquantes**: ${Object.values(photosMissingByProvince).flat().length}\n`;
rapport += `- **Photos dupliquées**: ${Object.keys(photosDuplicates).length}\n`;
rapport += `- **Spots uniques**: ${totalSpots}\n`;
rapport += `- **Objectif spots**: 20-25\n`;
rapport += `- **Statut**: ${totalSpots >= 20 ? '✅ Objectif atteint' : `⚠️ Manque ${20 - totalSpots} spots`}\n\n`;

rapport += `---\n\n`;

// Par province
rapport += `## 📍 Détail par Province\n\n`;

const allProvinces = [...new Set(lieux.map(l => l.ville))].sort();

allProvinces.forEach(province => {
    if (!province) return;

    rapport += `### ${province}\n\n`;

    // Comptage
    const lieuxProvince = lieux.filter(l => l.ville === province);
    const photosManquantes = photosMissingByProvince[province] || [];
    const spotsProvince = spotsByProvince[province] || [];

    rapport += `**Statistiques**:\n`;
    rapport += `- Lieux total: ${lieuxProvince.length}\n`;
    rapport += `- Photos manquantes: ${photosManquantes.length}\n`;
    rapport += `- Spots uniques: ${spotsProvince.length}\n\n`;

    // Photos manquantes
    if (photosManquantes.length > 0) {
        rapport += `**❌ Photos à ajouter (${photosManquantes.length})**:\n\n`;
        rapport += `| Nom | Type | Image actuelle |\n`;
        rapport += `|-----|------|----------------|\n`;
        photosManquantes.forEach(l => {
            rapport += `| ${l.nom} | ${l.type} | ${l.image} |\n`;
        });
        rapport += `\n`;
    }

    // Spots
    if (spotsProvince.length > 0) {
        rapport += `**🎯 Spots uniques (${spotsProvince.length})**:\n\n`;
        spotsProvince.forEach(s => {
            rapport += `- **${s.nom}** (${s.type})\n`;
        });
        rapport += `\n`;
    } else {
        rapport += `**⚠️ Aucun spot unique - À compl éter**\n\n`;
    }

    rapport += `---\n\n`;
});

// Photos dupliquées
if (Object.keys(photosDuplicates).length > 0) {
    rapport += `## 🔄 Photos Dupliquées\n\n`;
    Object.entries(photosDuplicates).forEach(([img, lieux]) => {
        rapport += `### \`${img}\` (utilisée ${lieux.length} fois)\n\n`;
        lieux.forEach(l => {
            rapport += `- ${l.nom} (${l.ville}) - ${l.type}\n`;
        });
        rapport += `\n`;
    });
}

// Sauvegarder
fs.writeFileSync('AUDIT_PHOTOS_SPOTS.md', rapport);
console.log('\n✅ Rapport généré: AUDIT_PHOTOS_SPOTS.md');

// Résumé console
console.log(`\n\n📊 RÉSUMÉ PAR PROVINCE:`);
allProvinces.forEach(p => {
    if (!p) return;
    const spots = (spotsByProvince[p] || []).length;
    const missing = (photosMissingByProvince[p] || []).length;
    console.log(`  ${p}: ${spots} spots, ${missing} photos manquantes`);
});
