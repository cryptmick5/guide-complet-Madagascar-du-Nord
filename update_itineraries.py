
import json

itineraires = {
    "circuit-nord": {
        "id": "circuit-nord",
        "nom": "L'Épopée du Grand Nord",
        "duree": "10 Jours",
        "image": "images/circuits/circuit-nord.jpg",
        "description": "De la Mer d'Émeraude aux Tsingy Rouge, une aventure complète.",
        "match_profil": ["Aventure", "Nature", "Plage"],
        "infos": {
            "securite_level": "Sûr",
            "description_fun": "Le best-seller ! Vous allez en prendre plein les yeux. Préparez la crème solaire et les cartes SD."
        },
        "logistique_generale": {
            "saison_ideale": "Avril à Novembre",
            "route_etat": "Mixte (Goudron + Piste)",
            "vehicule_conseil": "4x4 Obligatoire"
        },
        "budgets": {
            "standard": { "price": "950 €", "desc": "Hôtels de charme & Guide privé", "inclus": ["Hébergement", "4x4 + Chauffeur", "Entrées Parcs", "Petits dej"] },
            "eco": { "price": "600 €", "desc": "Transport en commun & Bungalows", "inclus": ["Hébergement simple", "Transport brousse", "Entrées"] },
            "premium": { "price": "1800 €", "desc": "Luxe & Vols privés", "inclus": ["Hôtels 4-5*", "Vol interne", "Tout inclus"] }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Arrivée à Diego-Suarez",
                "description": "Diego, c'est la Havane de l'Océan Indien ! Accueil à l'aéroport, check-in, et direct un cocktail face à la baie (la 2ème plus grande du monde après Rio, s'il vous plaît).",
                "logistique": { "depart": "Aéroport", "arrivee": "Hôtel Diego", "duree_totale_transport": "20 min" },
                "transports_details": [{ "type": "Navette", "duree": "20 min" }],
                "hebergement_options": { "standard": "Grand Hôtel", "premium": { "text": "Allamanda (Vue Mer)", "id": 101 }, "eco": "Hôtel de la Poste" },
                "gourmandise": "Dîner de fruits de mer au Tsara Be ou Carpaccio de Zébu.",
                "astuce": "Changez vos euros en ville, le taux est bien meilleur qu'à l'aéroport (et on évite l'arnaque touristique)."
            },
            {
                "jour": 2,
                "titre": "La Mer d'Émeraude",
                "description": "Imaginez une piscine géante couleur Menthe à l'eau. On y va en boutre (bateau traditionnel). Au programme : Kitesurf, sieste, et grillades de poissons fraîchement péchés. Le paradis existe.",
                "incontournables": [{ "id": 1, "label": "Mer d'Émeraude" }],
                "logistique": { "depart": "Ramena", "arrivee": "Îlot Suarez", "duree_totale_transport": "45 min" },
                "transports_details": [{ "type": "Boutre", "duree": "45 min" }],
                "hebergement_options": { "standard": "Lakana Ramena", "premium": "Mantleis" },
                "gourmandise": "Poisson Capitaine grillé au feu de bois sur la plage.",
                 "astuce": "Prenez un chapeau qui tient bien, le vent peut souffler fort (c'est le spot mondial de Kite !)."
            },
            {
                "jour": 3,
                "titre": "Les Tsingy Rouges",
                "description": "On quitte le bleu pour le rouge intense. Un canyon digne de Mars, sculpté par la pluie. C'est fragile, c'est beau, et ça change toutes les heures avec le soleil.",
                "incontournables": [{ "id": 3, "label": "Tsingy Rouge" }],
                "logistique": { "depart": "Diego", "arrivee": "Tsingy", "duree_totale_transport": "2h00" },
                "transports_details": [{ "type": "4x4", "duree": "2h Piste" }],
                "hebergement_options": { "standard": "Retour Diego" },
                "astuce": "Allez-y en fin d'aprem pour la 'Golden Hour', les couleurs explosent.",
                "gourmandise": "Pique-nique avec vue panoramique."
            },
            {
                "jour": 4,
                "titre": "Montagne d'Ambre",
                "description": "Changement d'ambiance : Forêt tropicale humide. Ici il pleut (un peu), il fait frais, et bourré de lémuriens couronnés qui vous regardent de haut. Cascades sacrées incluses.",
                "incontournables": [{ "id": 2, "label": "Montagne d'Ambre" }],
                "logistique": { "depart": "Joffreville", "arrivee": "Parc", "duree_totale_transport": "30 min" },
                "transports_details": [{ "type": "Marche", "duree": "3h Circuit" }],
                "hebergement_options": { "standard": "Nature Lodge", "eco": "Gîte du Parc" },
                "astuce": "Prenez un K-Way, même s'il fait grand soleil à Diego. La montagne a son propre micro-climat."
            },
            {
                "jour": 5,
                "titre": "La Baie des Courriers",
                "description": "Un spot 'Secret Defense' (littéralement, c'est une ancienne base militaire). Calme absolu, baobabs les pieds dans l'eau, et fond marins préservés.",
                "logistique": { "depart": "Diego", "arrivee": "Windsor Castle", "duree_totale_transport": "1h30" },
                "transports_details": [{ "type": "4x4", "duree": "1h30" }],
                "hebergement_options": { "standard": "Meva Plage" },
                "gourmandise": "Calmars sautés à l'ail."
            },
             {
                "jour": 6,
                "titre": "Les Tsingy de l'Ankarana (Est)",
                "description": "On descend vers le sud. Les Tsingy gris, tranchants comme des rasoirs. C'est immense, impressionnant, et on marche sur des ponts suspendus.",
                "logistique": { "depart": "Diego", "arrivee": "Mahamasina", "duree_totale_transport": "3h30" },
                 "transports_details": [{ "type": "4x4", "duree": "3h30" }],
                "hebergement_options": { "standard": "Relais de l'Ankarana", "eco": "Campement Mahamasina" },
                "astuce": "Attention aux 'Fady' (tabous) ici. Écoutez bien votre guide."
            },
            {
                "jour": 7,
                "titre": "Grotte des chauves-souris",
                "description": "Exploration souterraine dans le réseau de grottes de l'Ankarana. Stalactites géantes et colonie de chauves-souris. Indiana Jones style.",
                 "transports_details": [{ "type": "Marche", "duree": "4h Spéléo" }],
                 "hebergement_options": { "standard": "Relais de l'Ankarana" }
            },
             {
                "jour": 8,
                "titre": "Ambilobe & Marché",
                "description": "Immersion locale. Le marché d'Ambilobe est vibrant, bruyant, coloré. C'est ici que s'échangent l'or, le saphir et le khat.",
                "logistique": { "depart": "Mahamasina", "arrivee": "Ambilobe", "duree_totale_transport": "45 min" },
                 "transports_details": [{ "type": "Tuk-Tuk", "duree": "Visite Ville" }],
                 "hebergement_options": { "standard": "Hôtel Kozobe" },
                 "gourmandise": "Goûtez aux 'Mofo Gasy' au marché."
            },
             {
                "jour": 9,
                "titre": "Plantations de Cacao",
                "description": "La vallée du Sambirano. L'odeur du cacao, de la vanille et du poivre. Visite pédagogique et dégustation.",
                "logistique": { "depart": "Ambilobe", "arrivee": "Ambanja", "duree_totale_transport": "1h30" },
                 "transports_details": [{ "type": "4x4", "duree": "1h30" }],
                 "hebergement_options": { "standard": "Palma Nova" }
            },
             {
                "jour": 10,
                "titre": "Transfert Nosy Be ou Retour",
                "description": "Fin de l'aventure ! Soit vous prenez le bateau pour l'île aux parfums (Nosy Be), soit retour à Diego.",
                "logistique": { "depart": "Ambanja", "arrivee": "Ankify", "duree_totale_transport": "30 min" },
                 "transports_details": [{ "type": "Vedette Rapide", "duree": "30 min vers Nosy Be" }]
            }
        ]
    },
    "circuit-cacao": {
        "id": "circuit-cacao",
        "nom": "La Route du Cacao & Sambirano",
        "duree": "5 Jours",
        "image": "images/circuits/circuit-cacao.jpg",
        "description": "Immersion dans les plantations d'Ambanja et détente à Ankify.",
        "match_profil": ["Culture", "Gastronomie", "Détente"],
        "infos": {
            "securite_level": "Très Sûr",
            "description_fun": "Pour les gourmands ! Vous ne mangerez plus jamais de chocolat industriel après ça."
        },
        "logistique_generale": {
            "saison_ideale": "Août à Octobre (Récolte)",
            "route_etat": "Route Goudronnée (RN6)",
            "vehicule_conseil": "Taxi-brousse ou Voiture légère"
        },
        "budgets": {
            "standard": { "price": "450 €", "desc": "Hôtels Confort", "inclus": ["Hébergement", "Guide Plantations", "Demi-pension"] },
            "eco": { "price": "250 €", "desc": "Roots", "inclus": ["Gîte", "Taxi-brousse", "Repas simples"] }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Descente vers Ambanja",
                "description": "On prend la RN6 vers le sud. C'est root, c'est beau. On traverse des savanes à perte de vue avant d'arriver dans la verdure tropicale du Sambirano.",
                "logistique": { "depart": "Diego", "arrivee": "Ambanja", "duree_totale_transport": "5h00" },
                "transports_details": [{ "type": "Taxi-Brousse Premium", "duree": "5h" }],
                "hebergement_options": { "standard": "Palma Nova" },
                "astuce": "Achetez des noix de cajou sur la route, elles sont grillées minute."
            },
            {
                "jour": 2,
                "titre": "Plantations Millot",
                "description": "Le Graal du chocolat. Visite d'une plantation historique qui fournit les plus grands chocolatiers français. Ylang-Ylang, Poivre Vert, Cacao... vos sens vont exploser.",
                "incontournables": ["Cacao", "Ylang Ylang", "Poivre Vert"],
                "hebergement_options": { "standard": "Palma Nova" },
                "gourmandise": "Dégustation de fèves crues (surprenant !) et de chocolat noir."
            },
            {
                "jour": 3,
                "titre": "Ankify - Farniente",
                "description": "Petit village portuaire face à Nosy Be. On se pose, on regarde les bateaux, on mange du poisson coco.",
                "hebergement_options": { "standard": "Dauphin Bleu" },
                "transports_details": [{ "type": "Tuk-Tuk", "duree": "30 min" }],
                 "gourmandise": "Crabe au poivre vert frais."
            },
             {
                "jour": 4,
                "titre": "Remontée du Fleuve",
                "description": "Excursion en pirogue sur le fleuve Sambirano. On croise des crocodiles (de loin) et des caméléons panthères.",
                 "transports_details": [{ "type": "Pirogue", "duree": "3h" }],
                 "hebergement_options": { "standard": "Bungalows du Fleuve" }
            },
             {
                "jour": 5,
                "titre": "Retour ou Continuation",
                "description": "Soit on remonte sur Diego avec le taxi-brousse, soit on saute dans une vedette pour aller faire la fête à Nosy Be.",
                 "transports_details": [{ "type": "Choix Libre", "duree": "-" }]
            }
        ]
    },
     "circuit-vanille": {
        "id": "circuit-vanille",
        "nom": "Côte de la Vanille (Expédition)",
        "duree": "12 Jours",
        "image": "images/circuits/circuit-vanille.jpg",
         "description": "De Sambava à Antalaha, l'or vert de Madagascar.",
        "match_profil": ["Aventure", "Nature"],
        "infos": {
            "securite_level": "Sûr",
            "description_fun": "Authentique et parfumé. Attention aux pistes parfois rudes !"
        },
        "logistique_generale": {
             "saison_ideale": "Octobre à Décembre",
             "route_etat": "Piste difficile",
             "vehicule_conseil": "4x4 Robuste"
        },
         "budgets": {
             "standard": { "price": "1200 €", "desc": "Expédition Confort", "inclus": ["Guide", "4x4", "Hôtels et Gîtes"] }
         },
         "etapes": [
             { "jour": 1, "titre": "Vol vers Sambava", "description": "Arrivée au cœur de la région SAVA (Sambava, Antalaha, Vohemar, Andapa). L'air sent déjà la vanille.", "hebergement_options": { "standard": "Orchidea" } },
             { "jour": 2, "titre": "Visite de Cocoteraie", "description": "L'une des plus grandes du monde. C'est industriel mais impressionnant. Des millions de noix de coco.", "hebergement_options": { "standard": "Orchidea" } },
             { "jour": 3, "titre": "Trek Marojejy - Camp 1", "description": "On attaque la montagne. Forêt dense, humide. On dort au premier campement.", "transports_details": [{ "type": "Marche", "duree": "5h" }], "hebergement_options": { "standard": "Camp Mantella" } },
             { "jour": 4, "titre": "Trek Marojejy - Simpona", "description": "On monte plus haut. C'est ici qu'on voit le fameux Sifaka Soyeux (lémurien tout blanc, très rare).", "hebergement_options": { "standard": "Camp Simpona" } },
             { "jour": 5, "titre": "Sommet Marojejy", "description": "Le toit du Nord-Est. Vue à couper le souffle sur l'Océan Indien au loin.", "transports_details": [{ "type": "Marche Difficile", "duree": "6h A/R" }] },
             { "jour": 6, "titre": "Descente et Repos", "description": "Les mollets piquent. Retour à la civilisation et bonne douche.", "hebergement_options": { "standard": "Orchidea" } },
             { "jour": 7, "titre": "Route vers Antalaha", "description": "La capitale mondiale de la vanille. La route est belle, bordée de végétation.", "transports_details": [{ "type": "Taxi-Brousse", "duree": "2h" }], "hebergement_options": { "standard": "Oceanam" } },
             { "jour": 8, "titre": "Ateliers de Vanille", "description": "Vous allez tout comprendre : échaudage, étuvage, séchage, massage... Un travail de titanesque pour une gousse.", "astuce": "Achetez votre vanille ici, avec certificat phytosanitaire." },
             { "jour": 9, "titre": "Cap Est", "description": "Le point le plus à l'Est de Madagascar et d'Afrique. Phare du bout du monde.", "transports_details": [{ "type": "4x4", "duree": "Journée" }] },
             { "jour": 10, "titre": "Macolline", "description": "Une colline botanique gérée par 'Madame Marie'. Vue panoramique sur le fleuve.", "transports_details": [{ "type": "Pirogue", "duree": "1h" }] },
             { "jour": 11, "titre": "Détente Plage", "description": "Attention aux requins parfois, demandez aux locaux où se baigner. Sinon piscine de l'hôtel.", "gourmandise": "Langouste grillée." },
             { "jour": 12, "titre": "Vol Retour", "description": "Décollage d'Antalaha avec des valises qui sentent bon.", "logistique": { "depart": "Antalaha", "arrivee": "Tana", "duree_totale_transport": "1h30 Vol" } }
         ]
     },
     "circuit-nosybe": {
        "id": "circuit-nosybe",
        "nom": "Archipel de Nosy Be",
        "duree": "7 Jours",
        "image": "images/circuits/circuit-nosybe.jpg",
        "description": "Détente, plongée et îles paradisiaques autour de l'île aux parfums.",
        "match_profil": ["Plage", "Détente", "Luxe"],
        "infos": {
            "securite_level": "Très Sûr",
            "description_fun": "Mode vacances activé. Pas de stress, juste du bleu."
        },
        "logistique_generale": {
            "saison_ideale": "Toute l'année",
            "route_etat": "Excellente (Bateau)",
            "vehicule_conseil": "Bateau & Scooter"
        },
        "budgets": {
            "standard": { "price": "1100 €", "desc": "Hôtels Charme & Excursions", "inclus": ["Hébergement Plage", "Sorties Bateau", "Transferts"] },
            "premium": { "price": "2500 €", "desc": "Luxe & Catamaran Privé", "inclus": ["Ravintsara Hotel", "Croisière privée", "Tout inclus"] }
        },
        "etapes": [
            { "jour": 1, "titre": "Arrivée à Fascene", "description": "L'air est chaud, humide et parfumé. Transfert vers votre hôtel, cocktail de bienvenue. On enlève les chaussures pour 7 jours.", "hebergement_options": { "standard": "L'Heure Bleue", "premium": "Ravintsara" }, "logistique": { "depart": "Aéroport", "arrivee": "Hôtel", "duree_totale_transport": "45 min" } },
            { "jour": 2, "titre": "Nosy Komba & Tanikely", "description": "Le combo classique : Lémuriens qui vous sautent sur l'épaule à Komba, puis aquarium naturel à Tanikely. Mettez la tête sous l'eau, c'est Finding Nemo en vrai.", "transports_details": [{ "type": "Bateau Rapide", "duree": "1h" }], "incontournables": ["Tortues Marines", "Lémuriens"] },
            { "jour": 3, "titre": "Tour de l'île en Scooter", "description": "Liberté totale. On passe par la cascade, l'Arbre Sacré (un banian géant), et on finit au Mont Passot pour le coucher de soleil avec un apéro.", "transports_details": [{ "type": "Scooter/Taxi", "duree": "Journée" }] },
            { "jour": 4, "titre": "Nosy Iranja", "description": "L'image de carte postale. Deux îles reliées par une langue de sable blanc. L'eau est d'un bleu irréel. Attention aux coups de soleil !", "incontournables": [{ "id": 19, "label": "Nosy Iranja" }], "hebergement_options": { "standard": "Bivouac sous les étoiles" } },
            { "jour": 5, "titre": "Réserve de Lokobe", "description": "La dernière forêt primaire de l'île. On y va en pirogue traditionnelle. Caméléons minuscules et boas (gentils).", "transports_details": [{ "type": "Pirogue", "duree": "45 min" }] },
            { "jour": 6, "titre": "Plage d'Andilana & Détente", "description": "Dimanche à la plage. Musique, grillades, massage sur le sable. C'est la Dolce Vita version tropiques.", "gourmandise": "Langouste et Coco." },
            { "jour": 7, "titre": "Départ", "description": "Dernier bain, achat de vanille et d'épices au marché d'Hell-Ville sur la route de l'aéroport. Veloma !", "logistique": { "depart": "Hôtel", "arrivee": "Aéroport", "duree_totale_transport": "1h" } }
        ]
    }
}

file_content = f"const ITINERAIRES_DATA = {json.dumps(itineraires, indent=4)};"

with open("data/itineraires.js", "w", encoding="utf-8") as f:
    f.write(file_content)

print("Itineraries updated successfully.")
