"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").walkthrough };

export default function Walkthrough({ data }: Props) {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const tab = data.tabs[active];

  return (
    <section id="walkthrough" className="relative border-t border-border bg-bg-elev py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} center />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="flex flex-col gap-3">
              {data.tabs.map((tb, i) => (
                <Reveal key={tb.key} delay={i * 0.06}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={
                      "w-full rounded-2xl border p-5 text-start transition-all " +
                      (i === active
                        ? "border-brand-yellow bg-surface shadow-md"
                        : "border-border bg-surface/50 hover:border-brand-yellow/50")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "flex size-8 items-center justify-center rounded-lg text-sm font-bold " +
                          (i === active
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-brand-yellow-soft text-brand-yellow-dark")
                        }
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-bold text-brand-ink">{t(tb.label)}</h3>
                    </div>
                    {i === active && (
                      <p className="mt-3 text-sm text-text-muted">{t(tb.desc)}</p>
                    )}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Image
                  src={tab.image}
                  alt={t(tab.label)}
                  width={360}
                  height={720}
                  className="w-[240px] drop-shadow-2xl md:w-[300px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
