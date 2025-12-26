
import json
import re
import os
import ast
import unicodedata

def normalize_text(text):
    if not isinstance(text, str): return ""
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8').lower().strip()

def load_js_list(filepath):
    if not os.path.exists(filepath): return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'const\s+\w+\s*=\s*(\[.*\])', content, re.DOTALL)
            if match:
                json_str = match.group(1)
                json_str = re.sub(r',(\s*[\]}])', r'\1', json_str)
                # Removing comments carefully if any
                return json.loads(json_str, strict=False)
    except Exception as e:
        print(f"Error JS: {e}")
    return []

def load_python_list(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            tree = ast.parse(content)
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name) and target.id == 'lieux_data':
                            return ast.literal_eval(node.value)
    except:
        pass
    return []

def inject_rich_tags():
    target_path = 'data/lieux.js'
    target_data = load_js_list(target_path)
    rich_data = load_python_list('restore_data.py')
    
    if not target_data or not rich_data:
        print("Failed to load datasets")
        return
        
    rich_map = {normalize_text(item.get('nom')): item for item in rich_data}
    
    updated_count = 0
    
    for item in target_data:
        rich_item = rich_map.get(normalize_text(item.get('nom')))
        if rich_item:
            # We found a match in the Rich Backup
            # Inject Tags if missing
            if 'tags' in rich_item:
                if 'tags' not in item:
                    item['tags'] = rich_item['tags']
                    updated_count += 1
                elif item['tags'] != rich_item['tags']:
                    # Merge or Overwrite? 
                    # User likely wants the rich tags. 
                    # If Local has tags, we keep them? 
                    # But local LOST tags. So we overwrite.
                    item['tags'] = rich_item['tags']
                    updated_count += 1
            
            # Inject spotLocal
            if 'spotLocal' in rich_item and 'spotLocal' not in item:
                item['spotLocal'] = rich_item['spotLocal']
                
            # Inject Note if better?
            # Start with tags.
            
    print(f"Injected rich tags into {updated_count} items (e.g. Ramena).")
    
    js_content = f"const LIEUX_DATA = {json.dumps(target_data, indent=4, ensure_ascii=False)};"
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(js_content)

if __name__ == "__main__":
    inject_rich_tags()
