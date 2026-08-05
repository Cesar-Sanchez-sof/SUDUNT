data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking for invalid dates ('0000-00-00') in postgres_data.sql...")

invalid_dates_count = 0

with open(data_path, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f, 1):
        if '0000-00-00' in line:
            invalid_dates_count += 1
            if invalid_dates_count <= 5:
                print(f"Line {i}: Found '0000-00-00' in line: {line[:150]}...")
        if i >= 300000:
            break

print(f"\nTotal invalid dates found: {invalid_dates_count}")
