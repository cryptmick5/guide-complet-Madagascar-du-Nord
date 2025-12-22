
import os
import re
import json

# Paths
BASE_DIR = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord"
SOURCE_FILE = os.path.join(BASE_DIR, "data", "lieux_FINAL_RESTORED.js")
OUTPUT_FILE = os.path.join(BASE_DIR, "js", "data", "lieux_consolidated.js")

print(f"Reading from {SOURCE_FILE}...")

with open(SOURCE_FILE, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Try to find the array content
# The file structure is likely: const LIEUX_DATA = [ ... ];
# We'll use a simple strategy: find the first '[' and the last ']'
start = content.find('[')
end = content.rfind(']')

if start != -1 and end != -1:
    json_str = content[start:end+1]
    
    # Clean it up to be valid JSON
    # Remove // comments
    json_str = re.sub(r'//.*', '', json_str)
    # Remove trailing commas
    json_str = re.sub(r',(\s*])', r'\1', json_str)
    json_str = re.sub(r',(\s*})', r'\1', json_str)
    
    try:
        data = json.loads(json_str)
        print(f"Successfully loaded {len(data)} items.")
        
        # Deduplicate strictly by ID
        unique_data = {}
        for item in data:
            if item.get('id'):
                unique_data[item['id']] = item
        
        final_list = list(unique_data.values())
        print(f"Final Count after ID dedup: {len(final_list)}")
        
        # Write back
        js_out = f"const LIEUX_DATA = {json.dumps(final_list, indent=4, ensure_ascii=False)};"
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f_out:
            f_out.write(js_out)
            
        print("Fixed data saved.")
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        # Fallback: Just copy the array part if JSON fails (risky but better than empty)
        # But we need to assign it to variable
        # Let's hope JSON works. If not, we might need a manual copy.
else:
    print("Could not find array brackets in source file.")
