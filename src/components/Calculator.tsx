"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").calculator };

export default function Calculator({ data }: Props) {
  const { t, lang } = useLang();

  const [serviceKey, setServiceKey] = useState(data.serviceOptions[0].key);
  const [distance, setDistance] = useState(0);
  const [peak, setPeak] = useState(false);

  const service = data.serviceOptions.find((s) => s.key === serviceKey)!;

  const fare = useMemo(() => {
    const raw = service.perKm * distance;
    return Math.round(peak ? raw * 1.25 : raw);
  }, [service, distance, peak]);

  const fmt = (n: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US").format(n);

  return (
    <section id="calculator" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} body={data.body} />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* المدخلات */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-surface p-8">
              <label className="text-sm font-medium text-text-muted">{t(data.serviceLabel)}</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.serviceOptions.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setServiceKey(opt.key)}
                    className={
                      "rounded-full px-5 py-2.5 text-sm font-bold transition-colors " +
                      (opt.key === serviceKey
                        ? "bg-brand-yellow text-brand-ink"
                        : "border border-border text-text-muted hover:text-brand-ink")
                    }
                  >
                    {t(opt.label)}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-muted">{t(data.inputs.distance)}</label>
                  <span className="text-lg font-extrabold text-brand-ink">{fmt(distance)}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDistance((d) => Math.max(0, d - 1))}
                    aria-label="-1 km"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-lg font-bold text-brand-ink transition-colors hover:border-brand-yellow-dark hover:bg-brand-yellow-soft"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={1}
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full accent-brand-yellow-dark"
                  />
                  <button
                    type="button"
                    onClick={() => setDistance((d) => Math.min(1000, d + 1))}
                    aria-label="+1 km"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-lg font-bold text-brand-ink transition-colors hover:border-brand-yellow-dark hover:bg-brand-yellow-soft"
                  >
                    +
                  </button>
                </div>
              </div>

              <label className="mt-8 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={peak}
                  onChange={(e) => setPeak(e.target.checked)}
                  className="size-5 accent-brand-yellow-dark"
                />
                <span className="text-sm font-medium text-text">{t(data.peakLabel)}</span>
              </label>
            </div>
          </Reveal>

          {/* النتيجة */}
          <Reveal delay={0.1} variant="flip">
            <Tilt3D max={6} scale={1.015}>
              <div className="flex h-full flex-col justify-center rounded-3xl border-2 border-brand-yellow bg-brand-yellow-soft p-8 glow-yellow">
                <p className="text-sm font-medium text-brand-ink-soft">{t(data.resultLabel)}</p>
                <motion.p
                  key={fare}
                  initial={{ opacity: 0.4, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="mt-2 text-5xl font-extrabold text-brand-ink md:text-6xl"
                >
                  {fmt(fare)} <span className="text-2xl">{lang === "ar" ? "ج.م" : "EGP"}</span>
                </motion.p>
                <p className="mt-6 text-xs text-brand-ink-soft">{t(data.note)}</p>
              </div>
            </Tilt3D>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
