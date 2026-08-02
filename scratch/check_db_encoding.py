import pg8000

conn = pg8000.connect(host="127.0.0.1", port=5432, database="SUDUNT", user="postgres", password="74036718")
cursor = conn.cursor()

cursor.execute("SHOW client_encoding;")
print("Client encoding:", cursor.fetchone()[0])

cursor.execute("SHOW server_encoding;")
print("Server encoding:", cursor.fetchone()[0])

cursor.execute("SELECT pg_encoding_to_char(encoding) FROM pg_database WHERE datname = 'SUDUNT';")
print("Database encoding:", cursor.fetchone()[0])

# Let's select one socio's raw bytes in PostgreSQL to see what is stored in the database!
cursor.execute("SELECT nombre::bytea FROM socios WHERE de_codigo = '7041';")
raw_bytes = cursor.fetchone()[0]
print("Stored bytes for SOLIS MUÑOZ in DB:", repr(raw_bytes))

conn.close()
