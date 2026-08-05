data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Counting rows for socios in postgres_data.sql...")

in_socios = False
row_count = 0

with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        stripped = line.strip()
        if stripped.startswith("INSERT INTO socios "):
            in_socios = True
            continue
            
        if in_socios:
            if stripped.endswith(";"):
                in_socios = False
            # Count the row (which should start with '(')
            if stripped.startswith("("):
                row_count += 1

print(f"\nTotal socios rows to insert: {row_count}")
