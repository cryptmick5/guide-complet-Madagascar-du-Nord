
import json
import os

DATA_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"

def add_website_pangalanes():
    if not os.path.exists(DATA_PATH): return

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.replace('window.LIEUX_DATA =', '').strip().rstrip(';')
        data = json.loads(json_str)

    found = False
    for item in data:
        if item.get('nom') == "Canal des Pangalanes" or item.get('id') == 631:
            # Adding a relevant website URL
            item['siteWeb'] = "https://madagascar-tourisme.com/fr/les-incontournables/le-canal-des-pangalanes/"
            found = True
            break
    
    if found:
        with open(DATA_PATH, 'w', encoding='utf-8') as f:
            f.write(f"window.LIEUX_DATA = {json.dumps(data, indent=4, ensure_ascii=False)};")
        print("✅ SUCCESS: Pangalanes website URL added.")
    else:
        print("❌ ERROR: Pangalanes not found.")

if __name__ == "__main__":
    add_website_pangalanes()
