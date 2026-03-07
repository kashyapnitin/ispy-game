from PIL import Image
import os

img_path = '/Users/nitinkashyap/.gemini/antigravity/brain/29a1a50e-1831-4071-aa81-c677509e329c/toys_spritesheet_1772271705515.png'
img = Image.open(img_path)
w, h = img.size

cols, rows = 5, 3
item_w = w // cols
item_h = h // rows

os.makedirs('assets/images/objects', exist_ok=True)
count = 1
for r in range(rows):
    for c in range(cols):
        box = (c * item_w, r * item_h, (c + 1) * item_w, (r + 1) * item_h)
        cropped = img.crop(box)
        
        # Make white background transparent
        cropped = cropped.convert("RGBA")
        datas = cropped.getdata()
        newData = []
        for item in datas:
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        cropped.putdata(newData)
        
        cropped.save(f'assets/images/objects/obj_{count}.png', 'PNG')
        count += 1
