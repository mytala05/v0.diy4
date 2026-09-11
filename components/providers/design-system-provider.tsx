"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
  type DesignPreferences,
  defaultDesignPreferences,
  getTheme,
  isDesignStyle,
  isFontFamily,
} from "@/lib/design-system";

type DesignContextValue = DesignPreferences & {
  theme: ReturnType<typeof getTheme>;
  preview: (preferences: DesignPreferences) => void;
  resetPreview: () => void;
  apply: (preferences: DesignPreferences) => Promise<void>;
};

const DesignContext = createContext<DesignContextValue | null>(null);
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to load design preferences");
  }
  return (await response.json()).data as DesignPreferences;
};

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSWR<DesignPreferences>("/api/user/preferences", fetcher);
  const [saved, setSaved] = useState(defaultDesignPreferences);
  const [previewed, setPreviewed] = useState<DesignPreferences | null>(null);
  const preferences = previewed ?? saved;

  useEffect(() => {
    if (data && isDesignStyle(data.style) && isFontFamily(data.font_family)) {
      setSaved({ style: data.style, font_family: data.font_family });
    }
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = getTheme(preferences.style);
    root.dataset.style = preferences.style;
    root.dataset.font = preferences.font_family;
    root.dataset.density = theme.density;
    root.dataset.motion = theme.motion;
    root.dataset.themeVersion = theme.version;
  }, [preferences]);

  const value = useMemo<DesignContextValue>(
    () => ({
      ...preferences,
      theme: getTheme(preferences.style),
      preview: setPreviewed,
      resetPreview: () => setPreviewed(null),
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
          throw new Error("Unable to save design preferences");
        }
        setSaved(next);
        setPreviewed(null);
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
