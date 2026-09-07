"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";

const mockupAlt = { en: "Beep Beep app", ar: "تطبيق بيب بيب" };

type Props = { data: typeof import("@/lib/content").hero };

export default function Hero({ data }: Props) {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-yellow-soft to-bg pt-28 pb-20 md:pt-32">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(50% 40% at 80% 15%, rgba(255,196,19,0.35), transparent 70%)",
        }}
      />
      <RouteVisual />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-1.5 text-xs font-bold tracking-wide text-brand-yellow">
              <span className="size-1.5 rounded-full bg-brand-yellow" />
              {t(data.eyebrow)}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-brand-ink md:text-6xl">
              {t(data.title)}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-lg text-lg text-text-muted">{t(data.subtitle)}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#download"
                className="rounded-full bg-brand-yellow px-7 py-3.5 text-base font-bold text-brand-ink transition-transform hover:scale-105 glow-yellow"
              >
                {t(data.ctaPrimary)}
              </a>
              <a
                href="#services"
                className="rounded-full border-2 border-brand-ink/15 px-7 py-3.5 text-base font-bold text-brand-ink transition-colors hover:bg-brand-ink/5"
              >
                {t(data.ctaSecondary)}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {data.stats.map((s) => (
                <div key={s.value}>
                  <dt className="text-2xl font-extrabold text-brand-ink md:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-xs text-text-muted">{t(s.label)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          >
            <Image
              src={data.mockup}
              alt={t(mockupAlt)}
              width={520}
              height={640}
              priority
              className="w-[260px] drop-shadow-2xl md:w-[360px]"
            />
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/** مسار توصيل متحرك بلون بيب بيب */
function RouteVisual() {
  const d = "M-50 640 C 250 640, 320 440, 580 440 S 920 300, 1250 300";
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc413" />
          <stop offset="100%" stopColor="#e2a300" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke="url(#route)"
        strokeWidth="3"
        strokeDasharray="10 14"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      <circle r="7" fill="#ffc413" style={{ filter: "drop-shadow(0 0 8px #ffc413)" }}>
        <animateMotion dur="6s" repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}
