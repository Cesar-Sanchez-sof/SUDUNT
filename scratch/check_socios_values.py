import re

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking first row values of INSERT INTO socios...")

with open(data_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'INSERT INTO `socios` ' in line:
            parts = line.split('VALUES')
            if len(parts) > 1:
                val_part = parts[1].strip()
                # Print first 2 rows
                rows = val_part.split('),')
                print(f"Row 1: {rows[0]})")
                if len(rows) > 1:
                    print(f"Row 2: {rows[1]})")
            break
