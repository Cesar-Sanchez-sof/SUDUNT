import re

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"
data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

# 1. Parse tables and columns from schema
schema_tables = {}
current_table = None

with open(schema_path, 'r', encoding='utf-8') as f:
    schema_content = f.read()

# Simple regex to find CREATE TABLE and columns
table_blocks = re.findall(r'CREATE TABLE IF NOT EXISTS (\w+)\s*\((.*?)\);', schema_content, re.DOTALL | re.IGNORECASE)
for table_name, body in table_blocks:
    cols = []
    # Extract column names (first word on lines that don't start with CONSTRAINT, PRIMARY KEY, UNIQUE, etc.)
    for line in body.split('\n'):
        line = line.strip()
        if not line or line.startswith('--'):
            continue
        if any(line.upper().startswith(kw) for kw in ['CONSTRAINT', 'PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'KEY']):
            continue
        match = re.match(r'^(\w+)\s', line)
        if match:
            cols.append(match.group(1).lower())
    schema_tables[table_name.lower()] = cols

print(f"Parsed {len(schema_tables)} tables from schema.")

# 2. Inspect data file INSERT statements
insert_patterns = {}
print("Inspecting INSERT statements in postgres_data.sql...")

with open(data_path, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f, 1):
        if line.strip().upper().startswith("INSERT INTO"):
            match = re.match(r'INSERT INTO\s+(\w+)\s*\((.*?)\)', line, re.IGNORECASE)
            if match:
                table_name = match.group(1).lower()
                cols = [c.strip().strip('`').strip('"').lower() for c in match.group(2).split(',')]
                insert_patterns[table_name] = cols
                
                # Check if table exists in schema
                if table_name not in schema_tables:
                    print(f"Line {i}: WARNING - Table '{table_name}' in INSERT statement does not exist in schema!")
                else:
                    schema_cols = schema_tables[table_name]
                    # Check column mismatch
                    mismatch_insert_only = set(cols) - set(schema_cols)
                    mismatch_schema_only = set(schema_cols) - set(cols)
                    if mismatch_insert_only or mismatch_schema_only:
                        print(f"Line {i}: WARNING - Column mismatch for '{table_name}':")
                        print(f"  INSERT has: {cols}")
                        print(f"  SCHEMA has: {schema_cols}")
            else:
                # Insert without column list?
                match_no_cols = re.match(r'INSERT INTO\s+(\w+)\s+VALUES', line, re.IGNORECASE)
                if match_no_cols:
                    table_name = match_no_cols.group(1).lower()
                    print(f"Line {i}: WARNING - INSERT INTO '{table_name}' has no column list (VALUES only)!")

print("Inspection completed.")
