import "server-only";
import { cache } from "react";
import { getContent } from "./getContent";

export const SITE_URL = "https://www.bibiip.online";

/**
 * بيانات السيو والبراند مطلوبة في نفس الوقت في generateMetadata و RootLayout
 * (JSON-LD) - الـ cache() هنا بتضمن إن قاعدة البيانات تتقرا مرة واحدة بس لكل
 * ريكوست حتى لو الدالة دي اتنادت من أكتر من مكان.
 */
export const getSeoData = cache(async () => {
  const [seo, brand] = await Promise.all([getContent("seo"), getContent("brand")]);
  return { seo, brand };
});
