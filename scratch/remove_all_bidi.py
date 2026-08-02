import os

input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_clean.sql"

# Common bidi UTF-8 byte sequences
bidi_bytes = [
    b'\xe2\x80\xae', # RLO (U+202E)
    b'\xe2\x80\xad', # LRO (U+202D)
    b'\xe2\x80\x8e', # LRM (U+200E)
    b'\xe2\x80\x8f', # RLM (U+200F)
    b'\xe2\x80\xac', # PDF (U+202C)
    b'\xe2\x80\xab', # RLE (U+202B)
    b'\xe2\x80\xaa', # LRE (U+202A)
    b'\xe2\x81\xa6', # LRI (U+2066)
    b'\xe2\x81\xa7', # RLI (U+2067)
    b'\xe2\x81\xa8', # FSI (U+2068)
    b'\xe2\x81\xa9', # PDI (U+2069)
]

print("Starting full binary scan of postgres_data.sql...")

with open(input_path, 'rb') as f:
    content = f.read()

total_removed = 0
for b_seq in bidi_bytes:
    count = content.count(b_seq)
    if count > 0:
        total_removed += count
        print(f"Found and removing {count} occurrences of byte sequence {b_seq.hex()}")
        content = content.replace(b_seq, b'')

if total_removed > 0:
    with open(temp_path, 'wb') as f:
        f.write(content)
    os.replace(temp_path, input_path)
    print(f"\nSuccessfully cleaned a total of {total_removed} bidi characters!")
else:
    print("\nNo bidi byte sequences found in the entire file.")
