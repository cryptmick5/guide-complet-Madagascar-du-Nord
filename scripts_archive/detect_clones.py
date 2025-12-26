import os
import hashlib

IMAGE_DIR = 'images'
OUTPUT_FILE = 'IMAGES_A_REMPLACER.txt'

def calculate_md5(filepath):
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def find_duplicates():
    hashes = {}
    if not os.path.exists(IMAGE_DIR):
        print(f"❌ Directory '{IMAGE_DIR}' not found.")
        return

    print(f"Scanning {IMAGE_DIR} for duplicates...")
    
    count_files = 0
    for root, dirs, files in os.walk(IMAGE_DIR):
        for filename in files:
            if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                filepath = os.path.join(root, filename)
                try:
                    file_hash = calculate_md5(filepath)
                    if file_hash not in hashes:
                        hashes[file_hash] = []
                    hashes[file_hash].append(filepath)
                    count_files += 1
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

    print(f"Scanned {count_files} images.")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("⚠️ GROUPE DE DOUBLONS DÉTECTÉS (IMAGES À REMPLACER) :\n")
        f.write("====================================================\n\n")
        
        group_id = 1
        duplicates_found = False
        
        for file_hash, paths in hashes.items():
            if len(paths) > 1:
                duplicates_found = True
                # Normalize paths for cleaner output
                clean_paths = [p.replace(os.sep, '/') for p in paths]
                
                # Try to guess original (heuristic: shortest name or specific folder?)
                # For now just list them.
                f.write(f"📂 Groupe {group_id} ({len(paths)} copies) :\n")
                for p in clean_paths:
                    f.write(f"  - {p}\n")
                f.write("\n")
                group_id += 1
        
        if not duplicates_found:
            f.write("Aucun doublon trouvé.\n")

    print(f"✅ Report generated: {OUTPUT_FILE}")

if __name__ == "__main__":
    find_duplicates()
