import pg8000
import sys

print("==================================================")
print("NEON DATABASE HEALING TOOL FOR SUDUNT")
print("==================================================")

raw_input = input("Enter Neon Connection String or Host: ").strip()

# Default values
host = ""
database = "neondb"
user = "neondb_owner"
password = ""

# Auto-parse
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
    if '/' in raw_input:
        parts = raw_input.split('/')
        host = parts[0]
        path_part = parts[1]
        if '?' in path_part:
            database = path_part.split('?')[0] or "neondb"
        else:
            database = path_part or "neondb"
    else:
        host = raw_input

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
    print(f"Failed to connect: {e}")
    sys.exit(1)

# 1. Find missing codes
print("\nScanning for orphaned com_codigo values in credcom...")
cursor.execute("""
    SELECT DISTINCT com_codigo 
    FROM credcom 
    WHERE com_codigo NOT IN (SELECT com_cod FROM comerciales);
""")
missing_codes = [row[0] for row in cursor.fetchall()]

if missing_codes:
    print(f"Found {len(missing_codes)} missing merchant codes in comerciales: {repr(missing_codes)}")
    
    # 2. Insert placeholders
    print("Inserting placeholder records into comerciales...")
    for code in missing_codes:
        try:
            cursor.execute("""
                INSERT INTO comerciales (com_cod, catc_cod, cc_des, cc_dir, cc_tel1, cc_tel2, activo, fec_activ, fec_dactiv, cc_contac)
                VALUES (%s, '00', 'Placeholder de Migracion', '', '', '', 'N', '1900-01-01', '1900-01-01', '');
            """, [code])
            print(f"  Inserted placeholder for code: '{code}'")
        except Exception as e:
            print(f"  Failed to insert placeholder for '{code}': {e}")
            conn.rollback()
            conn.close()
            sys.exit(1)
    conn.commit()
else:
    print("No orphaned codes found!")

# 3. Apply the foreign key constraint
print("\nApplying foreign key constraint fk_credcom_comerciales...")
sql = "ALTER TABLE credcom ADD CONSTRAINT fk_credcom_comerciales FOREIGN KEY (com_codigo) REFERENCES comerciales(com_cod) ON DELETE CASCADE;"
try:
    cursor.execute(sql)
    conn.commit()
    print("Foreign key constraint applied successfully!")
except Exception as e:
    conn.rollback()
    print(f"Error applying constraint: {e}")
    print("Attempting with NOT VALID...")
    try:
        cursor.execute("ALTER TABLE credcom ADD CONSTRAINT fk_credcom_comerciales FOREIGN KEY (com_codigo) REFERENCES comerciales(com_cod) ON DELETE CASCADE NOT VALID;")
        conn.commit()
        print("Foreign key constraint applied successfully (with NOT VALID)!")
    except Exception as e2:
        conn.rollback()
        print(f"Failed again: {e2}")

conn.close()
print("\nHealing process complete!")
