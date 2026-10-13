import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { client, projectBySlugQuery, urlFor } from "@/lib/sanity";
import type { Project, ChooseGallery } from "@/lib/sanity-types";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";

// A smart helper function that handles both YouTube and Vimeo URLs
const getVideoEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  let videoId: string | null = null;

  // Try to parse YouTube URLs (handles various formats)
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch && youtubeMatch[1]) {
    videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If not YouTube, try to parse Vimeo URLs
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    videoId = vimeoMatch[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // If neither service is matched, return null
  return null;
};

// A labelled gallery where numbered pills switch between pieces of content
// (e.g. "Choose film" → multiple videos, "Choose stills" → multiple images)
function ChooseGallerySection({ gallery }: { gallery: ChooseGallery }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = gallery.items ?? [];
  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const embedUrl =
    active._type === "vimeoVideo" && active.url
      ? getVideoEmbedUrl(active.url)
      : null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-sm uppercase tracking-widest text-white/60">
          {gallery.title}
        </span>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <button
              key={item._key ?? index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors",
                index === activeIndex
                  ? "border-white bg-white text-black"
                  : "border-white/30 text-white hover:border-white",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      {active._type === "image" && active.asset?._ref ? (
        <div>
          <div className="relative aspect-video overflow-hidden rounded-md bg-white/5">
            <img
              src={urlFor(active).width(1600).url()}
              alt={active.alt || gallery.title}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          {active.caption && (
            <p className="text-center text-sm text-white/60 mt-2">
              {active.caption}
            </p>
          )}
        </div>
      ) : active._type === "videoFile" && active.fileUrl ? (
        <div>
          <div className="relative aspect-video overflow-hidden rounded-md bg-white/5">
            <video
              key={active._key}
              src={active.fileUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {active.caption && (
            <p className="text-center text-sm text-white/60 mt-3">
              {active.caption}
            </p>
          )}
        </div>
      ) : embedUrl ? (
        <div>
          <div className="relative aspect-video overflow-hidden rounded-md bg-white/5">
            <iframe
              key={activeIndex}
              src={embedUrl}
              title={active.caption || gallery.title}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          {active.caption && (
            <p className="text-center text-sm text-white/60 mt-3">
              {active.caption}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function getProject() {
      try {
        const data = await client.fetch<Project>(projectBySlugQuery, { slug });
        if (!data) {
          navigate("/404", { replace: true });
        } else {
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }
    getProject();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center text-white">
        Loading project...
      </div>
    );
  }

  if (!project) {
    // This will show briefly before the navigate('/404') kicks in if a project is not found.
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center text-white">
        Project not found.
      </div>
    );
  }

  const chooseGalleries = (project.chooseGalleries ?? []).filter(
    (g) => (g.items ?? []).length > 0,
  );
  const videos = project.videos ?? [];
  const mainVideo = videos[0];
  const mainEmbedUrl =
    chooseGalleries.length === 0 && mainVideo
      ? getVideoEmbedUrl(mainVideo.url)
      : null;
  const extraVideos = chooseGalleries.length === 0 ? videos.slice(1) : videos;
  const coverImageUrl = project.coverImage?.asset?._ref
    ? urlFor(project.coverImage).width(1600).url()
    : null;

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Back to homepage */}
      <Link
        to="/"
        aria-label="Back to homepage"
        className="fixed top-4 left-4 z-50 text-white drop-shadow-md transition-opacity hover:opacity-60"
      >
        <ArrowLeft className="h-7 w-7" strokeWidth={1.5} />
      </Link>

      <div className="px-4 md:px-8 pt-20 md:pt-24 pb-16">
        {/* Player: choose galleries, or the single film, or cover image */}
        <div className="mx-auto w-full">
          {chooseGalleries.length > 0 ? (
            <div
              className={cn(
                chooseGalleries.length > 1 &&
                  "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8",
              )}
            >
              {chooseGalleries.map((gallery) => (
                <ChooseGallerySection key={gallery._key} gallery={gallery} />
              ))}
            </div>
          ) : mainEmbedUrl ? (
            <div>
              <div className="relative h-[70svh]">
                <iframe
                  src={mainEmbedUrl}
                  title={mainVideo?.caption || project.title}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              {mainVideo?.caption && (
                <p className="text-center text-sm text-white/60 mt-3">
                  {mainVideo.caption}
                </p>
              )}
            </div>
          ) : coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={project.coverImage?.alt || project.title}
              className="h-[70svh] w-full object-cover"
            />
          ) : null}
        </div>

        {/* Additional Videos */}
        <div className="mx-auto mt-10 md:mt-12 max-w-4xl space-y-10 md:space-y-12">
          {extraVideos.length > 0 && (
            <div className="space-y-8">
              {extraVideos.map((video, index) => {
                const embedUrl = getVideoEmbedUrl(video.url);
                if (!embedUrl) return null; // Gracefully skip any invalid or non-YouTube/Vimeo URLs

                return (
                  <div key={index}>
                    <div className="relative aspect-video">
                      <iframe
                        src={embedUrl}
                        title={
                          video.caption || `${project.title} Video ${index + 1}`
                        }
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                    {video.caption && (
                      <p className="text-center text-sm text-white/60 mt-3">
                        {video.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Photo Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {project.gallery.map((image, index) => {
                const totalImages = project.gallery!.length;
                // This is the magic: is the total odd, and is this the last item?
                const isLastAndOdd =
                  totalImages % 2 !== 0 && index === totalImages - 1;

                return (
                  <div
                    key={index}
                    // Apply 'md:col-span-2' only if the condition is true
                    className={cn(isLastAndOdd && "md:col-span-2")}
                  >
                    <img
                      src={urlFor(image)
                        .width(isLastAndOdd ? 1600 : 800)
                        .height(isLastAndOdd ? 900 : 600)
                        .url()}
                      alt={
                        image.alt ||
                        `${project.title} Gallery Image ${index + 1}`
                      }
                      className="w-full h-auto rounded-md object-cover"
                    />
                    {image.caption && (
                      <p className="text-center text-sm text-white/60 mt-2">
                        {image.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Title and Portable Text Content */}
        <div className="mx-auto mt-10 md:mt-12 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8 text-left text-balance">
            {project.title}
          </h1>
          {project.content && (
            <div className="prose prose-invert prose-lg mx-auto text-white/80 space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
              <PortableText value={project.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
