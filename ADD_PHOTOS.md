# 📸 How to Add Your Photos - Kosal Sensok & Khun Mengly

## Quick Steps

### 1. Add Your Photos
Place your photos in the `src/assets/` folder:
- `kosal.jpg` (or `.png`, `.webp`) - Photo of Kosal Sensok
- `mengly.jpg` (or `.png`, `.webp`) - Photo of Khun Mengly

### 2. Update the Component
Open `src/components/LovePairHero.jsx` and replace lines 9-10:

**Before:**
```javascript
const kosalImg = "https://images.unsplash.com/...";
const menglyImg = "https://images.unsplash.com/...";
```

**After:**
```javascript
import kosalImg from "../assets/kosal.jpg";
import menglyImg from "../assets/mengly.jpg";
```

### 3. Done! ✅
Run `npm run build` to verify everything works.

---

## Image Requirements

### Recommended Specs:
- **Format:** JPG, PNG, or WebP
- **Size:** 300x300px to 500x500px (square works best)
- **Aspect Ratio:** 1:1 (square) or 3:4 (portrait)
- **Quality:** High resolution, clear face visible
- **File Size:** Under 500KB each (for fast loading)

### Tips:
- ✅ Use square or portrait photos
- ✅ Ensure faces are clearly visible
- ✅ Good lighting, clear background
- ✅ Professional or casual photos both work
- ❌ Avoid very wide landscape photos
- ❌ Avoid very dark or blurry images

---

## Current Status

✅ Component is ready and working
✅ Placeholder images are active
✅ Fallback avatars will show if images fail to load
✅ All animations and styling are complete

**Just add your photos and update the imports!**

---

## Testing

After adding your photos:
1. Run `npm run dev` to see changes
2. Check that images load correctly
3. Verify hover effects work
4. Test on mobile and desktop

---

## Need Help?

If images don't load:
- Check file paths are correct
- Ensure file names match exactly (case-sensitive)
- Verify images are in `src/assets/` folder
- Check browser console for errors
