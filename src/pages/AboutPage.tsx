import { useState, useEffect } from "react";
import { client, aboutQuery, urlFor } from "@/lib/sanity";
import type { About } from "@/lib/sanity-types";
import { Mail, Instagram } from "lucide-react";

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAbout() {
      try {
        const data = await client.fetch<About>(aboutQuery);
        setAbout(data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }
    getAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="text-center text-white">
          <h1 className="text-xl md:text-2xl mb-4">About Page Not Found</h1>
          <p className="text-sm md:text-base">
            Please configure the 'About' page in your Sanity CMS.
          </p>
        </div>
      </div>
    );
  }

  const profileImageUrl = about.profileImage?.asset?._ref
    ? urlFor(about.profileImage).width(400).height(400).url()
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-xl">
        {profileImageUrl && (
          <div className="mb-6 md:mb-8">
            <img
              src={profileImageUrl}
              alt={about.profileImage?.alt || "Profile"}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8 text-white text-balance">
          {about.title}
        </h1>

        <div className="md:space-y-2 md:text-lg text-white/90 text-sm">
          {about.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
          <a
            href={`mailto:${about.email}`}
            className="text-white/70 hover:text-white transition-colors underline"
          >
            <Mail />
          </a>
          {about.instagram && (
            <a
              href={about.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors underline"
            >
              <Instagram />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
