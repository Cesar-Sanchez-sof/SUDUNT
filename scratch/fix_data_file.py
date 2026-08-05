import os

input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_temp.sql"

print("Starting to parse and fix postgres_data.sql...")

removed_lines = 0
first_line = True

with open(input_path, 'r', encoding='utf-8', errors='ignore') as infile:
    with open(temp_path, 'w', encoding='utf-8') as outfile:
        # Write replication disable trigger first
        outfile.write("SET session_replication_role = 'replica';\n\n")
        
        for line in infile:
            # Skip invalid sequence updates
            if "pg_get_serial_sequence('usuarios'" in line or "pg_get_serial_sequence('credcom'" in line:
                removed_lines += 1
                print(f"Removed sequence update line: {line.strip()}")
                continue
                
            outfile.write(line)
            
        # Restore replication role trigger at the end
        outfile.write("\n\nSET session_replication_role = 'origin';\n")

# Replace original file with temporary file
os.replace(temp_path, input_path)

print(f"\nDone! Removed {removed_lines} invalid sequence updates.")
print("Added SET session_replication_role commands at the start and end of postgres_data.sql.")
