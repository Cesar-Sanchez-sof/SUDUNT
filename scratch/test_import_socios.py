import pg8000
import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

conn = pg8000.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")
cursor = conn.cursor()

# Disable constraints temporarily for testing
cursor.execute("SET session_replication_role = 'replica';")
conn.commit()

inserts = []
with open(data_path, 'r', encoding='utf-8') as f:
    current_insert = []
    in_socios = False
    for line in f:
        if "insert into socios (" in line.lower():
            in_socios = True
        if in_socios:
            current_insert.append(line)
            if line.strip().endswith(";"):
                in_socios = False
                inserts.append("".join(current_insert))
                current_insert = []

print(f"Found {len(inserts)} insert statements for socios. Executing them one by one...")

for idx, sql in enumerate(inserts):
    try:
        cursor.execute(sql)
        conn.commit()
        print(f"Insert #{idx+1} succeeded.")
    except Exception as e:
        conn.rollback()
        print(f"Insert #{idx+1} failed: {e}")
        # Let's inspect the first few lines of this SQL statement
        sql_lines = sql.splitlines()
        print("First 3 lines of SQL:")
        for l in sql_lines[:3]:
            print("  ", l.strip()[:150])
        print("...")

# Restore constraints
cursor.execute("SET session_replication_role = 'origin';")
conn.commit()
conn.close()
