import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Analyzing socios inserts in postgres_data.sql...")
inserts_found = 0
total_tuples = 0

with open(data_path, 'r', encoding='utf-8') as f:
    current_insert = ""
    in_socios = False
    for i, line in enumerate(f):
        if "insert into socios (" in line.lower():
            in_socios = True
            inserts_found += 1
            current_insert = line
            continue
        if in_socios:
            current_insert += line
            if line.strip().endswith(";"):
                in_socios = False
                # Parse tuples from current_insert
                # The format is INSERT INTO socios (...) VALUES\n(row1),\n(row2)...;
                # Let's count occurrences of ), at end of lines or ); at the very end
                tuples = re.findall(r'\(\s*\'[^\n]+', current_insert)
                print(f"Insert #{inserts_found} starts at line {i - len(current_insert.splitlines()) + 2}, has approx {len(tuples)} tuples")
                total_tuples += len(tuples)
                current_insert = ""

print(f"Total inserts found: {inserts_found}, total tuples: {total_tuples}")
