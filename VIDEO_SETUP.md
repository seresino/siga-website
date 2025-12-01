# Video Background Setup Guide

## 🎥 Two Options for Video Background

### Option 1: Vimeo Embed (Currently Active) 🌐

**Best for:** Easy updates, client can change video without developer help

#### Setup Steps:
1. Upload your video to Vimeo
2. Get the video ID from the URL:
   - Example: `https://vimeo.com/123456789` → ID is `123456789`
3. In `src/pages/HomePage.tsx`, replace `VIMEO_VIDEO_ID` with your actual ID:
   ```tsx
   src="https://player.vimeo.com/video/123456789?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
   ```

**Pros:**
- Easy to update (just change video ID)
- No large files in your repo
- Client can update without redeploying

**Cons:**
- Requires internet connection
- Slight delay on initial load
- Depends on Vimeo's availability

**Vimeo Settings:**
- Use `background=1` parameter for clean autoplay
- Video will be muted by default (required for autoplay)
- Consider using Vimeo's privacy settings appropriately

---

### Option 2: HTML5 Video (Better Performance) ⚡

**Best for:** Smooth playback, faster loading, no external dependencies

#### Setup Steps:

1. **Prepare Your Video Files:**
   - Export video in multiple formats for browser compatibility:
     - **MP4** (H.264 codec) - Most compatible
     - **WebM** (VP9 codec) - Better quality/size ratio, modern browsers
   
   Recommended specs:
   - Resolution: 1920x1080 (Full HD) 
   - Bitrate: 3-5 Mbps for MP4
   - Keep file size under 10MB if possible (compress for web)

2. **Create video folder in public:**
   ```bash
   mkdir public/video
   ```

3. **Add your video files:**
   ```
   public/
   └── video/
       ├── reel.mp4
       └── reel.webm
   ```

4. **In `src/pages/HomePage.tsx`, comment out Vimeo and uncomment HTML5:**
   ```tsx
   {/* Comment out Vimeo iframe */}
   {/*
   <iframe
     src="https://player.vimeo.com/video/VIMEO_VIDEO_ID?..."
     ...
   />
   */}
   
   {/* Uncomment this: */}
   <video
     autoPlay
     loop
     muted
     playsInline
     className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
   >
     <source src="/video/reel.mp4" type="video/mp4" />
     <source src="/video/reel.webm" type="video/webm" />
   </video>
   ```

**Pros:**
- Faster loading (no external API calls)
- Smoother playback
- Works offline
- Better performance on mobile

**Cons:**
- Larger file in your repository
- Need to redeploy to change video
- Need to optimize/compress video yourself

---

## 🎨 Customization Options

### Adjust Video Overlay Darkness

In `src/pages/HomePage.tsx`, find this line:
```tsx
<div className="absolute inset-0 bg-black/30" />
```

Change the opacity number (0-100):
- `bg-black/10` - Very light overlay (logo needs to be dark)
- `bg-black/30` - Current setting (balanced)
- `bg-black/50` - Darker overlay (better logo visibility)
- `bg-black/70` - Very dark overlay

### Adjust Logo Size

Find this line:
```tsx
className="max-w-[80vw] max-h-[40vh] w-auto h-auto object-contain"
```

Adjust the max width/height:
- `max-w-[80vw]` - Logo takes up to 80% of screen width
- `max-h-[40vh]` - Logo takes up to 40% of screen height
- Increase/decrease these percentages as needed

---

## 📱 Mobile Optimization

Both options work on mobile, but:

**For Vimeo:**
- Vimeo handles mobile optimization automatically
- May load slower on mobile data

**For HTML5:**
- Consider creating a mobile-optimized version (lower resolution/bitrate)
- Add mobile-specific source:
  ```tsx
  <video>
    <source src="/video/reel-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
    <source src="/video/reel.mp4" type="video/mp4" />
  </video>
  ```

---

## 🚀 Recommendations

**For Siga:**
- **Start with Vimeo** (currently set up) - easier for client to update
- **If performance is critical** or video won't change often, switch to HTML5
- **Test on mobile** before launching to ensure smooth playback

---

## 🔄 Restoring Projects Later

When ready to add projects:

1. **Uncomment navigation** in `src/components/Layout.tsx`:
   ```tsx
   <MobileSidebar />
   <DesktopSidebar />
   ```

2. **Replace HomePage** with original code (commented out in the file)

3. **Add projects** in Sanity Studio

Everything is preserved and ready to restore! 🎉
