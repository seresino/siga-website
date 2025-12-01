# Landing Page Setup - Siga

## 🎬 Current Status

The site is configured as a **simple landing page** with:
- ✅ Video background (Vimeo reel)
- ✅ Centered logo
- ✅ No navigation
- ✅ No projects shown

This is temporary until the client has projects ready to showcase.

---

## 📝 To Set Up in Sanity

1. Go to **https://siga.sanity.studio**
2. Click **"Site Settings"**
3. Fill out:
   - **Site Name**: "Siga" (or client's preferred name)
   - **Video Reel URL**: Full Vimeo URL (e.g., `https://vimeo.com/123456789`)
   - **Upload Logos**: Add 1-3 logo variations (first one will be displayed)
   - Email and Instagram (optional - for future use)

---

## 🎥 Video Options

### Current: Vimeo (Recommended for Easy Updates)

The client can update the video reel by:
1. Uploading new video to Vimeo
2. Copying the Vimeo URL
3. Pasting into Sanity Site Settings → Video Reel URL
4. No code deployment needed!

See `VIDEO_SETUP.md` for alternative options (HTML5 video).

---

## 🔮 Future: Adding Projects

When the client is ready to add projects:

### 1. Restore Navigation
In `src/components/Layout.tsx`, uncomment:
```tsx
<MobileSidebar />
<DesktopSidebar />
```

### 2. Restore Project Grid Homepage
In `src/pages/HomePage.tsx`:
- Replace current simple landing page code
- Uncomment the "ORIGINAL PROJECT GRID CODE" section at the bottom

### 3. Add Projects in Sanity
- Create projects with Film/Code categories
- Add cover images, descriptions, etc.

Everything is already built and ready to go! 🎉

---

## 📁 Files Modified

- ✅ `src/pages/HomePage.tsx` - Landing page with video + logo
- ✅ `src/components/Layout.tsx` - Navigation hidden
- ✅ `sanity-studio/schemaTypes/siteSettings.ts` - Added video URL field
- ✅ All original code preserved in comments

---

## 🚀 Deployment

After setting up Sanity content:
1. Redeploy Sanity Studio: `cd sanity-studio && pnpm run deploy`
2. Frontend should work automatically (fetches from Sanity)

That's it! The landing page will show the Vimeo reel with the logo on top.
