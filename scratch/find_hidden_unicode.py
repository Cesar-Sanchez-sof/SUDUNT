import unicodedata

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Scanning for hidden or unusual Unicode characters in postgres_data.sql...")
control_chars = {}
with open(data_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        for char in line:
            cat = unicodedata.category(char)
            # Cf is 'Other, format' (includes zero-width spaces, Bidi, etc.)
            # Zl is line separator, Zp is paragraph separator
            if cat in ['Cf', 'Zl', 'Zp']:
                code = ord(char)
                control_chars[code] = control_chars.get(code, 0) + 1
                if control_chars[code] <= 5:
                    print(f"Line {i+1}: char U+{code:04X} ({unicodedata.name(char, 'UNKNOWN')}) category {cat}")

print("\nSummary of unusual format/control characters found:")
for code, count in control_chars.items():
    print(f"  U+{code:04X} ({unicodedata.name(chr(code), 'UNKNOWN')}): {count} times")
