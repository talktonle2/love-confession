# How to Add Your Photos

## Steps to Replace Placeholder Images

1. **Add your images to this folder:**
   - `kosal.jpg` (or `.png`, `.webp`)
   - `mengly.jpg` (or `.png`, `.webp`)

2. **Update `src/components/LovePairHero.jsx`:**

   Replace these lines (around line 7-10):
   ```javascript
   const kosalImg = "https://images.unsplash.com/...";
   const menglyImg = "https://images.unsplash.com/...";
   ```

   With:
   ```javascript
   import kosalImg from "../assets/kosal.jpg";
   import menglyImg from "../assets/mengly.jpg";
   ```

3. **Image Recommendations:**
   - **Format:** JPG, PNG, or WebP
   - **Size:** 200x200px to 400x400px (square or portrait)
   - **Quality:** High quality, clear faces
   - **Aspect Ratio:** Square (1:1) or Portrait (3:4) works best

4. **After adding images:**
   - Run `npm run build` to verify
   - The component will automatically crop/resize to fit

## Current Setup

The component currently uses placeholder images from Unsplash. Once you add your photos, they will replace the placeholders automatically.

## Features

- ✨ Beautiful gradient backgrounds
- 💗 Animated heart icons
- 🎨 Hover effects with glow
- 📱 Fully responsive
- 🌙 Dark mode support
