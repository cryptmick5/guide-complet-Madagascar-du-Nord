import re

# File path
file_path = r'c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\js\app.js'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Target: inside window.navigateToPage function
    # We look for the block where special logic is triggered, currently:
    # if (targetId.toLowerCase().includes('antsiranana')) {
    #     setTimeout(window.initNorthSwitch, 100);
    # }

    # We want to replace or augment this.
    # Pattern to find: The specific IF block reference to antsiranana/northswitch
    pattern_to_replace = r"if\s*\(\s*targetId\.toLowerCase\(\)\.includes\('antsiranana'\)\s*\)\s*\{\s*setTimeout\(window\.initNorthSwitch,\s*100\);\s*\}"
    
    # New content: standardized trigger for both cities
    replacement_code = """
        // ⚡ FORCE PREMIUM ENGINE TRIGGER (Mirroring Diego & Nosy Be)
        if (targetId.toLowerCase().includes('antsiranana') || targetId.toLowerCase().includes('diego')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Antsiranana'); }, 50);
        }
        if (targetId.toLowerCase().includes('nosybe') || targetId.toLowerCase().includes('nosy-be')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Nosy Be'); }, 50);
        }
        if (targetId.toLowerCase().includes('mahajanga') || targetId.toLowerCase().includes('majunga')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Mahajanga'); }, 50);
        }
        if (targetId.toLowerCase().includes('toliara') || targetId.toLowerCase().includes('tulear')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Toliara'); }, 50);
        }
        if (targetId.toLowerCase().includes('toamasina') || targetId.toLowerCase().includes('tamatave')) {
            setTimeout(() => { if(window.filterProvinceItems) window.filterProvinceItems('all', 'Toamasina'); }, 50);
        }
    """.strip()

    # Apply replacement
    if re.search(pattern_to_replace, content):
        new_content = re.sub(pattern_to_replace, replacement_code, content)
        print("✅ Found 'initNorthSwitch' call and replacing with Universal Filter Trigger.")
    else:
        # Fallback: if exact match fails (maybe whitespace diff), try inserting after window.scrollTo
        print("⚠️ Exact 'initNorthSwitch' pattern not found. Attempting fallback insertion after scrollTo...")
        fallback_anchor = r"window\.scrollTo\(\{\s*top:\s*0,\s*behavior:\s*'smooth'\s*\}\);"
        if re.search(fallback_anchor, content):
             new_content = re.sub(fallback_anchor, f"window.scrollTo({{ top: 0, behavior: 'smooth' }});\n        {replacement_code}", content)
             print("✅ Inserted trigger after window.scrollTo.")
        else:
             print("❌ CRITICAL: Could not find insertion point!")
             exit(1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("✅ Successfully patched js/app.js to mirror Diego styling logic to Nosy Be.")

except Exception as e:
    print(f"❌ Error: {e}")
