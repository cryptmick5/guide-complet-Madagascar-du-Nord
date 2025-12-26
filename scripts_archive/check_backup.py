
import json
import re
import os

def load_js_list(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'const\s+\w+\s*=\s*(\[.*\])', content, re.DOTALL)
            if match:
                json_str = match.group(1)
                json_str = re.sub(r',(\s*[\]}])', r'\1', json_str)
                return json.loads(json_str, strict=False)
    except Exception as e:
        print(f"Error JS: {e}")
    return []

def check_backup():
    path = 'data/lieux_FINAL_RESTORED.js'
    if not os.path.exists(path):
        print("Backup not found.")
        return

    lieux = load_js_list(path)
    ramena = next((i for i in lieux if "Ramena" in i.get('nom', '')), None)
    
    if ramena:
        print("--- BACKUP ITEM (Ramena) ---")
        for k, v in ramena.items():
            print(f"{k}: {str(v)[:100]}")
    else:
        print("Ramena not found in backup.")

if __name__ == "__main__":
    check_backup()
