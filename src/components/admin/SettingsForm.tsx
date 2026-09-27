"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

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

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(currentLabel)}</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(newLabel)}</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(confirmLabel)}</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
          />
        </div>

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
