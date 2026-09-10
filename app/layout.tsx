import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StreamingProvider } from "@/contexts/streaming-context";
import { V0ApiKeyModalProvider } from "@/contexts/v0-api-key-modal-context";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة v0 — مساحة العمل الذكية",
  description:
    "منصة عربية لإنشاء الواجهات والتجارب الرقمية باستخدام الذكاء الاصطناعي.",
};

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
      className={`${cairo.variable} ${GeistMono.variable}`}
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
