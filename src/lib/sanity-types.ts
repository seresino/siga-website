export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

// Keep this for the About page
export interface About {
  _id: string;
  title: string;
  content: string;
  profileImage?: SanityImage;
  email: string;
  instagram: string;
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
  projectType: "film" | "code";
  coverImage: SanityImage;
  order: number; // Display order on homepage
  content: any[]; // Portable Text content
  videos?: ProjectVideo[]; // <-- NEW: Array of videos
  gallery?: GalleryImage[]; // <-- NEW: Array of gallery images
}
