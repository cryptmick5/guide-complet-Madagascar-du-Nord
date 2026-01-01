const PHRASES_DATA = {
    "Salutations & Politesse": [
        { fr: "Bonjour", mg: "Manao ahoana", phonetic: "man-ao a-ho-ana", audio: "bonjour.wav" },
        { fr: "Merci", mg: "Misaotra", phonetic: "mi-sao-tra", audio: "merci.wav" },
        { fr: "S'il vous plaît", mg: "Azafady", phonetic: "a-za-fa-dy", audio: "sil-vous-plait.wav" },
        { fr: "Excusez-moi", mg: "Miala tsiny", phonetic: "mi-a-la tsi-ny", audio: "excusez-moi.wav" },
        { fr: "Au revoir", mg: "Veloma", phonetic: "ve-lo-ma", audio: "au-revoir.wav" },
        { fr: "Oui", mg: "Eny", phonetic: "e-ny", audio: "oui.wav" },
        { fr: "Non", mg: "Tsia", phonetic: "tsi-a", audio: "non.wav" }
    ],
    "Se présenter": [
        { fr: "Je m'appelle...", mg: "[Nom] no anarako", phonetic: "[nom] no a-na-ra-ko", audio: "je-mappelle.wav" },
        { fr: "Je suis français(e)", mg: "Frantsay aho", phonetic: "fran-tsaï a-ho", audio: "je-suis-francaise.wav" },
        { fr: "Je ne parle pas malgache", mg: "Tsy mahay miteny malagasy aho", phonetic: "tsi ma-haï mi-te-ny ma-la-ga-sy a-ho", audio: "je-ne-parle-pas-malgache.wav" },
        { fr: "Je suis en vacances", mg: "Miala sasatra aho", phonetic: "mi-a-la sa-sa-tra a-ho", audio: "je-suis-en-vacances.wav" },
        { fr: "Enchanté(e)", mg: "Faly mahafantatra anao", phonetic: "fa-ly ma-ha-fan-ta-tra a-nao", audio: "enchantee.wav" }
    ],
    "Se déplacer": [
        { fr: "Où est la plage ?", mg: "Aiza ny moron-dranomasina ?", phonetic: "aï-za ni mo-ron-dra-no-ma-si-na", audio: "ou-est-la-plage.wav" },
        { fr: "Combien pour Diego ?", mg: "Hoatrinona ny ho any Antsiranana ?", phonetic: "ho-a-tri-no-na ni ho a-ny an-tsi-ra-na-na", audio: "combien-pour-diego.wav" },
        { fr: "Je suis perdu(e)", mg: "Very làlana aho", phonetic: "ve-ry la-la-na a-ho", audio: "je-suis-perdue.wav" },
        { fr: "C'est loin ?", mg: "Lavitra ve ?", phonetic: "la-vi-tra ve", audio: "cest-loin.wav" },
        { fr: "À droite", mg: "Havanana", phonetic: "ha-va-na-na", audio: "a-droite.wav" },
        { fr: "À gauche", mg: "Havia", phonetic: "hi-vi-a", audio: "a-gauche.wav" },
        { fr: "Tout droit", mg: "Mahitsy", phonetic: "ma-hit-sy", audio: "tout-droit.wav" },
        { fr: "Arrêtez ici", mg: "Mijanona eto", phonetic: "mi-ja-no-na e-to", audio: "arretez-ici.wav" }
    ],
    "Négocier & Acheter": [
        { fr: "Combien ça coûte ?", mg: "Ohatrinona ny vidiny ?", phonetic: "o-ha-tri-no-na ni vi-di-ny", audio: "combien-ca-coute.wav" },
        { fr: "C'est trop cher", mg: "Lafo be loatra izany", phonetic: "la-fo be lo-a-tra i-za-ny", audio: "cest-trop-cher.wav" },
        { fr: "Moins cher possible ?", mg: "Mora kokoa ve ?", phonetic: "mo-ra ko-ko-a ve", audio: "moins-cher-possible.wav" },
        { fr: "Je prends ça", mg: "Alako io", phonetic: "a-la-ko i-o", audio: "je-prends-ca.wav" },
        { fr: "Vous acceptez les euros ?", mg: "Mandray euros ve ianao ?", phonetic: "man-draï e-u-ros ve i-a-nao", audio: "vous-acceptez-les-euros.wav" },
        { fr: "Pas de monnaie", mg: "Tsy misy vola madinika", phonetic: "tsi mi-sy vo-la ma-di-ni-ka", audio: "pas-de-monnaie.wav" }
    ],
    "Restaurant": [
        { fr: "Une table pour deux", mg: "Latabatra roa azafady", phonetic: "la-ta-ba-tra ro-a a-za-fa-dy", audio: "une-table-pour-deux.wav" },
        { fr: "Le menu s'il vous plaît", mg: "Ny menu azafady", phonetic: "ni me-nu a-za-fa-dy", audio: "le-menu-sil-vous-plait.wav" },
        { fr: "L'addition", mg: "Ny faktiora", phonetic: "ni fak-ti-o-ra", audio: "laddition.wav" },
        { fr: "C'était délicieux", mg: "Matsiro be", phonetic: "ma-tsi-ro be", audio: "cetait-delicieux.wav" },
        { fr: "Eau minérale", mg: "Rano mineraly", phonetic: "ra-no mi-ne-ra-ly", audio: "eau-minerale.wav" },
        { fr: "Sans piment", mg: "Tsy misy sakay", phonetic: "tsi mi-sy sa-kaï", audio: "sans-piment.wav" },
        { fr: "Je suis végétarien(ne)", mg: "Tsy mihinana hena aho", phonetic: "tsi mi-hi-na-na he-na a-ho", audio: "je-suis-vegetarienne.wav" }
    ],
    "Nombres": [
        { fr: "1", mg: "Iray", phonetic: "i-raï", audio: "1.wav" },
        { fr: "2", mg: "Roa", phonetic: "ro-a", audio: "2.wav" },
        { fr: "3", mg: "Telo", phonetic: "te-lo", audio: "3.wav" },
        { fr: "4", mg: "Efatra", phonetic: "e-fa-tra", audio: "4.wav" },
        { fr: "5", mg: "Dimy", phonetic: "di-my", audio: "5.wav" },
        { fr: "10", mg: "Folo", phonetic: "fo-lo", audio: "10.wav" },
        { fr: "100", mg: "Zato", phonetic: "za-to", audio: "100.wav" },
        { fr: "1 000", mg: "Arivo", phonetic: "a-ri-vo", audio: "1-000.wav" }
    ],
    "Urgence & Santé": [
        { fr: "Aidez-moi !", mg: "Vonjeo aho !", phonetic: "von-je-o a-ho", audio: "aidez-moi.wav" },
        { fr: "Mal à la tête", mg: "Marary ny lohako", phonetic: "ma-ra-ry ni lo-ha-ko", audio: "mal-a-la-tete.wav" },
        { fr: "Où est la pharmacie ?", mg: "Aiza ny fivarotam-panafody ?", phonetic: "aï-za ni fi-va-ro-tam-fa-na-fo-dy", audio: "ou-est-la-pharmacie.wav" },
        { fr: "Hôpital", mg: "Hopitaly", phonetic: "ho-pi-ta-ly", audio: "hopital.wav" },
        { fr: "J'ai besoin d'un docteur", mg: "Mila dokotera aho", phonetic: "mi-la do-ko-te-ra a-ho", audio: "jai-besoin-dun-docteur.wav" },
        { fr: "Allergie", mg: "Alerizy", phonetic: "a-le-ri-zy", audio: "allergie.wav" }
    ],
    "Hébergement & Météo": [
        { fr: "Hôtel", mg: "Hotely", phonetic: "ho-te-ly", audio: "hotel.wav" },
        { fr: "Chambre", mg: "Efitrano", phonetic: "e-fi-tra-no", audio: "chambre.wav" },
        { fr: "Il fait chaud", mg: "Mafana", phonetic: "ma-fa-na", audio: "il-fait-chaud.wav" },
        { fr: "Il pleut", mg: "Avy ny orana", phonetic: "a-vy ni o-ra-na", audio: "il-pleut.wav" }
    ]
};

const CHECKLIST_ITEMS = [
    "SIM locale Telma",
    "Argent liquide (CB rare)",
    "Adaptateur prise C/E",
    "Crème solaire SPF50+",
    "Lampe frontale",
    "Carnet + stylo",
    "Powerbank 20 000 mAh",
    "Sac étanche",
    "Répulsif anti-moustiques",
    "Trousse premiers secours"
];
