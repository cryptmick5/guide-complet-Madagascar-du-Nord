
filename = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\index.html"
with open(filename, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "<body" in line:
            print(f"Body found at line {i+1}: {line.strip()}")
        if "theme-toggle" in line:
            print(f"Theme toggle found at line {i+1}: {line.strip()}")
        if "header-premium" in line:
            print(f"Header found at line {i+1}: {line.strip()}")
