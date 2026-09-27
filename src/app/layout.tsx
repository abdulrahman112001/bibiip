import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import { SoundProvider } from "@/lib/sound";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "بيب بيب | مشاوير، نقل، توصيل... كله بين ايديك",
  description:
    "بيب بيب - تطبيق التوصيل والنقل المصري. اطلب مشوارك، انقل شحنتك، وتابع طلبك لحظة بلحظة. مشاوير، نقل، توصيل، وسوبر ماركت في تطبيق واحد.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <LanguageProvider>
          <SoundProvider>
            <SmoothScroll />
            {children}
          </SoundProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
