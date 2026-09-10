export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const dictionary = {
  ar: {
    brand: "منصة v0",
    home: "الرئيسية",
    chats: "المحادثات",
    projects: "المشاريع",
    settings: "الإعدادات",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    signUp: "إنشاء حساب",
    search: "بحث",
    notifications: "الإشعارات",
    help: "مركز المساعدة",
    newChat: "محادثة جديدة",
    welcome: "مرحبًا بك في منصتك الذكية",
    description: "أنشئ واجهات وتجارب رقمية احترافية باستخدام الذكاء الاصطناعي.",
  },
  en: {
    brand: "v0 Platform",
    home: "Home",
    chats: "Chats",
    projects: "Projects",
    settings: "Settings",
    signIn: "Sign in",
    signOut: "Sign out",
    signUp: "Create account",
    search: "Search",
    notifications: "Notifications",
    help: "Help center",
    newChat: "New chat",
    welcome: "Welcome to your intelligent workspace",
    description:
      "Create polished digital experiences with artificial intelligence.",
  },
} as const;

export type TranslationKey = keyof typeof dictionary.ar;

export function getDictionary(locale: Locale = "ar") {
  return dictionary[locale];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export function localeDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}
