import type { MetadataRoute } from "next";
import { getSeoData, SITE_URL } from "@/lib/seo";

// عشان لو الأدمن غيّر noIndex أو الرابط الأساسي، robots.txt يتحدث فورًا من
// غير ما نحتاج نعمل build/deploy جديد (مش زي الصفحة الرئيسية اللي بتتحدث
// أوتوماتيك بالـ revalidatePath("/") بعد كل حفظ)
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSeoData();

  if (seo.noIndex) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
