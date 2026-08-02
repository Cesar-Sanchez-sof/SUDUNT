data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking bytes in postgres_data.sql...")
with open(data_path, 'rb') as f:
    for i, line in enumerate(f):
        if b'SOLIS' in line:
            print(f"Line {i+1}: {line[:120]}")
