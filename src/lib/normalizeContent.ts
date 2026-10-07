import type { Field, FieldMap } from "./contentSchemas";

/**
 * حقول الصور والفيديوهات اتحولت من نص واحد (string) لكائن {en, ar} عشان يبقى
 * ممكن نرفع ملف مختلف لكل لغة. السكاشن القديمة المتخزّنة في قاعدة البيانات
 * (قبل التعديل ده) لسه فيها القيمة القديمة كنص واحد - الدالة دي بتحوّلها
 * تلقائيًا لما بتتقرا، عشان الموقع والداشبورد يشتغلوا صح من غير ما نحتاج
 * migration سكريبت يعدّل قاعدة البيانات نفسها.
 */
function normalizeValue(field: Field, value: unknown): unknown {
  switch (field.kind) {
    case "image":
    case "video": {
      if (typeof value === "string") return { en: value, ar: value };
      if (value && typeof value === "object") {
        const v = value as { en?: string; ar?: string };
        return { en: v.en ?? v.ar ?? "", ar: v.ar ?? v.en ?? "" };
      }
      return { en: "", ar: "" };
    }
    case "object": {
      const v = (value as Record<string, unknown>) ?? {};
      const out: Record<string, unknown> = { ...v };
      for (const [key, f] of Object.entries(field.fields)) out[key] = normalizeValue(f, v[key]);
      return out;
    }
    case "array": {
      const items = Array.isArray(value) ? value : [];
      if (field.of.kind !== "object") return items;
      const itemFields = field.of.fields;
      return items.map((item) => {
        let v = (item as Record<string, unknown>) ?? {};
        // ترحيل تلقائي: عناصر قديمة كانت بس {en, ar} خام (زي روابط الفوتر
        // قبل ما نضيفلها href) - لو السكيما الجديدة فيها حقل "label" بس
        // العنصر المتخزن شكله bilingual خام (en+ar على طول)، حطه تحت label
        if ("label" in itemFields && !("label" in v) && "en" in v && "ar" in v) {
          const bilingual = v as { en?: string; ar?: string };
          const isContactLink = bilingual.en === "Contact" || bilingual.ar === "تواصل معنا";
          v = { label: v, href: isContactLink ? "#contact" : "#" };
        }
        const out: Record<string, unknown> = { ...v };
        for (const [key, f] of Object.entries(itemFields)) out[key] = normalizeValue(f, v[key]);
        return out;
      });
    }
    default:
      return value;
  }
}

export function normalizeSection(
  schema: FieldMap,
  data: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };
  for (const [key, field] of Object.entries(schema)) {
    out[key] = normalizeValue(field, data[key]);
  }
  return out;
}
