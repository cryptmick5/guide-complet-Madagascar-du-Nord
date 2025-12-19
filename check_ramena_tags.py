
import json
import re

def check_ramena_tags():
    try:
        with open('data/lieux.js', 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r'const\s+\w+\s*=\s*(\[.*\])', content, re.DOTALL)
            if match:
                json_str = match.group(1)
                json_str = re.sub(r',(\s*[\]}])', r'\1', json_str)
                data = json.loads(json_str, strict=False)
                
                ramena = next((i for i in data if "Ramena" in i.get('nom', '')), None)
                if ramena:
                    print(f"Name: {ramena.get('nom')}")
                    print(f"Tags: {ramena.get('tags')}")
                    print(f"Type: {ramena.get('type')}")
                else:
                    print("Ramena not found")
    except Exception as e:
        print(e)

if __name__ == "__main__":
    check_ramena_tags()
