input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"
temp_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data_hashed.sql"

print("Hashing passwords in postgres_data.sql...")

import os

# We will read the entire file, locate the usuarios INSERT block and replace the plain-text passwords with Bcrypt hashes.
bcrypt_hashes = {
    "'ozsystem'": "'$2y$10$Jd41LCoBSXYQcZwQobWvNeJWNzGzUXS/BdWEqK2rQuvTLfhotMsoK'",
    "'123456'": "'$2y$10$IFpTJCeoy56.CpKvUsxU5eZaHzw4iHQwecv925kaWfSvMZMhPulf.'",
    "'94ma83'": "'$2y$10$ejXaLKNuN9xDoDrs1SLeueRTok7k/pYruYz9hZuAZSgWKIvTTMSya'"
}

with open(input_path, 'r', encoding='utf-8') as infile:
    content = infile.read()

# Find the exact block
target_block = """INSERT INTO usuarios (id_usuario, dni_usuario, clv_usuario, nom_usuario, car_usuario, niv_usuario) VALUES
(1, 'adminozc', 'ozsystem', 'Oscar Zavaleta Cedeño', 'Administrador', 1),
(2, '18190279', '123456', 'Lucia Lopez Vera', 'Consultor', 1),
(3, '28065769', '123456', 'Armando Alfaro', 'Consultor', 2),
(4, '19219483', '94ma83', 'Marianella Padilla', 'Administrador', 1);"""

# Replace in content
replacement_block = """INSERT INTO usuarios (id_usuario, dni_usuario, clv_usuario, nom_usuario, car_usuario, niv_usuario) VALUES
(1, 'adminozc', '$2y$10$Jd41LCoBSXYQcZwQobWvNeJWNzGzUXS/BdWEqK2rQuvTLfhotMsoK', 'Oscar Zavaleta Cedeño', 'Administrador', 1),
(2, '18190279', '$2y$10$IFpTJCeoy56.CpKvUsxU5eZaHzw4iHQwecv925kaWfSvMZMhPulf.', 'Lucia Lopez Vera', 'Consultor', 1),
(3, '28065769', '$2y$10$IFpTJCeoy56.CpKvUsxU5eZaHzw4iHQwecv925kaWfSvMZMhPulf.', 'Armando Alfaro', 'Consultor', 2),
(4, '19219483', '$2y$10$ejXaLKNuN9xDoDrs1SLeueRTok7k/pYruYz9hZuAZSgWKIvTTMSya', 'Marianella Padilla', 'Administrador', 1);"""

if target_block in content:
    content = content.replace(target_block, replacement_block)
    print("Found and replaced plain text passwords in usuarios INSERT block successfully!")
else:
    # Try with replacement character if any encoding issue, or try line-by-line
    print("Target block exact match not found. Trying line replacement...")
    content = content.replace("(1, 'adminozc', 'ozsystem',", "(1, 'adminozc', '$2y$10$Jd41LCoBSXYQcZwQobWvNeJWNzGzUXS/BdWEqK2rQuvTLfhotMsoK',")
    content = content.replace("(2, '18190279', '123456',", "(2, '18190279', '$2y$10$IFpTJCeoy56.CpKvUsxU5eZaHzw4iHQwecv925kaWfSvMZMhPulf.',")
    content = content.replace("(3, '28065769', '123456',", "(3, '28065769', '$2y$10$IFpTJCeoy56.CpKvUsxU5eZaHzw4iHQwecv925kaWfSvMZMhPulf.',")
    content = content.replace("(4, '19219483', '94ma83',", "(4, '19219483', '$2y$10$ejXaLKNuN9xDoDrs1SLeueRTok7k/pYruYz9hZuAZSgWKIvTTMSya',")
    print("Replacements applied.")

with open(temp_path, 'w', encoding='utf-8') as outfile:
    outfile.write(content)

os.replace(temp_path, input_path)
print("Finished writing hashed file.")
