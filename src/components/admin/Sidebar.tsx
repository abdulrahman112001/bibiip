"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLang } from "@/lib/i18n";
import { sectionLabels } from "@/lib/contentSchemas";

const overviewLabel = { en: "Overview", ar: "نظرة عامة" };
const sectionsLabel = { en: "Sections", ar: "السكاشن" };

const keys = Object.keys(sectionLabels);

export default function Sidebar({ topOffset }: { topOffset: number }) {
  const { t } = useLang();
  const pathname = usePathname();

  return (
    <aside
      className="fixed bottom-0 start-0 z-10 w-64 overflow-y-auto border-e border-border bg-white p-4"
      style={{ top: topOffset }}
    >
      <Link
        href="/admin"
        className={clsx(
          "block rounded-lg px-3 py-2 text-sm font-bold transition-colors",
          pathname === "/admin"
            ? "bg-brand-yellow text-brand-ink"
            : "text-slate-500 hover:bg-surface hover:text-brand-ink"
        )}
      >
        {t(overviewLabel)}
      </Link>

      <p className="mt-4 mb-1.5 px-3 text-xs font-bold text-slate-300">{t(sectionsLabel)}</p>

      <ul className="space-y-0.5">
        {keys.map((key) => {
          const href = `/admin/content/${key}`;
          const active = pathname === href;
          return (
            <li key={key}>
              <Link
                href={href}
                className={clsx(
                  "block rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                  active
                    ? "bg-brand-yellow text-brand-ink"
                    : "text-slate-500 hover:bg-surface hover:text-brand-ink"
                )}
              >
                {t(sectionLabels[key])}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
