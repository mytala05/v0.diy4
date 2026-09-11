export const designStyles = [
  {
    id: "executive",
    label: "Executive",
    arabicLabel: "تنفيذي",
    description: "نظام عملي رصين لمساحات العمل والقرارات المهمة.",
    accent: "أزرق ملكي",
    version: "1.0.0",
    density: "comfortable",
    radius: "medium",
    motion: "standard",
  },
  {
    id: "modern-glass",
    label: "Modern Glass",
    arabicLabel: "زجاجي عصري",
    description: "طبقات شفافة هادئة ومساحات مرنة لواجهة معاصرة.",
    accent: "سماوي بارد",
    version: "1.0.0",
    density: "comfortable",
    radius: "large",
    motion: "expressive",
  },
  {
    id: "futuristic-ai",
    label: "Futuristic AI",
    arabicLabel: "ذكاء مستقبلي",
    description: "تباين تقني وحركة محسوبة لتجارب الذكاء الاصطناعي.",
    accent: "فيروزي كهربائي",
    version: "1.0.0",
    density: "compact",
    radius: "sharp",
    motion: "expressive",
  },
  {
    id: "minimal-pro",
    label: "Minimal Pro",
    arabicLabel: "احترافي بسيط",
    description: "حدود دقيقة ومساحات نظيفة تضع المحتوى أولًا.",
    accent: "رمادي حجري",
    version: "1.0.0",
    density: "compact",
    radius: "sharp",
    motion: "quiet",
  },
  {
    id: "premium-luxury",
    label: "Premium Luxury",
    arabicLabel: "فاخر راقٍ",
    description: "تفاصيل دافئة وعمق بصري لتجربة مميزة.",
    accent: "ذهبي هادئ",
    version: "1.0.0",
    density: "comfortable",
    radius: "large",
    motion: "quiet",
  },
] as const;

export const fontOptions = [
  {
    id: "cairo",
    label: "Cairo",
    arabicLabel: "كايرو",
    description: "حديث وواضح للعربية وواجهات المنتجات.",
    weights: "400 · 500 · 600 · 700",
    cssVariable: "--font-cairo",
  },
  {
    id: "noto",
    label: "Noto Sans Arabic",
    arabicLabel: "نوتو العربية",
    description: "متوازن للنصوص الطويلة والقراءة المريحة.",
    weights: "400 · 500 · 600 · 700",
    cssVariable: "--font-arabic",
  },
] as const;

export type DesignStyle = (typeof designStyles)[number]["id"];
export type FontFamily = (typeof fontOptions)[number]["id"];
export type Density = (typeof designStyles)[number]["density"];
export type MotionPreset = (typeof designStyles)[number]["motion"];

export type DesignPreferences = {
  style: DesignStyle;
  font_family: FontFamily;
};

export type ThemeSchema = {
  id: DesignStyle;
  version: string;
  density: Density;
  radius: string;
  motion: MotionPreset;
  metadata: { label: string; arabicLabel: string; description: string };
};

export function getTheme(style: DesignStyle): ThemeSchema {
  const theme =
    designStyles.find((item) => item.id === style) ?? designStyles[0];
  return {
    id: theme.id,
    version: theme.version,
    density: theme.density,
    radius: theme.radius,
    motion: theme.motion,
    metadata: {
      label: theme.label,
      arabicLabel: theme.arabicLabel,
      description: theme.description,
    },
  };
}

export function validateTheme(style: unknown): style is DesignStyle {
  return isDesignStyle(style) && Boolean(getTheme(style).version);
}

export function isDesignStyle(value: unknown): value is DesignStyle {
  return designStyles.some((style) => style.id === value);
}

export function isFontFamily(value: unknown): value is FontFamily {
  return fontOptions.some((font) => font.id === value);
}

export const defaultDesignPreferences: DesignPreferences = {
  style: "executive",
  font_family: "cairo",
};
