"use client";

import Reveal from "./Reveal";
import { useLang, type L } from "@/lib/i18n";

export default function SectionHeading({
  eyebrow,
  title,
  body,
  center,
}: {
  eyebrow: L;
  title: L;
  body?: L;
  center?: boolean;
}) {
  const { t } = useLang();
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="text-xs font-bold tracking-widest text-brand-yellow-dark">{t(eyebrow)}</span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-brand-ink md:text-4xl lg:text-5xl">
          {t(title)}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.1}>
          <p className={`mt-5 text-lg text-text-muted ${center ? "mx-auto" : ""}`}>{t(body)}</p>
        </Reveal>
      )}
    </div>
  );
}
