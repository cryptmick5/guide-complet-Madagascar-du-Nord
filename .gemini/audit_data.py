
import json
import re

def audit_lieux():
    path = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\data\lieux.js"
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Strip JS variable declaration to get valid JSON
    # const LIEUX_DATA = [...]
    json_str = re.sub(r'const\s+LIEUX_DATA\s*=\s*', '', content)
    # Remove trailing semicolon if present
    json_str = json_str.strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1]
        
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return

    print(f"Total Items: {len(data)}")
    
    ids = []
    coords = []
    missing_coords = 0
    missing_name = 0
    duplicates = []
    coord_duplicates = []
    
    for item in data:
        # Check ID
        if 'id' in item:
            if item['id'] in ids:
                duplicates.append(item['id'])
            ids.append(item['id'])
        else:
            print("Item missing ID:", item.get('nom', 'Unknown'))
            
        # Check Coords
        if 'lat' in item and 'lng' in item:
            lat = item['lat']
            lng = item['lng']
            
            if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
                missing_coords += 1
                print(f"Invalid Coords (Type Error): ID {item.get('id')} - {item.get('nom')} -> lat:{type(lat)} lng:{type(lng)}")
                continue

            c = (lat, lng)
            if c in coords:
                coord_duplicates.append(f"{item.get('nom')} ({c})")
            coords.append(c)
        else:
            missing_coords += 1
            print(f"Missing Coords: ID {item.get('id')} - {item.get('nom')}")
            
        # Check Name
        if not item.get('nom'):
            missing_name += 1
            print(f"Missing Name: ID {item.get('id')}")

    # Type Analysis
    types = {}
    for item in data:
        t = item.get('type', 'Unknown')
        types[t] = types.get(t, 0) + 1

    print("-" * 30)
    print(f"Missing Coordinates: {missing_coords}")
    print(f"Missing Names: {missing_name}")
    print(f"Duplicate IDs: {len(duplicates)} -> {duplicates}")
    print(f"Duplicate Coordinates: {len(coord_duplicates)}")
    print("-" * 30)
    print("Type Distribution:")
    for t, count in types.items():
        print(f"  {t}: {count}")
    
    # Check for empty or malformed items
    invalid_items = [i for i in data if not i.get('id') or not i.get('nom')]
    if invalid_items:
        print(f"Invalid Items count: {len(invalid_items)}")

if __name__ == "__main__":
    audit_lieux()
