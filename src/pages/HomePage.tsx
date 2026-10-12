import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { client, projectsQuery, urlFor } from "@/lib/sanity";
import type { Project } from "@/lib/sanity-types";

interface Tile {
  project: Project;
  clipUrl: string | null;
}

function ProjectTile({ tile }: { tile: Tile }) {
  const tileRef = useRef<HTMLAnchorElement>(null);
  const [activated, setActivated] = useState(false);

  // Only mount the <video> once the tile is near the viewport, so offscreen
  // clips never download. Once mounted it stays mounted to preserve the buffer.
  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { project, clipUrl } = tile;
  const imageUrl = project.coverImage?.asset?._ref
    ? urlFor(project.coverImage).width(800).height(450).url()
    : "/placeholder.svg";

  return (
    <Link
      ref={tileRef}
      to={`/${project.slug.current}`}
      className="group relative block aspect-video w-full overflow-hidden bg-black"
    >
      {activated && clipUrl ? (
        <video
          src={clipUrl}
          poster={imageUrl}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <img
          src={imageUrl}
          alt={project.coverImage?.alt || project.title}
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <h2 className="text-white text-sm md:text-base font-light uppercase tracking-widest drop-shadow-md opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          {project.title}
        </h2>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Flatten: one tile per preview clip. A project with no clips still gets
  // one tile using its cover image so it stays reachable. Memoized so the
  // random order and featured flags stay stable across re-renders.
  const tiles: Tile[] = useMemo(() => {
    const flat = projects
      .filter((project) => project.slug?.current)
      .flatMap((project): Tile[] => {
        const clips = (project.previewClipUrls ?? []).filter(
          (url): url is string => Boolean(url),
        );
        if (clips.length === 0) return [{ project, clipUrl: null }];
        return clips.map((clipUrl) => ({ project, clipUrl }));
      });

    // Shuffle with a greedy pass so a clip never sits directly next to
    // another clip from the same project (unless it can't be avoided).
    const pool = [...flat].sort(() => Math.random() - 0.5);
    const ordered: typeof flat = [];
    while (pool.length > 0) {
      const last = ordered[ordered.length - 1];
      const idx = pool.findIndex(
        (tile) => !last || tile.project._id !== last.project._id,
      );
      ordered.push(pool.splice(idx === -1 ? 0 : idx, 1)[0]);
    }

    return ordered;
  }, [projects]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black">
      <div className="grid grid-cols-1 gap-px">
        {tiles.map((tile, index) => (
          <ProjectTile key={`${tile.project._id}-${index}`} tile={tile} />
        ))}
      </div>
    </div>
  );
}
