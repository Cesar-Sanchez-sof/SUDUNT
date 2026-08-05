import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking for duplicate pre_codigo in prestfin inserts...")

seen_codes = set()
duplicates = 0

with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'INSERT INTO prestfin ' in line or 'insert into prestfin ' in line:
            # Extract rows
            parts = line.split('VALUES')
            if len(parts) > 1:
                val_part = parts[1].strip()
                # Find all pre_codigo (which is the second column, e.g. (id, 'pre_codigo', ...))
                # Row looks like: (1, 'P000001', ...)
                # Let's find matches like (number, 'code', ...
                matches = re.findall(r"\(\s*\d+\s*,\s*'([^']+)'\s*,", val_part)
                for code in matches:
                    if code in seen_codes:
                        duplicates += 1
                        if duplicates <= 5:
                            print(f"Duplicate pre_codigo found: {code}")
                    seen_codes.add(code)

print(f"\nTotal prestfin records: {len(seen_codes)}")
print(f"Total duplicate pre_codigo: {duplicates}")
