const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'lieux.js');
const rawContent = fs.readFileSync(filePath, 'utf8');

const jsonStart = rawContent.indexOf('[');
const jsonEnd = rawContent.lastIndexOf(']');
const jsonString = rawContent.substring(jsonStart, jsonEnd + 1);

let data = JSON.parse(jsonString);

// EXPANDED BLOCKLIST (Generics + Mistagged Restaurants in Screenshot)
const genericSpots = [
    "Tsingy Rouge", "Montagne d'Ambre", "Ankarana", "Diego-Suarez",
    "Baie Sakalava", "Mer d'Émeraude", "Mer d'Emeraude", // Handle accents
    "Pain de Sucre", "Windsor Castle", "Réserve Ankarana",
    "Plage de Ramena", "Les Trois Baies", "Baie des Dunes", "Baie des Pigeons",
    "Cap Miné", "Phare du Cap Miné", "Joffreville",
    "Nosy Be", "Nosy Komba", "Nosy Tanikely", "Nosy Iranja", "Mont Passot", "Arbre Sacré",
    "Montagne des Français", "Les Salines", "Salines de Diego",
    "Marché Bazarikely", "Bazarikely", "Colbert", "Rue Colbert",
    "Cathédrale", "Kiosque", "Place de l'Indépendance"
];

// CATEGORIES TO EXCLUDE STRICTLY
const excludedTypes = ['restaurant', 'hôtel', 'hotel', 'bar', 'manger', 'dormir', 'sortir', 'club', 'snack'];

let removedCount = 0;
let remainingSecret = 0;

data.forEach(lieu => {
    // 1. Check if previously tagged secret
    const wasSecret = lieu.tags && lieu.tags.includes('secret_spot');

    if (wasSecret) {
        let shouldRemove = false;

        // A. Check Category/Type
        const type = (lieu.type || '').toLowerCase();
        const hasExcludedType = excludedTypes.some(t => type.includes(t));
        // Also check boolean tags like "manger" if implicit
        const hasExcludedTag = lieu.tags.some(t => excludedTypes.includes(t.toLowerCase()));

        if (hasExcludedType || hasExcludedTag) {
            shouldRemove = true;
            // console.log(`Removing Secret Tag from (Category): ${lieu.nom} (${lieu.type})`);
        }

        // B. Check Generic Name
        if (!shouldRemove) {
            const isGeneric = genericSpots.some(g => lieu.nom.toLowerCase().includes(g.toLowerCase()));
            if (isGeneric) {
                shouldRemove = true;
                // console.log(`Removing Secret Tag from (Generic): ${lieu.nom}`);
            }
        }

        // Apply Removal
        if (shouldRemove) {
            lieu.tags = lieu.tags.filter(t => t !== 'secret_spot');

            // Restore Original Type if it was forced to 'Spot Local' purely for the tag?
            // Actually, my previous script changed type to 'Spot Local'. 
            // I should revert it if it was a Restaurant?
            // "Le Melville" -> Type was "Restaurant" likely, changed to "Spot Local"?
            // Wait, previous script did: `if (isSpotType) ... lieu.type = 'Spot Local'`.
            // Dangerous. I need to Infer correct type if I stripped it.
            // If tags has 'manger', set type back to 'Restaurant'.
            if (lieu.tags.includes('manger')) lieu.type = 'Restaurant';
            if (lieu.tags.includes('dormir')) lieu.type = 'Hôtel';
            if (lieu.tags.includes('sortir')) lieu.type = 'Bar';
            if (lieu.tags.includes('nature') && !lieu.tags.includes('secret_spot')) lieu.type = 'Nature';

            removedCount++;
        } else {
            remainingSecret++;
            // console.log(`Keeping Secret: ${lieu.nom}`);
        }
    }
});

console.log(`Correction Complete. Removed 'secret_spot' from ${removedCount} items. Remaining Correct Secrets: ${remainingSecret}.`);

const newContent = `window.LIEUX_DATA = ${JSON.stringify(data, null, 2)};`;
fs.writeFileSync(filePath, newContent, 'utf8');
