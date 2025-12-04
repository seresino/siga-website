import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client, siteSettingsQuery, urlFor, getLogoUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";
import { Mail, Instagram } from "lucide-react";

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      try {
        const data = await client.fetch<SiteSettings>(siteSettingsQuery);
        setSettings(data);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    }
    getSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!settings || !settings.aboutTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
        <div className="text-center text-white">
          <h1 className="text-xl md:text-2xl mb-4">
            About Page Not Configured
          </h1>
          <p className="text-sm md:text-base">
            Please configure the About page content in 'Site Settings' in your
            Sanity CMS.
          </p>
        </div>
      </div>
    );
  }

  const profileImageUrl = settings.profileImage?.asset?._ref
    ? urlFor(settings.profileImage).width(400).height(400).url()
    : null;

  // Logo #3 (index 2) from Site Settings logos array
  const logo3 = settings.logos?.[2];
  const logo3Url = logo3?.file ? getLogoUrl(logo3.file) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="max-w-xl">
        {profileImageUrl && (
          <div className="mb-6 md:mb-8">
            <img
              src={profileImageUrl}
              alt={settings.profileImage?.alt || "Profile"}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto object-cover"
            />
          </div>
        )}

        <Link
          to="/"
          aria-label={
            settings.aboutTitle
              ? `${settings.aboutTitle} – Back to homepage`
              : "Back to homepage"
          }
          className="block mb-6 md:mb-8"
        >
          {logo3Url ? (
            <img
              src={logo3Url}
              alt={logo3?.name || settings.aboutTitle}
              className="mx-auto w-full max-w-[428px] h-auto"
            />
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white text-balance">
              {settings.aboutTitle}
            </h1>
          )}
        </Link>

        {settings.aboutContent && (
          <div className="md:space-y-2 md:text-lg text-white/90 text-sm">
            {settings.aboutContent.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {(settings.email || settings.instagram) && (
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6">
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="text-white/70 hover:text-white transition-colors underline"
              >
                <Mail />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors underline"
              >
                <Instagram />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
