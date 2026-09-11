export const designStyles = [
  {
    id: "executive",
    label: "Executive",
    arabicLabel: "تنفيذي",
    description: "رصين وواضح لمساحات العمل والقرارات المهمة.",
    accent: "أزرق ملكي",
  },
  {
    id: "modern-glass",
    label: "Modern Glass",
    arabicLabel: "زجاجي عصري",
    description: "شفافية هادئة وطبقات خفيفة لواجهة معاصرة.",
    accent: "سماوي بارد",
  },
  {
    id: "futuristic-ai",
    label: "Futuristic AI",
    arabicLabel: "ذكاء مستقبلي",
    description: "تباين تقني وحركة محسوبة لتجارب الذكاء الاصطناعي.",
    accent: "فيروزي كهربائي",
  },
  {
    id: "minimal-pro",
    label: "Minimal Pro",
    arabicLabel: "احترافي بسيط",
    description: "مساحات نظيفة وتركيز كامل على المحتوى.",
    accent: "رمادي حجري",
  },
  {
    id: "premium-luxury",
    label: "Premium Luxury",
    arabicLabel: "فاخر راقٍ",
    description: "تفاصيل دافئة وعمق بصري لمنتج مميز.",
    accent: "ذهبي هادئ",
  },
] as const;

export const fontOptions = [
  {
    id: "cairo",
    label: "Cairo",
    arabicLabel: "كايرو",
    description: "حديث وواضح للعربية",
  },
  {
    id: "noto",
    label: "Noto Sans Arabic",
    arabicLabel: "نوتو العربية",
    description: "متوازن للنصوص الطويلة",
  },
] as const;

export type DesignStyle = (typeof designStyles)[number]["id"];
export type FontFamily = (typeof fontOptions)[number]["id"];

export function isDesignStyle(value: unknown): value is DesignStyle {
  return designStyles.some((style) => style.id === value);
}

export function isFontFamily(value: unknown): value is FontFamily {
  return fontOptions.some((font) => font.id === value);
}
