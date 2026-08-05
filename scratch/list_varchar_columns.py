import re

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"

print("Listing all varchar columns in schema...")
with open(schema_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "varchar(" in line:
            print(f"Line {i+1}: {line.strip()}")
