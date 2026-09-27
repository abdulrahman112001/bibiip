"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";
export type L = Record<Lang, string>;

type LangContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** يرجّع النص حسب اللغة الحالية من كائن { en, ar } */
  t: (value: L) => string;
  /** زي t() بس للصور: لو اللغة الحالية معملهاش صورة، بيرجع صورة اللغة التانية بدل الفراغ */
  img: (value: L) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "beepbeep-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  // استرجاع اللغة المحفوظة بعد الـ mount (تجنّب hydration mismatch)
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);

  // تحديث اتجاه الصفحة ولغتها
  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "ar" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback((value: L) => value[lang], [lang]);
  const img = useCallback((value: L) => value?.[lang] || value?.ar || value?.en || "", [lang]);

  return (
    <LangContext.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle, t, img }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
