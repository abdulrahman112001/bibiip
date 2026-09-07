"use client";

import { useState } from "react";
import Link from "next/link";
import FieldRenderer from "./FieldRenderer";
import { useLang, type L } from "@/lib/i18n";
import type { FieldMap } from "@/lib/contentSchemas";

type Path = (string | number)[];

const backLabel = { en: "← All sections", ar: "← كل السكاشن" };
const saveLabel = { en: "Save changes", ar: "حفظ التغييرات" };
const savingLabel = { en: "Saving…", ar: "جاري الحفظ…" };
const savedPrefix = { en: "✓ Saved at", ar: "✓ اتحفظ الساعة" };
const genericError = { en: "Save failed", ar: "فشل الحفظ" };
const unexpectedError = { en: "Something went wrong", ar: "حصل خطأ غير متوقع" };

function setDeep(obj: Record<string, unknown>, path: Path, value: unknown) {
  const next: Record<string, unknown> = Array.isArray(obj) ? [...(obj as unknown[])] as never : { ...obj };
  let cur: Record<string, unknown> = next;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const child = (cur as Record<string | number, unknown>)[key];
    const cloned = Array.isArray(child) ? [...child] : { ...(child as Record<string, unknown>) };
    (cur as Record<string | number, unknown>)[key] = cloned;
    cur = cloned as Record<string, unknown>;
  }
  (cur as Record<string | number, unknown>)[path[path.length - 1]] = value;
  return next;
}

export default function SectionForm({
  sectionKey,
  label,
  schema,
  initialData,
}: {
  sectionKey: string;
  label: L;
  schema: FieldMap;
  initialData: Record<string, unknown>;
}) {
  const { t, lang } = useLang();
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(path: Path, value: unknown) {
    setSavedAt(null);
    setData((prev) => setDeep(prev, path, value) as Record<string, unknown>);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? t(genericError));
      }
      setSavedAt(new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t(unexpectedError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600">
            {t(backLabel)}
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold text-brand-ink">{t(label)}</h1>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-sm font-bold text-green-600">
              {t(savedPrefix)} {savedAt}
            </span>
          )}
          {error && <span className="text-sm font-bold text-red-600">{error}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-bold text-brand-ink transition-transform hover:scale-105 disabled:opacity-50"
          >
            {saving ? t(savingLabel) : t(saveLabel)}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(schema).map(([key, field]) => (
          <FieldRenderer key={key} field={field} value={data[key]} path={[key]} onChange={handleChange} />
        ))}
      </div>
    </div>
  );
}
