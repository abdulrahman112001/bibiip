"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang, type L } from "@/lib/i18n";
import { sectionLabels } from "@/lib/contentSchemas";

const searchPlaceholder = { en: "Search the dashboard", ar: "ابحث في لوحة التحكم" };
const roleLabel = { en: "Super Admin", ar: "أدمن عام" };
const logoutLabel = { en: "Log out", ar: "تسجيل خروج" };
const noResultsLabel = { en: "No matches", ar: "مفيش نتايج" };
const overviewLabel = { en: "Overview", ar: "نظرة عامة" };
const settingsSearchLabel = { en: "Settings", ar: "الإعدادات" };

type SearchItem = { key: string; href: string; label: L };

const searchIndex: SearchItem[] = [
  { key: "__overview", href: "/admin", label: overviewLabel },
  ...Object.entries(sectionLabels).map(([key, label]) => ({
    key,
    href: `/admin/content/${key}`,
    label,
  })),
  { key: "__settings", href: "/admin/settings", label: settingsSearchLabel },
];

function initialsFromEmail(email?: string | null) {
  if (!email) return "A";
  const name = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = name.split(" ").filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || name[0] || "A").toUpperCase();
}

export default function AdminHeaderClient({
  email,
  onLogout,
  onMenuToggle,
}: {
  email?: string | null;
  onLogout: () => Promise<void>;
  onMenuToggle?: () => void;
}) {
  const { t, lang, setLang } = useLang();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = email?.split("@")[0] ?? "Admin";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter(
        (item) =>
          item.label.ar.toLowerCase().includes(q) ||
          item.label.en.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  function goTo(href: string) {
    router.push(href);
    setSearchOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) goTo(results[0].href);
  }

  return (
    <header className="flex h-20 items-center gap-3 rounded-3xl border border-border bg-white px-4 md:gap-4 md:px-6">
      {/* زر القائمة للموبايل */}
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open menu"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border text-slate-500 transition-colors hover:border-brand-yellow hover:text-brand-ink md:hidden"
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* البحث */}
      <div className="hidden flex-1 sm:block">
        <form onSubmit={handleSubmit} className="relative">
          <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-slate-400">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchOpen(false);
                inputRef.current?.blur();
              }
            }}
            placeholder={t(searchPlaceholder)}
            className="h-12 w-full rounded-2xl border border-border bg-bg-elev/60 ps-10 pe-10 text-sm text-brand-ink outline-none transition-colors placeholder:text-slate-400 focus:border-brand-yellow focus:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear"
              className="absolute inset-y-0 inset-e-3 flex items-center text-slate-400 hover:text-brand-ink"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          )}

          {searchOpen && query && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setSearchOpen(false)} />
              <div className="absolute inset-s-0 top-full z-20 mt-2 w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-lg">
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">{t(noResultsLabel)}</p>
                ) : (
                  results.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="block px-4 py-2 text-start text-sm text-brand-ink hover:bg-surface"
                    >
                      {t(item.label)}
                    </Link>
                  ))
                )}
              </div>
            </>
          )}
        </form>
      </div>

      {/* أدوات الجانب */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none md:gap-3">
        {/* اللغة */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLangOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-white px-3 text-sm font-medium text-slate-500 transition-colors hover:border-brand-yellow hover:text-brand-ink"
          >
            <span>{lang === "ar" ? "عربي" : "English"}</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {langOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setLangOpen(false)} />
              <div className="absolute inset-e-0 top-full z-20 mt-2 w-32 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => { setLang("ar"); setLangOpen(false); }}
                  className="block w-full px-4 py-2 text-start text-sm text-brand-ink hover:bg-surface"
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => { setLang("en"); setLangOpen(false); }}
                  className="block w-full px-4 py-2 text-start text-sm text-brand-ink hover:bg-surface"
                >
                  English
                </button>
              </div>
            </>
          )}
        </div>

        {/* البروفايل */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setLangOpen(false);
            }}
            className="flex h-11 items-center gap-2.5 rounded-2xl border border-border bg-white py-1 pe-3 ps-1"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-sm font-extrabold text-brand-ink">
              {initialsFromEmail(email)}
            </span>
            <span className="hidden text-start leading-tight sm:block">
              <span className="block text-sm font-semibold text-brand-ink">{displayName}</span>
              <span className="block text-xs text-slate-400">{t(roleLabel)}</span>
            </span>
            <svg className="hidden sm:block" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {profileOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setProfileOpen(false)} />
              <div className="absolute inset-e-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
                <div className="border-b border-border px-4 py-2">
                  <p className="truncate text-sm font-semibold text-brand-ink">{displayName}</p>
                  <p className="truncate text-xs text-slate-400">{email}</p>
                </div>
                <form action={onLogout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2 text-start text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    {t(logoutLabel)}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
