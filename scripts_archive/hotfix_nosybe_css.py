import os

CSS_PATH = 'css/style.css'

def apply_css_hotfix():
    if not os.path.exists(CSS_PATH):
        # Création si inexistant (peu probable mais prudent)
        os.makedirs('css', exist_ok=True)
        with open(CSS_PATH, 'w') as f: f.write("/* Style Global */\n")

    # Le Patch CSS qui force le design "Premium" sur Nosy Be
    # On cible plusieurs IDs possibles pour être sûr que ça marche
    hotfix = """

/* --- URGENCE HOTFIX : DESIGN NOSY BE --- */
#grid-NosyBe, #grid-Nosy-Be, #NosyBe .lieux-grid, #grid-Nosy {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
    gap: 25px !important;
    padding: 20px 0 !important;
}

/* Force le style de la carte */
#grid-NosyBe .lieu-card, #grid-Nosy-Be .lieu-card, #NosyBe .lieu-card, #grid-Nosy .lieu-card {
    background: #fff !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
    border: 1px solid rgba(0,0,0,0.05) !important;
    transition: transform 0.3s ease !important;
}

/* Force la hauteur de l'image (C'est ça qui répare les images écrasées) */
#grid-NosyBe .card-image, #grid-Nosy-Be .card-image, #NosyBe .card-image, #grid-Nosy .card-image {
    height: 220px !important;
    width: 100% !important;
    background-size: cover !important;
    background-position: center !important;
    position: relative !important;
}

/* Un peu d'espace dans le contenu */
#grid-NosyBe .card-content, #grid-Nosy-Be .card-content, #NosyBe .card-content, #grid-Nosy .card-content {
    padding: 24px !important;
}
"""
    # On ajoute à la fin du fichier
    with open(CSS_PATH, 'a', encoding='utf-8') as f:
        f.write(hotfix)
    print("✅ HOTFIX CSS appliqué : Le design de Nosy Be est forcé.")

if __name__ == "__main__":
    apply_css_hotfix()
