import os
import shutil

src = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\temp_laravel"
dst = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\SUDUNT"

print(f"Moving files from {src} to {dst}...")

def move_all(src_dir, dst_dir):
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        d = os.path.join(dst_dir, item)
        
        # Skip git files and license
        if item in ['.git', 'LICENSE']:
            continue
            
        if os.path.isdir(s):
            if os.path.exists(d):
                # If destination dir exists, merge recursively
                move_all(s, d)
            else:
                shutil.move(s, d)
        else:
            if os.path.exists(d):
                os.remove(d) # overwrite files
            shutil.move(s, d)

try:
    move_all(src, dst)
    print("Files moved successfully!")
    # Delete the temp folder
    shutil.rmtree(src)
    print(f"Removed temporary directory {src}")
except Exception as e:
    print(f"Error during move: {e}")
