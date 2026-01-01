const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'lieux.js');
const rawContent = fs.readFileSync(filePath, 'utf8');

// Extract JSON part
const jsonStart = rawContent.indexOf('[');
const jsonEnd = rawContent.lastIndexOf(']');
if (jsonStart === -1 || jsonEnd === -1) {
    console.error("Could not find JSON array in lieux.js");
    process.exit(1);
}

let jsonString = rawContent.substring(jsonStart, jsonEnd + 1);
// Fix potentially trailing semi-colon or weirdness if any, but substr should be safe.

let data;
try {
    data = JSON.parse(jsonString);
} catch (e) {
    console.error("JSON Parse Error:", e);
    // Attempt relaxed parsing if needed (e.g. comments)
    // But standard JSON.parse is preferred for strict data
    process.exit(1);
}

// List of GENERIC SPOTS (Accessible, Google Maps, Touristy)
// User said: "In the Spot section... ONLY accessible with local contact... Not on Google Maps"
// So these below must NOT be in the Spot Page.
const genericSpots = [
    "Tsingy Rouge",
    "Montagne d'Ambre",
    "Ankarana",
    "Diego-Suarez",
    "Baie Sakalava",
    "Mer d'Émeraude",
    "Pain de Sucre",
    "Windsor Castle",
    "Réserve Ankarana",
    "Plage de Ramena",
    "Les Trois Baies",
    "Baie des Dunes",
    "Baie des Pigeons",
    "Cap Miné",
    "Phare du Cap Miné",
    "Joffreville",
    "Nosy Be",
    "Nosy Komba",
    "Nosy Tanikely",
    "Nosy Iranja",
    "Mont Passot",
    "Arbre Sacré" // Often touristy, but maybe borderline. Let's keep it generic.
];

let secretCount = 0;
let genericCount = 0;

data.forEach(lieu => {
    const isSpotType = (lieu.type && lieu.type.toLowerCase().includes('spot')) ||
        (lieu.tags && lieu.tags.includes('spots'));

    // Normalize Type if it's a spot
    if (isSpotType) {
        // Check if Generic
        const isGeneric = genericSpots.some(g => lieu.nom.toLowerCase().includes(g.toLowerCase()));

        if (isGeneric) {
            // It's a Spot, but Generic.
            if (!lieu.tags) lieu.tags = [];
            if (!lieu.tags.includes('spots')) lieu.tags.push('spots'); // Keep Generic Tag
            // REMOVE secret tag if present
            lieu.tags = lieu.tags.filter(t => t !== 'secret_spot');

            // Fix Type for display
            if (lieu.type === 'Spot Local') lieu.type = 'Découverte'; // Downgrade to generic discovery

            genericCount++;
        } else {
            // It's a SECRET / AUTHENTIC Spot
            if (!lieu.tags) lieu.tags = [];
            if (!lieu.tags.includes('secret_spot')) lieu.tags.push('secret_spot');

            // Ensure main 'spots' tag is also there? 
            // User: "found in different provinces... but in this section ONLY authentic"
            // So we can keep 'spots' for province filtering, but use 'secret_spot' for the Spots Page.
            if (!lieu.tags.includes('spots')) lieu.tags.push('spots');

            // Force Type
            lieu.type = 'Spot Local';

            // Add Placeholder Access Info if missing (User Requirement)
            if (!lieu.acces && !lieu.contactLocal) {
                lieu.local_access_required = true; // Signal for UI
            }
            secretCount++;
        }
    }
});

console.log(`Processed: ${genericCount} Generic Spots, ${secretCount} Secret Spots.`);

// Write back
const newContent = `window.LIEUX_DATA = ${JSON.stringify(data, null, 2)};`;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Updated lieux.js successfully.");
