import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking duplicate pre_codigo values in prestfin...")

in_prestfin = False
seen_codes = set()
duplicates = 0

with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        stripped = line.strip()
        if stripped.startswith("INSERT INTO prestfin"):
            in_prestfin = True
            continue
            
        if in_prestfin:
            # Check if we hit the end of the insert block
            if stripped.endswith(";"):
                in_prestfin = False
                
            # Extract the code (second field in the parentheses)
            # Row looks like: (1, 'F990001', '0655', ...)
            match = re.match(r"\(\s*\d+\s*,\s*'([^']+)'\s*,", stripped)
            if match:
                code = match.group(1)
                if code in seen_codes:
                    duplicates += 1
                    if duplicates <= 5:
                        print(f"Duplicate pre_codigo found: {code}")
                seen_codes.add(code)

print(f"\nTotal unique pre_codes: {len(seen_codes)}")
print(f"Total duplicate pre_codes: {duplicates}")
