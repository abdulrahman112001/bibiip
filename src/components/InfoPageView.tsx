"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/i18n";
import type { LegalPageContent } from "@/lib/content";

type Props = {
  page: LegalPageContent;
  brand: typeof import("@/lib/content").brand;
  navData: typeof import("@/lib/content").nav;
  footer: typeof import("@/lib/content").footer;
  seo: typeof import("@/lib/content").seo;
};

export default function InfoPageView({ page, brand, navData, footer, seo }: Props) {
  const { t } = useLang();

  return (
    <>
      <Header brand={brand} navData={navData} />
      <main className="flex-1 pt-28 pb-20">
        <section className="mx-auto max-w-4xl px-6">
          <div className="mb-6 inline-flex items-center rounded-full border border-brand-yellow/60 bg-brand-yellow-soft px-3 py-1 text-xs font-bold tracking-[0.18em] text-brand-ink">
            {t(page.eyebrow)}
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-brand-ink md:text-5xl">
            {t(page.title)}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">
            {t(page.description)}
          </p>

          <div className="mt-12 space-y-8">
            {page.sections.map((section, index) => (
              <article
                key={`${section.title.ar}-${index}`}
                className="rounded-[28px] border border-border bg-white p-6 shadow-[0_20px_60px_-35px_rgba(83,40,19,0.28)] md:p-8"
              >
                <h2 className="text-2xl font-extrabold text-brand-ink">{t(section.title)}</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-text-muted">
                  {section.body.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{t(paragraph)}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer brand={brand} data={footer} seo={seo} />
    </>
  );
}
