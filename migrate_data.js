
const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const zonesDataPath = path.join(__dirname, 'data', 'zones_data.json');
const itinerairesPath = path.join(__dirname, 'data', 'itineraires.json');
const budgetsPath = path.join(__dirname, 'data', 'budgets.json');

// --- 1. Read index.html ---
try {
    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // --- 2. Extract LIEUX_DATA ---
    // Look for const LIEUX_DATA = [ ... ];
    // We'll use a regex that captures the content between the brackets.
    // Note: This relies on the formatting being relatively standard.
    const lieuxRegex = /const LIEUX_DATA = (\[[\s\S]*?\]);/;
    const match = htmlContent.match(lieuxRegex);

    if (!match) {
        console.error("Critical Error: Could not find LIEUX_DATA in index.html");
        process.exit(1);
    }

    let lieuxRaw = match[1];

    // Create a temporary JS file
    const tempFile = path.join(__dirname, 'temp_lieux.js');
    fs.writeFileSync(tempFile, 'module.exports = ' + lieuxRaw + ';');

    let lieuxData;
    try {
        lieuxData = require(tempFile);
    } catch (e) {
        console.error("Error requiring temp file:", e);
        // Clean up even on error
        fs.unlinkSync(tempFile);
        process.exit(1);
    }

    // Clean up temp file
    fs.unlinkSync(tempFile);

    console.log(`Extracted ${lieuxData.length} locations.`);

    // --- 4. Group by Zone ---
    const zones = {};

    // Define initial structure for a zone
    const createZoneStructure = (name) => ({
        "infos": {
            "description_fun": "Zone à explorer !",
            "securite_level": "Normal",
            "conseil_securite": "Vigilance standard."
        },
        "logistique": {
            "route_etat": "Variable",
            "transport_conseil": "4x4 recommandé."
        },
        "gastronomie_stars": [],
        "lieux": []
    });

    lieuxData.forEach(lieu => {
        const ville = lieu.ville || "Autre";
        if (!zones[ville]) {
            zones[ville] = createZoneStructure(ville);
        }
        zones[ville].lieux.push(lieu);
    });

    // --- 5. Enrich specific zones (Manual Injection based on research) ---
    if (zones["Diego-Suarez"]) {
        zones["Diego-Suarez"].infos.description_fun = "Diego, c'est le Far West tropical. Ça bouge, c'est chaud, et c'est beau.";
        zones["Diego-Suarez"].logistique = {
            "route_etat": "RN6 : Chantier artistique (85% fini). Comptez 6h de gymkhana.",
            "transport_conseil": "4x4 impératif pour les pistes (3 Baies, Tsingy)."
        };
    }

    if (zones["Nosy Be"]) {
        zones["Nosy Be"].infos.description_fun = "L'île aux Parfums (et aux italiens). C'est le paradis version confort.";
        zones["Nosy Be"].logistique = {
            "route_etat": "Routes bitumées correctes sur l'île principale.",
            "transport_conseil": "Tuk-tuk pour les petits trajets, Bateau pour les îles."
        };
    }

    // --- 6. Write zones_data.json ---
    const finalZonesData = { zones };
    fs.writeFileSync(zonesDataPath, JSON.stringify(finalZonesData, null, 4));
    console.log(`Exported zones_data.json`);

    // --- 7. Create placeholders for other JSONs ---
    const itinerairesData = {
        "circuits": [
            {
                "nom": "Le Grand Nord Express (7 jours)",
                "profil": "Découverte accélérée",
                "etapes": ["Diego", "3 Baies", "Mer Emeraude", "Montagne d'Ambre", "Tsingy Rouge", "Ankarana"],
                "description": "L'essentiel du Nord en une semaine intense."
            },
            {
                "nom": "La Totale No Stress (14 jours)",
                "profil": "Relax & Profondeur",
                "etapes": ["Diego", "Nosy Be", "Iles Radama", "Ankarana"],
                "description": "Prenez le temps de vivre au rythme moramora."
            }
        ]
    };
    fs.writeFileSync(itinerairesPath, JSON.stringify(itinerairesData, null, 4));

    const budgetsData = {
        "Roots": { "profil": "Sac à dos", "daily_eur": 25, "desc": "Taxi-brousse, street food, auberges." },
        "Confort": { "profil": "Valise à roulettes", "daily_eur": 60, "desc": "Hôtels sympas, restos, guide privé occasionnel." },
        "Premium": { "profil": "Lune de miel", "daily_eur": 150, "desc": "Lodges de charme, 4x4 privé, tout inclus." }
    };
    fs.writeFileSync(budgetsPath, JSON.stringify(budgetsData, null, 4));
    console.log("Exported itineraires.json and budgets.json");

} catch (err) {
    console.error("Global Error:", err);
}
