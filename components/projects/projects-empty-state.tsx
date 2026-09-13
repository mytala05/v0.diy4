import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ProjectsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FolderOpen className="size-12 text-muted-foreground" />
      <h3 className="mt-4 font-medium text-foreground">لا توجد مشاريع بعد</h3>
      <p className="mt-1 text-muted-foreground text-sm">
        ابدأ بإنشاء مشروعك الأول.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">
          <Plus className="me-2 h-4 w-4" />
          مشروع جديد
        </Link>
      </Button>
    </div>
  );
}
