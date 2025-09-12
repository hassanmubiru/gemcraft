#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create a new image with the specified size
    img = Image.new('RGBA', (size, size), (26, 26, 46, 255))  # #1a1a2e
    draw = ImageDraw.Draw(img)
    
    # Draw a rounded rectangle background
    margin = size // 20
    draw.rounded_rectangle([margin, margin, size-margin, size-margin], 
                         radius=size//10, fill=(26, 26, 46, 255))
    
    # Draw a simple gem shape
    center = size // 2
    gem_size = size // 3
    
    # Draw gem outline
    points = [
        (center, center - gem_size//2),  # top
        (center + gem_size//2, center),  # right
        (center, center + gem_size//2),  # bottom
        (center - gem_size//2, center),  # left
    ]
    
    # Draw gem with gradient effect
    for i, point in enumerate(points):
        next_point = points[(i + 1) % len(points)]
        draw.line([point, next_point], fill=(255, 255, 255, 255), width=3)
    
    # Fill the gem
    draw.polygon(points, fill=(100, 200, 255, 200))
    
    # Add text for larger icons
    if size >= 192:
        try:
            # Try to use a system font
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size//12)
        except:
            font = ImageFont.load_default()
        
        text = "GemCraft"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = (size - text_width) // 2
        text_y = size - text_height - size//20
        
        draw.text((text_x, text_y), text, fill=(160, 160, 160, 255), font=font)
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    # Create icons in different sizes
    sizes = [192, 512, 1024]
    
    for size in sizes:
        filename = f"icon-{size}.png"
        create_icon(size, filename)
    
    print("All icons created successfully!")

if __name__ == "__main__":
    main()
