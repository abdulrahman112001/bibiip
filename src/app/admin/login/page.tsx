"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("الإيميل أو كلمة السر غلط");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-xl font-extrabold text-brand-ink">
          لوحة تحكم بيب بيب
        </h1>
        <p className="mt-1 text-center text-sm text-slate-400">سجّل دخولك عشان تكمّل</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">الإيميل</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              autoFocus
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">كلمة السر</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-brand-yellow-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow/30"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm font-bold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-brand-yellow py-3 text-sm font-bold text-brand-ink transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "جاري الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
