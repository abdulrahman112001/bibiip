"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";
import { download } from "@/lib/content";

export default function Download() {
  const { t } = useLang();
  return (
    <section id="download" className="relative overflow-hidden border-t border-border bg-brand-ink py-24 md:py-32">
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
            <span className="text-xs font-bold tracking-widest text-brand-yellow">{t(download.eyebrow)}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              {t(download.title)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md text-lg text-white/70">{t(download.body)}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap gap-4">
              <StoreButton title={t(download.appStore)} soon={t(download.soon)} />
              <StoreButton title={t(download.googlePlay)} soon={t(download.soon)} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="flex justify-center">
          <Image
            src={download.image}
            alt={t(download.title)}
            width={360}
            height={720}
            className="w-[240px] drop-shadow-2xl md:w-[300px]"
          />
        </Reveal>
      </div>
    </section>
  );
}

function StoreButton({ title, soon }: { title: string; soon: string }) {
  return (
    <span className="flex items-center gap-3 rounded-2xl bg-brand-yellow px-6 py-3.5 font-bold text-brand-ink">
      {title}
      <span className="rounded-full bg-brand-ink/10 px-2 py-0.5 text-[10px] font-bold">{soon}</span>
    </span>
  );
}
