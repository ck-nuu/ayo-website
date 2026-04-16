from PIL import Image
img = Image.open('public/logos/logo-white-text.png')
print(img.getbbox())
