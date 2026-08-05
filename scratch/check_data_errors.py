import sys

data_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Checking for potential syntax issues in postgres_data.sql...")

backslash_single_quote = 0
backslash_double_quote = 0
backslash_n = 0
double_backslash = 0
other_backslash = 0

with open(data_path, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f, 1):
        if "\\'" in line:
            backslash_single_quote += 1
            if backslash_single_quote <= 5:
                print(f"Line {i} [\\']: {line[:120].encode('ascii', errors='replace').decode('ascii')}...")
        if '\\"' in line:
            backslash_double_quote += 1
            if backslash_double_quote <= 5:
                print(f"Line {i} [\\\"]: {line[:120].encode('ascii', errors='replace').decode('ascii')}...")
        if '\\N' in line:
            backslash_n += 1
            if backslash_n <= 5:
                print(f"Line {i} [\\N]: {line[:120].encode('ascii', errors='replace').decode('ascii')}...")
        if '\\\\' in line:
            double_backslash += 1
            if double_backslash <= 5:
                print(f"Line {i} [\\\\\\\]: {line[:120].encode('ascii', errors='replace').decode('ascii')}...")
        
        # Check general backslashes that are not standard
        # Standard conforming strings are enabled by default in Postgres, meaning backslashes are literal unless prefixed with E.
        # But MySQL uses backslashes for escaping.
        if i >= 300000: # Limit check to first 300k lines
            break

print("\n--- RESULTS IN FIRST 300K LINES ---")
print(f"\\' (backslash single quote) count: {backslash_single_quote}")
print(f'\\" (backslash double quote) count: {backslash_double_quote}')
print(f"\\N (backslash N / NULL) count: {backslash_n}")
print(f"\\\\ (double backslash) count: {double_backslash}")
