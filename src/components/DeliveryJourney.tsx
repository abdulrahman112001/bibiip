"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLang, type L } from "@/lib/i18n";

type Props = { data: typeof import("@/lib/content") };

/** أقسام الصفحة اللي عربية بيب بيب "بتعرف" إنها وصلتلها، وشكلها/كلامها فيها */
const SECTION_IDS = ["services", "how", "features", "calculator", "walkthrough", "plans", "download", "faq"] as const;
type SectionId = (typeof SECTION_IDS)[number];

/** أقسام "مهمة" (CTA) - العربية بتوقف جنبها وتزق (وتبيّب لو الصوت مفعّل) */
const CTA_SECTIONS = new Set<SectionId>(["calculator", "plans", "download"]);

const VIEW_W = 40;
const VIEW_H = 1000;

/**
 * بيبني مسار SVG "متعرج" زي طريق حقيقي - مش خط مستقيم - عن طريق سلسلة
 * منحنيات cubic bezier بمماس رأسي (تقنية معروفة لعمل موجة جيبية بـ SVG).
 * كل نقطة تقاطع (boundary) بتدور على دورة من 4: النص، +سعة، النص، -سعة.
 */
function buildRoadPath(waves: number, amplitude: number) {
  const segH = VIEW_H / waves;
  const cx = VIEW_W / 2;
  const boundaryX = (k: number) => {
    const m = ((k % 4) + 4) % 4;
    if (m === 1) return cx + amplitude;
    if (m === 3) return cx - amplitude;
    return cx;
  };
  let d = `M ${cx} 0`;
  for (let i = 1; i <= waves; i++) {
    const y0 = (i - 1) * segH;
    const y1 = i * segH;
    const xPrev = boundaryX(i - 1);
    const xCur = boundaryX(i);
    d += ` C ${xPrev} ${y0 + segH / 2}, ${xCur} ${y1 - segH / 2}, ${xCur} ${y1}`;
  }
  return d;
}

const ROAD_D = buildRoadPath(10, 11);

export default function DeliveryJourney({ data }: Props) {
  const reduce = useReducedMotion();
  const { t } = useLang();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.4 });

  const pathRef = useRef<SVGPathElement>(null);
  const leftX = useMotionValue(50);
  const topY = useMotionValue(0);

  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [ctaBurst, setCtaBurst] = useState(false);
  const honkedRef = useRef<Set<string>>(new Set());

  // موضع العربية على الطريق المتعرج بيتحسب مباشرة من تقدّم السكرول
  const placeOnRoad = (v: number) => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * Math.min(1, Math.max(0, v)));
    leftX.set((pt.x / VIEW_W) * 100);
    topY.set((pt.y / VIEW_H) * 100);
  };

  useEffect(() => {
    placeOnRoad(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(progress, "change", placeOnRoad);

  // العربية "بتحس" بمكان الماوس أفقيًا - انحراف بسيط ناحيته
  const mouseLean = useMotionValue(0);
  const mouseLeanSpring = useSpring(mouseLean, { stiffness: 90, damping: 18, mass: 0.4 });
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      const pct = e.clientX / window.innerWidth; // 0..1
      mouseLean.set((pct - 0.5) * 10); // -5..+5
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, mouseLean]);

  // مراقبة الأقسام: أنهي سكشن ظاهر دلوقتي في نص الشاشة
  useEffect(() => {
    if (reduce) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as SectionId;
          setActiveId(id);
          if (CTA_SECTIONS.has(id) && !honkedRef.current.has(id)) {
            honkedRef.current.add(id);
            setCtaBurst(true);
            setTimeout(() => setCtaBurst(false), 900);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reduce]);

  // جوا سكشن الخدمات: أنهي خدمة بالظبط تحت نص الشاشة دلوقتي
  useEffect(() => {
    if (reduce || activeId !== "services") return;
    const el = document.getElementById("services");
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const fraction = (window.innerHeight / 2 - rect.top) / rect.height;
      const idx = Math.min(
        data.services.items.length - 1,
        Math.max(0, Math.floor(fraction * data.services.items.length))
      );
      setServiceIdx(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce, activeId, data.services.items]);

  const meta = useMemo(() => {
    const map: Partial<Record<SectionId, { icon: string; label: L }>> = {
      how: { icon: "🧭", label: data.howItWorks.eyebrow },
      features: { icon: "✨", label: data.features.eyebrow },
      calculator: { icon: "🧮", label: data.calculator.eyebrow },
      walkthrough: { icon: "📱", label: data.walkthrough.eyebrow },
      plans: { icon: "🎟️", label: data.plans.eyebrow },
      download: { icon: "📲", label: data.download.eyebrow },
      faq: { icon: "❓", label: data.faq.eyebrow },
    };
    return map;
  }, [data]);

  const leftPercent = useTransform(leftX, (v) => `${v}%`);
  const topPercent = useTransform(topY, (v) => `${v}%`);

  if (reduce) return null;

  const current =
    activeId === "services"
      ? { icon: data.services.items[serviceIdx]?.icon ?? "🚗", label: data.services.items[serviceIdx]?.title }
      : activeId
        ? meta[activeId]
        : undefined;

  const icon = current?.icon ?? "🚗";
  const showLabel = !!current?.label;
  const isCta = !!activeId && CTA_SECTIONS.has(activeId);

  return (
    <div className="pointer-events-none fixed inset-s-3 top-24 bottom-24 z-30 hidden w-10 md:block" aria-hidden>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {/* الطريق نفسه */}
        <path
          ref={pathRef}
          d={ROAD_D}
          fill="none"
          stroke="var(--color-brand-ink)"
          strokeOpacity={0.1}
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* الجزء اللي العربية قطعته */}
        <motion.path
          d={ROAD_D}
          fill="none"
          stroke="var(--color-brand-yellow)"
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      </svg>

      {/* العربية */}
      <motion.div
        style={{
          left: leftPercent,
          top: topPercent,
          x: mouseLeanSpring,
          rotate: mouseLeanSpring,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <AnimatePresence>
          {ctaBurst && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute inset-0 -z-10 rounded-full bg-brand-yellow/50"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={isCta ? { y: [0, -6, 0] } : { y: 0 }}
          transition={isCta ? { duration: 0.6, repeat: Infinity, repeatType: "loop" } : undefined}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-lg shadow-lg ring-4 ring-brand-yellow/25"
        >
          {icon}
        </motion.div>

        <AnimatePresence>
          {showLabel && current?.label && (
            <motion.div
              key={t(current.label)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.25 }}
              className="absolute top-1/2 inset-s-full ms-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-brand-ink shadow-md"
            >
              {t(current.label)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
