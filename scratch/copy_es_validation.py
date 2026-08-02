src_path = r"C:\Users\Cesar Sanchez\.gemini\antigravity\brain\9e1b6001-9afa-4dd9-b5bf-c820101a61c9\.system_generated\steps\1041\content.md"
dest_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\SUDUNT\lang\es\validation.php"

print("Reading downloaded validation content...")
with open(src_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find where <?php starts
php_start_idx = 0
for idx, line in enumerate(lines):
    if line.strip() == "<?php":
        php_start_idx = idx
        break

php_content = "".join(lines[php_start_idx:])

print(f"Writing PHP translation to {dest_path}...")
with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(php_content)

print("Copy complete!")
