import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavContent } from "@/components/NavContent";
import { client, siteSettingsQuery, getLogoUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";
import { cn } from "@/lib/utils";

export const SiteNav = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    "px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-white/20";
  const activeClass = "bg-white text-black hover:bg-white";

  return (
    <>
      {/* Logo - top center */}
      <Link
        to="/"
        onClick={() => setIsOpen(false)}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={siteSettings?.siteName || "Home"}
            className="h-8 md:h-10 w-auto"
          />
        ) : (
          <span className="text-white text-xl font-bold">
            {siteSettings?.siteName || "Client Name"}
          </span>
        )}
      </Link>

      {/* Pill nav - bottom center */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center divide-x divide-white/10 overflow-hidden rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(segmentClass, isOpen && activeClass)}
          >
            Projects
          </button>
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

      {/* Scrim */}
      {isOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 cursor-default bg-black/40"
        />
      )}

      {/* Slide-in drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 md:w-72 bg-black/60 backdrop-blur-md transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full overflow-y-auto no-scrollbar px-4 pb-24 pt-20">
          <NavContent onLinkClick={() => setIsOpen(false)} />
        </div>
      </aside>
    </>
  );
};
