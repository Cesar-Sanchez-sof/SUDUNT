data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Reading last 50 lines of postgres_data.sql...")

with open(data_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for line in lines[-50:]:
    print(line.strip())
