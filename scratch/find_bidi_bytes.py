input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

# Common bidi UTF-8 byte sequences
bidi_bytes = {
    b'\xe2\x80\xae': 'RLO (U+202E)',
    b'\xe2\x80\xad': 'LRO (U+202D)',
    b'\xe2\x80\x8e': 'LRM (U+200E)',
    b'\xe2\x80\x8f': 'RLM (U+200F)',
    b'\xe2\x80\xac': 'PDF (U+202C)',
    b'\xe2\x80\xab': 'RLE (U+202B)',
    b'\xe2\x80\xaa': 'LRE (U+202A)',
    b'\xe2\x81\xa6': 'LRI (U+2066)',
    b'\xe2\x81\xa7': 'RLI (U+2067)',
    b'\xe2\x81\xa8': 'FSI (U+2068)',
    b'\xe2\x81\xa9': 'PDI (U+2069)',
}

print("Searching for raw Bidi bytes in binary mode...")

found_count = 0

with open(input_path, 'rb') as f:
    content = f.read()

for b_seq, name in bidi_bytes.items():
    idx = 0
    count = 0
    while True:
        idx = content.find(b_seq, idx)
        if idx == -1:
            break
        count += 1
        found_count += 1
        if count <= 3:
            # Print surrounding context (20 bytes before and after)
            context = content[max(0, idx-30):min(len(content), idx+len(b_seq)+30)]
            print(f"Found {name} at byte offset {idx}: context={repr(context)}")
        idx += len(b_seq)
    if count > 0:
        print(f"Total occurrences of {name}: {count}")

print(f"\nTotal Bidi bytes found: {found_count}")
