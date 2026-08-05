import pg8000
import sys
import time

schema_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_schema.sql"
data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("==================================================")
print("NEON DATABASE IMPORT TOOL FOR SUDUNT")
print("==================================================")

host = input("Enter Neon Host (e.g., ep-xxxx-xxxx.us-east-2.aws.neon.tech): ").strip()
database = input("Enter Neon Database Name (default: neondb): ").strip() or "neondb"
user = input("Enter Neon Username (default: neondb_owner): ").strip() or "neondb_owner"
password = input("Enter Neon Password: ").strip()

print("\nConnecting to Neon PostgreSQL database...")
try:
    # ssl_context is required for Neon connections
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

# 1. Execute Schema
print("\nExecuting schema from postgres_schema.sql...")
with open(schema_path, 'r', encoding='utf-8') as f:
    schema_sql = f.read()

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
            print(f"Statement snippet: {stmt_clean[:200]}...")
            conn.close()
            sys.exit(1)

conn.commit()
print(f"Schema executed successfully. {executed_schema} statements run.")

# 2. Execute Data
print("\nExecuting data from postgres_data.sql. Please wait, uploading to Neon cloud...")
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
end_time = time.time()

# Verify socio count
cursor.execute("SELECT COUNT(*) FROM socios;")
socio_count = cursor.fetchone()[0]
print(f"\nImport to Neon finished successfully in {end_time - start_time:.2f} seconds!")
print(f"Total statements executed: {statement_count}")
print(f"Total socios now in Neon database: {socio_count}")

conn.close()
