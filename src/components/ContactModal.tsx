"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const title = { en: "Contact us", ar: "تواصل معنا" };
const subtitle = {
  en: "Got a question or feedback? Send us a message.",
  ar: "عندك سؤال أو اقتراح؟ ابعتلنا رسالة.",
};
const nameLabel = { en: "Name", ar: "الاسم" };
const emailLabel = { en: "Email", ar: "الإيميل" };
const messageLabel = { en: "Message", ar: "رسالتك" };
const sendLabel = { en: "Send", ar: "إرسال" };
const sendingLabel = { en: "Sending…", ar: "جاري الإرسال…" };
const successMsg = { en: "✓ Message sent, thank you!", ar: "✓ الرسالة اتبعتت، شكرًا ليك!" };
const unexpectedError = { en: "Something went wrong", ar: "حصل خطأ غير متوقع" };
const closeLabel = { en: "Close", ar: "إغلاق" };

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? t(unexpectedError));
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t(unexpectedError));
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setSuccess(false);
    setError(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-brand-ink">{t(title)}</h2>
                <p className="mt-1 text-sm text-text-muted">{t(subtitle)}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={t(closeLabel)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-surface hover:text-brand-ink"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            </div>

            {success ? (
              <p className="mt-6 rounded-2xl bg-brand-yellow-soft p-4 text-sm font-bold text-brand-ink">
                {t(successMsg)}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(nameLabel)}</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(emailLabel)}</label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-brand-ink">{t(messageLabel)}</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
                  />
                </div>
                {error && <p className="text-sm font-bold text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-brand-yellow px-6 py-3 text-sm font-bold text-brand-ink transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {sending ? t(sendingLabel) : t(sendLabel)}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
