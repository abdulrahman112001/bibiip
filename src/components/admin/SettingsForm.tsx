"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const showLabel = { en: "Show password", ar: "اظهار الباسورد" };
const hideLabel = { en: "Hide password", ar: "اخفاء الباسورد" };

const title = { en: "Settings", ar: "الإعدادات" };
const subtitle = { en: "Change your admin login password", ar: "غيّر كلمة سر دخولك للوحة التحكم" };
const emailLabel = { en: "Email", ar: "الإيميل" };
const currentLabel = { en: "Current password", ar: "الباسورد الحالي" };
const newLabel = { en: "New password", ar: "الباسورد الجديد" };
const confirmLabel = { en: "Confirm new password", ar: "أكّد الباسورد الجديد" };
const saveLabel = { en: "Change password", ar: "غيّر الباسورد" };
const savingLabel = { en: "Changing…", ar: "جاري التغيير…" };
const successMsg = { en: "✓ Password changed successfully", ar: "✓ اتغيّر الباسورد بنجاح" };
const mismatchError = { en: "New passwords don't match", ar: "الباسورد الجديد وتأكيده مش متطابقين" };
const shortError = { en: "New password must be at least 8 characters", ar: "الباسورد الجديد لازم يكون 8 حروف على الأقل" };
const unexpectedError = { en: "Something went wrong", ar: "حصل خطأ غير متوقع" };

export default function SettingsForm({ email }: { email: string }) {
  const { t } = useLang();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t(mismatchError));
      return;
    }
    if (newPassword.length < 8) {
      setError(t(shortError));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const resBody = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(resBody.error ?? t(unexpectedError));
      }
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t(unexpectedError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-ink">{t(title)}</h1>
        <p className="mt-1 text-sm text-slate-500">{t(subtitle)}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(emailLabel)}</label>
          <input
            type="text"
            value={email}
            disabled
            className="w-full rounded-xl border border-border bg-bg-elev px-4 py-2.5 text-sm text-slate-500"
          />
        </div>

        <PasswordField
          label={t(currentLabel)}
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />

        <PasswordField
          label={t(newLabel)}
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          minLength={8}
        />

        <PasswordField
          label={t(confirmLabel)}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          minLength={8}
        />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-bold text-brand-ink transition-transform hover:scale-105 disabled:opacity-50"
          >
            {saving ? t(savingLabel) : t(saveLabel)}
          </button>
          {success && <span className="text-sm font-bold text-green-600">{t(successMsg)}</span>}
          {error && <span className="text-sm font-bold text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  minLength?: number;
}) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border px-4 py-2.5 pe-11 text-sm outline-none focus:border-brand-yellow"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t(hideLabel) : t(showLabel)}
          className="absolute inset-y-0 inset-e-0 flex w-11 items-center justify-center text-slate-400 hover:text-brand-ink"
        >
          {visible ? (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
              <path d="m3 3 18 18" />
            </svg>
          ) : (
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
