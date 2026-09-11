"use client";

import {
  ArrowRight,
  Bell,
  Check,
  Languages,
  Palette,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type DesignStyle,
  designStyles,
  type FontFamily,
  fontOptions,
} from "@/lib/design-system";

type Preferences = {
  notifications_enabled: boolean;
  updates_enabled: boolean;
  locale: string;
  style: DesignStyle;
  font_family: FontFamily;
};
type SavePayload = {
  notificationsEnabled?: boolean;
  updatesEnabled?: boolean;
  locale?: "ar" | "en";
  style?: DesignStyle;
  fontFamily?: FontFamily;
};

const fetcher = async (url: string): Promise<Preferences> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("تعذر تحميل التفضيلات");
  }
  return (await response.json()).data;
};

export default function SettingsPage() {
  const {
    data: preferences,
    error,
    isLoading,
    mutate,
  } = useSWR<Preferences>("/api/user/preferences", fetcher);
  const [enabled, setEnabled] = useState({
    notifications: true,
    updates: false,
  });
  const [pending, setPending] = useState<{
    kind: "style" | "font";
    value: DesignStyle | FontFamily;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(next: SavePayload) {
    setSaving(true);
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          notificationsEnabled:
            preferences?.notifications_enabled ?? enabled.notifications,
          updatesEnabled: preferences?.updates_enabled ?? enabled.updates,
          locale: preferences?.locale === "en" ? "en" : "ar",
          style: preferences?.style ?? "executive",
          fontFamily: preferences?.font_family ?? "cairo",
          ...next,
        }),
      });
      if (!response.ok) {
        throw new Error("تعذر حفظ التفضيلات");
      }
      await mutate((await response.json()).data, { revalidate: false });
      setPending(null);
    } finally {
      setSaving(false);
    }
  }

  const activeStyle = preferences?.style ?? "executive";
  const activeFont = preferences?.font_family ?? "cairo";
  const pendingLabel = pending
    ? pending.kind === "style"
      ? designStyles.find((item) => item.id === pending.value)?.arabicLabel
      : fontOptions.find((item) => item.id === pending.value)?.arabicLabel
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="العودة للرئيسية"
        >
          <Link href="/">
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <div>
          <p className="text-muted-foreground text-sm">منصة v0</p>
          <h1 className="font-semibold text-2xl tracking-tight">
            الإعدادات والتفضيلات
          </h1>
        </div>
      </header>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-semibold text-lg">النمط والخطوط</h2>
          <p className="text-muted-foreground text-sm">
            خصص شكل مساحة العمل. المعاينة مؤقتة حتى تؤكد اختيارك.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {designStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setPending({ kind: "style", value: style.id })}
              className={`group flex min-h-40 flex-col justify-between rounded-2xl border p-4 text-start transition hover:-translate-y-1 hover:border-primary ${activeStyle === style.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "bg-background/50"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary text-xs">
                  {style.accent}
                </span>
                {activeStyle === style.id ? (
                  <Check className="size-4 text-primary" />
                ) : null}
              </div>
              <div>
                <p className="font-semibold">{style.arabicLabel}</p>
                <p className="mt-1 text-muted-foreground text-sm leading-6">
                  {style.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => setPending({ kind: "font", value: font.id })}
              className={`rounded-xl border p-4 text-start transition hover:border-primary ${activeFont === font.id ? "border-primary bg-primary/5" : ""}`}
            >
              <p
                className="font-semibold"
                style={{
                  fontFamily:
                    font.id === "cairo"
                      ? "var(--font-cairo)"
                      : "var(--font-arabic)",
                }}
              >
                {font.arabicLabel}
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                {font.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-lg">الإشعارات</h2>
          <p className="text-muted-foreground text-sm">
            تحكم في التنبيهات التي تظهر لك أثناء العمل.
          </p>
        </div>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">
            جارٍ تحميل التفضيلات...
          </p>
        ) : null}
        {error ? (
          <p className="text-destructive text-sm">تعذر تحميل التفضيلات.</p>
        ) : null}
        <div className="flex flex-col gap-1">
          {[
            {
              key: "notifications",
              label: "إشعارات النشاط",
              description: "تحديثات حول المحادثات والمشاريع",
              icon: Bell,
            },
            {
              key: "updates",
              label: "تحديثات المنصة",
              description: "أخبار الميزات والتحسينات الجديدة",
              icon: ShieldCheck,
            },
          ].map(({ key, label, description, icon: Icon }) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 rounded-xl px-2 py-4 hover:bg-muted/50"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="block text-muted-foreground text-sm">
                    {description}
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={
                  key === "notifications"
                    ? (preferences?.notifications_enabled ??
                      enabled.notifications)
                    : (preferences?.updates_enabled ?? enabled.updates)
                }
                onChange={(event) => {
                  const value = event.target.checked;
                  setEnabled((current) => ({ ...current, [key]: value }));
                  save(
                    key === "notifications"
                      ? { notificationsEnabled: value }
                      : { updatesEnabled: value },
                  ).catch(() => undefined);
                }}
                aria-label={label}
                className="size-4 accent-primary"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-5">
          <Palette className="size-5 text-primary" />
          <div>
            <p className="font-medium">الوضع الداكن</p>
            <p className="text-muted-foreground text-sm">
              يتبع إعداد المظهر الحالي
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-5">
          <Languages className="size-5 text-primary" />
          <div>
            <p className="font-medium">العربية RTL</p>
            <p className="text-muted-foreground text-sm">
              اللغة الافتراضية للمنصة
            </p>
          </div>
        </div>
      </section>

      <Dialog
        open={Boolean(pending)}
        onOpenChange={(open) => !open && setPending(null)}
      >
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد التغيير</DialogTitle>
            <DialogDescription>
              {pending?.kind === "style"
                ? "سيتم تطبيق هذا النمط على مساحة العمل بالكامل."
                : "سيتم استخدام هذا الخط في النصوص العربية."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border bg-muted/30 p-5 text-center">
            <p className="font-semibold text-lg">{pendingLabel}</p>
            <p className="mt-2 text-muted-foreground text-sm">
              يمكنك تغيير الاختيار لاحقًا من الإعدادات.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              إلغاء
            </Button>
            <Button
              disabled={saving}
              onClick={() => {
                if (!pending) {
                  return;
                }
                save(
                  pending.kind === "style"
                    ? { style: pending.value as DesignStyle }
                    : { fontFamily: pending.value as FontFamily },
                ).catch(() => undefined);
              }}
            >
              {saving ? "جارٍ الحفظ..." : "تطبيق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
