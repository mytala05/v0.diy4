"use client";

import {
  ArrowRight,
  Bell,
  Languages,
  Palette,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

type Preferences = {
  notifications_enabled: boolean;
  updates_enabled: boolean;
  locale: string;
};

const fetcher = async (url: string): Promise<Preferences> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load preferences");
  }
  const result = await response.json();
  return result.data;
};

const settings = [
  {
    key: "notifications",
    label: "إشعارات النشاط",
    description: "تلقي تحديثات حول المحادثات والمشاريع",
    icon: Bell,
  },
  {
    key: "updates",
    label: "تحديثات المنصة",
    description: "أخبار الميزات والتحسينات الجديدة",
    icon: ShieldCheck,
  },
] as const;

export default function SettingsPage() {
  const {
    data: preferences,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/user/preferences", fetcher);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    notifications: true,
    updates: false,
  });

  const updatePreference = async (
    key: "notifications" | "updates",
    value: boolean,
  ) => {
    const next = {
      notificationsEnabled:
        key === "notifications"
          ? value
          : (preferences?.notifications_enabled ?? true),
      updatesEnabled:
        key === "updates" ? value : (preferences?.updates_enabled ?? false),
      locale: preferences?.locale === "en" ? "en" : "ar",
    } as const;
    setEnabled((current) => ({ ...current, [key]: value }));
    await mutate(
      async () => {
        const response = await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }
        const result = await response.json();
        return result.data;
      },
      {
        optimisticData: {
          notifications_enabled: next.notificationsEnabled,
          updates_enabled: next.updatesEnabled,
          locale: next.locale,
        },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
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
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
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
        ) : error ? (
          <p className="text-destructive text-sm">تعذر تحميل التفضيلات.</p>
        ) : null}
        <div className="flex flex-col gap-1">
          {settings.map(({ key, label, description, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-xl px-2 py-4 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={
                  key === "notifications"
                    ? (preferences?.notifications_enabled ?? enabled[key])
                    : (preferences?.updates_enabled ?? enabled[key])
                }
                onChange={(event) => {
                  updatePreference(key, event.target.checked).catch(
                    () => undefined,
                  );
                }}
                aria-label={label}
                className="size-4 accent-primary"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-lg">المظهر واللغة</h2>
          <p className="text-muted-foreground text-sm">
            تفضيلات العرض الأساسية للمنصة.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Palette className="size-5 text-primary" />
            <div>
              <p className="font-medium">الوضع الداكن</p>
              <p className="text-muted-foreground text-sm">
                يمكن تغييره من زر المظهر
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Languages className="size-5 text-primary" />
            <div>
              <p className="font-medium">العربية RTL</p>
              <p className="text-muted-foreground text-sm">
                اللغة الافتراضية للمنصة
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
