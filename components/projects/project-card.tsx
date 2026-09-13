import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { ProjectThumbnail } from "./project-thumbnail";
import { formatRelativeTime } from "./utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = getDictionary("ar");
  return (
    <Link href={`/chats/${project.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
        <ProjectThumbnail demoUrl={project.demoUrl} name={project.name} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-medium text-foreground transition-colors group-hover:text-primary">
              {project.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{t.projectOptions}</span>
            </Button>
          </div>
          <p className="mt-1 text-muted-foreground text-sm">
            {t.lastEdited} {formatRelativeTime(project.updatedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
