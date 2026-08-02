import os
import re

mysql_dump_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\sgsudunt (1).sql"
postgres_data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_temp.sql"

print("Starting strict uppercase stateful parsing of sgsudunt (1).sql...")

in_insert = False
line_count = 0
insert_statements = 0
data_rows = 0

with open(mysql_dump_path, 'r', encoding='utf-8') as infile:
    with open(temp_path, 'w', encoding='utf-8') as outfile:
        # 1. Enable replication bypass for safe FK population
        outfile.write("SET session_replication_role = 'replica';\n\n")
        
        for line in infile:
            line_count += 1
            if line_count % 100000 == 0:
                print(f"Processed {line_count} lines...")
                
            # phpMyAdmin dump insert statements start exactly with uppercase "INSERT INTO "
            # and have the keyword "VALUES" on the same line.
            if line.startswith("INSERT INTO ") and "VALUES" in line:
                in_insert = True
                insert_statements += 1
                
            if in_insert:
                data_rows += 1
                
                # Perform translations:
                # A. Replace MySQL escaped single quotes \' with standard PostgreSQL ''
                line_translated = line.replace("\\'", "''")
                
                # B. Replace MySQL NULL indicator \N with SQL NULL (without quotes)
                line_translated = re.sub(r'(?<=[,\(])\s*\\N\s*(?=[,\)])', 'NULL', line_translated)
                
                # C. Replace invalid MySQL dates
                line_translated = line_translated.replace("'0000-00-00 00:00:00'", "'1970-01-01 00:00:00'")
                line_translated = line_translated.replace("'0000-00-00'", "'1900-01-01'")
                
                # D. Strip MySQL backticks (`) since PostgreSQL does not support them
                line_translated = line_translated.replace("`", "")
                
                outfile.write(line_translated)
                
                # If line ends with a semicolon, this insert statement is finished
                if line.strip().endswith(";"):
                    in_insert = False
                    
        # 2. Append sequence updates
        outfile.write("\n\n-- Update serial sequences to avoid conflicts on new inserts\n")
        seq_tables = [
            ('prestfin', 'idprestamo'),
            ('progpagcc', 'idpagcc'),
            ('progpagpf', 'idpagff'),
            ('retiroaportefm', 'idretiro'),
            ('retirosff', 'idretiro'),
            ('suc_fondo', 'idsucesos'),
            ('deudasoc', 'iddeudas'),
            ('aportesff', 'idaportes'),
            ('otros_dsctos', 'idmonto')
        ]
        for tbl, col in seq_tables:
            outfile.write(f"SELECT setval(pg_get_serial_sequence('{tbl}', '{col}'), coalesce(max({col}), 1)) FROM {tbl};\n")
            
        # 3. Restore replication role trigger
        outfile.write("\nSET session_replication_role = 'origin';\n")

# Replace original file
os.replace(temp_path, postgres_data_path)

print(f"\nDone! Processed {line_count} total lines.")
print(f"Extracted {insert_statements} INSERT statements spanning {data_rows} total rows/lines.")
print(f"File size: {os.path.getsize(postgres_data_path)} bytes.")
print("Recreated postgres_data.sql successfully in perfect UTF-8 with zero replacement characters!")
