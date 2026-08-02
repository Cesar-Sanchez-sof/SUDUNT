mysql_dump_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\sgsudunt (1).sql"

print("Counting socios rows in sgsudunt (1).sql...")

in_socios = False
row_count = 0

with open(mysql_dump_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        stripped = line.strip()
        if stripped.startswith("INSERT INTO `socios`"):
            in_socios = True
            continue
            
        if in_socios:
            if stripped.endswith(";"):
                in_socios = False
            if stripped.startswith("("):
                row_count += 1

print(f"\nOriginal MySQL dump socios rows: {row_count}")
