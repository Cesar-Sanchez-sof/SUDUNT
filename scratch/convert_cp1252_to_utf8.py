import os

input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_utf8.sql"

print("Converting postgres_data.sql from CP1252 to UTF-8...")

# We will open with cp1252 which matches Windows Spanish encoding
# and write out in proper UTF-8.
line_count = 0
try:
    with open(input_path, 'r', encoding='cp1252', errors='replace') as infile:
        with open(temp_path, 'w', encoding='utf-8') as outfile:
            for line in infile:
                line_count += 1
                outfile.write(line)
                
    # Replace original file
    os.replace(temp_path, input_path)
    print(f"Successfully converted {line_count} lines to UTF-8.")
except Exception as e:
    print(f"Error during conversion: {e}")
