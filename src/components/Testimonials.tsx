"use client";

import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").testimonials };

export default function Testimonials({ data }: Props) {
  const { t } = useLang();
  return (
    <section className="relative border-t border-border bg-bg-elev py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} center />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {data.items.map((item, i) => (
            <Reveal key={t(item.name)} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface p-8">
                <div className="text-brand-yellow" aria-hidden>
                  ★★★★★
                </div>
                <blockquote className="mt-4 flex-1 text-text">“{t(item.quote)}”</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <span className="font-bold text-brand-ink">{t(item.name)}</span>
                  <span className="text-text-muted"> · {t(item.city)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
