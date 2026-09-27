"use client";

import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").features };

export default function Features({ data }: Props) {
  const { t } = useLang();
  return (
    <section id="features" className="relative border-t border-border bg-bg-elev py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} center />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((f, i) => (
            <Reveal key={t(f.title)} delay={i * 0.08} variant="flip">
              <Tilt3D className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-brand-yellow">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-yellow-soft text-brand-yellow-dark">
                    <span className="size-2.5 rounded-full bg-brand-yellow-dark" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-brand-ink">{t(f.title)}</h3>
                  <p className="mt-2 text-sm text-text-muted">{t(f.desc)}</p>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
