#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔧 CORRECTION MODAL ERROR
Corrige l'échappement des quotes dans la modal
"""

from pathlib import Path

PROJECT_ROOT = Path(__file__).parent
APP_JS = PROJECT_ROOT / 'js' / 'app.js'

def fix_modal_onerror():
    print("🔧 CORRECTION ERREUR MODAL")
    print("=" * 80)
    
    with open(APP_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Chercher et remplacer la ligne problématique
    old_line = "this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:3rem;\\'><i class=\\'fas fa-image\\'></i></div>'"
    new_line = "this.parentElement.innerHTML='<div style=&quot;display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:3rem;&quot;><i class=&quot;fas fa-image&quot;></i></div>'"
    
    if old_line in content:
        content = content.replace(old_line, new_line)
        
        with open(APP_JS, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Ligne corrigée avec succès")
        print("📝 Les apostrophes échappées ont été remplacées par des entités HTML (&quot;)")
        print("\n🔄 Rechargez la page (Ctrl+Shift+R) et testez à nouveau")
        return True
    else:
        print("❌ Ligne problématique non trouvée")
        print("ℹ️  La correction a peut-être déjà été appliquée")
        return False

if __name__ == '__main__':
    fix_modal_onerror()
