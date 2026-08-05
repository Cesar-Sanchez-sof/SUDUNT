import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

seen_codes = set()
duplicates = []

with open(data_path, 'r', encoding='utf-8') as f:
    in_socios = False
    for i, line in enumerate(f):
        if "insert into socios (" in line.lower():
            in_socios = True
            continue
        if in_socios:
            if line.strip().endswith(";"):
                in_socios = False
            # extract the de_codigo from the line
            # format is ('6757', ...
            match = re.match(r"\s*\(\s*'([^']+)'", line)
            if match:
                code = match.group(1)
                if code in seen_codes:
                    duplicates.append((i+1, code, line.strip()[:100]))
                else:
                    seen_codes.add(code)

print(f"Total unique de_codigo seen: {len(seen_codes)}")
print(f"Total duplicates found: {len(duplicates)}")
if duplicates:
    print("First 10 duplicates:")
    for d in duplicates[:10]:
        print(f"  Line {d[0]}: code {d[1]} -> {d[2]}")
