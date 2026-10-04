import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import { getSeoData, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

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
    verification: seo.googleSiteVerification
      ? { google: seo.googleSiteVerification }
      : undefined,
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

  const twitterUrl = seo.twitterHandle
    ? seo.twitterHandle.startsWith("http")
      ? seo.twitterHandle
      : `https://x.com/${seo.twitterHandle.replace(/^@/, "")}`
    : "";
  const sameAs = [
    seo.social.facebook,
    seo.social.instagram,
    seo.social.tiktok,
    seo.social.youtube,
    seo.social.linkedin,
    seo.social.whatsapp,
    twitterUrl,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: brand.name.ar,
        url: canonical,
        logo: `${SITE_URL}${seo.ogImage.ar}`,
        ...(seo.contactEmail ? { email: seo.contactEmail } : {}),
        ...(seo.contactPhone ? { telephone: seo.contactPhone } : {}),
        ...(sameAs.length ? { sameAs } : {}),
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
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
