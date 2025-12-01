# Logo and Favicon Usage Guide

## 📋 Logo Variations

Logos are stored in Sanity's "Site Settings" and can be accessed throughout your application.

### Accessing Logos in Components

```tsx
import { useState, useEffect } from "react";
import { client, siteSettingsQuery, getLogoUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";

export function MyComponent() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const data = await client.fetch<SiteSettings>(siteSettingsQuery);
      setSettings(data);
    }
    fetchSettings();
  }, []);

  // Get the first logo (primary logo)
  const primaryLogo = settings?.logos?.[0];
  const primaryLogoUrl = primaryLogo ? getLogoUrl(primaryLogo.file) : null;

  // Or find a specific logo by name
  const darkLogo = settings?.logos?.find(logo => logo.name === "Dark Version");
  const darkLogoUrl = darkLogo ? getLogoUrl(darkLogo.file) : null;

  return (
    <div>
      {primaryLogoUrl && (
        <img src={primaryLogoUrl} alt={primaryLogo?.name || "Logo"} />
      )}
    </div>
  );
}
```

### Example: Display All Logo Variations

```tsx
{settings?.logos?.map((logo) => {
  const url = getLogoUrl(logo.file);
  return url ? (
    <div key={logo._key}>
      <img src={url} alt={logo.name} />
      <p>{logo.description}</p>
    </div>
  ) : null;
})}
```

## 🎨 Favicon Options

You have **two options** for managing your favicon:

### Option 1: Local Favicon (Recommended for Performance) ✅

**Best for:** Most websites, better performance, simpler setup

1. Replace `/public/favicon.svg` with your favicon file
2. Update `index.html` if using a different format:
   ```html
   <link rel="icon" type="image/png" href="/favicon.png" />
   ```

**Pros:**
- Faster load times (no API call needed)
- Works even if Sanity is down
- Browser caching is simpler

### Option 2: Dynamic Favicon from Sanity

**Best for:** Multi-tenant apps or if you need to change favicon without redeploying

1. Upload favicon in Sanity's "Site Settings"
2. Add this to your root component or `App.tsx`:

```tsx
import { useEffect, useState } from "react";
import { client, siteSettingsQuery, urlFor } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";

export function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const data = await client.fetch<SiteSettings>(siteSettingsQuery);
      setSettings(data);
    }
    fetchSettings();
  }, []);

  // Set dynamic favicon
  useEffect(() => {
    if (settings?.favicon?.asset?._ref) {
      const faviconUrl = urlFor(settings.favicon).width(32).height(32).url();
      
      // Update favicon link
      const link = document.querySelector("link[rel='icon']") || 
                   document.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('href', faviconUrl);
      
      if (!document.querySelector("link[rel='icon']")) {
        document.head.appendChild(link);
      }
    }
  }, [settings]);

  return <div>{/* Your app */}</div>;
}
```

**Pros:**
- Can change without redeploying
- Useful for white-label/multi-tenant apps

**Cons:**
- Slightly slower initial load
- Requires JavaScript to run

## 💡 Recommendation

- **Use Option 1 (local)** for the Siga template - simpler and faster
- Keep the favicon field in Sanity as **optional** for clients who want dynamic favicons
- Document both options so clients can choose based on their needs
