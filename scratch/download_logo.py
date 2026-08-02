import urllib.request
import re
import os

page_url = "https://commons.wikimedia.org/wiki/File:Universidad_Nacional_de_Trujillo_-_Per%C3%BA_vector_logo.png"
output_dir = r"c:\Users\Cesar Sanchez\Documents\Sindicatount\SUDUNT\public\images"
output_path = os.path.join(output_dir, "unt_logo.png")

print(f"Scraping Wikipedia page: {page_url}...")
try:
    os.makedirs(output_dir, exist_ok=True)
    req = urllib.request.Request(
        page_url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        
    # Look for image URLs containing the filename in upload.wikimedia.org
    # Matches typically look like: "https://upload.wikimedia.org/wikipedia/commons/.../Universidad_Nacional_de_Trujillo_-_Per%C3%BA_vector_logo.png"
    matches = re.findall(r'https://upload\.wikimedia\.org/wikipedia/commons/[^"\s>]+Universidad_Nacional_de_Trujillo[^"\s>]*\.png', html)
    if matches:
        # Use the first match (usually the full resolution or a thumb)
        direct_url = matches[0]
        # Make sure it's not a thumbnail, or if it is, clean it to get the original or a good sized one
        print(f"Found direct URL: {direct_url}")
        
        # Let's download it
        print(f"Downloading from direct URL...")
        req_img = urllib.request.Request(
            direct_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req_img) as response_img, open(output_path, 'wb') as out_file:
            out_file.write(response_img.read())
        print(f"Logo downloaded successfully to {output_path}!")
    else:
        # Let's try searching for the other Wikipedia page:
        print("Could not find the logo on that page, trying fallback page...")
        page_url_fallback = "https://commons.wikimedia.org/wiki/File:Universidad_Nacional_de_Trujillo.png"
        req_fb = urllib.request.Request(
            page_url_fallback, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req_fb) as response_fb:
            html_fb = response_fb.read().decode('utf-8', errors='ignore')
        matches_fb = re.findall(r'https://upload\.wikimedia\.org/wikipedia/commons/[^"\s>]+Universidad_Nacional_de_Trujillo[^"\s>]*\.png', html_fb)
        if matches_fb:
            direct_url = matches_fb[0]
            print(f"Found fallback direct URL: {direct_url}")
            req_img = urllib.request.Request(
                direct_url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            )
            with urllib.request.urlopen(req_img) as response_img, open(output_path, 'wb') as out_file:
                out_file.write(response_img.read())
            print(f"Logo downloaded successfully to {output_path}!")
        else:
            print("Could not find image matches on fallback page either.")
except Exception as e:
    print(f"Error: {e}")
