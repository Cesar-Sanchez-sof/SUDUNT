schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"

print("Searching for table definitions...")

with open(schema_path, 'r', encoding='utf-8') as f:
    schema = f.read()

# Find definitions of usuarios and others
for table in ['usuarios', 'usuariosxx', 'prestfin', 'progpagcc', 'progpagpf', 'retiroaportefm', 'retirosff', 'suc_fondo', 'deudasoc', 'aportesff', 'credcom', 'otros_dsctos']:
    match = re.search(r'CREATE TABLE IF NOT EXISTS ' + table + r'\s*\((.*?)\);', schema, re.DOTALL | re.IGNORECASE)
    if match:
        print(f"--- TABLE: {table} ---")
        print(match.group(0))
