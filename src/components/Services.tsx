"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";
import SectionHeading from "./SectionHeading";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").services };

export default function Services({ data }: Props) {
  const { t, img } = useLang();
  return (
    <section id="services" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} body={data.body} />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08} variant="flip">
              <Tilt3D className="h-full">
                <div className="group h-full overflow-hidden rounded-3xl border border-border bg-surface transition-all hover:shadow-xl glow-soft">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={img(s.image)}
                      alt={t(s.title)}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 start-3 flex size-10 items-center justify-center rounded-xl bg-brand-yellow text-lg shadow">
                      {s.icon}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-brand-ink">{t(s.title)}</h3>
                    <p className="mt-2 text-sm text-text-muted">{t(s.desc)}</p>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
