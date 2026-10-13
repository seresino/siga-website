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

  // Interleave clips round-robin across projects so tiles from the same
  // project are always separated by the other projects' tiles. Clip order
  // within each project and the project order each round are shuffled, so
  // it still feels random — just never clustered.
  const tiles: Tile[] = useMemo(() => {
    const remaining = projects
      .filter((project) => project.slug?.current)
      .map((project) => {
        const clips = (project.previewClipUrls ?? []).filter(
          (url): url is string => Boolean(url),
        );
        // Projects with no clips still get one cover-image tile.
        const queue: (string | null)[] = clips.length ? clips : [null];
        return {
          project,
          queue: queue.sort(() => Math.random() - 0.5),
        };
      })
      .sort(() => Math.random() - 0.5);

    const ordered: Tile[] = [];
    while (remaining.length > 0) {
      for (const entry of [...remaining].sort(() => Math.random() - 0.5)) {
        const clipUrl = entry.queue.shift();
        if (clipUrl !== undefined) {
          ordered.push({ project: entry.project, clipUrl });
        }
        if (entry.queue.length === 0) {
          remaining.splice(remaining.indexOf(entry), 1);
        }
      }
    }
    return ordered;
  }, [projects]);

  // Mobile: one tile per project (cover image only), so no repeated images.
  const mobileTiles: Tile[] = projects
    .filter((project) => project.slug?.current)
    .map((project) => ({ project, clipUrl: null }));

  if (loading) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black">
      {/* Mobile: one cover tile per project */}
      <div className="grid grid-cols-1 gap-px md:hidden">
        {mobileTiles.map((tile) => (
          <ProjectTile key={tile.project._id} tile={tile} />
        ))}
      </div>

      {/* Desktop: one tile per preview clip */}
      <div className="hidden md:grid grid-cols-1 gap-px">
        {tiles.map((tile, index) => (
          <ProjectTile key={`${tile.project._id}-${index}`} tile={tile} />
        ))}
      </div>
    </div>
  );
}
