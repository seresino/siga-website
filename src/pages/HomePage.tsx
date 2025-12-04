import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client, siteSettingsQuery } from "@/lib/sanity";
import type { SiteSettings } from "@/lib/sanity-types";

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try to trigger autoplay on mobile once the video is ready
    const tryPlay = () => {
      video.play().catch(() => {
        // Ignore autoplay errors; browser may still show poster with play button
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("canplay", tryPlay as any);
    };
  }, []);

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* HTML5 Video Background (from /public/video) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/home-placeholder.png"
          className="absolute top-1/2 left-1/2 w-auto h-auto min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/video/reel.mp4" type="video/mp4" />
          <source src="/video/reel.webm" type="video/webm" />
          {/* Fallback image if video cannot be played */}
          <img
            src="/home-placeholder.png"
            alt="Background placeholder"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Dark overlay for better logo visibility */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Centered Logo - Stretches to fill viewport like hungryman.com */}
      <div className="absolute inset-0 z-10 p-8 md:p-12">
        <svg
          viewBox="0 0 428 146"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-full"
          role="img"
          aria-label={
            settings?.siteName
              ? `${settings.siteName} – About page`
              : "About page"
          }
        >
          <path
            d="M1 144.4V116.8L42.8 70.6L2.6 30.6V1.60002L110.6 1.80001V32.8L68.6 32.6C66.6 32.6 63.9333 32.6 60.6 32.6C57.2667 32.4667 53.6 32.1334 49.6 31.6L80 63.8V71.6L43 114.2C47.2667 113.8 52.0667 113.533 57.4 113.4C62.8667 113.133 68 113 72.8 113H112V144.4H1ZM198.27 144.4H123.87V122.4L141.67 115.6V30.2L123.87 23.6V1.60002H198.27V23.6L180.47 30.2V115.6L198.27 122.4V144.4ZM220.556 144.4V1.60002H300.956V32.6H258.556V144.4H220.556ZM383.805 144.4L376.805 117.6H330.405L323.205 144.4H280.805L327.405 1.00002H378.805L426.005 144.4H383.805ZM362.605 62.6C361.938 60.0667 361.005 56.4667 359.805 51.8C358.605 47 357.405 42.0667 356.205 37C355.005 31.9334 354.071 27.8 353.405 24.6C352.871 27.8 352.005 31.8 350.805 36.6C349.738 41.4 348.605 46.1334 347.405 50.8C346.338 55.4667 345.405 59.4 344.605 62.6L338.405 86H368.805L362.605 62.6Z"
            className="transition-colors duration-300 fill-transparent stroke-white hover:fill-white/30 cursor-pointer focus:outline-none focus-visible:outline-none"
            strokeWidth={0.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            role="link"
            tabIndex={0}
            onClick={() => navigate("/about")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate("/about");
              }
            }}
            style={{ outline: "none" }}
          />
        </svg>
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
