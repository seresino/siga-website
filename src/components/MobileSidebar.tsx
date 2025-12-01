import { useState, useEffect } from "react";
import { NavContent } from "@/components/NavContent";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { client, siteSettingsQuery } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";

export const MobileSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

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

  return (
    <div className="md:hidden">
      {/* Header Bar - Always Visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent p-4">
        <Card className="rounded-md bg-black text-white">
          <CardContent>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {siteSettings?.siteName || "Client Name"}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-sm font-medium uppercase tracking-wider hover:opacity-70 transition-opacity"
              >
                {isMobileMenuOpen ? "CLOSE" : "MENU"}
              </button>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Full-Screen Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-transparent overflow-y-auto pt-16">
          <div className="px-4 py-6">
            <NavContent
              isMobile
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
