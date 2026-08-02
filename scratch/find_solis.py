data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Searching for SOLIS / HANIEL in postgres_data.sql...")
with open(data_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "SOLIS" in line or "HANIEL" in line:
            print(f"Line {i+1}: {line[:150].strip()}")
