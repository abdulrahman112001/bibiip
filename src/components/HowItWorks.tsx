"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";
import { howItWorks } from "@/lib/content";

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section id="how" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} center />

        <div className="mt-16">
          {/* الخط الرابط */}
          <div className="relative">
            <div
              className="absolute inset-s-0 top-8 hidden h-px w-full lg:block"
              style={{ background: "linear-gradient(90deg, transparent, #ffc41388, #e2a30088, transparent)" }}
              aria-hidden
            />
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.steps.map((step, i) => (
                <Reveal key={step.no} delay={i * 0.1}>
                  <li className="relative">
                    <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-surface text-xl font-extrabold text-brand-yellow-dark">
                      {step.no}
                    </div>
                    <h3 className="mt-5 text-base font-bold text-brand-ink">{t(step.title)}</h3>
                    <p className="mt-2 text-sm text-text-muted">{t(step.desc)}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
