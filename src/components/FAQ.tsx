"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";
import { faq } from "@/lib/content";

export default function FAQ() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} center />

        <div className="mt-12 divide-y divide-border border-y border-border">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={t(item.q)} delay={i * 0.05}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-start"
                  >
                    <span className="font-bold text-brand-ink">{t(item.q)}</span>
                    <span
                      className={
                        "flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-yellow-soft text-brand-yellow-dark transition-transform " +
                        (isOpen ? "rotate-45" : "")
                      }
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-text-muted">{t(item.a)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
