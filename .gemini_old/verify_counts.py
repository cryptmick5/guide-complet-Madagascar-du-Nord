
import json
import re

FILE_PATH = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"

def verify_counts():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON part
    json_str = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content)
    json_str = json_str.strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1]

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return

    print(f"Total Items in File: {len(data)}")

    valid_coords = 0
    missing_cat = 0
    cat_counts = {}

    invalid_items = []

    for item in data:
        # Check Coords
        lat = item.get('lat')
        lng = item.get('lng')
        has_coords = isinstance(lat, (int, float)) and isinstance(lng, (int, float))
        
        if has_coords:
            valid_coords += 1
        else:
            invalid_items.append(f"{item.get('nom')} (No Coords)")

        # Check Category
        cat = item.get('categorie')
        if not cat:
            missing_cat += 1
            cat = "MISSING"
        
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    print("-" * 30)
    print(f"Items with Valid Coords: {valid_coords}")
    print(f"Items Missing Category: {missing_cat}")
    
    if invalid_items:
        print(f"Invalid Items ({len(invalid_items)}):")
        for i in invalid_items:
            print(f" - {i}")

    print("-" * 30)
    print("Category Distribution:")
    for c, count in cat_counts.items():
        print(f"  {c}: {count}")

    print("-" * 30)
    print(f"Discrepancy Check: {len(data)} - {valid_coords} = {len(data) - valid_coords} excluded due to coords.")

if __name__ == "__main__":
    verify_counts()
