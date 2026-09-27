"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import Tilt3D from "./Tilt3D";
import Magnetic from "./Magnetic";
import AmbientDots from "./AmbientDots";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").download };

export default function Download({ data }: Props) {
  const { t } = useLang();
  return (
    <section id="download" className="relative overflow-hidden border-t border-border bg-brand-ink py-24 md:py-32">
      <AmbientDots theme="glow" />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(50% 60% at 80% 10%, rgba(255,196,19,0.25), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="text-xs font-bold tracking-widest text-brand-yellow">{t(data.eyebrow)}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              {t(data.title)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-lg text-white/70">{t(data.body)}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-4">
              <StoreButton title={t(data.appStore)} soon={t(data.soon)} />
              <StoreButton title={t(data.googlePlay)} soon={t(data.soon)} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} variant="flip" className="flex justify-center">
          <Tilt3D max={10}>
            <Image
              src={data.image}
              alt={t(data.title)}
              width={360}
              height={720}
              className="w-60 drop-shadow-2xl md:w-75"
            />
          </Tilt3D>
        </Reveal>
      </div>
    </section>
  );
}

function StoreButton({ title, soon }: { title: string; soon: string }) {
  return (
    <Magnetic strength={0.3}>
      <span className="flex items-center gap-3 rounded-2xl bg-brand-yellow px-6 py-3.5 font-bold text-brand-ink">
        {title}
        <span className="rounded-full bg-brand-ink/10 px-2 py-0.5 text-[10px] font-bold">{soon}</span>
      </span>
    </Magnetic>
  );
}
