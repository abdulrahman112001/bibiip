"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Reveal from "./Reveal";
import LivingPhoto from "./LivingPhoto";
import { useLang, type L } from "@/lib/i18n";

/** الصورة دي بالذات عندها فيديو حقيقي مطابق - بتتحول لـ"صورة حيّة" (شوف LivingPhoto) */
const LIVING_PHOTOS: Record<string, string> = {
  "/brand/service-transport-hero.jpg": "/brand/transport-hologram.mp4",
};

/**
 * مستوحى من سكشن "We built our own road" في waabi.ai:
 * صور حقيقية متبعتره حوالين نص في النص، والنص بيتلوّن كلمة كلمة مع نزولك
 * بالسكرول. كل صورة بتظهر مرة واحدة وتفضل ثابتة في مكانها (من غير اختفاء
 * وظهور) - بس بتتحرك بهدوء (parallax + عوم بسيط) عشان تحس إن السكشن عايش.
 */
type Props = { data: typeof import("@/lib/content").ourStory };

export default function OurStory({ data }: Props) {
  const { t, img } = useLang();
  const sectionRef = useRef<HTMLElement>(null);

  // تقدّم السكرول من لحظة ما السكشن يدخل الشاشة لحد ما يخرج منها -
  // بنستخدمه عشان كل صورة تتحرك بسرعة مختلفة (عمق حقيقي/parallax)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-bg py-24 md:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* الصور المتبعترة - ديسكتوب بس */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {data.photos.map((photo, i) => (
            <FloatingPhoto key={img(photo.src)} photo={photo} index={i} progress={scrollYProgress} />
          ))}
        </div>

        {/* موبايل: صورتين بس في صف واحد فوق النص */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:hidden">
          {data.photos.slice(0, 2).map((photo) => (
            <div key={img(photo.src)} className="aspect-square overflow-hidden rounded-2xl shadow-lg">
              <Image src={img(photo.src)} alt="" width={400} height={400} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* النص في النص */}
        <div className="relative z-10 mx-auto max-w-2xl py-4 text-center md:py-64">
          <Reveal>
            <span className="inline-block rounded-full bg-brand-ink px-4 py-1.5 text-xs font-bold tracking-wide text-brand-yellow">
              {t(data.eyebrow)}
            </span>
          </Reveal>

          <RevealText text={t(data.manifesto)} />
        </div>
      </div>
    </section>
  );
}

type Photo = { src: L; left: string; top: string; size: number };

/**
 * صورة عايمة: بتظهر مرة واحدة (fade-in) وتفضل ثابتة في مكانها - من غير
 * اختفاء تاني - بس بحركتين خفيفتين مستمرتين فوقها: parallax حسب سكرول
 * الصفحة (كل صورة بسرعة مختلفة، فيحس إنهم في عمق مختلف)، وعوم بطيء دايم.
 */
function FloatingPhoto({
  photo,
  index,
  progress,
}: {
  photo: Photo;
  index: number;
  progress: MotionValue<number>;
}) {
  const { img } = useLang();
  const speed = 30 + (index % 3) * 22;
  const direction = index % 2 === 0 ? -1 : 1;
  const parallaxY = useTransform(progress, [0, 1], [speed * direction, -speed * direction]);
  const src = img(photo.src);

  return (
    <motion.div
      className="absolute overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5"
      style={{ left: photo.left, top: photo.top, width: photo.size, height: photo.size }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: index * 0.06 }}
    >
      <motion.div className="h-full w-full" style={{ y: parallaxY }}>
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 4.5 + (index % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.25,
          }}
        >
          {LIVING_PHOTOS[src] ? (
            <LivingPhoto src={LIVING_PHOTOS[src]} className="h-full w-full" />
          ) : (
            <Image
              src={src}
              alt=""
              width={photo.size * 2}
              height={photo.size * 2}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function RevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.3"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="mt-6 text-2xl font-extrabold leading-snug text-brand-ink md:text-4xl"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mx-1 inline-block">
      {children}
    </motion.span>
  );
}
