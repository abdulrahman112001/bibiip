"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

const title = { en: "Beep Beep Dashboard", ar: "لوحة تحكم بيب بيب" };
const logoutLabel = { en: "Log out", ar: "تسجيل خروج" };

export default function AdminHeaderClient({
  email,
  onLogout,
}: {
  email?: string | null;
  onLogout: () => Promise<void>;
}) {
  const { t, lang, toggle } = useLang();

  return (
    <div className="flex h-full items-center justify-between px-6">
      <Link href="/admin" className="text-lg font-extrabold text-brand-ink">
        {t(title)}
      </Link>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle language"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:border-brand-yellow hover:text-brand-ink"
        >
          {lang === "en" ? "العربية" : "EN"}
        </button>
        <span className="text-sm text-slate-400">{email}</span>
        <form action={onLogout}>
          <button
            type="submit"
            className="rounded-full border border-border px-4 py-1.5 text-sm font-bold text-slate-500 hover:border-red-300 hover:text-red-600"
          >
            {t(logoutLabel)}
          </button>
        </form>
      </div>
    </div>
  );
}
