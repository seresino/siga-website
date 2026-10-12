import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client, siteSettingsQuery, urlFor } from "@/lib/sanity";
import type { SiteSettings, TeamMember } from "@/lib/sanity-types";
import { PortableText } from "@portabletext/react";
import { Instagram } from "lucide-react";

const bioComponents = {
  marks: {
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-white"
      >
        {children}
      </a>
    ),
  },
};

function TeamCard({ member }: { member: TeamMember }) {
  const photoUrl = member.photo?.asset?._ref
    ? urlFor(member.photo).width(480).height(640).url()
    : null;

  return (
    <div className="group outline-none" tabIndex={0}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-white/5">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={member.photo?.alt || member.name}
            className="h-full w-full object-cover"
          />
        )}
        {member.bio && member.bio.length > 0 && (
          <div className="absolute inset-0 translate-y-full overflow-y-auto bg-black/75 p-4 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
            <div className="space-y-2 text-xs leading-relaxed text-white/85">
              <PortableText value={member.bio} components={bioComponents} />
            </div>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium text-white">{member.name}</h3>
      {member.role && <p className="text-xs text-white/60">{member.role}</p>}
    </div>
  );
}

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

  return (
    <div className="px-4 md:px-8">
      <div className="max-w-xl mx-auto min-h-svh flex flex-col justify-center py-16">
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
          className="block mb-12"
        ></Link>

        {settings.aboutContent && (
          <div className="space-y-2 text-center text-lg text-white/90 text-sm">
            {settings.aboutContent.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {settings.instagram && (
          <div className="mt-8 flex flex-row gap-4 justify-center">
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

      {settings.team && settings.team.length > 0 && (
        <section className="mx-auto w-full max-w-6xl pb-24">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-light text-white">
            Team
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {settings.team.map((member) => (
              <TeamCard key={member._key} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
