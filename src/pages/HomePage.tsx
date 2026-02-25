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
          <source src="/video/sigareel.mp4" type="video/mp4" />
          <source src="/video/sigareel.webm" type="video/webm" />
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
          viewBox="0 0 1325 516"
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
            d="M174.103 513.787C139.186 513.787 108.707 507.369 82.7173 494.506C56.7015 481.643 36.4964 461.808 22.1018 435C11.2201 414.742 4.40581 382.282 1.63255 353.493C0.127067 337.804 11.5899 324.149 26.3278 324.149H82.4532C93.9953 324.149 103.794 332.706 106.62 344.671C108.179 351.3 110.371 357.322 113.197 362.71C118.69 373.222 126.112 384.553 136.413 389.149C145.023 393.005 147.083 393.401 157.648 394.563C169.296 395.831 179.148 392.767 187.071 389.202C194.995 385.636 200.964 380.644 205.031 374.279C209.099 367.913 211.106 360.597 211.106 352.304C211.106 344.697 209.178 338.042 205.295 332.363C201.413 326.658 195.074 321.455 186.252 316.78C177.431 312.079 160.58 303.997 145.631 300.193L124.924 293.326C89.4524 283.95 61.5085 267.891 41.0921 245.203C20.6492 222.516 10.4542 191.613 10.4542 152.497C10.4542 120.75 17.3741 100.915 31.2404 77.0911C45.1067 53.2939 64.229 34.7263 88.6072 21.441C112.985 8.15582 141.114 1.5 172.967 1.5C204.82 1.5 233.662 8.26147 257.327 21.7844C280.992 35.3073 299.269 54.2976 312.132 78.7815C320.769 95.2097 326.553 105.563 329.485 125.689C331.835 141.88 320.267 156.538 304.974 156.538H247.449C236.62 156.538 227.244 148.958 223.784 137.971C221.354 130.258 217.603 123.761 212.532 118.479C203.79 109.419 190.61 104.903 172.967 104.903C161.795 104.903 160.025 106.54 152.841 109.763C145.631 113.011 140.322 117.528 136.915 123.338C133.481 129.149 131.791 135.752 131.791 143.121C131.791 150.939 133.64 157.833 137.337 163.749C141.035 169.665 146.872 174.815 154.875 179.173C162.878 183.531 165.783 187.388 178.382 190.742L211.317 199.458C233.451 205.268 252.494 212.981 268.42 222.595C284.346 232.209 297.394 243.434 307.563 256.296C317.731 269.159 325.206 283.633 329.96 299.718C334.714 315.803 337.118 333.367 337.118 352.357C337.118 385.213 330.594 421.028 317.546 443.927C304.499 466.853 285.826 484.232 261.526 496.064C237.227 507.897 208.069 513.84 174.05 513.84L174.103 513.787Z M487.824 34.7263V481.195C487.824 495.88 476.705 507.765 462.997 507.765H403.57C389.862 507.765 378.743 495.88 378.743 481.195V34.7263C378.743 20.0413 389.862 8.15587 403.57 8.15587L462.997 8.15587C476.705 8.15587 487.824 20.0413 487.824 34.7263Z M729.732 514.474C690.668 514.474 656.333 504.146 626.725 483.466C597.117 462.785 574.033 433.336 557.473 395.118C540.912 356.9 532.645 311.524 532.645 258.99C532.645 206.457 541.52 157.331 559.242 119.007C576.965 80.6831 600.683 51.4979 630.396 31.504C660.083 11.5101 693.045 1.5 729.203 1.5C752.974 1.5 775.055 5.69951 795.497 14.0721C815.914 22.4447 834.059 34.3565 849.906 49.7811C865.753 65.2057 878.484 83.3772 888.098 104.269C893.301 115.573 897.421 143.306 900.432 155.799C904.5 172.623 892.614 189.025 876.371 189.025H803.817C793.886 189.025 785.065 182.633 781.024 172.94C780.047 170.616 778.99 168.371 777.802 166.232C774.104 159.523 771.595 154.373 766.497 149.301C761.875 144.679 759.392 141.404 747.19 137.337C742.092 135.646 740.904 135.462 732.267 135.462C714.096 135.462 707.176 135.514 694.208 146.343C681.239 157.199 676.67 162.323 669.935 182.898C663.173 203.472 659.819 228.168 659.819 257.01C659.819 285.851 663.068 311.339 669.539 332.125C676.01 352.911 685.597 368.838 698.301 379.905C711.006 390.971 716.922 396.491 735.806 396.491C752.367 396.491 761.241 393.48 772.308 387.432C783.374 381.384 791.641 372.853 797.135 361.786C802.629 350.719 805.376 348.263 805.376 333.287H764.728C751.02 333.314 739.874 321.428 739.874 306.743V255.398C739.874 240.713 750.993 228.828 764.701 228.828H885.827C899.534 228.828 910.654 240.713 910.654 255.398V297.895C910.654 343.509 902.915 382.44 887.438 414.742C871.96 447.044 850.593 471.739 823.309 488.854C796.052 505.942 764.86 514.5 729.758 514.5L729.732 514.474Z M1184.57 8.15576L1049.66 8.15576C1045.43 8.15576 1041.68 11.5365 1040.36 16.5548L916.28 491.918C914.246 499.762 918.947 507.791 925.577 507.791H1026.84C1031.2 507.791 1035.03 504.226 1036.22 499.023L1046.75 453.541C1052.46 428.899 1070.6 411.916 1091.26 411.916H1145.75C1166.27 411.916 1184.33 428.687 1190.15 453.118L1201.11 499.128C1202.32 504.279 1206.15 507.818 1210.46 507.818H1313.23C1319.91 507.818 1324.61 499.683 1322.47 491.838L1193.82 16.4227C1192.47 11.4837 1188.75 8.15576 1184.57 8.15576ZM1078.48 232.578C1092.21 190.293 1140.09 189.316 1154.94 230.994C1166.96 264.695 1147.41 302.702 1117.75 303.415C1088.01 304.102 1067.33 266.861 1078.48 232.578Z"
            className="transition-colors duration-300 fill-transparent stroke-white hover:fill-white cursor-pointer focus:outline-none focus-visible:outline-none"
            strokeWidth={2}
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
