"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const title = { en: "Messages", ar: "الرسائل" };
const subtitle = {
  en: "Messages sent from the \"Contact Us\" form on the site.",
  ar: "الرسائل اللي العملاء بعتوها من فورم \"تواصل معنا\" في الموقع.",
};
const emptyLabel = { en: "No messages yet", ar: "لسه مفيش رسائل" };
const replyLabel = { en: "Reply by email", ar: "رد عبر الإيميل" };
const markUnreadLabel = { en: "Mark as unread", ar: "تعليم كغير مقروءة" };
const markReadLabel = { en: "Mark as read", ar: "تعليم كمقروءة" };
const deleteLabel = { en: "Delete", ar: "حذف" };
const confirmDeleteLabel = {
  en: "Delete this message?",
  ar: "تأكيد حذف الرسالة؟",
};
const newLabel = { en: "New", ar: "جديدة" };

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesInbox({ initialMessages }: { initialMessages: Message[] }) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState(initialMessages);
  const locale = lang === "ar" ? "ar-EG" : "en-US";

  async function toggleRead(id: string, read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(id: string) {
    if (!confirm(t(confirmDeleteLabel))) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-extrabold text-brand-ink">{t(title)}</h1>
        <p className="mt-1 text-sm text-slate-500">{t(subtitle)}</p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-slate-400">
          {t(emptyLabel)}
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                "rounded-2xl border bg-white p-5 shadow-sm " +
                (m.read ? "border-border" : "border-brand-yellow")
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-ink">{m.name}</h3>
                    {!m.read && (
                      <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold text-brand-ink">
                        {t(newLabel)}
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${m.email}`} dir="ltr" className="text-sm text-slate-500 hover:text-brand-ink">
                    {m.email}
                  </a>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(m.createdAt).toLocaleString(locale)}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent("رد على رسالتك - بيب بيب")}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-brand-yellow-dark hover:text-brand-ink"
                >
                  {t(replyLabel)}
                </a>
                <button
                  type="button"
                  onClick={() => toggleRead(m.id, !m.read)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-brand-yellow-dark hover:text-brand-ink"
                >
                  {m.read ? t(markUnreadLabel) : t(markReadLabel)}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  {t(deleteLabel)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
