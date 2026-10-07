"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import AmbientDots from "./AmbientDots";
import { useLang } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content").hero };

/**
 * الهيرو بقى "لحظة سينماتيك" واحدة متثبتة (pinned) بدل سكشنين منفصلين
 * (فيديو + نص). طول ما المستخدم بيعمل سكرول جوا المساحة دي، الفيديو
 * بيتقطّع (scrub) بالظبط زي ScrollTransportScene، والمحتوى بيتحول من
 * "لقطة عنوان" كبيرة لنص/موبايل/أزرار الهيرو التقليدي - كل حاجة مربوطة
 * بنفس تقدّم السكرول.
 */
export default function Hero({ data }: Props) {
  const { t, img } = useLang();
  const reduce = useReducedMotion();
  // سكاشن محفوظة قبل إضافة الفيديو كحقل في لوحة التحكم لسه معندهاش قيمة له
  const videoSrc = img(data.video) || "/brand/action-reel.mp4";

  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const { scrollYProgress: rawProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // بنلفّ التقدّم الخام بزنبرك ناعم - بدل ما الفيديو "يقفز" مع كل حركة عجلة
  // ماوس صغيرة، بيتحرك بسلاسة زي ما لو كان بيتشغل فعلًا مش بيتقطّع
  const progress = useSpring(rawProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  // لقطة العنوان الكبيرة (Beat A): ظاهرة في الأول وبتختفي وهي بتكبر شوية للخلف
  const titleCardOpacity = useTransform(progress, [0, 0.32, 0.48], [1, 1, 0]);
  const titleCardY = useTransform(progress, [0, 0.5], [0, -50]);
  const titleCardScale = useTransform(progress, [0, 0.5], [1, 1.06]);

  // الهيرو الكامل (Beat B): بيدخل بعد ما لقطة العنوان تخلص وبيستقر لحد آخر السكرول
  const fullHeroOpacity = useTransform(progress, [0.4, 0.62], [0, 1]);
  const fullHeroY = useTransform(progress, [0.4, 0.68], [48, 0]);

  // تظليل الفيديو بيزيد تدريجيًا عشان النص يفضل واضح كل ما دخلنا في Beat B
  const overlayOpacity = useTransform(progress, [0, 0.4, 1], [0.1, 0.15, 0.55]);

  // تقطيع الفيديو (scrub) حسب تقدّم السكرول - نفس منطق ScrollTransportScene
  // بالظبط (بما فيه حل مشكلة تراكم طلبات الـ seek فوق بعض).
  useEffect(() => {
    if (reduce) return;
    const video = videoRef.current;
    if (!video) return;

    const applyTarget = () => {
      if (seekingRef.current) return;
      const diff = Math.abs(video.currentTime - targetTimeRef.current);
      if (diff < 0.03) return;
      seekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    };

    const onLoaded = () => {
      durationRef.current = video.duration || 0;
      applyTarget();
    };
    const onSeeked = () => {
      seekingRef.current = false;
      applyTarget();
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    video.pause();
    if (video.readyState >= 1 && video.duration) durationRef.current = video.duration;

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [reduce]);

  useMotionValueEvent(progress, "change", (v) => {
    if (reduce) return;
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;
    const clamped = Math.min(0.98, Math.max(0.01, v));
    targetTimeRef.current = clamped * duration;
    if (!seekingRef.current) {
      const diff = Math.abs(video.currentTime - targetTimeRef.current);
      if (diff >= 0.03) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    }
  });

  // نسخة بسيطة وثابتة لمن يفضّل تقليل الحركة - نفس الهيرو التقليدي من غير تثبيت/سكرب
  if (reduce) {
    return (
      <section
        id="hero-cinematic"
        className="relative overflow-hidden bg-linear-to-b from-brand-yellow-soft to-bg pt-28 pb-20 md:pt-32"
      >
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
        <AmbientDots theme="ink" />
        <HeroContent data={data} t={t} />
      </section>
    );
  }

  return (
    <div id="hero-cinematic" ref={wrapRef} className="relative" style={{ height: "320vh" }}>
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-brand-yellow-soft">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.div
          className="pointer-events-none absolute inset-0 bg-brand-ink"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
        <AmbientDots theme="glow" />

        {/* Beat A: لقطة عنوان سينماتيك كبيرة */}
        <motion.div
          style={{ opacity: titleCardOpacity, y: titleCardY, scale: titleCardScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-ink/80 px-4 py-1.5 text-xs font-bold tracking-wide text-brand-yellow backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-yellow" />
            {t(data.eyebrow)}
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
            {t(data.title)}
          </h1>
        </motion.div>

        {/* Beat B: الهيرو المستقر بالنص والموبايل والأزرار */}
        <motion.div
          style={{ opacity: fullHeroOpacity, y: fullHeroY }}
          className="relative mx-auto flex h-full max-w-7xl items-center px-6 pt-16"
        >
          <HeroContent data={data} t={t} dark />
        </motion.div>
      </section>
    </div>
  );
}

function HeroContent({
  data,
  t,
  dark,
}: {
  data: Props["data"];
  t: (v: { en: string; ar: string }) => string;
  dark?: boolean;
}) {
  return (
    <div className="relative w-full max-w-2xl">
      <div>
        {!dark && (
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-1.5 text-xs font-bold tracking-wide text-brand-yellow">
              <span className="size-1.5 rounded-full bg-brand-yellow" />
              {t(data.eyebrow)}
            </span>
          </Reveal>
        )}

        <Reveal delay={0.1} variant="flip">
          <h1
            className={
              "mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight md:text-6xl " +
              (dark ? "text-white" : "text-brand-ink")
            }
          >
            {t(data.title)}
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className={"mt-6 max-w-lg text-lg " + (dark ? "text-white/75" : "text-text-muted")}>
            {t(data.subtitle)}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#download"
                className="inline-block rounded-full bg-brand-yellow px-7 py-3.5 text-base font-bold text-brand-ink transition-transform hover:scale-105 glow-yellow"
              >
                {t(data.ctaPrimary)}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#services"
                className={
                  "inline-block rounded-full border-2 px-7 py-3.5 text-base font-bold transition-colors " +
                  (dark
                    ? "border-white/25 text-white hover:bg-white/10"
                    : "border-brand-ink/15 text-brand-ink hover:bg-brand-ink/5")
                }
              >
                {t(data.ctaSecondary)}
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <dl
            className={
              "mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-8 " +
              (dark ? "border-white/15" : "border-border")
            }
          >
            {data.stats.map((s) => (
              <div key={s.value}>
                <dt className={"text-2xl font-extrabold md:text-3xl " + (dark ? "text-white" : "text-brand-ink")}>
                  {s.value}
                </dt>
                <dd className={"mt-1 text-xs " + (dark ? "text-white/60" : "text-text-muted")}>{t(s.label)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </div>
  );
}
