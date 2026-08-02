import sys

print("Testing database connection...")

# Try to find a PostgreSQL adapter
adapter = None
for name in ['psycopg2', 'psycopg', 'pg8000', 'pygresql']:
    try:
        __import__(name)
        adapter = name
        print(f"Found adapter: {name}")
        break
    except ImportError:
        pass

if not adapter:
    print("No PostgreSQL adapter found. Installing pg8000 using pip...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pg8000"])
    adapter = 'pg8000'

if adapter == 'psycopg2':
    import psycopg2
    conn = psycopg2.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")
elif adapter == 'pg8000':
    import pg8000
    conn = pg8000.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")

cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM socios;")
row = cursor.fetchone()
print(f"\nNumber of rows in socios: {row[0]}")

cursor.execute("SELECT DISTINCT COUNT(*) FROM socios;")
# Let's inspect some sample rows
cursor.execute("SELECT de_codigo, nombre FROM socios LIMIT 10;")
print("\nFirst 10 socios in DB:")
for r in cursor.fetchall():
    print(r)

conn.close()
