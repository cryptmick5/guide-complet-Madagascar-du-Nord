
import os
import torch
from transformers import VitsModel, AutoTokenizer
import scipy.io.wavfile
import re
import unicodedata

# 1. Installation des dépendances si nécessaire:
# pip install torch transformers scipy

def slugify(value):
    """
    Normalizes string, converts to lowercase, removes non-alpha characters,
    and converts spaces to hyphens.
    """
    value = str(value)
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)

PHRASES_DATA = {
    "Salutations & Politesse": [
        { "fr": "Bonjour", "mg": "Manao ahoana" },
        { "fr": "Merci", "mg": "Misaotra" },
        { "fr": "S'il vous plaît", "mg": "Azafady" },
        { "fr": "Excusez-moi", "mg": "Miala tsiny" },
        { "fr": "Au revoir", "mg": "Veloma" },
        { "fr": "Oui", "mg": "Eny" },
        { "fr": "Non", "mg": "Tsia" }
    ],
    "Se présenter": [
        { "fr": "Je m'appelle...", "mg": "No anarako" }, # Removed [Nom] for TTS
        { "fr": "Je suis français(e)", "mg": "Frantsay aho" },
        { "fr": "Je ne parle pas malgache", "mg": "Tsy mahay miteny malagasy aho" },
        { "fr": "Je suis en vacances", "mg": "Miala sasatra aho" },
        { "fr": "Enchanté(e)", "mg": "Faly mahafantatra anao" }
    ],
    "Se déplacer": [
        { "fr": "Où est la plage ?", "mg": "Aiza ny moron-dranomasina ?" },
        { "fr": "Combien pour Diego ?", "mg": "Hoatrinona ny ho any Antsiranana ?" },
        { "fr": "Je suis perdu(e)", "mg": "Very làlana aho" },
        { "fr": "C'est loin ?", "mg": "Lavitra ve ?" },
        { "fr": "À droite", "mg": "Havanana" },
        { "fr": "À gauche", "mg": "Havia" },
        { "fr": "Tout droit", "mg": "Mahitsy" },
        { "fr": "Arrêtez ici", "mg": "Mijanona eto" }
    ],
    "Négocier & Acheter": [
        { "fr": "Combien ça coûte ?", "mg": "Ohatrinona ny vidiny ?" },
        { "fr": "C'est trop cher", "mg": "Lafo be loatra izany" },
        { "fr": "Moins cher possible ?", "mg": "Mora kokoa ve ?" },
        { "fr": "Je prends ça", "mg": "Alako io" },
        { "fr": "Vous acceptez les euros ?", "mg": "Mandray euros ve ianao ?" },
        { "fr": "Pas de monnaie", "mg": "Tsy misy vola madinika" }
    ],
    "Restaurant": [
        { "fr": "Une table pour deux", "mg": "Latabatra roa azafady" },
        { "fr": "Le menu s'il vous plaît", "mg": "Ny menu azafady" },
        { "fr": "L'addition", "mg": "Ny faktiora" },
        { "fr": "C'était délicieux", "mg": "Matsiro be" },
        { "fr": "Eau minérale", "mg": "Rano mineraly" },
        { "fr": "Sans piment", "mg": "Tsy misy sakay" },
        { "fr": "Je suis végétarien(ne)", "mg": "Tsy mihinana hena aho" }
    ],
    "Nombres": [
        { "fr": "1", "mg": "Iray" },
        { "fr": "2", "mg": "Roa" },
        { "fr": "3", "mg": "Telo" },
        { "fr": "4", "mg": "Efatra" },
        { "fr": "5", "mg": "Dimy" },
        { "fr": "10", "mg": "Folo" },
        { "fr": "100", "mg": "Zato" },
        { "fr": "1 000", "mg": "Arivo" }
    ],
    "Urgence & Santé": [
        { "fr": "Aidez-moi !", "mg": "Vonjeo aho !" },
        { "fr": "Mal à la tête", "mg": "Marary ny lohako" },
        { "fr": "Où est la pharmacie ?", "mg": "Aiza ny fivarotam-panafody ?" },
        { "fr": "Hôpital", "mg": "Hopitaly" },
        { "fr": "J'ai besoin d'un docteur", "mg": "Mila dokotera aho" },
        { "fr": "Allergie", "mg": "Alerizy" }
    ],
    "Hébergement & Météo": [
        { "fr": "Hôtel", "mg": "Hotely" },
        { "fr": "Chambre", "mg": "Efitrano" },
        { "fr": "Il fait chaud", "mg": "Mafana" },
        { "fr": "Il pleut", "mg": "Avy ny orana" }
    ]
}

def generate_audio():
    print("Chargement du modèle MMS-TTS Malgache...")
    try:
        model = VitsModel.from_pretrained("facebook/mms-tts-mlg")
        tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-mlg")
    except Exception as e:
        print(f"Erreur lors du chargement du modèle. Assurez-vous d'avoir internet et les librairies. {e}")
        return

    output_dir = "audio"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print("Génération des fichiers audio...")
    
    count = 0
    for category, phrases in PHRASES_DATA.items():
        print(f"Catégorie: {category}")
        for phrase in phrases:
            text_mg = phrase["mg"]
            text_fr = phrase["fr"]
            
            # Nettoyage pour le modèle
            inputs = tokenizer(text_mg, return_tensors="pt")
            
            with torch.no_grad():
                output = model(**inputs).waveform
            
            # Nom du fichier basé sur la version française
            filename = slugify(text_fr) + ".wav"
            filepath = os.path.join(output_dir, filename)
            
            # Sauvegarder
            scipy.io.wavfile.write(filepath, model.config.sampling_rate, output.float().numpy().T)
            print(f" -> Généré: {filename}")
            count += 1
            
    print(f"Terminé ! {count} fichiers audio générés dans le dossier '{output_dir}'.")

if __name__ == "__main__":
    generate_audio()
