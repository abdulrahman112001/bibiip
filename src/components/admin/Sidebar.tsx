"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLang } from "@/lib/i18n";
import { sectionLabels } from "@/lib/contentSchemas";

const overviewLabel = { en: "Overview", ar: "نظرة عامة" };
const sectionsLabel = { en: "Sections", ar: "السكاشن" };
const settingsLabel = { en: "Settings", ar: "الإعدادات" };
const brandLabel = { en: "Beep Beep", ar: "بيب بيب" };

const keys = Object.keys(sectionLabels);

/* أيقونة SVG بسيطة لكل سكشن (بنفس روح مشروع cars: أيقونة جوه دايرة) */
function SectionIcon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <path d="M3 9.5 12 3l9 6.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case "brand":
      return (
        <svg {...common}>
          <path d="m12 3 2.4 5 5.6.8-4 3.9 1 5.5L12 15.9 6.9 18.2l1-5.5-4-3.9L9.6 8Z" />
        </svg>
      );
    case "nav":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
    case "hero":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m3 15 5-4 4 3 3-2 6 5" />
          <circle cx="8" cy="9" r="1.4" />
        </svg>
      );
    case "ourStory":
      return (
        <svg {...common}>
          <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z" />
          <path d="M8 3v18" />
        </svg>
      );
    case "services":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "howItWorks":
      return (
        <svg {...common}>
          <path d="M9 6h11M9 12h11M9 18h11" />
          <path d="m3 6 1.5 1.5L7 5" />
          <path d="m3 12 1.5 1.5L7 11" />
          <path d="m3 18 1.5 1.5L7 17" />
        </svg>
      );
    case "features":
      return (
        <svg {...common}>
          <path d="m12 3 1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9Z" />
          <path d="M19 15v4M17 17h4M5 4v3M3.5 5.5h3" />
        </svg>
      );
    case "calculator":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
        </svg>
      );
    case "walkthrough":
      return (
        <svg {...common}>
          <rect x="7" y="2" width="10" height="20" rx="2.5" />
          <path d="M11 18h2" />
        </svg>
      );
    case "plans":
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5Z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12Z" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 11 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );
    case "faq":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4v.3" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "footer":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 15h18" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const overviewActive = pathname === "/admin";

  return (
    <aside
      className={clsx(
        "sidebar-gradient flex h-screen shrink-0 flex-col text-white transition-all duration-200",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* البراند فوق */}
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-ink font-extrabold">
          ب
        </span>
        {!collapsed && (
          <span className="truncate text-base font-extrabold text-brand-yellow">
            {t(brandLabel)}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto p-3 scrollbar-thin">
        {/* Overview */}
        <Link
          href="/admin"
          title={t(overviewLabel)}
          className={clsx(
            "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
            overviewActive
              ? "bg-brand-yellow text-brand-ink shadow-sm"
              : "bg-white/10 text-white/90 hover:bg-white/15"
          )}
        >
          <span
            className={clsx(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              overviewActive ? "bg-brand-ink text-brand-yellow" : "bg-white/15 text-white"
            )}
          >
            <SectionIcon name="overview" />
          </span>
          {!collapsed && <span className="flex-1 truncate text-start">{t(overviewLabel)}</span>}
        </Link>

        <div className="my-2 h-px bg-white/15" />

        {!collapsed && (
          <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-brand-yellow/60">
            {t(sectionsLabel)}
          </p>
        )}

        {keys.map((key) => {
          const href = `/admin/content/${key}`;
          const active = pathname === href;
          return (
            <Link
              key={key}
              href={href}
              title={t(sectionLabels[key])}
              className={clsx(
                "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-yellow text-brand-ink shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-brand-ink text-brand-yellow" : "bg-white/15 text-white"
                )}
              >
                <SectionIcon name={key} />
              </span>
              {!collapsed && (
                <span className="flex-1 truncate text-start">{t(sectionLabels[key])}</span>
              )}
            </Link>
          );
        })}

        <div className="my-2 h-px bg-white/15" />

        {(() => {
          const href = "/admin/settings";
          const active = pathname === href;
          return (
            <Link
              href={href}
              title={t(settingsLabel)}
              className={clsx(
                "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand-yellow text-brand-ink shadow-sm"
                  : "bg-white/10 text-white/90 hover:bg-white/15"
              )}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-brand-ink text-brand-yellow" : "bg-white/15 text-white"
                )}
              >
                <SectionIcon name="settings" />
              </span>
              {!collapsed && <span className="flex-1 truncate text-start">{t(settingsLabel)}</span>}
            </Link>
          );
        })()}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="flex items-center justify-end gap-2 p-4 text-white/70 transition-colors hover:text-white"
      >
        {collapsed ? (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m13 17 5-5-5-5" />
            <path d="m6 17 5-5-5-5" />
          </svg>
        ) : (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
        )}
      </button>
    </aside>
  );
}
