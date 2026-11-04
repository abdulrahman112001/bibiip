"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import type { LegalPageContent } from "@/lib/content";
import ContactModal from "./ContactModal";
import SocialIcon, { type SocialPlatform } from "./SocialIcon";

type FooterPage = Pick<LegalPageContent, "eyebrow" | "sections">;

type Props = {
  brand: typeof import("@/lib/content").brand;
  data: typeof import("@/lib/content").footer;
  seo: typeof import("@/lib/content").seo;
  pages: Record<"about" | "terms" | "privacy" | "replacementPolicy", FooterPage>;
};

function resolveTwitterUrl(handle: string): string {
  if (!handle) return "";
  return handle.startsWith("http") ? handle : `https://x.com/${handle.replace(/^@/, "")}`;
}

export default function Footer({ brand, data, seo, pages }: Props) {
  const { t } = useLang();
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);
  const pageGroups = [
    { key: "about", page: pages.about },
    { key: "terms", page: pages.terms },
    { key: "privacy", page: pages.privacy },
    { key: "replacement-policy", page: pages.replacementPolicy },
  ] as const;

  const allSocialLinks: { label: string; platform: SocialPlatform; href: string }[] = [
    { label: "Email", platform: "email", href: seo.contactEmail ? `mailto:${seo.contactEmail}` : "" },
    { label: "Phone", platform: "phone", href: seo.contactPhone ? `tel:${seo.contactPhone.replace(/\s+/g, "")}` : "" },
    { label: "Facebook", platform: "facebook", href: seo.social.facebook },
    { label: "Instagram", platform: "instagram", href: seo.social.instagram },
    { label: "TikTok", platform: "tiktok", href: seo.social.tiktok },
    { label: "X", platform: "x", href: resolveTwitterUrl(seo.twitterHandle) },
    { label: "YouTube", platform: "youtube", href: seo.social.youtube },
    { label: "LinkedIn", platform: "linkedin", href: seo.social.linkedin },
    { label: "WhatsApp", platform: "whatsapp", href: seo.social.whatsapp },
  ];
  const socialLinks = allSocialLinks.filter((s) => s.href);

  return (
    <footer className="border-t border-white/10 bg-brand-ink py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
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
                {col.links.map((link) =>
                  link.href === "#contact" ? (
                    <li key={t(link.label)}>
                      <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        className="text-sm text-white/70 transition-colors hover:text-brand-yellow"
                      >
                        {t(link.label)}
                      </button>
                    </li>
                  ) : (
                    <li key={t(link.label)}>
                      <a
                        href={link.href.startsWith("#") && pathname !== "/" ? `/${link.href}` : link.href}
                        className="text-sm text-white/70 transition-colors hover:text-brand-yellow"
                      >
                        {t(link.label)}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold text-white">
              {t({ en: "Page sections", ar: "أقسام الصفحات" })}
            </h3>
            <div className="mt-4 space-y-4">
              {pageGroups.map(({ key, page }) => (
                <details key={key} className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-white/80 transition-colors hover:text-brand-yellow">
                    {t(page.eyebrow)}
                  </summary>
                  <ul className="mt-2 space-y-2 border-s-2 border-white/15 ps-3">
                    <li>
                      <a
                        href={`/${key}#top`}
                        className="text-xs text-white/60 transition-colors hover:text-brand-yellow"
                      >
                        {t({ en: "Page introduction", ar: "مقدمة الصفحة" })}
                      </a>
                    </li>
                    {page.sections.map((section, index) => (
                      <li key={`${key}-${index}`}>
                        <a
                          href={`/${key}#section-${index + 1}`}
                          className="text-xs text-white/60 transition-colors hover:text-brand-yellow"
                        >
                          {t(section.title)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {t(brand.name)}. {t(data.rights)}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2.5">
              {socialLinks.map((s) => {
                const isExternal = s.platform !== "email" && s.platform !== "phone";
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    title={s.label}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-brand-yellow hover:text-brand-ink"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
