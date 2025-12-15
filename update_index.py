
import os

file_path = 'index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_data_block = False
data_block_removed = False

for i, line in enumerate(lines):
    # 1. Insert CSS Link
    if '</head>' in line and not any('styles-premium.css' in l for l in lines):
        new_lines.append('    <link rel="stylesheet" href="css/styles-premium.css">\n')
    
    # 2. Remove LIEUX_DATA
    if 'const LIEUX_DATA = [' in line:
        in_data_block = True
        continue
    
    if in_data_block:
        if '];' in line and line.strip() == '];':
            in_data_block = False
            data_block_removed = True
            # We don't append the closing bracket line either
            continue
        continue # Skip lines inside block

    # 3. Modify Init Logic
    if "document.addEventListener('DOMContentLoaded', () => {" in line:
         new_lines.append(line.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {\n    initData().then(() => {"))
         continue
         
    # 4. Close the new promise block
    # We need to find where the original block ends or just close it after the calls.
    # The original block ends with }); at line 5944 (approx).
    # Actually, modifying the *start* is easy, but I need to close the parenthesis.
    # Logic:
    # document.addEventListener('DOMContentLoaded', () => {
    #     initData().then(() => {
    #         initTheme();
    #         ...
    #         initGeolocation();
    #     }); <--- Need to add this
    # });
    
    # Check if this is the closing of the init block
    if 'initGeolocation();' in line:
        new_lines.append(line)
        new_lines.append('            });\n') # Close the .then()
        continue

    # 5. Insert JS Script
    if '</body>' in line and not any('js/app-data.js' in l for l in lines):
         new_lines.append('    <script src="js/app-data.js"></script>\n')

    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("index.html updated successfully.")
