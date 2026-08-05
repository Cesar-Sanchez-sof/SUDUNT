data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

with open(data_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "'6757'" in line:
            # check if it is part of insert into socios
            if i >= 998000 and i <= 1001000:
                print(f"Line {i+1}: {line[:120].strip()}")
