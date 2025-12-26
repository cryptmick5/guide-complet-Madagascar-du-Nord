import json
import os
import re

DATA_PATH = 'data/lieux.js'
REPORT_PATH = 'audit_report.txt'

def audit_data():
    if not os.path.exists(DATA_PATH):
        print("❌ data/lieux.js not found.")
        return

    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        # Clean JS var declaration for JSON parsing
        json_str = re.sub(r'^(const|var|let|window\.)\s*\w+\s*=\s*', '', content).strip().rstrip(';')
        try:
            data = json.loads(json_str)
        except Exception as e:
            print(f"❌ CRITICAL: JSON Parsing failed. The file is corrupt. Error: {e}")
            return

    issues = []
    missing_images = []
    risky_syntax = []

    print(f"🔍 Auditing {len(data)} entries...")

    for item in data:
        item_id = item.get('id', 'Unknown')
        nom = item.get('nom', 'Unnamed')
        img_path = item.get('image', '')
        
        # 1. Check Image Existence
        if not img_path:
            missing_images.append(f"ID {item_id} ({nom}): No image path defined")
        elif not os.path.exists(img_path):
            # Try to handle relative paths if run from root
            if not os.path.exists(os.path.join(os.getcwd(), img_path.replace('/', os.sep))):
                 missing_images.append(f"ID {item_id} ({nom}): File not found '{img_path}'")

        # 2. Check for Risky Characters (Unescaped quotes that might break HTML attributes if not handled)
        # Note: JSON loads handles the JS string parsing, but we check the content for things that might
        # confuse simple parsers or string concatenation if used elsewhere.
        # simple check: if description has double quotes unescaped (JSON handles this but let's see)
        desc = item.get('description', '')
        if '"' in desc or "'" in desc:
            risky_syntax.append(f"ID {item_id} ({nom}): Contains quotes in description (Logic handled by createLieuCard fix?)")

    # Generate Report
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write("=== AUDIT REPORT ===\n")
        f.write(f"Total Entries: {len(data)}\n")
        f.write(f"Missing Images: {len(missing_images)}\n")
        f.write(f"Risky Content Note: {len(risky_syntax)} items have quotes (should be handled by JS fix, but good to know)\n\n")
        
        f.write("--- ITEMS WITH MISSING IMAGES ---\n")
        for err in missing_images:
            f.write(err + "\n")

    print(f"✅ Audit Complete. Found {len(missing_images)} missing images. Report saved to {REPORT_PATH}.")

if __name__ == "__main__":
    audit_data()
