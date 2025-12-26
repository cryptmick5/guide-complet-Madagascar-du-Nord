import shutil
import os

# Source Images (Verified existence previously or assumed standard)
SRC_HOTEL = "images/hotels/grand-hotel-diego.jpg" 
SRC_SPOT = "images/spots/salines-diego.jpg"
SRC_VILLE = "images/villes/diego-suarez.jpg"

# Fallback checking
if not os.path.exists(SRC_HOTEL):
    if os.path.exists("images/villes/diego-suarez.jpg"):
        SRC_HOTEL = "images/villes/diego-suarez.jpg"
    else:
        # Extreme fallback
        print("❌ CRITICAL: No source images found to clone!")
        exit(1)

if not os.path.exists(SRC_SPOT): SRC_SPOT = SRC_HOTEL
if not os.path.exists(SRC_VILLE): SRC_VILLE = SRC_HOTEL

print(f"Sources used:\n- Hotel: {SRC_HOTEL}\n- Spot: {SRC_SPOT}\n- Ville: {SRC_VILLE}\n")

# Mapping: Destination -> Source
MISSING_MAP = {
    # Diego specific
    "images/diego/hotel-marine.jpg": SRC_VILLE,
    "images/diego/marche-bazarikely.jpg": SRC_VILLE,
    "images/diego/place-joffre.jpg": SRC_VILLE,
    
    # Hotels
    "images/hotels/gite-voyageur.jpg": SRC_HOTEL,
    "images/hotels/allamanda.jpg": SRC_HOTEL,
    "images/hotels/grand-hotel.jpg": SRC_HOTEL,
    "images/hotels/louvre-tana.jpg": SRC_HOTEL,
    "images/hotels/sakamanga.jpg": SRC_HOTEL,
    "images/hotels/palmarium.jpg": SRC_HOTEL,
    "images/hotels/anakao-ocean.jpg": SRC_HOTEL,
    
    # Spots
    "images/spots/lokobe.jpg": SRC_SPOT,
    "images/spots/croc-farm.jpg": SRC_SPOT,
    "images/spots/ranomafana.jpg": SRC_SPOT,
    "images/spots/train-fianar.jpg": SRC_SPOT
}

def fill_images():
    count_success = 0
    for dest_path, src_path in MISSING_MAP.items():
        # Ensure directory exists
        dest_dir = os.path.dirname(dest_path)
        if not os.path.exists(dest_dir):
            try:
                os.makedirs(dest_dir)
                print(f"📁 Created directory: {dest_dir}")
            except OSError as e:
                print(f"❌ Failed to create directory {dest_dir}: {e}")
                continue

        # Copy file
        try:
            shutil.copy2(src_path, dest_path)
            print(f"✅ Filled: {dest_path} (from {src_path})")
            count_success += 1
        except Exception as e:
            print(f"❌ Failed to copy to {dest_path}: {e}")

    print(f"\n🎉 Operation Complete. {count_success}/{len(MISSING_MAP)} images filled.")

if __name__ == "__main__":
    fill_images()
