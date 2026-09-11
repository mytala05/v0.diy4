import {
  Activity,
  ArrowRight,
  Database,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { designStyles } from "@/lib/design-system";

const metrics = [
  { label: "المستخدمون النشطون", value: "1,284", icon: Users },
  { label: "المحادثات اليوم", value: "3,842", icon: Activity },
  { label: "سلامة النظام", value: "99.98%", icon: ShieldCheck },
];

export default function AdmincpPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-2 hover:bg-muted"
          aria-label="العودة"
        >
          <ArrowRight className="size-5" />
        </Link>
        <div>
          <p className="text-muted-foreground text-sm">إدارة المنصة</p>
          <h1 className="font-semibold text-2xl">Admincp</h1>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              <Icon className="size-5 text-primary" />
            </div>
            <p className="mt-3 font-semibold text-3xl">{value}</p>
          </div>
        ))}
      </section>
      <section className="rounded-xl border bg-card p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">سجل الأنماط</h2>
            <p className="text-muted-foreground text-sm">
              إصدارات مسجلة وقابلة للمعاينة قبل التفعيل.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary text-xs">
            صلاحية الإدارة
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {designStyles.map((style) => (
            <div
              key={style.id}
              className="rounded-lg border bg-background/60 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{style.arabicLabel}</span>
                <span className="text-muted-foreground text-xs">
                  v{style.version}
                </span>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                {style.description}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-muted px-2 py-1 text-xs">
                متاح للمعاينة
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <Database className="size-5 text-primary" />
            <h2 className="font-semibold">حالة الخدمات</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex justify-between">
              <span>قاعدة البيانات</span>
              <span className="text-emerald-400">متصل</span>
            </div>
            <div className="flex justify-between">
              <span>خدمة التوليد</span>
              <span className="text-emerald-400">تعمل</span>
            </div>
            <div className="flex justify-between">
              <span>التخزين</span>
              <span className="text-emerald-400">متاح</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="size-5 text-primary" />
            <h2 className="font-semibold">آخر النشاطات</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <p>
              <span className="text-muted-foreground">منذ دقيقتين</span> — إنشاء
              مشروع جديد
            </p>
            <p>
              <span className="text-muted-foreground">منذ 8 دقائق</span> — تحديث
              إعدادات الأمان
            </p>
            <p>
              <span className="text-muted-foreground">منذ 14 دقيقة</span> —
              اكتمال عملية توليد
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
