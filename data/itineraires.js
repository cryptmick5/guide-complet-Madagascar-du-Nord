const ITINERAIRES_DATA = {
    "circuit-nord": {
        "id": "circuit-nord",
        "nom": "L'\u00c9pop\u00e9e du Grand Nord",
        "duree": "10 Jours",
        "image": "images/circuits/circuit-nord.jpg",
        "description": "De la Mer d'\u00c9meraude aux Tsingy Rouge, une aventure compl\u00e8te.",
        "match_profil": [
            "Aventure",
            "Nature",
            "Plage"
        ],
        "infos": {
            "securite_level": "S\u00fbr",
            "description_fun": "Le best-seller ! Vous allez en prendre plein les yeux. Pr\u00e9parez la cr\u00e8me solaire et les cartes SD."
        },
        "logistique_generale": {
            "saison_ideale": "Avril \u00e0 Novembre",
            "route_etat": "Mixte (Goudron + Piste)",
            "vehicule_conseil": "4x4 Obligatoire"
        },
        "budgets": {
            "standard": {
                "price": "950 \u20ac",
                "desc": "H\u00f4tels de charme & Guide priv\u00e9",
                "inclus": [
                    "H\u00e9bergement",
                    "4x4 + Chauffeur",
                    "Entr\u00e9es Parcs",
                    "Petits dej"
                ]
            },
            "eco": {
                "price": "600 \u20ac",
                "desc": "Transport en commun & Bungalows",
                "inclus": [
                    "H\u00e9bergement simple",
                    "Transport brousse",
                    "Entr\u00e9es"
                ]
            },
            "premium": {
                "price": "1800 \u20ac",
                "desc": "Luxe & Vols priv\u00e9s",
                "inclus": [
                    "H\u00f4tels 4-5*",
                    "Vol interne",
                    "Tout inclus"
                ]
            }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Arriv\u00e9e \u00e0 Diego-Suarez",
                "description": "Diego, c'est la Havane de l'Oc\u00e9an Indien ! Accueil \u00e0 l'a\u00e9roport, check-in, et direct un cocktail face \u00e0 la baie (la 2\u00e8me plus grande du monde apr\u00e8s Rio, s'il vous pla\u00eet).",
                "logistique": {
                    "depart": "A\u00e9roport",
                    "arrivee": "H\u00f4tel Diego",
                    "duree_totale_transport": "20 min"
                },
                "transports_details": [
                    {
                        "type": "Navette",
                        "duree": "20 min"
                    }
                ],
                "hebergement_options": {
                    "standard": "Grand H\u00f4tel",
                    "premium": {
                        "text": "Allamanda (Vue Mer)",
                        "id": 101
                    },
                    "eco": "H\u00f4tel de la Poste"
                },
                "gourmandise": "D\u00eener de fruits de mer au Tsara Be ou Carpaccio de Z\u00e9bu.",
                "astuce": "Changez vos euros en ville, le taux est bien meilleur qu'\u00e0 l'a\u00e9roport (et on \u00e9vite l'arnaque touristique)."
            },
            {
                "jour": 2,
                "titre": "La Mer d'\u00c9meraude",
                "description": "Imaginez une piscine g\u00e9ante couleur Menthe \u00e0 l'eau. On y va en boutre (bateau traditionnel). Au programme : Kitesurf, sieste, et grillades de poissons fra\u00eechement p\u00e9ch\u00e9s. Le paradis existe.",
                "incontournables": [
                    {
                        "id": 1,
                        "label": "Mer d'\u00c9meraude"
                    }
                ],
                "logistique": {
                    "depart": "Ramena",
                    "arrivee": "\u00celot Suarez",
                    "duree_totale_transport": "45 min"
                },
                "transports_details": [
                    {
                        "type": "Boutre",
                        "duree": "45 min"
                    }
                ],
                "hebergement_options": {
                    "standard": "Lakana Ramena",
                    "premium": "Mantleis"
                },
                "gourmandise": "Poisson Capitaine grill\u00e9 au feu de bois sur la plage.",
                "astuce": "Prenez un chapeau qui tient bien, le vent peut souffler fort (c'est le spot mondial de Kite !)."
            },
            {
                "jour": 3,
                "titre": "Les Tsingy Rouges",
                "description": "On quitte le bleu pour le rouge intense. Un canyon digne de Mars, sculpt\u00e9 par la pluie. C'est fragile, c'est beau, et \u00e7a change toutes les heures avec le soleil.",
                "incontournables": [
                    {
                        "id": 3,
                        "label": "Tsingy Rouge"
                    }
                ],
                "logistique": {
                    "depart": "Diego",
                    "arrivee": "Tsingy",
                    "duree_totale_transport": "2h00"
                },
                "transports_details": [
                    {
                        "type": "4x4",
                        "duree": "2h Piste"
                    }
                ],
                "hebergement_options": {
                    "standard": "Retour Diego"
                },
                "astuce": "Allez-y en fin d'aprem pour la 'Golden Hour', les couleurs explosent.",
                "gourmandise": "Pique-nique avec vue panoramique."
            },
            {
                "jour": 4,
                "titre": "Montagne d'Ambre",
                "description": "Changement d'ambiance : For\u00eat tropicale humide. Ici il pleut (un peu), il fait frais, et bourr\u00e9 de l\u00e9muriens couronn\u00e9s qui vous regardent de haut. Cascades sacr\u00e9es incluses.",
                "incontournables": [
                    {
                        "id": 2,
                        "label": "Montagne d'Ambre"
                    }
                ],
                "logistique": {
                    "depart": "Joffreville",
                    "arrivee": "Parc",
                    "duree_totale_transport": "30 min"
                },
                "transports_details": [
                    {
                        "type": "Marche",
                        "duree": "3h Circuit"
                    }
                ],
                "hebergement_options": {
                    "standard": "Nature Lodge",
                    "eco": "G\u00eete du Parc"
                },
                "astuce": "Prenez un K-Way, m\u00eame s'il fait grand soleil \u00e0 Diego. La montagne a son propre micro-climat."
            },
            {
                "jour": 5,
                "titre": "La Baie des Courriers",
                "description": "Un spot 'Secret Defense' (litt\u00e9ralement, c'est une ancienne base militaire). Calme absolu, baobabs les pieds dans l'eau, et fond marins pr\u00e9serv\u00e9s.",
                "logistique": {
                    "depart": "Diego",
                    "arrivee": "Windsor Castle",
                    "duree_totale_transport": "1h30"
                },
                "transports_details": [
                    {
                        "type": "4x4",
                        "duree": "1h30"
                    }
                ],
                "hebergement_options": {
                    "standard": "Meva Plage"
                },
                "gourmandise": "Calmars saut\u00e9s \u00e0 l'ail."
            },
            {
                "jour": 6,
                "titre": "Les Tsingy de l'Ankarana (Est)",
                "description": "On descend vers le sud. Les Tsingy gris, tranchants comme des rasoirs. C'est immense, impressionnant, et on marche sur des ponts suspendus.",
                "logistique": {
                    "depart": "Diego",
                    "arrivee": "Mahamasina",
                    "duree_totale_transport": "3h30"
                },
                "transports_details": [
                    {
                        "type": "4x4",
                        "duree": "3h30"
                    }
                ],
                "hebergement_options": {
                    "standard": "Relais de l'Ankarana",
                    "eco": "Campement Mahamasina"
                },
                "astuce": "Attention aux 'Fady' (tabous) ici. \u00c9coutez bien votre guide."
            },
            {
                "jour": 7,
                "titre": "Grotte des chauves-souris",
                "description": "Exploration souterraine dans le r\u00e9seau de grottes de l'Ankarana. Stalactites g\u00e9antes et colonie de chauves-souris. Indiana Jones style.",
                "transports_details": [
                    {
                        "type": "Marche",
                        "duree": "4h Sp\u00e9l\u00e9o"
                    }
                ],
                "hebergement_options": {
                    "standard": "Relais de l'Ankarana"
                }
            },
            {
                "jour": 8,
                "titre": "Ambilobe & March\u00e9",
                "description": "Immersion locale. Le march\u00e9 d'Ambilobe est vibrant, bruyant, color\u00e9. C'est ici que s'\u00e9changent l'or, le saphir et le khat.",
                "logistique": {
                    "depart": "Mahamasina",
                    "arrivee": "Ambilobe",
                    "duree_totale_transport": "45 min"
                },
                "transports_details": [
                    {
                        "type": "Tuk-Tuk",
                        "duree": "Visite Ville"
                    }
                ],
                "hebergement_options": {
                    "standard": "H\u00f4tel Kozobe"
                },
                "gourmandise": "Go\u00fbtez aux 'Mofo Gasy' au march\u00e9."
            },
            {
                "jour": 9,
                "titre": "Plantations de Cacao",
                "description": "La vall\u00e9e du Sambirano. L'odeur du cacao, de la vanille et du poivre. Visite p\u00e9dagogique et d\u00e9gustation.",
                "logistique": {
                    "depart": "Ambilobe",
                    "arrivee": "Ambanja",
                    "duree_totale_transport": "1h30"
                },
                "transports_details": [
                    {
                        "type": "4x4",
                        "duree": "1h30"
                    }
                ],
                "hebergement_options": {
                    "standard": "Palma Nova"
                }
            },
            {
                "jour": 10,
                "titre": "Transfert Nosy Be ou Retour",
                "description": "Fin de l'aventure ! Soit vous prenez le bateau pour l'\u00eele aux parfums (Nosy Be), soit retour \u00e0 Diego.",
                "logistique": {
                    "depart": "Ambanja",
                    "arrivee": "Ankify",
                    "duree_totale_transport": "30 min"
                },
                "transports_details": [
                    {
                        "type": "Vedette Rapide",
                        "duree": "30 min vers Nosy Be"
                    }
                ]
            }
        ]
    },
    "circuit-cacao": {
        "id": "circuit-cacao",
        "nom": "La Route du Cacao & Sambirano",
        "duree": "5 Jours",
        "image": "images/circuits/circuit-cacao.jpg",
        "description": "Immersion dans les plantations d'Ambanja et d\u00e9tente \u00e0 Ankify.",
        "match_profil": [
            "Culture",
            "Gastronomie",
            "D\u00e9tente"
        ],
        "infos": {
            "securite_level": "Tr\u00e8s S\u00fbr",
            "description_fun": "Pour les gourmands ! Vous ne mangerez plus jamais de chocolat industriel apr\u00e8s \u00e7a."
        },
        "logistique_generale": {
            "saison_ideale": "Ao\u00fbt \u00e0 Octobre (R\u00e9colte)",
            "route_etat": "Route Goudronn\u00e9e (RN6)",
            "vehicule_conseil": "Taxi-brousse ou Voiture l\u00e9g\u00e8re"
        },
        "budgets": {
            "standard": {
                "price": "450 \u20ac",
                "desc": "H\u00f4tels Confort",
                "inclus": [
                    "H\u00e9bergement",
                    "Guide Plantations",
                    "Demi-pension"
                ]
            },
            "eco": {
                "price": "250 \u20ac",
                "desc": "Roots",
                "inclus": [
                    "G\u00eete",
                    "Taxi-brousse",
                    "Repas simples"
                ]
            }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Descente vers Ambanja",
                "description": "On prend la RN6 vers le sud. C'est root, c'est beau. On traverse des savanes \u00e0 perte de vue avant d'arriver dans la verdure tropicale du Sambirano.",
                "logistique": {
                    "depart": "Diego",
                    "arrivee": "Ambanja",
                    "duree_totale_transport": "5h00"
                },
                "transports_details": [
                    {
                        "type": "Taxi-Brousse Premium",
                        "duree": "5h"
                    }
                ],
                "hebergement_options": {
                    "standard": "Palma Nova"
                },
                "astuce": "Achetez des noix de cajou sur la route, elles sont grill\u00e9es minute."
            },
            {
                "jour": 2,
                "titre": "Plantations Millot",
                "description": "Le Graal du chocolat. Visite d'une plantation historique qui fournit les plus grands chocolatiers fran\u00e7ais. Ylang-Ylang, Poivre Vert, Cacao... vos sens vont exploser.",
                "incontournables": [
                    "Cacao",
                    "Ylang Ylang",
                    "Poivre Vert"
                ],
                "hebergement_options": {
                    "standard": "Palma Nova"
                },
                "gourmandise": "D\u00e9gustation de f\u00e8ves crues (surprenant !) et de chocolat noir."
            },
            {
                "jour": 3,
                "titre": "Ankify - Farniente",
                "description": "Petit village portuaire face \u00e0 Nosy Be. On se pose, on regarde les bateaux, on mange du poisson coco.",
                "hebergement_options": {
                    "standard": "Dauphin Bleu"
                },
                "transports_details": [
                    {
                        "type": "Tuk-Tuk",
                        "duree": "30 min"
                    }
                ],
                "gourmandise": "Crabe au poivre vert frais."
            },
            {
                "jour": 4,
                "titre": "Remont\u00e9e du Fleuve",
                "description": "Excursion en pirogue sur le fleuve Sambirano. On croise des crocodiles (de loin) et des cam\u00e9l\u00e9ons panth\u00e8res.",
                "transports_details": [
                    {
                        "type": "Pirogue",
                        "duree": "3h"
                    }
                ],
                "hebergement_options": {
                    "standard": "Bungalows du Fleuve"
                }
            },
            {
                "jour": 5,
                "titre": "Retour ou Continuation",
                "description": "Soit on remonte sur Diego avec le taxi-brousse, soit on saute dans une vedette pour aller faire la f\u00eate \u00e0 Nosy Be.",
                "transports_details": [
                    {
                        "type": "Choix Libre",
                        "duree": "-"
                    }
                ]
            }
        ]
    },
    "circuit-vanille": {
        "id": "circuit-vanille",
        "nom": "C\u00f4te de la Vanille (Exp\u00e9dition)",
        "duree": "12 Jours",
        "image": "images/circuits/circuit-vanille.jpg",
        "description": "De Sambava \u00e0 Antalaha, l'or vert de Madagascar.",
        "match_profil": [
            "Aventure",
            "Nature"
        ],
        "infos": {
            "securite_level": "S\u00fbr",
            "description_fun": "Authentique et parfum\u00e9. Attention aux pistes parfois rudes !"
        },
        "logistique_generale": {
            "saison_ideale": "Octobre \u00e0 D\u00e9cembre",
            "route_etat": "Piste difficile",
            "vehicule_conseil": "4x4 Robuste"
        },
        "budgets": {
            "standard": {
                "price": "1200 \u20ac",
                "desc": "Exp\u00e9dition Confort",
                "inclus": [
                    "Guide",
                    "4x4",
                    "H\u00f4tels et G\u00eetes"
                ]
            }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Vol vers Sambava",
                "description": "Arriv\u00e9e au c\u0153ur de la r\u00e9gion SAVA (Sambava, Antalaha, Vohemar, Andapa). L'air sent d\u00e9j\u00e0 la vanille.",
                "hebergement_options": {
                    "standard": "Orchidea"
                }
            },
            {
                "jour": 2,
                "titre": "Visite de Cocoteraie",
                "description": "L'une des plus grandes du monde. C'est industriel mais impressionnant. Des millions de noix de coco.",
                "hebergement_options": {
                    "standard": "Orchidea"
                }
            },
            {
                "jour": 3,
                "titre": "Trek Marojejy - Camp 1",
                "description": "On attaque la montagne. For\u00eat dense, humide. On dort au premier campement.",
                "transports_details": [
                    {
                        "type": "Marche",
                        "duree": "5h"
                    }
                ],
                "hebergement_options": {
                    "standard": "Camp Mantella"
                }
            },
            {
                "jour": 4,
                "titre": "Trek Marojejy - Simpona",
                "description": "On monte plus haut. C'est ici qu'on voit le fameux Sifaka Soyeux (l\u00e9murien tout blanc, tr\u00e8s rare).",
                "hebergement_options": {
                    "standard": "Camp Simpona"
                }
            },
            {
                "jour": 5,
                "titre": "Sommet Marojejy",
                "description": "Le toit du Nord-Est. Vue \u00e0 couper le souffle sur l'Oc\u00e9an Indien au loin.",
                "transports_details": [
                    {
                        "type": "Marche Difficile",
                        "duree": "6h A/R"
                    }
                ]
            },
            {
                "jour": 6,
                "titre": "Descente et Repos",
                "description": "Les mollets piquent. Retour \u00e0 la civilisation et bonne douche.",
                "hebergement_options": {
                    "standard": "Orchidea"
                }
            },
            {
                "jour": 7,
                "titre": "Route vers Antalaha",
                "description": "La capitale mondiale de la vanille. La route est belle, bord\u00e9e de v\u00e9g\u00e9tation.",
                "transports_details": [
                    {
                        "type": "Taxi-Brousse",
                        "duree": "2h"
                    }
                ],
                "hebergement_options": {
                    "standard": "Oceanam"
                }
            },
            {
                "jour": 8,
                "titre": "Ateliers de Vanille",
                "description": "Vous allez tout comprendre : \u00e9chaudage, \u00e9tuvage, s\u00e9chage, massage... Un travail de titanesque pour une gousse.",
                "astuce": "Achetez votre vanille ici, avec certificat phytosanitaire."
            },
            {
                "jour": 9,
                "titre": "Cap Est",
                "description": "Le point le plus \u00e0 l'Est de Madagascar et d'Afrique. Phare du bout du monde.",
                "transports_details": [
                    {
                        "type": "4x4",
                        "duree": "Journ\u00e9e"
                    }
                ]
            },
            {
                "jour": 10,
                "titre": "Macolline",
                "description": "Une colline botanique g\u00e9r\u00e9e par 'Madame Marie'. Vue panoramique sur le fleuve.",
                "transports_details": [
                    {
                        "type": "Pirogue",
                        "duree": "1h"
                    }
                ]
            },
            {
                "jour": 11,
                "titre": "D\u00e9tente Plage",
                "description": "Attention aux requins parfois, demandez aux locaux o\u00f9 se baigner. Sinon piscine de l'h\u00f4tel.",
                "gourmandise": "Langouste grill\u00e9e."
            },
            {
                "jour": 12,
                "titre": "Vol Retour",
                "description": "D\u00e9collage d'Antalaha avec des valises qui sentent bon.",
                "logistique": {
                    "depart": "Antalaha",
                    "arrivee": "Tana",
                    "duree_totale_transport": "1h30 Vol"
                }
            }
        ]
    },
    "circuit-nosybe": {
        "id": "circuit-nosybe",
        "nom": "Archipel de Nosy Be",
        "duree": "7 Jours",
        "image": "images/circuits/circuit-nosybe.jpg",
        "description": "D\u00e9tente, plong\u00e9e et \u00eeles paradisiaques autour de l'\u00eele aux parfums.",
        "match_profil": [
            "Plage",
            "D\u00e9tente",
            "Luxe"
        ],
        "infos": {
            "securite_level": "Tr\u00e8s S\u00fbr",
            "description_fun": "Mode vacances activ\u00e9. Pas de stress, juste du bleu."
        },
        "logistique_generale": {
            "saison_ideale": "Toute l'ann\u00e9e",
            "route_etat": "Excellente (Bateau)",
            "vehicule_conseil": "Bateau & Scooter"
        },
        "budgets": {
            "standard": {
                "price": "1100 \u20ac",
                "desc": "H\u00f4tels Charme & Excursions",
                "inclus": [
                    "H\u00e9bergement Plage",
                    "Sorties Bateau",
                    "Transferts"
                ]
            },
            "premium": {
                "price": "2500 \u20ac",
                "desc": "Luxe & Catamaran Priv\u00e9",
                "inclus": [
                    "Ravintsara Hotel",
                    "Croisi\u00e8re priv\u00e9e",
                    "Tout inclus"
                ]
            }
        },
        "etapes": [
            {
                "jour": 1,
                "titre": "Arriv\u00e9e \u00e0 Fascene",
                "description": "L'air est chaud, humide et parfum\u00e9. Transfert vers votre h\u00f4tel, cocktail de bienvenue. On enl\u00e8ve les chaussures pour 7 jours.",
                "hebergement_options": {
                    "standard": "L'Heure Bleue",
                    "premium": "Ravintsara"
                },
                "logistique": {
                    "depart": "A\u00e9roport",
                    "arrivee": "H\u00f4tel",
                    "duree_totale_transport": "45 min"
                }
            },
            {
                "jour": 2,
                "titre": "Nosy Komba & Tanikely",
                "description": "Le combo classique : L\u00e9muriens qui vous sautent sur l'\u00e9paule \u00e0 Komba, puis aquarium naturel \u00e0 Tanikely. Mettez la t\u00eate sous l'eau, c'est Finding Nemo en vrai.",
                "transports_details": [
                    {
                        "type": "Bateau Rapide",
                        "duree": "1h"
                    }
                ],
                "incontournables": [
                    "Tortues Marines",
                    "L\u00e9muriens"
                ]
            },
            {
                "jour": 3,
                "titre": "Tour de l'\u00eele en Scooter",
                "description": "Libert\u00e9 totale. On passe par la cascade, l'Arbre Sacr\u00e9 (un banian g\u00e9ant), et on finit au Mont Passot pour le coucher de soleil avec un ap\u00e9ro.",
                "transports_details": [
                    {
                        "type": "Scooter/Taxi",
                        "duree": "Journ\u00e9e"
                    }
                ]
            },
            {
                "jour": 4,
                "titre": "Nosy Iranja",
                "description": "L'image de carte postale. Deux \u00eeles reli\u00e9es par une langue de sable blanc. L'eau est d'un bleu irr\u00e9el. Attention aux coups de soleil !",
                "incontournables": [
                    {
                        "id": 19,
                        "label": "Nosy Iranja"
                    }
                ],
                "hebergement_options": {
                    "standard": "Bivouac sous les \u00e9toiles"
                }
            },
            {
                "jour": 5,
                "titre": "R\u00e9serve de Lokobe",
                "description": "La derni\u00e8re for\u00eat primaire de l'\u00eele. On y va en pirogue traditionnelle. Cam\u00e9l\u00e9ons minuscules et boas (gentils).",
                "transports_details": [
                    {
                        "type": "Pirogue",
                        "duree": "45 min"
                    }
                ]
            },
            {
                "jour": 6,
                "titre": "Plage d'Andilana & D\u00e9tente",
                "description": "Dimanche \u00e0 la plage. Musique, grillades, massage sur le sable. C'est la Dolce Vita version tropiques.",
                "gourmandise": "Langouste et Coco."
            },
            {
                "jour": 7,
                "titre": "D\u00e9part",
                "description": "Dernier bain, achat de vanille et d'\u00e9pices au march\u00e9 d'Hell-Ville sur la route de l'a\u00e9roport. Veloma !",
                "logistique": {
                    "depart": "H\u00f4tel",
                    "arrivee": "A\u00e9roport",
                    "duree_totale_transport": "1h"
                }
            }
        ]
    }
};