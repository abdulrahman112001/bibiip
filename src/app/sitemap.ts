import type { MetadataRoute } from "next";
import { getSeoData, SITE_URL } from "@/lib/seo";

// نفس سبب robots.ts - عشان تعديل الرابط الأساسي من لوحة التحكم يظهر فورًا
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getSeoData();
  const base = seo.canonicalUrl || SITE_URL;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
