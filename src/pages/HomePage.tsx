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
      
      {/* Dot Navigation Indicator */}
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

      {/* Scroll Down Chevron */}
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
