import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { client, projectsQuery } from "@/lib/sanity";
import type { Project } from "@/lib/sanity-types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const { pathname } = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedProjects = await client.fetch<Project[]>(projectsQuery);
        setProjects(fetchedProjects || []);
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      }
    }
    fetchData();
  }, []);

  if (projects.length === 0) return null;

  return (
    <nav>
      <Card className="rounded-md bg-black text-white">
        <CardContent>
          <h3 className="font-medium text-sm tracking-wide">Projects</h3>
          <Separator className="my-2 bg-white" />
          <ul className="space-y-1.5">
            {projects.map((project) => (
              <li key={project._id}>
                <Link
                  to={`/${project.slug.current}`}
                  className={cn(
                    "block text-sm text-white hover:italic transition-colors",
                    pathname === `/${project.slug.current}` && "font-medium",
                  )}
                  onClick={onLinkClick}
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </nav>
  );
};
