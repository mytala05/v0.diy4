"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
  type DesignStyle,
  type FontFamily,
  isDesignStyle,
  isFontFamily,
} from "@/lib/design-system";

type DesignPreferences = { style: DesignStyle; font_family: FontFamily };
type DesignContextValue = DesignPreferences & {
  preview: (preferences: DesignPreferences) => void;
  apply: (preferences: DesignPreferences) => Promise<void>;
};

const DesignContext = createContext<DesignContextValue | null>(null);

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSWR<{ data: DesignPreferences }>("/api/user/preferences");
  const [preferences, setPreferences] = useState<DesignPreferences>({
    style: "executive",
    font_family: "cairo",
  });

  useEffect(() => {
    if (
      data?.data &&
      isDesignStyle(data.data.style) &&
      isFontFamily(data.data.font_family)
    ) {
      setPreferences({
        style: data.data.style,
        font_family: data.data.font_family,
      });
    }
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.style = preferences.style;
    root.dataset.font = preferences.font_family;
  }, [preferences]);

  const value = useMemo<DesignContextValue>(
    () => ({
      ...preferences,
      preview: setPreferences,
      apply: async (next) => {
        const response = await fetch("/api/user/preferences", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            notificationsEnabled: true,
            updatesEnabled: false,
            locale: "ar",
            ...next,
          }),
        });
        if (!response.ok) {
          throw new Error("تعذر حفظ نمط التصميم");
        }
        setPreferences(next);
      },
    }),
    [preferences],
  );

  return (
    <DesignContext.Provider value={value}>{children}</DesignContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesignSystem must be used inside DesignSystemProvider");
  }
  return context;
}
