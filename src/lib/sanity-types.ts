export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

// Logo variation object
export interface Logo {
  _key: string;
  name: string;
  description?: string;
  file: {
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
}

// A team member shown on the About page
export interface TeamMember {
  _key: string;
  name: string;
  role?: string;
  photo?: SanityImage;
  bio?: any[]; // Portable Text content
}

// Site-wide settings (includes About page content)
export interface SiteSettings {
  _id: string;
  siteName: string;
  email?: string;
  instagram?: string;
  videoReelUrl?: string;
  // Branding assets
  logos?: Logo[];
  favicon?: SanityImage;
  // About page fields
  aboutTitle?: string;
  profileImage?: SanityImage;
  aboutContent?: string;
  team?: TeamMember[];
}

// A new type for our gallery images, which include a caption
export interface GalleryImage extends SanityImage {
  caption?: string;
}

// A new type for our video objects
export interface ProjectVideo {
  _type: "video";
  url: string;
  caption?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  coverImage: SanityImage;
  previewClipUrls?: string[]; // Resolved CDN URLs for the homepage grid clips
  order: number; // Display order on homepage
  content: any[]; // Portable Text content
  videos?: ProjectVideo[]; // <-- NEW: Array of videos
  gallery?: GalleryImage[]; // <-- NEW: Array of gallery images
}
