import pg8000
import os
import sys
import time

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"
data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Connecting to PostgreSQL database SUDUNT...")
try:
    conn = pg8000.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")
    cursor = conn.cursor()
except Exception as e:
    print(f"Failed to connect to database: {e}")
    sys.exit(1)

# 1. Execute Schema
print("Executing schema from postgres_schema.sql...")
with open(schema_path, 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Split schema statements by semicolon and execute them
# Simple splitting is fine for schema as it doesn't contain semicolons in string values
statements = schema_sql.split(';')
executed_schema = 0
for stmt in statements:
    stmt_clean = stmt.strip()
    if stmt_clean:
        try:
            cursor.execute(stmt_clean)
            executed_schema += 1
        except Exception as e:
            conn.rollback()
            print(f"Error in schema statement: {e}")
            print(f"Statement: {stmt_clean[:200]}...")
            conn.close()
            sys.exit(1)

conn.commit()
print(f"Schema executed successfully. {executed_schema} statements run.")

# 2. Execute Data
print("Executing data from postgres_data.sql (this may take a minute)...")
start_time = time.time()

statement_buffer = []
statement_count = 0
line_count = 0

with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        line_count += 1
        statement_buffer.append(line)
        
        # Check if the statement is complete
        if line.strip().endswith(';'):
            stmt = "".join(statement_buffer).strip()
            statement_buffer = []
            
            if stmt:
                try:
                    cursor.execute(stmt)
                    statement_count += 1
                    if statement_count % 100 == 0:
                        conn.commit()
                        print(f"Executed {statement_count} statements (line {line_count})...")
                except Exception as e:
                    conn.rollback()
                    print(f"Error at line {line_count}: {e}")
                    # Print snippet of the failed statement
                    print("Failed statement snippet:")
                    lines = stmt.splitlines()
                    for l in lines[:5]:
                        print("  ", l[:150])
                    if len(lines) > 5:
                        print("  ...")
                    conn.close()
                    sys.exit(1)

# Commit any remaining statements
conn.commit()
end_time = time.time()

# Verify socio count
cursor.execute("SELECT COUNT(*) FROM socios;")
socio_count = cursor.fetchone()[0]
print(f"\nImport finished successfully in {end_time - start_time:.2f} seconds!")
print(f"Total statements executed: {statement_count}")
print(f"Total socios now in database: {socio_count}")

# Check one name to verify UTF-8 encoding
cursor.execute("SELECT nombre FROM socios WHERE de_codigo = '7041';")
res = cursor.fetchone()
if res:
    print(f"Verified encoding for SOLIS MUÑOZ HANIEL: {res[0]}")
else:
    print("Socio 7041 not found!")

# Check another name
cursor.execute("SELECT nombre FROM socios WHERE de_codigo = '5574';")
res = cursor.fetchone()
if res:
    print(f"Verified encoding for ABANTO ROJAS ELÍ MANUEL: {res[0]}")

conn.close()
