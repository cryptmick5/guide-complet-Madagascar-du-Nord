#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔧 CORRECTION COMPLÈTE MODAL & IMAGES
Corrige le bouton X et résout le problème de clignotement
"""

from pathlib import Path
import base64

PROJECT_ROOT = Path(__file__).parent
APP_JS = PROJECT_ROOT / 'js' / 'app.js'
IMAGES_DIR = PROJECT_ROOT / 'images'

# Image placeholder 1x1 transparente en base64
PLACEHOLDER_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

def create_placeholder_images():
    """Crée les images placeholder manquantes"""
    print("📸 CRÉATION DES IMAGES PLACEHOLDER")
    print("=" * 80)
    
    IMAGES_DIR.mkdir(exist_ok=True)
    
    placeholders = [
        'placeholder-restaurant.jpg',
        'placeholder-hotel.jpg',
        'placeholder-nature.jpg',
        'placeholder-bar.jpg',
        'placeholder-spot.jpg',
    ]
    
    created = 0
    for filename in placeholders:
        filepath = IMAGES_DIR / filename
        if not filepath.exists():
            # Créer un fichier PNG transparent
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(PLACEHOLDER_PNG))
            print(f"   ✅ Créé: {filename}")
            created += 1
        else:
            print(f"   ⏭️  Existe: {filename}")
    
    print(f"\n✅ {created} images placeholder créées")
    return True

def fix_close_button():
    """Corrige le bouton X de fermeture"""
    print("\n🔧 CORRECTION BOUTON FERMETURE")
    print("=" * 80)
    
    with open(APP_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Chercher la ligne du bouton close
    old_button = '<button class="btn-close-modal-overlay" onclick="window.closeLieuModal();"'
    new_button = '<button class="btn-close-modal-overlay" id="modal-close-btn"'
    
    if old_button in content:
        content = content.replace(old_button, new_button)
        print("   ✅ Bouton: onclick remplacé par id")
        
        # Ajouter l'event listener après la fonction closeLieuModal
        close_function_end = "    document.body.style.overflow = '';\r\n};"
        
        event_listener_code = """
// Attacher l'event listener au bouton de fermeture après création de la modal
document.addEventListener('click', function(e) {
    if (e.target.closest('#modal-close-btn')) {
        window.closeLieuModal();
    }
});
"""
        
        if close_function_end in content and event_listener_code not in content:
            content = content.replace(
                close_function_end,
                close_function_end + "\r\n" + event_listener_code
            )
            print("   ✅ Event listener: Ajouté")
        else:
            print("   ⏭️  Event listener: Déjà présent ou structure modifiée")
    else:
        print("   ⚠️  Bouton: Déjà modifié ou non trouvé")
    
    # Sauvegarder
    with open(APP_JS, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("   ✅ Fichier app.js mis à jour")
    return True

def main():
    print("🎯 CORRECTION COMPLÈTE - MODAL & IMAGES")
    print("=" * 80)
    print()
    
    # 1. Créer les images placeholder
    create_placeholder_images()
    
    # 2. Corriger le bouton X
    fix_close_button()
    
    print("\n" + "=" * 80)
    print("✅ CORRECTIONS TERMINÉES !")
    print("\n📝 Changements:")
    print("   • Images placeholder créées (plus de clignotement)")
    print("   • Bouton X corrigé avec event listener")
    print("   • Clic extérieur fonctionne toujours")
    print("\n🔄 Rechargez (Ctrl+Shift+R) et testez !")

if __name__ == '__main__':
    main()
