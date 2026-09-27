"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { useLang, type L } from "@/lib/i18n";
import { sectionLabels } from "@/lib/contentSchemas";

const pageTitle = { en: "Dashboard", ar: "لوحة التحكم" };
const pageSubtitle = {
  en: "Welcome back — an overview of your Beep Beep site content.",
  ar: "مرحبًا بك مرة أخرى — نظرة عامة على محتوى موقع بيب بيب.",
};
const statusAllLabel = { en: "All sections", ar: "كل السكاشن" };
const statusEditedLabel = { en: "Edited only", ar: "المعدّلة بس" };
const statusPendingLabel = { en: "Not edited", ar: "غير المعدّلة" };
const periodAllLabel = { en: "All time", ar: "كل الوقت" };
const periodMonthLabel = { en: "This month", ar: "هذا الشهر" };
const periodQuarterLabel = { en: "Last 3 months", ar: "آخر 3 شهور" };
const noMatchLabel = { en: "No sections match these filters", ar: "مفيش سكاشن مطابقة للفلتر ده" };
const sectionsHeading = { en: "Quick access to sections", ar: "الوصول السريع للسكاشن" };
const updatedPrefix = { en: "Last updated:", ar: "آخر تعديل:" };
const neverEdited = { en: "Not edited yet", ar: "لسه من غير تعديل" };

type StatusFilter = "all" | "edited" | "pending";
type PeriodFilter = "all" | "month" | "quarter";

const statTotal = { en: "Total sections", ar: "إجمالي السكاشن" };
const statEdited = { en: "Edited sections", ar: "سكاشن معدّلة" };
const statPending = { en: "Not edited", ar: "غير معدّلة" };
const statAssets = { en: "Uploaded images", ar: "الصور المرفوعة" };
const statLast = { en: "Last edit", ar: "آخر تعديل" };
const ofTotal = { en: "of total", ar: "من الإجمالي" };
const today = { en: "Today", ar: "اليوم" };
const daysAgo = (n: number) => ({ en: `${n} days ago`, ar: `منذ ${n} يوم` });

const trendTitle = { en: "Edits over time", ar: "التعديلات خلال الفترة" };
const donutTitle = { en: "Sections status", ar: "حالة السكاشن" };
const donutTotal = { en: "Sections", ar: "السكشن" };
const legendEdited = { en: "Edited", ar: "معدّلة" };
const legendPending = { en: "Not edited", ar: "غير معدّلة" };

export type SectionInfo = { key: string; updatedAt: string | null };

/* ===== أدوات الرسم (SVG خالص، بدون مكتبات) ===== */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function AreaChart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 640;
  const H = 260;
  const padL = 34;
  const padR = 16;
  const padT = 28;
  const padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxY = Math.max(1, Math.ceil(Math.max(...values, 1) * 1.25));
  const n = values.length;
  const x = (i: number) => padL + (n <= 1 ? chartW / 2 : (chartW * i) / (n - 1));
  const y = (v: number) => padT + chartH * (1 - v / maxY);
  const pts = values.map((v, i) => ({ x: x(i), y: y(v) }));
  const line = smoothPath(pts);
  const area = `${line} L ${x(n - 1)} ${padT + chartH} L ${x(0)} ${padT + chartH} Z`;
  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc413" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffc413" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const gy = padT + (chartH * i) / gridLines;
        const val = Math.round(maxY * (1 - i / gridLines));
        return (
          <g key={i}>
            <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="#f0e3c8" strokeWidth={1} />
            <text x={padL - 6} y={gy + 3} textAnchor="end" fontSize={10} fill="#a99b8b">
              {val}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#e2a300" strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#e2a300" stroke="#fff" strokeWidth={2} />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#532813">
            {values[i]}
          </text>
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize={10} fill="#a99b8b">
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Donut({
  segments,
  total,
  centerLabel,
}: {
  segments: { value: number; color: string }[];
  total: number;
  centerLabel: string;
}) {
  const size = 190;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const arcs = segments.map((s, i) => {
    const start = segments.slice(0, i).reduce((a, x) => a + x.value, 0);
    return { color: s.color, len: (s.value / sum) * c, off: (start / sum) * c };
  });

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f6ecd6" strokeWidth={stroke} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={`${a.len} ${c - a.len}`}
              strokeDashoffset={-a.off}
              strokeLinecap="butt"
            />
          ))}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-brand-ink">{total}</span>
        <span className="text-xs text-slate-400">{centerLabel}</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
  badge,
  icon,
  iconClass,
}: {
  label: string;
  value: string | number;
  caption?: string;
  badge?: string;
  icon: ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[26px] font-extrabold leading-9 text-brand-ink">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-1.5">
        {caption ? <span className="text-xs text-slate-400">{caption}</span> : <span />}
        {badge ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* أيقونات صغيرة للكروت */
const icon = (path: ReactNode) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

function FilterDropdown<Value extends string>({
  icon: triggerIcon,
  value,
  options,
  onChange,
}: {
  icon: ReactNode;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (v: Value) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-white px-4 text-sm text-slate-500 transition-colors hover:border-brand-yellow hover:text-brand-ink"
      >
        {triggerIcon}
        {current.label}
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute inset-s-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={
                  "block w-full px-4 py-2 text-start text-sm hover:bg-surface " +
                  (o.value === value ? "font-bold text-brand-ink" : "text-slate-500")
                }
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminHomeContent({
  sections,
  assetsCount,
  now,
}: {
  sections: SectionInfo[];
  assetsCount: number;
  now: number;
}) {
  const { t, lang } = useLang();
  const router = useRouter();
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");

  const stats = useMemo(() => {
    const total = sections.length;
    const editedDates = sections
      .map((s) => (s.updatedAt ? new Date(s.updatedAt) : null))
      .filter((d): d is Date => d !== null);
    const edited = editedDates.length;
    const pending = total - edited;
    const editedPct = total ? Math.round((edited / total) * 100) : 0;

    // آخر تعديل (بالأيام)
    let lastEditText = t(neverEdited);
    if (editedDates.length) {
      const latest = Math.max(...editedDates.map((d) => d.getTime()));
      const days = Math.floor((now - latest) / (1000 * 60 * 60 * 24));
      lastEditText = days <= 0 ? t(today) : t(daysAgo(days));
    }

    // سلسلة التعديلات على مدار آخر 6 شهور
    const current = new Date(now);
    const months: { label: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const label = d.toLocaleString(locale, { month: "short" });
      const count = editedDates.filter(
        (ed) => ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth()
      ).length;
      months.push({ label, count });
    }

    return { total, edited, pending, editedPct, lastEditText, months };
  }, [sections, t, locale, now]);

  const filteredSections = useMemo(() => {
    const current = new Date(now);
    return sections.filter((s) => {
      if (statusFilter === "edited" && !s.updatedAt) return false;
      if (statusFilter === "pending" && s.updatedAt) return false;
      if (periodFilter !== "all") {
        if (!s.updatedAt) return false;
        const d = new Date(s.updatedAt);
        const monthsDiff =
          (current.getFullYear() - d.getFullYear()) * 12 + (current.getMonth() - d.getMonth());
        if (periodFilter === "month" && monthsDiff !== 0) return false;
        if (periodFilter === "quarter" && (monthsDiff < 0 || monthsDiff > 2)) return false;
      }
      return true;
    });
  }, [sections, statusFilter, periodFilter, now]);

  return (
    <div className="space-y-4">
      {/* العنوان + الفلاتر */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-ink">{t(pageTitle)}</h1>
          <p className="mt-1 text-sm text-slate-400">{t(pageSubtitle)}</p>
        </div>
        <div className="flex items-center gap-2">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            icon={icon(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>)}
            options={[
              { value: "all", label: t(statusAllLabel) },
              { value: "edited", label: t(statusEditedLabel) },
              { value: "pending", label: t(statusPendingLabel) },
            ]}
          />
          <FilterDropdown
            value={periodFilter}
            onChange={setPeriodFilter}
            icon={icon(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>)}
            options={[
              { value: "all", label: t(periodAllLabel) },
              { value: "month", label: t(periodMonthLabel) },
              { value: "quarter", label: t(periodQuarterLabel) },
            ]}
          />
          <button
            type="button"
            onClick={() => router.refresh()}
            aria-label="Refresh"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-brand-yellow-soft text-brand-ink transition-colors hover:bg-brand-yellow"
          >
            {icon(<><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>)}
          </button>
        </div>
      </div>

      {/* كروت الإحصائيات */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t(statTotal)}
          value={stats.total.toLocaleString(locale)}
          caption={t(sectionsHeading)}
          icon={icon(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>)}
          iconClass="bg-amber-100 text-amber-700"
        />
        <StatCard
          label={t(statEdited)}
          value={stats.edited.toLocaleString(locale)}
          caption={t(ofTotal)}
          badge={`${stats.editedPct}%`}
          icon={icon(<><path d="M20 6 9 17l-5-5" /></>)}
          iconClass="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label={t(statPending)}
          value={stats.pending.toLocaleString(locale)}
          caption={t(ofTotal)}
          icon={icon(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>)}
          iconClass="bg-orange-100 text-orange-700"
        />
        <StatCard
          label={t(statAssets)}
          value={assetsCount.toLocaleString(locale)}
          icon={icon(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L7 20" /></>)}
          iconClass="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          label={t(statLast)}
          value={stats.lastEditText}
          icon={icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)}
          iconClass="bg-brand-yellow-soft text-brand-ink"
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-bold text-brand-ink">{t(trendTitle)}</h2>
          <div className="mt-2">
            <AreaChart values={stats.months.map((m) => m.count)} labels={stats.months.map((m) => m.label)} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-bold text-brand-ink">{t(donutTitle)}</h2>
          <div className="mt-2">
            <Donut
              total={stats.total}
              centerLabel={t(donutTotal)}
              segments={[
                { value: stats.edited, color: "#e2a300" },
                { value: stats.pending, color: "#e4c98f" },
              ]}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: "#e2a300" }} />
              <span className="text-slate-500">{stats.edited}</span>
              <span className="text-brand-ink">{t(legendEdited)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-sm">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: "#e4c98f" }} />
              <span className="text-slate-500">{stats.pending}</span>
              <span className="text-brand-ink">{t(legendPending)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* الوصول السريع للسكاشن */}
      <div className="rounded-2xl border border-border bg-white p-5">
        <h2 className="font-bold text-brand-ink">
          {t(sectionsHeading)}{" "}
          <span className="font-normal text-slate-400">({filteredSections.length})</span>
        </h2>
        {filteredSections.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">{t(noMatchLabel)}</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSections.map(({ key, updatedAt }) => (
              <Link
                key={key}
                href={`/admin/content/${key}`}
                className="rounded-2xl border border-border bg-bg-elev/50 p-4 transition-shadow hover:shadow-md"
              >
                <h3 className="font-bold text-brand-ink">
                  {t((sectionLabels[key] as L) ?? { en: key, ar: key })}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {updatedAt
                    ? `${t(updatedPrefix)} ${new Date(updatedAt).toLocaleString(locale)}`
                    : t(neverEdited)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
