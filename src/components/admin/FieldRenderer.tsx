"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Field, ArrayItemSchema } from "@/lib/contentSchemas";

type Path = (string | number)[];

type Props = {
  field: Field;
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
};

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow/30";

/** بيرجّع قيمة افتراضية معقولة لحقل جديد حسب نوعه - بيستخدم لما نضيف عنصر جديد لمصفوفة */
export function defaultValueForItem(schema: ArrayItemSchema): unknown {
  if (schema.kind === "bilingual") return { en: "", ar: "" };
  if (schema.kind === "text") return "";
  const obj: Record<string, unknown> = {};
  for (const [key, f] of Object.entries(schema.fields)) {
    obj[key] = defaultValueForField(f);
  }
  return obj;
}

function defaultValueForField(field: Field): unknown {
  switch (field.kind) {
    case "bilingual":
      return { en: "", ar: "" };
    case "text":
      return "";
    case "image":
    case "video":
      return { en: "", ar: "" };
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object": {
      const obj: Record<string, unknown> = {};
      for (const [key, f] of Object.entries(field.fields)) obj[key] = defaultValueForField(f);
      return obj;
    }
    case "array":
      return [];
  }
}

export default function FieldRenderer({ field, value, path, onChange }: Props) {
  if (field.kind === "bilingual") {
    const v = (value as { en?: string; ar?: string } | undefined) ?? { en: "", ar: "" };
    const Tag = field.multiline ? "textarea" : "input";
    return (
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}</label>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <span className="mb-1 block text-xs text-slate-400">عربي</span>
            <Tag
              dir="rtl"
              rows={field.multiline ? 3 : undefined}
              value={v.ar ?? ""}
              onChange={(e) => onChange([...path, "ar"], e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <span className="mb-1 block text-xs text-slate-400">English</span>
            <Tag
              dir="ltr"
              rows={field.multiline ? 3 : undefined}
              value={v.en ?? ""}
              onChange={(e) => onChange([...path, "en"], e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    );
  }

  if (field.kind === "text") {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}</label>
        <input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(path, e.target.value)}
          className={inputClass}
        />
        {field.helpLink && (
          <a
            href={field.helpLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-brand-yellow-dark hover:underline"
          >
            {field.helpLink.label}
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        )}
      </div>
    );
  }

  if (field.kind === "number") {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}</label>
        <input
          type="number"
          value={(value as number) ?? 0}
          onChange={(e) => onChange(path, Number(e.target.value))}
          className={inputClass}
        />
      </div>
    );
  }

  if (field.kind === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(path, e.target.checked)}
          className="size-4 rounded border-border accent-brand-yellow-dark"
        />
        {field.label}
      </label>
    );
  }

  if (field.kind === "image") {
    const v = (value as { en?: string; ar?: string } | undefined) ?? { en: "", ar: "" };
    return (
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}</label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <ImageField
            label="عربي"
            value={v.ar ?? ""}
            onChange={(url) => onChange([...path, "ar"], url)}
          />
          <ImageField
            label="English"
            value={v.en ?? ""}
            onChange={(url) => onChange([...path, "en"], url)}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          لو سبت لغة من غير صورة، الموقع هيستخدم صورة اللغة التانية بدالها.
        </p>
      </div>
    );
  }

  if (field.kind === "video") {
    const v = (value as { en?: string; ar?: string } | undefined) ?? { en: "", ar: "" };
    return (
      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">{field.label}</label>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <VideoField
            label="عربي"
            value={v.ar ?? ""}
            onChange={(url) => onChange([...path, "ar"], url)}
          />
          <VideoField
            label="English"
            value={v.en ?? ""}
            onChange={(url) => onChange([...path, "en"], url)}
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">
          لو سبت لغة من غير فيديو، الموقع هيستخدم فيديو اللغة التانية بدالها.
        </p>
      </div>
    );
  }

  if (field.kind === "object") {
    const v = (value as Record<string, unknown>) ?? {};
    return (
      <fieldset className="rounded-2xl border border-border bg-bg-elev/40 p-4 shadow-sm">
        <legend className="px-1 text-sm font-bold text-slate-700">{field.label}</legend>
        <div className="space-y-4">
          {Object.entries(field.fields).map(([key, f]) => (
            <FieldRenderer key={key} field={f} value={v[key]} path={[...path, key]} onChange={onChange} />
          ))}
        </div>
      </fieldset>
    );
  }

  // array
  const items = Array.isArray(value) ? value : [];
  const itemSchema = field.of;

  function move(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    onChange(path, reordered);
  }

  function remove(index: number) {
    onChange(
      path,
      items.filter((_, i) => i !== index)
    );
  }

  function add() {
    onChange(path, [...items, defaultValueForItem(itemSchema)]);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">{field.label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-bg-elev/50 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                {itemDisplayTitle(itemSchema, item, i)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                  aria-label="نقل لفوق"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                  aria-label="نقل لتحت"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded-md px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  حذف
                </button>
              </div>
            </div>
            <ArrayItemFields schema={itemSchema} value={item} path={[...path, i]} onChange={onChange} />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 rounded-lg border-2 border-dashed border-border px-4 py-2 text-sm font-bold text-slate-500 hover:border-brand-yellow-dark hover:text-brand-ink"
      >
        + إضافة عنصر جديد
      </button>
    </div>
  );
}

function ArrayItemFields({
  schema,
  value,
  path,
  onChange,
}: {
  schema: ArrayItemSchema;
  value: unknown;
  path: Path;
  onChange: (path: Path, value: unknown) => void;
}) {
  if (schema.kind === "bilingual") {
    return (
      <FieldRenderer
        field={{ kind: "bilingual", label: "" }}
        value={value}
        path={path}
        onChange={onChange}
      />
    );
  }
  if (schema.kind === "text") {
    return (
      <FieldRenderer field={{ kind: "text", label: "" }} value={value} path={path} onChange={onChange} />
    );
  }
  const v = (value as Record<string, unknown>) ?? {};
  return (
    <div className="space-y-4">
      {Object.entries(schema.fields).map(([key, f]) => (
        <FieldRenderer key={key} field={f} value={v[key]} path={[...path, key]} onChange={onChange} />
      ))}
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/assets", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "فشل رفع الصورة");
      onChange(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ غير متوقع");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
          {value && <Image src={value} alt="" fill className="object-cover" unoptimized />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/brand/… أو ارفع صورة"
              className={inputClass}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-yellow-dark hover:text-brand-ink disabled:opacity-50"
            >
              {uploading ? "بيرفع…" : "ارفع صورة"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        ارفع صورة جديدة (بتحل محل القديمة أوتوماتيك)، أو حط مسار صورة موجودة يدويًا.
      </p>
    </div>
  );
}

function VideoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/assets", { method: "POST", body: form });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "فشل رفع الفيديو");
      onChange(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حصل خطأ غير متوقع");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
          {value ? (
            <video src={value} muted playsInline preload="metadata" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/brand/… أو ارفع فيديو"
              className={inputClass}
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-brand-yellow-dark hover:text-brand-ink disabled:opacity-50"
            >
              {uploading ? "بيرفع…" : "ارفع فيديو"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        ارفع فيديو جديد (بيحل محل القديم أوتوماتيك)، أو حط مسار فيديو موجود يدويًا.
      </p>
    </div>
  );
}

function itemDisplayTitle(schema: ArrayItemSchema, item: unknown, index: number): string {
  if (schema.kind === "object" && schema.titleField) {
    const v = (item as Record<string, unknown>)?.[schema.titleField];
    if (v && typeof v === "object" && "ar" in (v as object)) {
      const bilingual = v as { ar?: string; en?: string };
      return bilingual.ar || bilingual.en || `#${index + 1}`;
    }
    if (typeof v === "string" && v) return v;
  }
  return `#${index + 1}`;
}
