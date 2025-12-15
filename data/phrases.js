const PHRASES_DATA = {
    "Salutations & Politesse": [
        { fr: "Bonjour", mg: "Manao ahoana", phonetic: "man-ao a-ho-ana" },
        { fr: "Merci", mg: "Misaotra", phonetic: "mi-sao-tra" },
        { fr: "S'il vous plaît", mg: "Azafady", phonetic: "a-za-fa-dy" },
        { fr: "Excusez-moi", mg: "Miala tsiny", phonetic: "mi-a-la tsi-ny" },
        { fr: "Au revoir", mg: "Veloma", phonetic: "ve-lo-ma" },
        { fr: "Oui", mg: "Eny", phonetic: "e-ny" },
        { fr: "Non", mg: "Tsia", phonetic: "tsi-a" }
    ],
    "Se présenter": [
        { fr: "Je m'appelle...", mg: "[Nom] no anarako", phonetic: "[nom] no a-na-ra-ko" },
        { fr: "Je suis français(e)", mg: "Frantsay aho", phonetic: "fran-tsaï a-ho" },
        { fr: "Je ne parle pas malgache", mg: "Tsy mahay miteny malagasy aho", phonetic: "tsi ma-haï mi-te-ny ma-la-ga-sy a-ho" },
        { fr: "Je suis en vacances", mg: "Miala sasatra aho", phonetic: "mi-a-la sa-sa-tra a-ho" },
        { fr: "Enchanté(e)", mg: "Faly mahafantatra anao", phonetic: "fa-ly ma-ha-fan-ta-tra a-nao" }
    ],
    "Se déplacer": [
        { fr: "Où est la plage ?", mg: "Aiza ny moron-dranomasina ?", phonetic: "aï-za ni mo-ron-dra-no-ma-si-na" },
        { fr: "Combien pour Diego ?", mg: "Hoatrinona ny ho any Antsiranana ?", phonetic: "ho-a-tri-no-na ni ho a-ny an-tsi-ra-na-na" },
        { fr: "Je suis perdu(e)", mg: "Very làlana aho", phonetic: "ve-ry la-la-na a-ho" },
        { fr: "C'est loin ?", mg: "Lavitra ve ?", phonetic: "la-vi-tra ve" },
        { fr: "À droite", mg: "Havanana", phonetic: "ha-va-na-na" },
        { fr: "À gauche", mg: "Havia", phonetic: "hi-vi-a" },
        { fr: "Tout droit", mg: "Mahitsy", phonetic: "ma-hit-sy" },
        { fr: "Arrêtez ici", mg: "Mijanona eto", phonetic: "mi-ja-no-na e-to" }
    ],
    "Négocier & Acheter": [
        { fr: "Combien ça coûte ?", mg: "Ohatrinona ny vidiny ?", phonetic: "o-ha-tri-no-na ni vi-di-ny" },
        { fr: "C'est trop cher", mg: "Lafo be loatra izany", phonetic: "la-fo be lo-a-tra i-za-ny" },
        { fr: "Moins cher possible ?", mg: "Mora kokoa ve ?", phonetic: "mo-ra ko-ko-a ve" },
        { fr: "Je prends ça", mg: "Alako io", phonetic: "a-la-ko i-o" },
        { fr: "Vous acceptez les euros ?", mg: "Mandray euros ve ianao ?", phonetic: "man-draï e-u-ros ve i-a-nao" },
        { fr: "Pas de monnaie", mg: "Tsy misy vola madinika", phonetic: "tsi mi-sy vo-la ma-di-ni-ka" }
    ],
    "Restaurant": [
        { fr: "Une table pour deux", mg: "Latabatra roa azafady", phonetic: "la-ta-ba-tra ro-a a-za-fa-dy" },
        { fr: "Le menu s'il vous plaît", mg: "Ny menu azafady", phonetic: "ni me-nu a-za-fa-dy" },
        { fr: "L'addition", mg: "Ny faktiora", phonetic: "ni fak-ti-o-ra" },
        { fr: "C'était délicieux", mg: "Matsiro be", phonetic: "ma-tsi-ro be" },
        { fr: "Eau minérale", mg: "Rano mineraly", phonetic: "ra-no mi-ne-ra-ly" },
        { fr: "Sans piment", mg: "Tsy misy sakay", phonetic: "tsi mi-sy sa-kaï" },
        { fr: "Je suis végétarien(ne)", mg: "Tsy mihinana hena aho", phonetic: "tsi mi-hi-na-na he-na a-ho" }
    ],
    "Nombres": [
        { fr: "1", mg: "Iray", phonetic: "i-raï" },
        { fr: "2", mg: "Roa", phonetic: "ro-a" },
        { fr: "3", mg: "Telo", phonetic: "te-lo" },
        { fr: "4", mg: "Efatra", phonetic: "e-fa-tra" },
        { fr: "5", mg: "Dimy", phonetic: "di-my" },
        { fr: "10", mg: "Folo", phonetic: "fo-lo" },
        { fr: "100", mg: "Zato", phonetic: "za-to" },
        { fr: "1 000", mg: "Arivo", phonetic: "a-ri-vo" }
    ],
    "Urgence & Santé": [
        { fr: "Aidez-moi !", mg: "Vonjeo aho !", phonetic: "von-je-o a-ho" },
        { fr: "Mal à la tête", mg: "Marary ny lohako", phonetic: "ma-ra-ry ni lo-ha-ko" },
        { fr: "Où est la pharmacie ?", mg: "Aiza ny fivarotam-panafody ?", phonetic: "aï-za ni fi-va-ro-tam-fa-na-fo-dy" },
        { fr: "Hôpital", mg: "Hopitaly", phonetic: "ho-pi-ta-ly" },
        { fr: "J'ai besoin d'un docteur", mg: "Mila dokotera aho", phonetic: "mi-la do-ko-te-ra a-ho" },
        { fr: "Allergie", mg: "Alerizy", phonetic: "a-le-ri-zy" }
    ],
    "Hébergement & Météo": [
        { fr: "Hôtel", mg: "Hotely", phonetic: "ho-te-ly" },
        { fr: "Chambre", mg: "Efitrano", phonetic: "e-fi-tra-no" },
        { fr: "Il fait chaud", mg: "Mafana", phonetic: "ma-fa-na" },
        { fr: "Il pleut", mg: "Avy ny orana", phonetic: "a-vy ni o-ra-na" }
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
