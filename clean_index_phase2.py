
import os

file_path = r"c:\Users\wanad\OneDrive\Documents\Projets_Git\guide-complet-Madagascar-du-Nord\index.html"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print(f"Total lines read: {len(lines)}")

    # We want to cut at line 4119 approx.
    # Look for the last closing div of modal-header-image or similar
    # Actually, look for the start of the SCRIPT block at line 4120
    # Line 4120 in recent view was "<script>"
    
    cut_index = -1
    for i in range(4100, 4200):
        if "<script>" in lines[i]:
            # Verify if it's the big script block.
            # Next line usually "// ============================================"
            if i+2 < len(lines) and "DATA INJECTION" in lines[i+8] or "DONNÉES" in lines[i+2] or "VARIABLES GLOBALES" in lines[i]: 
                 # Wait, looking at view_file 2178:
                 # 4120: <script>
                 # 4121: // ============================================
                 # 4122: // DONNÉES
                 cut_index = i
                 print(f"Found cut point at {i}: {lines[i].strip()}")
                 break
    
    if cut_index == -1:
         # Fallback search for "window.initData = function"
         for i in range(4100, 4300):
             if "window.initData =" in lines[i]:
                 cut_index = i - 15 # Move up to finding <script>
                 # search backwards for <script>
                 for j in range(i, i-50, -1):
                     if "<script>" in lines[j]:
                         cut_index = j
                         print(f"Found cut point (backtrack) at {j}: {lines[j].strip()}")
                         break
                 break

    if cut_index != -1:
        # Keep everything before the script
        new_content = lines[:cut_index]
        
        # Append new scripts
        new_content.append('<script src="js/app.js"></script>\n')
        new_content.append('<script src="js/map-logic.js"></script>\n')
        new_content.append('</body>\n</html>')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_content)
        print("Success: Truncated index.html and added imports.")
    else:
        print("Error: Could not find the script block to cut.")

except Exception as e:
    print(f"Error: {e}")
