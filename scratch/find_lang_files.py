import os

search_dir = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\SUDUNT"
query = "These credentials do not match our records."

print(f"Searching for translations in {search_dir}...")
found = []
for root, dirs, files in os.walk(search_dir):
    if "vendor" in root or "node_modules" in root or ".git" in root or "storage" in root:
        continue
    for file in files:
        if file.endswith('.php') or file.endswith('.json'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if query in content:
                        found.append(path)
                        print(f"Found match in: {path}")
            except Exception:
                pass

if not found:
    print("No translation files containing that exact query found in custom project files.")
