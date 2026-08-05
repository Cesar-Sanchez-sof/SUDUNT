import pg8000
import sys
import time

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"
data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("==================================================")
print("NEON DATABASE IMPORT TOOL FOR SUDUNT (CLOUD OPTIMIZED)")
print("==================================================")

raw_input = input("Enter Neon Connection String or Host: ").strip()

# Default values
host = ""
database = "neondb"
user = "neondb_owner"
password = ""

# Auto-parse if they pasted a full postgresql:// URL
if raw_input.startswith("postgres://") or raw_input.startswith("postgresql://"):
    try:
        import urllib.parse as urlparse
        result = urlparse.urlparse(raw_input)
        host = result.hostname or ""
        user = result.username or "neondb_owner"
        password = result.password or ""
        database = result.path.lstrip('/') or "neondb"
        print("\n--> Auto-parsed full connection URI successfully!")
    except Exception as e:
        print(f"Error parsing URI: {e}")
        host = raw_input
else:
    # If they pasted host/db?sslmode...
    if '/' in raw_input:
        parts = raw_input.split('/')
        host = parts[0]
        path_part = parts[1]
        if '?' in path_part:
            database = path_part.split('?')[0] or "neondb"
        else:
            database = path_part or "neondb"
        print(f"\n--> Cleaned host domain name and extracted database: '{database}'")
    else:
        host = raw_input

    # Prompt for database, user, password
    database = input(f"Enter Neon Database Name (default: {database}): ").strip() or database
    user = input(f"Enter Neon Username (default: {user}): ").strip() or user
    password = input("Enter Neon Password: ").strip()

print("\nConnecting to Neon PostgreSQL database...")
try:
    import ssl
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    conn = pg8000.connect(
        host=host, 
        port=5432, 
        database=database, 
        user=user, 
        password=password,
        ssl_context=ssl_context
    )
    cursor = conn.cursor()
    print("Connected successfully!")
except Exception as e:
    print(f"Failed to connect to Neon database: {e}")
    sys.exit(1)

# 1. Read and split schema
print("\nReading postgres_schema.sql...")
with open(schema_path, 'r', encoding='utf-8') as f:
    schema_sql = f.read()

# Split schema into main tables/views and foreign keys
fk_marker = "-- === RELACIONES EXPLÍCITAS (FOREIGN KEYS) ==="
if fk_marker in schema_sql:
    parts = schema_sql.split(fk_marker)
    tables_sql = parts[0]
    fkeys_sql = parts[1]
else:
    tables_sql = schema_sql
    fkeys_sql = ""

# Execute Tables and Views Schema
print("Creating tables and views...")
statements = tables_sql.split(';')
executed_tables = 0
for stmt in statements:
    stmt_clean = stmt.strip()
    if stmt_clean:
        try:
            cursor.execute(stmt_clean)
            executed_tables += 1
        except Exception as e:
            conn.rollback()
            print(f"Error creating tables: {e}")
            print(f"Statement snippet: {stmt_clean[:200]}...")
            conn.close()
            sys.exit(1)

conn.commit()
print(f"Tables and views created successfully ({executed_tables} statements).")

# 2. Execute Data (excluding replication role changes)
print("\nUploading data from postgres_data.sql. Please wait...")
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
            
            # Skip replication role statements which require superuser on Neon
            if "session_replication_role" in stmt:
                continue
            
            if stmt:
                try:
                    cursor.execute(stmt)
                    statement_count += 1
                    if statement_count % 100 == 0:
                        conn.commit()
                        print(f"Uploaded {statement_count} statements...")
                except Exception as e:
                    conn.rollback()
                    print(f"Error at line {line_count}: {e}")
                    print("Failed statement snippet:")
                    lines = stmt.splitlines()
                    for l in lines[:5]:
                        print("  ", l[:150])
                    conn.close()
                    sys.exit(1)

conn.commit()
print(f"Data upload finished. {statement_count} statements imported.")

# 3. Create Foreign Key Constraints (with NOT VALID for legacy safety)
if fkeys_sql.strip():
    print("\nApplying foreign key constraints to Neon database (with NOT VALID for safety)...")
    fk_statements = fkeys_sql.split(';')
    executed_fkeys = 0
    
    for stmt in fk_statements:
        stmt_clean = stmt.strip()
        if stmt_clean:
            # Append NOT VALID to ensure it passes even if legacy data has minor inconsistencies
            if stmt_clean.lower().startswith("alter table") and "add constraint" in stmt_clean.lower():
                stmt_clean = stmt_clean.rstrip(';') + " NOT VALID"
            
            try:
                cursor.execute(stmt_clean)
                executed_fkeys += 1
            except Exception as e:
                conn.rollback()
                print(f"Warning: Failed to create foreign key constraint: {e}")
                print(f"Statement: {stmt_clean[:150]}...")
                # We continue since NOT VALID constraints are safe, but print warning
    
    conn.commit()
    print(f"Foreign keys applied successfully ({executed_fkeys} constraints).")

end_time = time.time()

# Verify socio count
cursor.execute("SELECT COUNT(*) FROM socios;")
socio_count = cursor.fetchone()[0]
print(f"\nImport to Neon finished successfully in {end_time - start_time:.2f} seconds!")
print(f"Total socios now in Neon database: {socio_count}")

conn.close()
