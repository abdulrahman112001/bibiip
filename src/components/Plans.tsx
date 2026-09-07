"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").plans };

export default function Plans({ data }: Props) {
  const { t } = useLang();
  return (
    <section id="plans" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} body={data.body} center />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {data.items.map((plan, i) => (
            <Reveal key={t(plan.name)} delay={i * 0.1}>
              <div
                className={
                  "relative flex h-full flex-col rounded-3xl border p-8 " +
                  (plan.highlighted
                    ? "border-brand-yellow bg-brand-ink text-white glow-yellow"
                    : "border-border bg-surface")
                }
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 start-8 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold text-brand-ink">
                    ★
                  </span>
                )}
                <h3
                  className={
                    "text-lg font-bold " + (plan.highlighted ? "text-brand-yellow" : "text-brand-ink")
                  }
                >
                  {t(plan.name)}
                </h3>
                <div className="mt-4 flex items-end gap-1">
                  <span
                    className={
                      "text-4xl font-extrabold " +
                      (plan.highlighted ? "text-white" : "text-brand-ink")
                    }
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      "pb-1 text-sm " + (plan.highlighted ? "text-white/70" : "text-text-muted")
                    }
                  >
                    {t(data.currency)} {t(data.perWeek)}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={t(f)}
                      className={
                        "flex items-center gap-3 text-sm " +
                        (plan.highlighted ? "text-white/90" : "text-text")
                      }
                    >
                      <span
                        className={
                          "flex size-5 items-center justify-center rounded-full text-xs " +
                          (plan.highlighted
                            ? "bg-brand-yellow text-brand-ink"
                            : "bg-brand-yellow-soft text-brand-yellow-dark")
                        }
                      >
                        ✓
                      </span>
                      {t(f)}
                    </li>
                  ))}
                </ul>

                <a
                  href="#download"
                  className={
                    "mt-8 rounded-full px-6 py-3 text-center text-sm font-bold transition-transform hover:scale-[1.02] " +
                    (plan.highlighted
                      ? "bg-brand-yellow text-brand-ink"
                      : "border border-brand-ink/15 text-brand-ink hover:bg-brand-ink/5")
                  }
                >
                  {t(data.eyebrow)}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
