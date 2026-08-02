import os

input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_clean.sql"

# List of bidirectional unicode control characters to strip
bidi_chars = [
    '\u202e', # RLO
    '\u202d', # LRO
    '\u202b', # RLE
    '\u202a', # LRE
    '\u202c', # PDF
    '\u200f', # RLM
    '\u200e', # LRM
    '\u061c', # ALM
    '\u2066', # LRI
    '\u2067', # RLI
    '\u2068', # FSI
    '\u2069', # PDI
]

print("Removing bidirectional Unicode control characters from postgres_data.sql...")

removed_count = 0

with open(input_path, 'r', encoding='utf-8', errors='ignore') as infile:
    with open(temp_path, 'w', encoding='utf-8') as outfile:
        for i, line in enumerate(infile, 1):
            cleaned_line = line
            for char in bidi_chars:
                if char in cleaned_line:
                    count_in_line = cleaned_line.count(char)
                    removed_count += count_in_line
                    cleaned_line = cleaned_line.replace(char, '')
                    
            outfile.write(cleaned_line)

# Replace original file with cleaned file
os.replace(temp_path, input_path)

print(f"\nDone! Cleaned {removed_count} bidirectional Unicode control characters.")
