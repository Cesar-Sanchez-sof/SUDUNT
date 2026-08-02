schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"

print("Truncating foreign keys in postgres_schema.sql...")

with open(schema_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We only keep up to line 721 (which is index 720)
# Let's verify line 721 content
print(f"Line 721: {lines[720].strip()}")

clean_lines = lines[:721]

with open(schema_path, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)

print("Successfully removed the trailing foreign keys.")
