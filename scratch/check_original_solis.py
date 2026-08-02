mysql_dump_path = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\Recursos\sgsudunt (1).sql"

with open(mysql_dump_path, 'rb') as f:
    for i, line in enumerate(f):
        if b'SOLIS' in line or b'7041' in line:
            if b'socios' in line or (b'7041' in line and b'SOLIS' in line):
                print(f"Line {i+1}: {line[:150]}")
