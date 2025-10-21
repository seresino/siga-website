import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client, projectBySlugQuery, urlFor } from "@/lib/sanity";
import type { Project } from "@/lib/sanity-types";
import { Button } from "@/components/ui/button";
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

  const headerImageUrl = project.coverImage?.asset?._ref
    ? urlFor(project.coverImage).width(1920).height(1080).url()
    : `/placeholder.svg`;

  return (
    <div>
      {/* Header Image Section */}
      <div className="relative h-dvh">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${headerImageUrl})` }}
        />
        <div className="absolute inset-0" />
        <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2">
          <Button
            variant="outline"
            className="cursor-pointer bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-6 py-2 md:px-8 md:py-3 text-sm md:text-base"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            Read More
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-black text-white py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Title and Portable Text Content */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 md:mb-8 text-center text-balance">
              {project.title}
            </h1>
            {project.content && (
              <div className="prose prose-invert prose-lg mx-auto text-white/80 space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
                <PortableText value={project.content} />
              </div>
            )}
          </div>

          {/* --- UPDATED: Photo Gallery Section --- */}
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

          {/* Videos Section */}
          {project.videos && project.videos.length > 0 && (
            <div className="space-y-8">
              {project.videos.map((video, index) => {
                const embedUrl = getVideoEmbedUrl(video.url);
                if (!embedUrl) return null; // Gracefully skip any invalid or non-YouTube/Vimeo URLs

                return (
                  <div key={index}>
                    <div className="relative aspect-video">
                      {" "}
                      {/* Responsive 16:9 aspect ratio */}
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
        </div>
      </div>
    </div>
  );
}
