"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import Magnetic from "./Magnetic";
import { useLang } from "@/lib/i18n";

type Props = {
  brand: typeof import("@/lib/content").brand;
  navData: typeof import("@/lib/content").nav;
};

export default function Header({ brand, navData }: Props) {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // الهيرو (لو سينماتيك) عنده مساحة سكرول طويلة بيتثبّت فيها الفيديو -
    // مش عايزين خلفية الناف تظهر فوقه لحد ما نخلّص السكشن ده فعليًا وننتقل
    // للي بعده، عشان الفيديو يفضل واضح كامل من غير أي تظليل فوقه.
    let threshold = 24;

    const computeThreshold = () => {
      const hero = document.getElementById("hero-cinematic");
      threshold = hero ? hero.offsetHeight - 4 : 24;
    };

    const onScroll = () => setScrolled(window.scrollY > threshold);
    const onResize = () => {
      computeThreshold();
      onScroll();
    };

    computeThreshold();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div
        className={clsx(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <Link href="#" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src="/brand/logo.png"
            alt={t(brand.name)}
            width={40}
            height={40}
            className={clsx("rounded-xl transition-all duration-300", scrolled ? "size-8" : "size-9")}
          />
          <span className="text-lg font-extrabold tracking-tight text-text">{t(brand.name)}</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navData.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-text-muted transition-colors hover:text-text after:absolute after:-bottom-1.5 after:inset-s-0 after:h-0.5 after:w-0 after:bg-brand-yellow after:transition-all after:duration-300 hover:after:w-full"
            >
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle language"
            className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:border-brand-yellow hover:text-text"
          >
            {lang === "en" ? "العربية" : "EN"}
          </button>

          <div className="hidden md:block">
            <Magnetic>
              <a
                href="#contact"
                className="inline-block rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold text-brand-ink transition-transform hover:scale-105"
              >
                {t(navData.cta)}
              </a>
            </Magnetic>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex size-10 items-center justify-center rounded-xl border border-border bg-surface/60 backdrop-blur lg:hidden"
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <span className={clsx("h-0.5 w-full origin-center rounded-full bg-text transition-all duration-300", open && "translate-y-1.75 rotate-45")} />
              <span className={clsx("h-0.5 w-full rounded-full bg-text transition-all duration-300", open && "opacity-0")} />
              <span className={clsx("h-0.5 w-full origin-center rounded-full bg-text transition-all duration-300", open && "-translate-y-1.75 -rotate-45")} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-border bg-bg/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {navData.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-text transition-colors hover:bg-surface"
                >
                  {t(link.label)}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-brand-yellow px-5 py-3 text-center text-base font-bold text-brand-ink"
              >
                {t(navData.cta)}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
