import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  // --- THIS IS THE KEY CHANGE ---
  // It reads the variable from your .env.local file
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-05-03",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export const projectsQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  slug,
  projectType,
  coverImage,
  order
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  projectType,
  coverImage,
  content,
  videos[],
  gallery[]
}`;

// Query for site-wide settings (includes About page content)
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  siteName,
  email,
  instagram,
  videoReelUrl,
  logos[]{
    _key,
    name,
    description,
    "file": file.asset->
  },
  favicon,
  aboutTitle,
  profileImage,
  aboutContent
}`;
// Helper to get logo file URL from Sanity
export function getLogoUrl(logoAsset: any): string | null {
  if (!logoAsset?._ref && !logoAsset?.url) return null;
  // If it's already a URL, return it
  if (logoAsset.url) return logoAsset.url;
  // Otherwise construct the URL from the asset reference
  const ref = logoAsset._ref;
  if (!ref) return null;
  const [_file, id, extension] = ref.split('-');
  return `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${id}.${extension}`;
}
