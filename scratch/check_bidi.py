import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

# Bidi control characters regex
bidi_chars = re.compile(r'[\u200e\u200f\u202a-\u202e\u2066-\u2069]')

print("Scanning for BiDi control characters in postgres_data.sql...")
found_count = 0
with open(data_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        matches = bidi_chars.findall(line)
        if matches:
            found_count += len(matches)
            print(f"Line {i+1} has {len(matches)} BiDi chars: {repr(matches)} | Content: {line[:120].strip()}")
            if found_count > 20:
                print("Too many matches, stopping print...")
                break

print(f"Total BiDi control characters found: {found_count}")
