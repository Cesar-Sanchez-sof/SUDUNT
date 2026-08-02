import pg8000

conn = pg8000.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")
cursor = conn.cursor()

cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
""")
tables = [row[0] for row in cursor.fetchall()]

print("Row counts for all tables:")
for table in tables:
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table};")
        count = cursor.fetchone()[0]
        print(f"  {table}: {count}")
    except Exception as e:
        print(f"  Error reading {table}: {e}")

conn.close()
