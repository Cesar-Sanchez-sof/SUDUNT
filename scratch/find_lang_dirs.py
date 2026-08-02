import os

search_dir = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\SUDUNT"

print("Searching for lang directories...")
for root, dirs, files in os.walk(search_dir):
    if "vendor" in root or "node_modules" in root or ".git" in root or "storage" in root:
        continue
    for d in dirs:
        if d == 'lang':
            print("Found lang directory:", os.path.join(root, d))
