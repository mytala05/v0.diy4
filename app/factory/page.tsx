import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Play,
  Plus,
} from "lucide-react";
import Link from "next/link";

const jobs = [
  {
    name: "صفحة هبوط SaaS",
    status: "جاهز للمراجعة",
    time: "منذ 4 دقائق",
    tone: "text-emerald-400",
  },
  {
    name: "لوحة تحليلات العملاء",
    status: "قيد التوليد",
    time: "منذ 12 دقيقة",
    tone: "text-amber-400",
  },
  { name: "متجر إلكتروني", status: "مكتمل", time: "أمس", tone: "text-sky-400" },
];

export default function FactoryPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="العودة"
          >
            <ArrowRight className="size-5" />
          </Link>
          <div>
            <p className="text-muted-foreground text-sm">مساحة العمل</p>
            <h1 className="font-semibold text-2xl">Factory</h1>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
        >
          <Plus className="size-4" />
          مهمة جديدة
        </button>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">إجمالي المهام</p>
          <p className="mt-2 font-semibold text-3xl">24</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">قيد التنفيذ</p>
          <p className="mt-2 font-semibold text-3xl text-amber-400">3</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-muted-foreground text-sm">معدل النجاح</p>
          <p className="mt-2 font-semibold text-3xl text-emerald-400">98%</p>
        </div>
      </section>
      <section className="rounded-xl border bg-card">
        <div className="flex items-center gap-3 border-b p-5">
          <Boxes className="size-5 text-primary" />
          <div>
            <h2 className="font-semibold">خط الإنتاج</h2>
            <p className="text-muted-foreground text-sm">
              تابع عمليات إنشاء المشاريع في مكان واحد.
            </p>
          </div>
        </div>
        <div className="divide-y">
          {jobs.map((job) => (
            <div
              key={job.name}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-2 rounded-full bg-current ${job.tone}`}
                />
                <div>
                  <p className="font-medium">{job.name}</p>
                  <p className="text-muted-foreground text-sm">{job.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={job.tone}>{job.status}</span>
                {job.status === "قيد التوليد" ? (
                  <Clock3 className="size-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                )}
                <button
                  type="button"
                  className="rounded-md border px-3 py-1.5 hover:bg-muted"
                >
                  <Play className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
