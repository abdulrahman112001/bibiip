"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  /** الصوت مفعّل ولا لأ (افتراضيًا: لأ، لحد ما المستخدم يفعّله بنفسه) */
  enabled: boolean;
  toggle: () => void;
  /** بيبقّي "بيب بيب" خفيفة – بنستخدمها كتأكيد أو كتنبيه لطيف */
  honk: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "beepbeep-sound";

/**
 * صوت "بيب بيب" اتولّد بالكامل بالـ Web Audio API (من غير أي ملف صوت) —
 * نغمتين قصيرتين صاعدتين شويه، زي بوق عربية لطيف مش مزعج.
 */
function playHonk() {
  try {
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    [0, 0.16].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(i === 0 ? 740 : 880, now + offset);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.06, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.14);
    });

    setTimeout(() => ctx.close(), 500);
  } catch {
    // متصفح مش داعم WebAudio أو حظره – نتجاهل بهدوء
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "1") setEnabled(true);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      if (next) playHonk();
      return next;
    });
  }, []);

  const honk = useCallback(() => {
    if (enabled) playHonk();
  }, [enabled]);

  return <SoundContext.Provider value={{ enabled, toggle, honk }}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
