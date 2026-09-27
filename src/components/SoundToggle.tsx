"use client";

import { motion } from "framer-motion";
import { useSound } from "@/lib/sound";
import { useLang } from "@/lib/i18n";

const label = {
  on: { en: "Mute Beep Beep's honk", ar: "اكتم بيب بيب" } as const,
  off: { en: "Let Beep Beep honk at you", ar: "خلّي بيب بيب يبيّبلك" } as const,
};

/**
 * زرار صغير عايم بيسيب المستخدم هو اللي يقرر لو عايز يسمع "بيب بيب" العربية
 * وهي بتتفاعل معاه (افتراضيًا مقفول، عشان محدش يتفاجئ بصوت).
 */
export default function SoundToggle() {
  const { enabled, toggle } = useSound();
  const { t } = useLang();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={t(enabled ? label.on : label.off)}
      title={t(enabled ? label.on : label.off)}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 start-5 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-surface/90 text-lg shadow-lg backdrop-blur transition-colors hover:border-brand-yellow"
    >
      {enabled ? "🔊" : "🔇"}
    </motion.button>
  );
}
