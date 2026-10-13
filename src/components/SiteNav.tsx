import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { client, siteSettingsQuery, getLogoUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";
import { cn } from "@/lib/utils";

export const SiteNav = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await client.fetch<SiteSettings>(siteSettingsQuery);
        setSiteSettings(settings);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const logo = siteSettings?.logos?.[0];
  const logoUrl = logo?.file ? getLogoUrl(logo.file) : null;

  const segmentClass =
    "cursor-pointer px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-white/20";
  const activeClass = "bg-white text-black hover:bg-white";

  return (
    <>
      {/* Logo - top center */}
      <Link to="/" className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={siteSettings?.siteName || "Home"}
            className="h-8 md:h-10 w-auto"
          />
        ) : siteSettings ? (
          <span className="text-white text-xl font-bold">
            {siteSettings.siteName}
          </span>
        ) : null}
      </Link>

      {/* Pill nav - bottom center */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center divide-x divide-white/10 overflow-hidden rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md">
          <Link
            to="/about"
            className={cn(segmentClass, pathname === "/about" && activeClass)}
          >
            About
          </Link>
          {siteSettings?.email ? (
            <a href={`mailto:${siteSettings.email}`} className={segmentClass}>
              Contact
            </a>
          ) : (
            <Link to="/about" className={segmentClass}>
              Contact
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};
