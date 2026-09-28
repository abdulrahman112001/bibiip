import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import { SoundProvider } from "@/lib/sound";
import { getSeoData, SITE_URL } from "@/lib/seo";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSeoData();
  const title = seo.metaTitle.ar;
  const description = seo.metaDescription.ar;
  const canonical = seo.canonicalUrl || SITE_URL;
  const keywords = seo.keywords.ar
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    applicationName: seo.siteName.ar,
    robots: seo.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: seo.siteName.ar,
      title,
      description,
      locale: "ar_EG",
      images: [{ url: seo.ogImage.ar, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.ogImage.ar],
      site: seo.twitterHandle || undefined,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { seo, brand } = await getSeoData();
  const canonical = seo.canonicalUrl || SITE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name.ar,
        url: canonical,
        logo: `${SITE_URL}${seo.ogImage.ar}`,
      },
      {
        "@type": "WebSite",
        name: seo.siteName.ar,
        url: canonical,
        inLanguage: "ar",
      },
    ],
  };

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
