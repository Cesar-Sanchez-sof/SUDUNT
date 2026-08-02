input_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\postgres_data.sql"

print("Reading first 100 bytes of postgres_data.sql in hex and char:")

with open(input_path, 'rb') as f:
    chunk = f.read(100)

print(f"Hex: {chunk.hex()}")
print(f"Repr: {repr(chunk)}")

if chunk.startswith(b'\xff\xfe'):
    print("Detected: UTF-16 LE BOM")
elif chunk.startswith(b'\xfe\xff'):
    print("Detected: UTF-16 BE BOM")
elif chunk.startswith(b'\xef\xbb\xbf'):
    print("Detected: UTF-8 BOM")
else:
    print("No BOM detected.")
