import "server-only";
import { prisma } from "./prisma";
import * as staticContent from "./content";
import { contentSchemas } from "./contentSchemas";
import { normalizeSection } from "./normalizeContent";

type ContentKey = keyof typeof staticContent;

/**
 * بيجيب سكشن من قاعدة البيانات. لو مش موجود (أول تشغيل قبل الـ seed)
 * أو لو قاعدة البيانات مش متاحة لأي سبب، بيرجع النسخة الثابتة من
 * content.ts كـ fallback - عشان الموقع مايوقفش لو حصل أي مشكلة في الاتصال.
 */
export async function getContent<K extends ContentKey>(
  key: K
): Promise<(typeof staticContent)[K]> {
  try {
    const row = await prisma.contentSection.findUnique({ where: { key } });
    if (row) {
      const schema = contentSchemas[key as string];
      const data = row.data as Record<string, unknown>;
      return (schema ? normalizeSection(schema, data) : data) as (typeof staticContent)[K];
    }
  } catch (err) {
    console.error(`[getContent] فشل الاتصال بقاعدة البيانات لسكشن "${key}":`, err);
  }
  return staticContent[key];
}

/** بيجيب كل السكاشن مرة واحدة - مفيد في الصفحة الرئيسية عشان نعمل fetch واحد بدل 14 */
export async function getAllContent(): Promise<typeof staticContent> {
  const keys = Object.keys(staticContent) as ContentKey[];
  const entries = await Promise.all(
    keys.map(async (key) => [key, await getContent(key)] as const)
  );
  return Object.fromEntries(entries) as typeof staticContent;
}
