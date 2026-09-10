import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StreamingProvider } from "@/contexts/streaming-context";
import { V0ApiKeyModalProvider } from "@/contexts/v0-api-key-modal-context";

export const metadata: Metadata = {
  title: "منصة v0 — مساحة العمل الذكية",
  description:
    "منصة عربية لإنشاء الواجهات والتجارب الرقمية باستخدام الذكاء الاصطناعي.",
};

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${GeistMono.variable} ${notoArabic.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          <SessionProvider>
            <SWRProvider>
              <V0ApiKeyModalProvider>
                <StreamingProvider>{children}</StreamingProvider>
              </V0ApiKeyModalProvider>
            </SWRProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
