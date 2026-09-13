import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/i18n";

interface ProjectsHeaderProps {
  projectCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProjectsHeader({
  projectCount,
  searchQuery,
  onSearchChange,
}: ProjectsHeaderProps) {
  const t = getDictionary("ar");
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-foreground">المشاريع</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {projectCount} {projectCount === 1 ? t.project : t.projectsCount}
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="me-2 h-4 w-4" />
            {t.newProject}
          </Link>
        </Button>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={t.searchProjects}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-10"
        />
      </div>
    </div>
  );
}
