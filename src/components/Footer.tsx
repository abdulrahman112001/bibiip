"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

type Props = {
  brand: typeof import("@/lib/content").brand;
  data: typeof import("@/lib/content").footer;
};

export default function Footer({ brand, data }: Props) {
  const { t } = useLang();
  return (
    <footer className="border-t border-white/10 bg-brand-ink py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/logo.png" alt={t(brand.name)} width={36} height={36} className="rounded-lg" />
              <span className="text-lg font-extrabold text-white">{t(brand.name)}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">{t(brand.tagline)}</p>
          </div>

          {data.columns.map((col) => (
            <div key={t(col.title)}>
              <h3 className="text-sm font-bold text-white">{t(col.title)}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={t(link)}>
                    <a href="#" className="text-sm text-white/70 transition-colors hover:text-brand-yellow">
                      {t(link)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {t(brand.name)}. {t(data.rights)}
          </p>
          <div className="flex items-center gap-5 text-sm text-white/70">
            <a href="#" className="transition-colors hover:text-white">LinkedIn</a>
            <a href="#" className="transition-colors hover:text-white">X</a>
            <a href="#" className="transition-colors hover:text-white">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
