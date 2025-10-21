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

// This query for the About page is still correct
export const aboutQuery = `*[_type == "about"][0] {
  _id,
  title,
  content,
  profileImage,
  email,
  instagram
}`;
