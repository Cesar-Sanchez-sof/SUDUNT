import sys

mysql_dump_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\sgsudunt (1).sql"

print("Testing UTF-8 reading of sgsudunt (1).sql...")

try:
    with open(mysql_dump_path, 'r', encoding='utf-8') as f:
        # Read the file in chunks of 10MB
        chunk_idx = 0
        while True:
            chunk = f.read(10*1024*1024)
            if not chunk:
                break
            chunk_idx += 1
            print(f"Read chunk {chunk_idx} (10MB)...")
    print("Full file is 100% valid UTF-8!")
except UnicodeDecodeError as e:
    print(f"UTF-8 Decoding Error at position {e.start}-{e.end}: {e.reason}")
    # Let's inspect bytes around the error
    with open(mysql_dump_path, 'rb') as fb:
        fb.seek(max(0, e.start - 20))
        err_bytes = fb.read(40)
        print(f"Bytes around error: {err_bytes}")
except Exception as e:
    print(f"Other error: {e}")
