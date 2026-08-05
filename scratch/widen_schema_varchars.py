import re

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"

print("Reading postgres_schema.sql...")
with open(schema_path, 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Define the widening substitutions
widened_sql = schema_sql

# We will search for varchar(N) on specific columns
# To make it robust and simple, let's write a parser that processes line by line
lines = widened_sql.splitlines()
new_lines = []

for line in lines:
    line_lower = line.lower().strip()
    
    # Skip drop or create table lines, only process column definitions
    if "varchar(" in line_lower and not line_lower.startswith("alter ") and not line_lower.startswith("create "):
        # Extract column name and current varchar size
        match = re.search(r'([a-zA-Z0-9_]+)\s+varchar\((\d+)\)', line)
        if match:
            col_name = match.group(1).lower()
            current_size = int(match.group(2))
            
            # Decide new size
            new_size = current_size
            if any(x in col_name for x in ['observacion', 'observaciones', 'observac', 'descr', 'condicion', 'cc_des', 'cc_dir', 'cc_contac', 'nombre', 'socio', 'direccion', 'correo', 'facultad', 'depacad']):
                new_size = max(current_size, 255)
            elif any(x in col_name for x in ['cheque', 'recibo', 'documento', 'vale']):
                new_size = max(current_size, 100)
            elif any(x in col_name for x in ['usuario']):
                new_size = max(current_size, 100)
            elif any(x in col_name for x in ['pre_codigo', 'ccc_codigo', 'deu_codigo', 'cod_deuda']):
                new_size = max(current_size, 50)
            
            if new_size != current_size:
                # Replace the varchar(N) with varchar(NEW_SIZE)
                line = re.sub(rf'\b{match.group(1)}\s+varchar\({current_size}\)', f'{match.group(1)} varchar({new_size})', line)
                print(f"Widened column '{match.group(1)}' from {current_size} to {new_size}")

    new_lines.append(line)

print("Writing widened schema back to postgres_schema.sql...")
with open(schema_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(new_lines) + "\n")

print("Schema widening complete!")
