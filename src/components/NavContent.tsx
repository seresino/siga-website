import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { client, projectsQuery } from "@/lib/sanity";
import type { Project } from "@/lib/sanity-types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export const NavContent = ({
  onLinkClick,
  isMobile,
}: {
  onLinkClick?: () => void;
  isMobile?: boolean;
}) => {
  const { pathname } = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const fetchedProjects = await client.fetch<Project[]>(projectsQuery);
        setProjects(fetchedProjects || []);
      } catch (error) {
        console.error("Error fetching projects for navigation:", error);
      }
    }
    fetchProjects();
  }, []);

  const filmProjects = projects.filter((p) => p.projectType === "film");
  const codeProjects = projects.filter((p) => p.projectType === "code");

  const cardClassName = "rounded-md bg-black text-white";
  const textColor = "text-white";
  const separatorColor = "bg-white";

  return (
    <nav className="flex flex-col min-h-full space-y-2 py-4">
      {!isMobile && (
        <Card className={cardClassName}>
          <CardContent>
            <Link
              to="/"
              className="text-white text-xl text-left font-bold block hover:italic transition-colors"
            >
              ruby seresin
            </Link>
          </CardContent>
        </Card>
      )}
      {filmProjects.length > 0 && (
        <Card className={cardClassName}>
          <CardContent>
            <h3 className="font-medium text-sm tracking-wide">Film</h3>
            <Separator className={cn("my-2", separatorColor)} />
            <ul className="space-y-1.5">
              {filmProjects.map((project) => (
                <li key={project._id}>
                  <Link
                    to={`/film/${project.slug.current}`}
                    className={cn(
                      "block text-sm hover:italic transition-colors",
                      textColor,
                      pathname === `/film/${project.slug.current}` &&
                        "font-medium"
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
      )}

      {codeProjects.length > 0 && (
        <Card className={cardClassName}>
          <CardContent>
            <h3 className="font-medium text-sm tracking-wide">Code</h3>
            <Separator className={cn("my-2", separatorColor)} />
            <ul className="space-y-1.5">
              {codeProjects.map((project) => (
                <li key={project._id}>
                  <Link
                    to={`/code/${project.slug.current}`}
                    className={cn(
                      "block text-sm hover:italic transition-colors",
                      textColor,
                      pathname === `/code/${project.slug.current}` &&
                        "font-medium"
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
      )}

      <div className="flex-1" />

      <Card className={cardClassName}>
        <CardContent>
          <Link
            to="/about"
            className={cn(
              "block text-sm hover:italic transition-colors",
              textColor,
              pathname === "/about" && "font-medium"
            )}
            onClick={onLinkClick}
          >
            About
          </Link>

          <a
            href="https://instagram.com/rubyseresin"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block text-sm hover:italic transition-colors",
              textColor
            )}
          >
            Instagram
          </a>
          <a
            href="mailto:ruby.seresin@gmail.com"
            className={cn(
              "block text-sm hover:italic transition-colors",
              textColor
            )}
          >
            Email
          </a>
        </CardContent>
      </Card>
    </nav>
  );
};
