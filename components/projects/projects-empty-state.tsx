import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";

export function ProjectsEmptyState() {
  const t = getDictionary("ar");
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FolderOpen className="size-12 text-muted-foreground" />
      <h3 className="mt-4 font-medium text-foreground"> {t.noProjectsYet}</h3>
      <p className="mt-1 text-muted-foreground text-sm">
        {t.createFirstProject}
      </p>
      <Button asChild className="mt-6">
        <Link href="/">
          <Plus className="me-2 h-4 w-4" />
          {t.newProject}
        </Link>
      </Button>
    </div>
  );
}
