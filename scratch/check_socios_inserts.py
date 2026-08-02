import os

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
print("Scanning postgres_data.sql for socios inserts...")

with open(data_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "insert into socios " in line.lower() or "insert into socios(" in line.lower():
            print(f"Line {i+1}: {line[:120].strip()}")
