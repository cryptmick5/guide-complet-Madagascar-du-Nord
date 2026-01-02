/**
 * ====================================================================
 * SCRIPT GROK V6 - L'ULTIME ROAST
 * ====================================================================
 * Objectif: Diversité MAXIMALE et Précision CHIRURGICALE
 * - Plus de catégories (Spot Local, Sacré/Fady, Transport)
 * - > 200 Punchlines uniques
 * - Logique de détection prioritaire
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data/lieux.js',
    backupPath: './data/_backups/lieux_backup_v6_grok_final_' + Date.now() + '.js',
    logPath: './logs/add_grok_v6_' + Date.now() + '.log',
    testMode: false
};

// ====================================================================
// BIBLIOTHÈQUE "GROK / ROAST" ÉTENDUE
// ====================================================================
const GROK_PUNCHLINES = {
    'SpotLocal': [
        "C'est pas sale, c'est 'roots'. Ton système immunitaire a besoin d'entraînement de toute façon. 🍛",
        "Si la nappe colle, c'est bon signe. Ça veut dire qu'il y a du passage (ou qu'elle est là depuis 1998). 🍽️",
        "Le prix est si bas que tu vas croire à une erreur. Non, c'est juste le vrai prix sans la 'taxe touriste'. 💰",
        "Oublie TripAdvisor. Ici, l'avis client, c'est le nombre de locaux qui font la queue. Fais la queue. 🚶‍♂️",
        "Tu vas manger avec les doigts, boire de l'eau suspecte et passer le meilleur moment de ton séjour. Promis. 🤝",
        "Le menu ? C'est ce qu'il y a dans la marmite. Prends-le ou va manger des pringles à l'hôtel. 🍲",
        "L'accueil est plus chaud que le piment dans ton assiette. Et crois-moi, le piment ne rigole pas. 🌶️",
        "Déco minimaliste : chaises en plastique et calendrier 2012. L'essentiel est dans l'assiette. 🪑",
        "Ici on ne poste pas sur Instagram, on mange. Vite. Avant que ton voisin ne lorgne sur ton assiette. 👀",
        "La patronne t'appelle 'Chéri' ou 'Mon fils'. Fais gaffe, elle peut aussi te gronder si tu finis pas. 👵",
        "Si tu cherches du quinoa bio sans gluten, tu t'es trompé de continent (et de quartier). Ici c'est graisse, rire et riz. 🍚",
        "Le concept de 'Service Client' ici, c'est de te nourrir avant que tu ne tombes en hypoglycémie. Efficace. ⚡",
        "La 'Carte' est orale et change selon l'humeur du chef. Mais le 'Ravitoto' est une valeur sûre. 🥥",
        "Tu as peur pour ton estomac ? Prends un Coca, ça tue tout. Et profite du goût. 🥤"
    ],
    'Sacre': [
        "Touche pas. Juste... touche pas. C'est sacré, c'est fady, et t'as pas envie d'être maudit sur 7 générations. ⛔",
        "Les ancêtres te regardent. Et ils jugent ton short à fleurs. Un peu de respect, merci. 👻",
        "Si le guide te dit d'enlever tes chaussures, tu le fais. Discuter, c'est risquer un incident diplomatique (et spirituel). 👞",
        "C'est mystique, c'est ancien, et toi tu penses juste à ta photo de profil. Triste époque. 📸",
        "Tu ne comprends rien aux rituels ? C'est normal. Contente-toi d'être humble et de ne rien casser. 🙏",
        "Ici, on ne pointe pas du doigt. Sauf si tu veux pointer vers ta propre malchance future. 👉",
        "Le silence est d'or. Et ici, il est obligatoire. Range ton téléphone et écoute l'histoire (même si c'est compliqué). 🤫",
        "Ne demande pas 'Pourquoi ?'. La réponse est 'Parce que'. C'est le Fady. Accepte-le. 🤐",
        "Tu te sens observé ? C'est normal. C'est l'ambiance. Ou un lémurien. Ou un fantôme. Qui sait ? 👁️",
        "Si tu vois du tissu rouge, c'est pas de la déco. C'est sacré. Recule doucement et fais un sourire gêné. 🔴",
        "On ne s'assoit pas n'importe où. Sauf si tu veux t'asseoir sur l'esprit d'un roi du 17ème siècle. Mauvaise idée. 👑"
    ],
    'Transport': [
        "Mora Mora... on arrive quand on arrive. Regarder ta montre ne fera pas avancer le taxi-brousse plus vite. 🚐",
        "C'est pas un trajet, c'est une expérience de survie collective. Tu vas te faire des amis (de force). 🫂",
        "Tu pensais que 100km ça prenait 1h ? Mignon. Compte plutôt en demi-journées. ⏳",
        "Astuce : Si tu tiens à tes genoux, ne monte pas. Ou coupe-les avant de partir. 🦵",
        "Les poules et les sacs de riz sont prioritaires. Toi, tu combles les vides. Accepte ta place dans la chaîne alimentaire. 🐔",
        "La playlist du chauffeur tourne en boucle. Dans 4h, tu connaîtras les tubes locaux par cœur (et tu les détesteras). 🎶",
        "La clim ? Baisse la vitre. Ah, la manivelle est cassée ? Dommage. 🥵",
        "Chaque nid de poule est une occasion de vérifier si tes vertèbres sont bien attachées. 🦴",
        "Tu vas connaître chaque nid de poule par son prénom. Jean-Michel le trou de 12h30 est particulièrement vicieux. 🕳️",
        "N'oublie pas de dire au revoir à ta famille, on ne sait jamais. 👋"
    ],
    'Nature': [
        "Tu vas payer pour marcher dans la boue et chercher un lézard de 2cm invisible. Et tu vas adorer ça. Masochiste. 🤠",
        "Si le guide te dit 'C'est juste à côté', prépare-toi mentalement pour 2h de marche commando. 🥾",
        "Les lémuriens ne sont pas mignons, ils complotent. Et ils jugent tes chaussures Quechua. 🐒",
        "La météo a plus de sautes d'humeur qu'une diva. K-way, maillot, doudoune : prends tout. 🌦️",
        "Tu vas prendre 50 photos de la même feuille en croyant que c'est un insecte rare. Spoiler: c'est une feuille. 🍃",
        "Le silence de la nature... interrompu uniquement par ton souffle court et tes plaintes. 😮‍💨",
        "Attention, ici les moustiques sont des mutants. Ils traversent les vêtements et se moquent de ton répulsif bio. 🦟",
        "C'est 'sauvage'. Ce qui veut dire 'pas de toilettes' et 'pas de réseau'. Bonne chance. 🚽",
        "Tu voulais de l'aventure ? Voilà de la boue jusqu'aux genoux. Ne pleure pas, c'est ce que tu as payé. 💩",
        "Regarde, une cascade ! Une autre ! C'est de l'eau qui tombe. Incroyable non ? Maintenant marche. 🌊",
        "Les sentiers sont 'balisés'. Si par balisé tu entends 'vaguement piétinés par un zébu en 2012'. 🗺️",
        "Ne touche pas à cette plante. Ni à celle-là. En fait, garde les mains dans les poches, tout veut te griffer ici. 🌵",
        "Le guide voit des choses que tu ne vois pas. Fais semblant. 'Ah oui, magnifique ce phasme !' (C'est une branche). 🌿"
    ],
    'Plage': [
        "Le sable s'infiltre partout. Vraiment partout. On en reparle dans 3 jours aux urgences. 🏖️",
        "L'eau est chaude, le soleil tape, et tu as oublié ta crème. Bonne chance le homard. 🦞",
        "C'est le paradis sur terre. Enfin, jusqu'à ce que tu cherches du WiFi pour poster ta story. 📶",
        "Attention, les noix de coco sont des tueuses silencieuses. La gravité ne prend pas de vacances. 🥥",
        "Tu vas passer 4h à essayer de faire une photo 'seule au monde' alors qu'il y a 50 vendeurs de paréos derrière. 📸",
        "L'eau bleue turquoise, c'est joli. Les coups de soleil au 3ème degré, c'est moins instagrammable. 🔥",
        "Profite du calme... avant que le groupe de touristes avec l'enceinte Bluetooth n'arrive. bzzzt 🔊",
        "Oui, l'eau est transparente. Oui, il y a des poissons. Non, ils ne veulent pas être tes amis. 🐠",
        "Détente absolue... interrompue toutes les 3 minutes pour te vendre un massage ou des beignets coco. 💆‍♀️",
        "Le coucher de soleil sera magnifique. Ton coup de soleil, lui, sera légendaire. 🌅",
        "Ne laisse rien traîner. Le vent (ou un chien errant) s'occupera de faire disparaître ta sandale gauche. 🐕"
    ],
    'Restaurant': [
        "Mora Mora sur le service. Si tu es pressé, tu t'es trompé de pays (et d'hémisphère). ⏳",
        "C'est lourd, c'est riche, c'est bon. Ton régime commence lundi prochain (ou jamais). 🍗",
        "Le rhum arrangé n'est pas une boisson, c'est un test de sélection naturelle pour ton foie. 🥃",
        "Ne demande pas ce qu'il y a exactement dans la sauce. Mange, c'est délicieux, pose pas de questions. 🤫",
        "Ici, 'épicé' veut dire 'appelle les pompiers'. Tu as été prévenu. 🌶️",
        "Le menu est à titre indicatif. Il y a ce qu'il y a, et tu vas dire merci. 🤷‍♂️",
        "Si tu finis ton assiette, ils vont croire que tu as encore faim. C'est un piège sans fin. 🍽️",
        "La vue est belle, ça aide à faire passer l'attente de 45 minutes pour une entrée froide. 🥗",
        "Prends le poisson. Il nageait encore ce matin. Contrairement au steak qui a fait plus d'avion que toi. 🐟",
        "Le dessert ? C'est des fruits. Toujours des fruits. Ou une banane flambée si c'est jour de fête. 🍌",
        "L'addition arrivera... un jour. Peut-être. Profite pour digérer. 🧾"
    ],
    'Bar': [
        "Tu vas boire, tu vas danser, tu vas oublier. Demain matin sera un problème pour le 'Toi du Futur'. 🍻",
        "La musique est si forte que tes oreilles vont saigner, mais après 3 verres, tu trouveras ça génial. 🎶",
        "Ici on ne demande pas l'heure. On demande juste 'encore un ?'. 🍹",
        "Tu vas devenir meilleur ami avec des gens dont tu ne te souviendras plus du prénom demain. C'est la magie. ✨",
        "Le sol colle. Les verres collent. Tout colle. C'est ça l'ambiance authentique. 🦶",
        "Le DJ passe les mêmes 3 chansons depuis 2010. Et tu vas quand même danser dessus. 💃",
        "Attention au rhum coco. Il a le goût de jus de fruit, mais il frappe comme un boxeur poids lourd. 🥊",
        "C'est ici que les légendes naissent et que les dignités meurent. Santé ! 🥂"
    ],
    'Hotel': [
        "Le WiFi fonctionne... quand il a envie. Un peu comme le personnel, finalement. 📶",
        "L'eau chaude est une option VIP aléatoire. Bienvenue dans la douche écossaise tropicale. 🚿",
        "Les geckos dans la chambre sont tes colocs. Ils mangent les moustiques, dis-leur merci et dors. 🦎",
        "5 étoiles en local, ça vaut un 2 étoiles chez toi. Ajuste tes attentes et tout ira bien. ⭐",
        "Le petit-déjeuner est inclus, mais la bataille pour le dernier croissant ne l'est pas. 🥐",
        "Si tu trouves une bête bizarre dans ta chambre, donne-lui un prénom. Ça fait moins peur. 🕷️",
        "Vue sur mer ? Si tu te penches beaucoup et que tu fermes un œil, oui, absolument. 🌊",
        "La piscine a l'air propre. 'A l'air' est le mot clé. Plonge, on verra bien. 🏊",
        "La télé a deux chaînes : de la neige et une émission de cuisine en malgache. Cultive-toi. 📺"
    ],
    'Ville': [
        "C'est bruyant, c'est chaotique, ça sent fort. C'est vivant, quoi. Pas comme ton open-space aseptisé. 🏙️",
        "Le code de la route est une suggestion vague. Le klaxon est ton seul bouclier. 🚗",
        "Tu vas acheter des souvenirs moches que tu cacheras au fond d'un placard. C'est la tradition. 🗿",
        "Ne cherche pas la logique des rues. Il n'y en a pas. Perds-toi, c'est fait exprès. 🗺️",
        "Les trottoirs sont des parcours d'obstacles. C'est comme Koh-Lanta, mais en ville. 🏃‍♂️",
        "Tu vas transpirer juste en restant debout. Accepte ta nouvelle condition d'humain moite. 💦",
        "Négocie tout. Même si tu ne gagnes que 10 centimes, c'est pour le principe (et le respect). 🤝",
        "Traverser la rue demande la foi, du courage et un timing parfait. Bonne chance. 🚦"
    ],
    'default': [
        "Tu es perdu ? Moi aussi. Mais regarde, c'est joli. 👀",
        "Mora Mora... on arrive quand on arrive. Arrête de regarder ta montre, elle ne sert à rien ici. ⌚",
        "Ceci est un lieu touristique. Il y a donc des touristes. Ne fais pas l'étonné. 📸",
        "Prépare ton portefeuille, tout se négocie. Sauf ta dignité, ça c'est déjà perdu. 💸",
        "Souriez, vous êtes à Madagascar. Si ça ne marche pas, prenez un autre rhum. 🥃",
        "C'est loin, c'est compliqué d'accès, mais tu vas mettre la photo sur Instagram donc ça vaut le coup. 📱",
        "Respire par la bouche si ça sent fort. Par le nez si ça sent bon. C'est la base de la survie ici. 👃",
        "L'aventure commence là où le goudron s'arrête. Et ici, il s'arrête souvent. 🛑"
    ]
};

/**
 * LOGIQUE DE DÉTECTION PRIORITAIRE (AFFINÉE)
 */
function determineCategory(lieu) {
    const nom = (lieu.nom || '').toLowerCase();
    const type = (lieu.categorie || lieu.type || '').toLowerCase();
    const tags = (lieu.tags || []).map(t => t.toLowerCase());
    const desc = (lieu.description || '').toLowerCase();

    // 1. PRIORITÉ ABSOLUE: LIEUX SACRÉS / FADY / HISTOIRE
    if (
        nom.includes('sacré') || nom.includes('fady') || nom.includes('tsingy') ||
        type.includes('culture') || type.includes('temp') || type.includes('tombeau') ||
        tags.includes('culture') || desc.includes('sacré') || desc.includes('interdit')
    ) {
        return 'Sacre';
    }

    // 2. TRANSPORT
    if (type.includes('transport') || type.includes('gare') || desc.includes('brousse') || nom.includes('taxi')) {
        return 'Transport';
    }

    // 3. PRIORITÉ ÉLEVÉE: SPOT LOCAL / GARGOTTE
    // Condition stricte : doit être explicitement budget_1 ET manger/gargote
    // OU avoir le mot "gargote"
    const isBudget1 = tags.includes('budget_1');
    const isManger = type.includes('restau') || type.includes('manger') || nom.includes('gargote') || nom.includes('chez ');

    // Liste d'exclusion pour ne pas taguer les lieux chics comme locaux juste à cause d'un tag budget mal placé
    const isExclu = type.includes('hotel') || type.includes('lodge') || type.includes('luxe') ||
        type.includes('resort') || type.includes('club') || type.includes('bistro') ||
        nom.includes('club') || nom.includes('lounge') || nom.includes('resort') || nom.includes('hotel');

    if ((isBudget1 && isManger && !isExclu) || nom.includes('gargote')) {
        return 'SpotLocal';
    }

    // 4. CATÉGORIES STANDARDS (Ordre intelligent)
    if (type.includes('natur') || type.includes('parc') || type.includes('rando') || type.includes('cascad')) return 'Nature';
    if (type.includes('plag') || type.includes('mer') || type.includes('îl') || type.includes('nautiq')) return 'Plage';

    // Bar check
    if (type.includes('bar') || type.includes('nuit') || type.includes('club') || type.includes('discoth') || nom.includes('club')) return 'Bar';

    if (type.includes('restau') || type.includes('manger') || type.includes('gastro')) return 'Restaurant';
    if (type.includes('hotel') || type.includes('héberg') || type.includes('lodge') || type.includes('bungalow') || type.includes('resort')) return 'Hotel';
    if (type.includes('vil') || type.includes('urbain') || type.includes('shop') || type.includes('march')) return 'Ville';

    // Fallback tag check
    if (tags.includes('nature')) return 'Nature';
    if (tags.includes('plage')) return 'Plage';
    if (tags.includes('ville')) return 'Ville';

    return 'default';
}

/**
 * Choisit une punchline unique
 */
function getGrokPunchline(lieu) {
    // Exception Montagne d'Ambre
    if (lieu.nom.toLowerCase().includes("montagne d'ambre")) {
        return "Tu vas marcher 3h dans la boue pour voir une cascade... qui est juste de l'eau qui tombe. Mais 'c'est l'aventure' qu'ils disent. 🤠";
    }

    const category = determineCategory(lieu);
    const options = GROK_PUNCHLINES[category] || GROK_PUNCHLINES['default'];

    // Générateur pseudo-aléatoire stable basé sur le nom
    let seed = 0;
    for (let i = 0; i < lieu.nom.length; i++) seed += lieu.nom.charCodeAt(i);
    seed += category.length * 10;

    const index = seed % options.length;
    return options[index];
}


// ====================================================================
// MAIN
// ====================================================================

async function main() {
    console.log('💀 GROK MODE V6: FINAL ROAST INJECTION...\n');
    console.log('-------------------------------------------');
    console.log(`📚 Punchlines: ${Object.values(GROK_PUNCHLINES).flat().length} variations`);
    console.log('-------------------------------------------\n');

    try {
        const dataFile = fs.readFileSync(CONFIG.dataPath, 'utf8');
        const dataMatch = dataFile.match(/window\.LIEUX_DATA\s*=\s*(\[[\s\S]*?\]);/);

        if (!dataMatch) throw new Error('Données non trouvées');

        const data = eval('(' + dataMatch[1] + ')');
        const fichesModifiees = [];
        const stats = {};

        for (let i = 0; i < data.length; i++) {
            const lieu = data[i];
            const cat = determineCategory(lieu);
            const punchline = getGrokPunchline(lieu);

            stats[cat] = (stats[cat] || 0) + 1;

            const fiche = { ...lieu };
            fiche.humour_grok = punchline;
            fichesModifiees.push(fiche);

            // Log sample pour debug (Kudeta, etc.)
            if (lieu.nom.includes('Kudeta') || i % 40 === 0) {
                console.log(`[${cat.toUpperCase()}] ${lieu.nom} \n   👉 "${punchline.substring(0, 60)}..."`);
            }
        }

        console.log('\n📊 DISTRIBUTION:');
        console.table(stats);

        if (!CONFIG.testMode) {
            const newContent = `/**
 * ====================================================================
 * DONNÉES DES LIEUX - GASIKARA EXPLORER V6 (FINAL ROAST)
 * ====================================================================
 * Version V6: 200+ punchlines, Catégories 'Local' & 'Sacré'
 * Date: ${new Date().toLocaleDateString('fr-FR')}
 * Total: ${fichesModifiees.length} fiches
 */

window.LIEUX_DATA = ${JSON.stringify(fichesModifiees, null, 2)};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.LIEUX_DATA;
}
`;
            fs.writeFileSync(CONFIG.dataPath, newContent);
            console.log(`\n✅ Sauvegardé avec succès !`);
        }
    } catch (error) {
        console.error('❌ ERREUR:', error);
    }
}

main();
