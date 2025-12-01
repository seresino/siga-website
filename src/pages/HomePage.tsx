import { useState, useEffect } from "react";
import { client, siteSettingsQuery, getLogoUrl } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await client.fetch<SiteSettings>(siteSettingsQuery);
        setSettings(data);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    }
    fetchSettings();
  }, []);

  // Get primary logo (first one in array)
  const primaryLogo = settings?.logos?.[0];
  const logoUrl = primaryLogo ? getLogoUrl(primaryLogo.file) : null;

  // Extract Vimeo video ID from URL
  const getVimeoId = (url: string | undefined): string | null => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const vimeoId = getVimeoId(settings?.videoReelUrl);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Option 1: Vimeo Embed - ID from Sanity Site Settings */}
        {vimeoId && (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "100vw",
              height: "56.25vw", // 16:9 aspect ratio
              minHeight: "100vh",
              minWidth: "177.77vh", // 16:9 aspect ratio
            }}
            frameBorder="0"
            allow="autoplay; fullscreen"
            title="Background Video"
          />
        )}

        {/* Option 2: HTML5 Video (Better Performance) - Uncomment and add video file to /public
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/video/reel.mp4" type="video/mp4" />
          <source src="/video/reel.webm" type="video/webm" />
        </video>
        */}

        {/* Dark overlay for better logo visibility */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Centered Logo - Stretches to fill viewport like hungryman.com */}
      <div className="absolute inset-0 z-10 p-8 md:p-12">
        <img
          src={"/logo-thin.svg"}
          alt={primaryLogo?.name || settings?.siteName || "Logo"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
        />
      </div>
    </div>
  );
}

/* ============================================
   ORIGINAL PROJECT GRID CODE (COMMENTED OUT)
   Uncomment this section when ready to show projects
   ============================================

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { client, projectsQuery, urlFor } from "@/lib/sanity";
import type { Project } from "@/lib/sanity-types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function getProjects() {
      try {
        const data = await client.fetch<Project[]>(projectsQuery);
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    getProjects();
  }, []);

  // Use Intersection Observer to accurately track which project is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = projectRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    // Observe all project elements
    projectRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [projects]);

  const scrollToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIndex = activeIndex + 1;
    const nextElement = projectRefs.current[nextIndex];

    if (nextElement) {
      nextElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-screen overflow-y-auto snap-y snap-mandatory"
    >
      {projects
        .filter((project) => project.slug && project.slug.current)
        .map((project, index) => {
          const imageUrl = project.coverImage?.asset?._ref
            ? urlFor(project.coverImage).width(1920).height(1080).url()
            : `/placeholder.svg`;

          return (
            <Link
              key={project._id}
              to={`/${project.projectType}/${project.slug.current}`}
              className="block relative h-dvh w-full cursor-pointer snap-start"
            >
              <div
                ref={(el) => { projectRefs.current[index] = el; }}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            </Link>
          );
        })}

      {/* Dot Navigation Indicator *\/}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {projects
          .filter((project) => project.slug && project.slug.current)
          .map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === activeIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
      </div>

      {/* Scroll Down Chevron *\/}
      {activeIndex < projects.filter((p) => p.slug && p.slug.current).length - 1 && (
        <button
          onClick={scrollToNext}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer hover:scale-110 transition-transform duration-200"
          aria-label="Scroll to next project"
        >
          <ChevronDown
            className="w-8 h-8 text-white animate-bounce"
            strokeWidth={1.5}
          />
        </button>
      )}
    </div>
  );
}

============================================ */
