const LIEUX_DATA = [
    {
        "id": 1,
        "nom": "Mer d'\u00c9meraude",
        "ville": "Diego-Suarez",
        "type": "Incontournable",
        "prix": "60 000 Ar",
        "prixNum": 60000,
        "note": "4.9",
        "image": "images/iles/mer-emeraude.jpg",
        "description": "Lagon aux eaux turquoise accessible en boutre. Kitesurf et baignade dans un d\u00e9cor de carte postale.",
        "tags": [
            "Nature",
            "Plage"
        ],
        "telephone": "+261 32 02 332 58",
        "adresse": "Accès via Ramena, Diego-Suarez",
        "lat": -12.3333,
        "lng": 49.4833
    },
    {
        "id": 2,
        "nom": "Montagne d'Ambre",
        "ville": "Diego-Suarez",
        "type": "Nature",
        "prix": "45 000 Ar",
        "prixNum": 45000,
        "note": "4.7",
        "image": "images/spots/montagne-ambre.jpg",
        "description": "Parc national offrant une for\u00eat tropicale humide, des cascades sacr\u00e9es et des l\u00e9muriens end\u00e9miques.",
        "tags": [
            "Nature",
            "Rando"
        ],
        "lat": -12.5186,
        "lng": 49.1769
    },
    {
        "id": 3,
        "nom": "Tsingy Rouge",
        "ville": "Diego-Suarez",
        "type": "Incontournable",
        "prix": "50 000 Ar",
        "prixNum": 50000,
        "note": "4.8",
        "image": "images/spots/tsingy-rouge.jpg",
        "description": "Formations g\u00e9ologiques spectaculaires de lat\u00e9rite rouge et de gr\u00e8s, sculpt\u00e9es par l'\u00e9rosion.",
        "tags": [
            "Nature",
            "Photo"
        ],
        "lat": -12.9165,
        "lng": 49.2936
    },
    {
        "id": 6,
        "nom": "Plage de Ramena",
        "ville": "Diego-Suarez",
        "type": "Plage",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.5",
        "image": "images/iles/plage-ramena.jpg",
        "description": "Village de p\u00eacheurs vibrant et plage de sable blanc. Id\u00e9al pour les brochettes de poisson.",
        "tags": [
            "Plage",
            "Manger"
        ],
        "lat": -12.2167,
        "lng": 49.3833
    },
    {
        "id": 16,
        "nom": "Grotte des P\u00eacheurs",
        "ville": "Diego-Suarez",
        "type": "Spot Local",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.8",
        "image": "images/spots/grotte-pecheurs.jpg",
        "description": "Lieu de culte mystique dans une grotte marine. Acc\u00e8s \u00e0 mar\u00e9e basse uniquement.",
        "tags": [
            "Culture",
            "Aventure"
        ],
        "spotLocal": true,
        "lat": -12.2389,
        "lng": 49.3012
    },
    {
        "id": 100,
        "nom": "Le Grand H\u00f4tel",
        "ville": "Diego-Suarez",
        "type": "Hotel",
        "prix": "250 000 Ar",
        "prixNum": 250000,
        "note": "4.5",
        "image": "images/hotels/grand-hotel-diego.jpg",
        "description": "Luxe historique au centre-ville avec piscine et casino.",
        "tags": [
            "Dormir",
            "Luxe"
        ],
        "lat": -12.2714,
        "lng": 49.2917
    },
    {
        "id": 101,
        "nom": "Allamanda Hotel",
        "ville": "Diego-Suarez",
        "type": "Hotel",
        "prix": "300 000 Ar",
        "prixNum": 300000,
        "note": "4.6",
        "image": "images/hotels/allamanda.jpg",
        "description": "Le plus bel h\u00f4tel de Diego centre, vue directe sur la baie.",
        "tags": [
            "Dormir",
            "Vue Mer"
        ],
        "telephone": "+261 32 05 234 56",
        "website": "www.allamanda-hotel.com",
        "adresse": "Rue Richelieu, Bord de Mer",
        "lat": -12.26,
        "lng": 49.29
    },
    {
        "id": 102,
        "nom": "Jungle Park",
        "ville": "Diego-Suarez",
        "type": "Lodge",
        "prix": "150 000 Ar",
        "prixNum": 150000,
        "note": "4.8",
        "image": "images/spots/piscine-naturelle.jpg",
        "description": "Camping \u00e9co-responsable et escalade \u00e0 l'entr\u00e9e de la Montagne des Fran\u00e7ais.",
        "tags": [
            "Dormir",
            "Aventure"
        ],
        "lat": -12.3,
        "lng": 49.3
    },
    {
        "id": 103,
        "nom": "Windsor Castle",
        "ville": "Diego-Suarez",
        "type": "Point de Vue",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.9",
        "image": "images/spots/windsor-castle.jpg",
        "description": "Ancienne fortification offrant une vue \u00e0 360\u00b0 sur tout le nord, y compris Nosy Be par temps clair.",
        "tags": [
            "Nature",
            "Histoire"
        ],
        "lat": -12.2,
        "lng": 49.1
    },
    {
        "id": 17,
        "nom": "Plage d'Andilana",
        "ville": "Nosy Be",
        "type": "Plage",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.8",
        "image": "images/iles/plage-andilana.jpg",
        "description": "La plus belle plage de Nosy Be. Eaux calmes et cristallines, id\u00e9ales pour la baignade.",
        "tags": [
            "Plage",
            "D\u00e9tente"
        ],
        "lat": -13.2205,
        "lng": 48.1824
    },
    {
        "id": 18,
        "nom": "Nosy Komba",
        "ville": "Nosy Be",
        "type": "Nature",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.7",
        "image": "images/iles/nosy-komba.jpg",
        "description": "L'\u00eele aux l\u00e9muriens. Rencontre avec les Makis Macaco et artisanat local (broderie).",
        "tags": [
            "Nature",
            "Faune"
        ],
        "lat": -13.4619,
        "lng": 48.3514
    },
    {
        "id": 19,
        "nom": "Nosy Tanikely",
        "ville": "Nosy Be",
        "type": "Nature",
        "prix": "45 000 Ar",
        "prixNum": 45000,
        "note": "4.9",
        "image": "images/iles/nosy-tanikely.jpg",
        "description": "R\u00e9serve marine prot\u00e9g\u00e9e. Aquarium naturel parfait pour le snorkeling.",
        "tags": [
            "Nature",
            "Plong\u00e9e"
        ],
        "lat": -13.4833,
        "lng": 48.2389
    },
    {
        "id": 20,
        "nom": "Nosy Iranja",
        "ville": "Nosy Be",
        "type": "Incontournable",
        "prix": "150 000 Ar",
        "prixNum": 150000,
        "note": "4.9",
        "image": "images/iles/nosy-iranja.jpg",
        "description": "Deux \u00eelots reli\u00e9s par un banc de sable blanc sublime. Le paradis des tortues.",
        "tags": [
            "Incontournable",
            "Plage"
        ],
        "lat": -13.596,
        "lng": 47.8228
    },
    {
        "id": 22,
        "nom": "Mont Passot",
        "ville": "Nosy Be",
        "type": "Point de Vue",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.7",
        "image": "images/spots/mont-passot.jpg",
        "description": "Le toit de Nosy Be. Coucher de soleil spectaculaire sur les lacs sacr\u00e9s.",
        "tags": [
            "Nature",
            "Sunset"
        ],
        "lat": -13.3214,
        "lng": 48.2611
    },
    {
        "id": 201,
        "nom": "Ravintsara Wellness Hotel",
        "ville": "Nosy Be",
        "type": "Hotel",
        "prix": "800 000 Ar",
        "prixNum": 800000,
        "note": "4.9",
        "image": "images/hotels/ravintsara.jpg",
        "description": "Sanctuaire de bien-\u00eatre luxe dans un jardin luxuriant.",
        "tags": [
            "Dormir",
            "Luxe"
        ],
        "lat": -13.335,
        "lng": 48.185
    },
    {
        "id": 202,
        "nom": "L'Heure Bleue",
        "ville": "Nosy Be",
        "type": "Hotel",
        "prix": "450 000 Ar",
        "prixNum": 450000,
        "note": "4.7",
        "image": "images/restaurants/heure-bleue.jpg",
        "description": "Ecolodge chic \u00e0 Madirokely avec vue imprenable sur la baie.",
        "tags": [
            "Dormir",
            "Charme"
        ],
        "lat": -13.4,
        "lng": 48.2
    },
    {
        "id": 203,
        "nom": "Manga Soa Lodge",
        "ville": "Nosy Be",
        "type": "Hotel",
        "prix": "600 000 Ar",
        "prixNum": 600000,
        "note": "4.8",
        "image": "images/hotels/manga-soa.jpg",
        "description": "Luxe discret et plage priv\u00e9e au nord de l'\u00eele.",
        "tags": [
            "Dormir",
            "Luxe"
        ],
        "lat": -13.2,
        "lng": 48.2
    },
    {
        "id": 204,
        "nom": "Arbre Sacr\u00e9",
        "ville": "Nosy Be",
        "type": "Culture",
        "prix": "10 000 Ar",
        "prixNum": 10000,
        "note": "4.5",
        "image": "images/spots/arbre-millenaire-sacre.jpg",
        "description": "Un banian mill\u00e9naire impressionnant, lieu de culte et d'offrandes.",
        "tags": [
            "Culture",
            "Histoire"
        ],
        "lat": -13.3,
        "lng": 48.3
    },
    {
        "id": 205,
        "nom": "Lokobe Special Reserve",
        "ville": "Nosy Be",
        "type": "Nature",
        "prix": "50 000 Ar",
        "prixNum": 50000,
        "note": "4.6",
        "image": "images/spots/lokobe.jpg",
        "description": "Derni\u00e8re for\u00eat primaire de l'\u00eele. Acc\u00e8s en pirogue, observation de cam\u00e9l\u00e9ons et boas.",
        "tags": [
            "Nature",
            "Aventure"
        ],
        "lat": -13.4,
        "lng": 48.3
    },
    {
        "id": 1001,
        "nom": "Palais de la Reine (Rova)",
        "ville": "Antananarivo",
        "type": "Culture",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.5",
        "image": "images/villes/palais-reine.jpg",
        "description": "Complexe royal historique surplombant la ville. Vue panoramique incontournable.",
        "tags": [
            "Culture",
            "Histoire"
        ],
        "lat": -18.9151,
        "lng": 47.5283
    },
    {
        "id": 1002,
        "nom": "Lemurs' Park",
        "ville": "Antananarivo",
        "type": "Nature",
        "prix": "75 000 Ar",
        "prixNum": 75000,
        "note": "4.6",
        "image": "images/tana/tana_lemurs_park_1765475327277.png",
        "description": "R\u00e9serve priv\u00e9e o\u00f9 9 esp\u00e8ces de l\u00e9muriens vivent en semi-libert\u00e9.",
        "tags": [
            "Nature",
            "Faune"
        ],
        "lat": -18.9667,
        "lng": 47.3833
    },
    {
        "id": 1003,
        "nom": "Restaurant La Varangue",
        "ville": "Antananarivo",
        "type": "Restaurant",
        "prix": "40 000 Ar",
        "prixNum": 40000,
        "note": "4.7",
        "image": "images/restaurants/la-varangue.jpg",
        "description": "Cuisine raffin\u00e9e dans un cadre d'antiquaire colonial unique.",
        "tags": [
            "Manger",
            "Gastronomie"
        ],
        "lat": -18.9122,
        "lng": 47.5341
    },
    {
        "id": 1004,
        "nom": "Colline Royale d'Ambohimanga",
        "ville": "Antananarivo",
        "type": "Culture",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.8",
        "image": "images/tana/tana_ambohimanga_royal_hill_1765475311821.png",
        "description": "Le berceau spirituel de la monarchie Merina. Class\u00e9 UNESCO.",
        "tags": [
            "Culture",
            "UNESCO"
        ],
        "lat": -18.7614,
        "lng": 47.5622
    },
    {
        "id": 1005,
        "nom": "Le Louvre Hotel & Spa",
        "ville": "Antananarivo",
        "type": "Hotel",
        "prix": "350 000 Ar",
        "prixNum": 350000,
        "note": "4.6",
        "image": "images/hotels/louvre-tana.jpg",
        "description": "H\u00f4tel d'affaires moderne et spa en plein quartier d'Antaninarenina.",
        "tags": [
            "Dormir",
            "Confort"
        ],
        "lat": -18.9,
        "lng": 47.5
    },
    {
        "id": 1006,
        "nom": "Sakamanga",
        "ville": "Antananarivo",
        "type": "Hotel",
        "prix": "150 000 Ar",
        "prixNum": 150000,
        "note": "4.5",
        "image": "images/hotels/sakamanga.jpg",
        "description": "Une institution ! Mus\u00e9e-h\u00f4tel plein de charme et d'histoire.",
        "tags": [
            "Dormir",
            "Original"
        ],
        "lat": -18.9,
        "lng": 47.5
    },
    {
        "id": 1007,
        "nom": "March\u00e9 Artisanal de la Digue",
        "ville": "Antananarivo",
        "type": "Shopping",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.4",
        "image": "images/spots/marche-digue.jpg",
        "description": "Le plus grand march\u00e9 d'artisanat : vannerie, bois, pierres, \u00e9pices.",
        "tags": [
            "Shopping",
            "Souvenirs"
        ],
        "lat": -18.8,
        "lng": 47.4
    },
    {
        "id": 1008,
        "nom": "Croc Farm",
        "ville": "Antananarivo",
        "type": "Nature",
        "prix": "30 000 Ar",
        "prixNum": 30000,
        "note": "4.3",
        "image": "images/spots/croc-farm.jpg",
        "description": "Elevage de crocodiles, parc botanique et d\u00e9gustation de viande de croco.",
        "tags": [
            "Nature",
            "Insolite"
        ],
        "lat": -18.8,
        "lng": 47.4
    },
    {
        "id": 31,
        "nom": "Cirque Rouge",
        "ville": "Mahajanga",
        "type": "Incontournable",
        "prix": "10 000 Ar",
        "prixNum": 10000,
        "note": "4.8",
        "image": "images/spots/cirque-rouge.jpg",
        "description": "Canyon de gr\u00e8s aux 12 couleurs. Magnifique au coucher du soleil.",
        "tags": [
            "Nature",
            "Photo"
        ],
        "lat": -15.6667,
        "lng": 46.3167
    },
    {
        "id": 34,
        "nom": "Bord de Mer",
        "ville": "Mahajanga",
        "type": "Spot Local",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.6",
        "image": "images/iles/plage-mahajanga.jpg",
        "description": "Le c\u0153ur vibrant de la ville le soir. Brochettes, baobab et ambiance festive.",
        "tags": [
            "Sortir",
            "Ambiance"
        ],
        "spotLocal": true,
        "lat": -15.7167,
        "lng": 46.3167
    },
    {
        "id": 35,
        "nom": "Parc Ankarafantsika",
        "ville": "Mahajanga",
        "type": "Nature",
        "prix": "45 000 Ar",
        "prixNum": 45000,
        "note": "4.8",
        "image": "images/spots/ankarafantsika.jpg",
        "description": "Royaume des oiseaux et des Sifakas. Paysages de canyon et de lacs.",
        "tags": [
            "Nature",
            "Rando"
        ],
        "lat": -16.3167,
        "lng": 46.8167
    },
    {
        "id": 36,
        "nom": "Katsepy",
        "ville": "Mahajanga",
        "type": "Nature",
        "prix": "15 000 Ar",
        "prixNum": 15000,
        "note": "4.5",
        "image": "images/spots/katsepy-phare.jpg",
        "description": "Village de p\u00eacheurs accessible en bac. L\u00e9muriens et phare historique.",
        "tags": [
            "Aventure",
            "Authentique"
        ],
        "lat": -15.7456,
        "lng": 46.2234
    },
    {
        "id": 37,
        "nom": "Grand Pavois",
        "ville": "Mahajanga",
        "type": "Plage",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.6",
        "image": "images/iles/plage-mahajanga.jpg",
        "description": "La plage pr\u00e9f\u00e9r\u00e9e des Majungais. Restaurants de fruits de mer les pieds dans le sable.",
        "tags": [
            "Plage",
            "Manger"
        ],
        "lat": -15.6,
        "lng": 46.3
    },
    {
        "id": 38,
        "nom": "Antsanitia Resort",
        "ville": "Mahajanga",
        "type": "Hotel",
        "prix": "350 000 Ar",
        "prixNum": 350000,
        "note": "4.7",
        "image": "images/hotels/antsanitia.jpg",
        "description": "Eco-luxe, calme absolu au nord de la ville. Plage immense.",
        "tags": [
            "Dormir",
            "D\u00e9tente"
        ],
        "lat": -15.5,
        "lng": 46.4
    },
    {
        "id": 41,
        "nom": "Parc Andasibe-Mantadia",
        "ville": "Toamasina",
        "type": "Nature",
        "prix": "45 000 Ar",
        "prixNum": 45000,
        "note": "4.8",
        "image": "images/spots/andasibe-mantadia.jpg",
        "description": "La maison de l'Indri Indri. For\u00eat humide et chant des l\u00e9muriens.",
        "tags": [
            "Nature",
            "Incontournable"
        ],
        "lat": -18.9333,
        "lng": 48.4167
    },
    {
        "id": 42,
        "nom": "R\u00e9serve de Vakona",
        "ville": "Toamasina",
        "type": "Nature",
        "prix": "35 000 Ar",
        "prixNum": 35000,
        "note": "4.7",
        "image": "images/spots/reserve-vakona.jpg",
        "description": "L'\u00eele aux l\u00e9muriens o\u00f9 ils viennent manger dans la main.",
        "tags": [
            "Nature",
            "Famille"
        ],
        "lat": -18.935,
        "lng": 48.42
    },
    {
        "id": 1137,
        "nom": "Canal des Pangalanes",
        "ville": "Toamasina",
        "type": "Nature",
        "prix": "40 000 Ar",
        "prixNum": 40000,
        "note": "4.6",
        "image": "images/tamatave/pangalanes.jpg",
        "description": "Navigation fluviale apaisante \u00e0 travers la v\u00e9g\u00e9tation luxuriante.",
        "tags": [
            "Nature",
            "Bateau"
        ],
        "lat": -18.1499,
        "lng": 49.4023
    },
    {
        "id": 1138,
        "nom": "Palmarium Reserve",
        "ville": "Toamasina",
        "type": "Lodge",
        "prix": "200 000 Ar",
        "prixNum": 200000,
        "note": "4.8",
        "image": "images/hotels/palmarium.jpg",
        "description": "Dormez au milieu des l\u00e9muriens. Visite de l'Aye-Aye nocturne.",
        "tags": [
            "Dormir",
            "Nature"
        ],
        "lat": -18.6,
        "lng": 49.2
    },
    {
        "id": 1139,
        "nom": "\u00cele aux Nattes",
        "ville": "Toamasina",
        "type": "Plage",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.9",
        "image": "images/iles/ile-aux-nattes.jpg",
        "description": "Le paradis tropical par excellence, sans voitures, juste du sable blanc.",
        "tags": [
            "Plage",
            "Incontournable"
        ],
        "lat": -17.0,
        "lng": 49.8
    },
    {
        "id": 47,
        "nom": "Plage d'Ifaty",
        "ville": "Toliara",
        "type": "Plage",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.5",
        "image": "images/iles/plage-ifaty.jpg",
        "description": "Station baln\u00e9aire et village de p\u00eacheurs Vezo. Baignade et d\u00e9tente.",
        "tags": [
            "Plage",
            "Farniente"
        ],
        "lat": -23.15,
        "lng": 43.6167
    },
    {
        "id": 48,
        "nom": "For\u00eat des Baobabs (Reniala)",
        "ville": "Toliara",
        "type": "Nature",
        "prix": "15 000 Ar",
        "prixNum": 15000,
        "note": "4.6",
        "image": "images/spots/foret-baobabs-mangily.jpg",
        "description": "For\u00eat \u00e9pineuse spectaculaire avec des baobabs bouteilles.",
        "tags": [
            "Nature",
            "Botanique"
        ],
        "lat": -23.1667,
        "lng": 43.6
    },
    {
        "id": 2046,
        "nom": "Arboretum d'Antsokay",
        "ville": "Toliara",
        "type": "Nature",
        "prix": "20 000 Ar",
        "prixNum": 20000,
        "note": "4.7",
        "image": "images/toliara/arboretum.jpg",
        "description": "Jardin botanique magnifique pr\u00e9sentant la flore unique du Sud.",
        "tags": [
            "Nature",
            "Culture"
        ],
        "lat": -23.4167,
        "lng": 43.75
    },
    {
        "id": 2047,
        "nom": "Anakao Ocean Lodge",
        "ville": "Toliara",
        "type": "Hotel",
        "prix": "400 000 Ar",
        "prixNum": 400000,
        "note": "4.8",
        "image": "images/hotels/anakao-ocean.jpg",
        "description": "Luxe sauvage au sud de Toliara, accessible en bateau.",
        "tags": [
            "Dormir",
            "Plage"
        ],
        "lat": -23.6,
        "lng": 43.6
    },
    {
        "id": 2048,
        "nom": "Bakuba Lodge",
        "ville": "Toliara",
        "type": "Lodge",
        "prix": "500 000 Ar",
        "prixNum": 500000,
        "note": "4.9",
        "image": "images/toliara/toliara_anakao.png",
        "description": "Architecture Gaudi-esque incroyable en plein bush.",
        "tags": [
            "Dormir",
            "Insolite"
        ],
        "lat": -23.3,
        "lng": 43.7
    },
    {
        "id": 44,
        "nom": "Parc National de l'Isalo",
        "ville": "Fianarantsoa",
        "type": "Incontournable",
        "prix": "45 000 Ar",
        "prixNum": 45000,
        "note": "4.9",
        "image": "images/spots/parc-isalo.jpg",
        "description": "Le Colorado Malgache. Piscines naturelles et canyons ruiniformes.",
        "tags": [
            "Nature",
            "Rando"
        ],
        "lat": -22.5833,
        "lng": 45.3667
    },
    {
        "id": 534,
        "nom": "Lac Tritriva",
        "ville": "Antsirabe",
        "type": "Nature",
        "prix": "10 000 Ar",
        "prixNum": 10000,
        "note": "4.8",
        "image": "images/tana/antsirabe_lac_tritriva.jpg",
        "description": "Lac de crat\u00e8re myst\u00e9rieux aux eaux vert \u00e9meraude.",
        "tags": [
            "Nature",
            "L\u00e9gende"
        ],
        "lat": -19.9333,
        "lng": 46.95
    },
    {
        "id": 535,
        "nom": "Cath\u00e9drale d'Antsirabe",
        "ville": "Antsirabe",
        "type": "Culture",
        "prix": "Gratuit",
        "prixNum": 0,
        "note": "4.6",
        "image": "images/tana/antsirabe_cathedrale.jpg",
        "description": "Majestueuse cath\u00e9drale et balade en pousse-pousse.",
        "tags": [
            "Culture",
            "Ville"
        ],
        "lat": -19.8667,
        "lng": 47.0333
    },
    {
        "id": 536,
        "nom": "Ranomafana National Park",
        "ville": "Fianarantsoa",
        "type": "Nature",
        "prix": "55 000 Ar",
        "prixNum": 55000,
        "note": "4.7",
        "image": "images/spots/ranomafana.jpg",
        "description": "For\u00eat dense humide, thermes et l\u00e9muriens dor\u00e9s.",
        "tags": [
            "Nature",
            "Faune"
        ],
        "lat": -21.2,
        "lng": 47.4
    },
    {
        "id": 537,
        "nom": "Train Fianar-Manakara",
        "ville": "Fianarantsoa",
        "type": "Aventure",
        "prix": "70 000 Ar",
        "prixNum": 70000,
        "note": "4.5",
        "image": "images/spots/train-fianar.jpg",
        "description": " Voyage mythique \u00e0 travers la jungle. Une exp\u00e9rience hors du temps.",
        "tags": [
            "Aventure",
            "Train"
        ],
        "lat": -21.4,
        "lng": 47.1
    }
];