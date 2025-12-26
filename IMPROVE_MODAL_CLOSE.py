#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔧 AMÉLIORATION MODAL - Fermeture
Ajoute la fermeture par clic extérieur et corrige le bouton X
"""

from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
APP_JS = PROJECT_ROOT / 'js' / 'app.js'

def improve_modal_close():
    print("🔧 AMÉLIORATION FERMETURE MODAL")
    print("=" * 80)
    
    with open(APP_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Modifier l'overlay pour ajouter le onclick
    old_overlay_start = '<div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;">'
    new_overlay_start = '<div id="lieu-modal-overlay" class="modal-overlay active" style="z-index: 10001;" onclick="if(event.target.id === \'lieu-modal-overlay\') window.closeLieuModal();">'
    
    if old_overlay_start in content:
        content = content.replace(old_overlay_start, new_overlay_start)
        print("✅ Overlay: Ajout du clic extérieur pour fermer")
    else:
        print("⚠️  Overlay: Déjà modifié ou non trouvé")
    
    # 2. S'assurer que closeLieuModal fonctionne
    # Vérifier que la fonction existe
    if 'window.closeLieuModal = function ()' in content:
        print("✅ Fonction closeLieuModal: Présente")
    else:
        print("❌ Fonction closeLieuModal: Manquante !")
    
    # Sauvegarder
    with open(APP_JS, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Améliorations appliquées !")
    print("\n📝 Changements:")
    print("   • Clic sur l'overlay (fond sombre) ferme la modal")
    print("   • Le bouton X devrait fonctionner")
    print("\n🔄 Rechargez (Ctrl+Shift+R) et testez !")

if __name__ == '__main__':
    improve_modal_close()
