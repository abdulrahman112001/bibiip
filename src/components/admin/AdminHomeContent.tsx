"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { sectionLabels } from "@/lib/contentSchemas";

const pageTitle = { en: "Site Content", ar: "محتوى الموقع" };
const pageBody = {
  en: "Pick a section below and edit it — any change saves and shows on the site instantly.",
  ar: "اختار سكشن تحته وعدّل عليه — أي تعديل بيتحفظ ويبان في الموقع فورًا.",
};
const updatedPrefix = { en: "Last updated:", ar: "آخر تعديل:" };
const neverEdited = { en: "Not edited yet", ar: "لسه من غير تعديل" };

export type SectionInfo = { key: string; updatedAt: string | null };

export default function AdminHomeContent({ sections }: { sections: SectionInfo[] }) {
  const { t, lang } = useLang();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-brand-ink">{t(pageTitle)}</h1>
      <p className="mt-1 text-sm text-slate-400">{t(pageBody)}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ key, updatedAt }) => (
          <Link
            key={key}
            href={`/admin/content/${key}`}
            className="rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h2 className="font-bold text-brand-ink">{t(sectionLabels[key] ?? { en: key, ar: key })}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {updatedAt
                ? `${t(updatedPrefix)} ${new Date(updatedAt).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}`
                : t(neverEdited)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
