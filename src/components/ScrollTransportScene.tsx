"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

/**
 * نفس ميكانيزم terminal-industries.com بالظبط (اتفحصت من كود الموقع فعليًا):
 * - عنصر "sticky" ثابت بارتفاع شاشة واحدة (100vh)
 * - جوا حاوي أطول بكتير (280vh) بيدي "مساحة سكرول"
 * - وبدل ما الفيديو يتشغل لوحده، إحنا بنوقفه (pause) ونتحكم في currentTime
 *   يدويًا حسب نسبة تقدم السكرول (0 → 1).
 *
 * ملحوظة مهمة (باگ شائع في scroll-scrub): لو غيّرنا currentTime في كل تحديث
 * سكرول من غير ما ننتظر الـ seek اللي قبله يخلص، المتصفح بيراكم طلبات seek
 * فوق بعض والفيديو بيفضل "عالق" على نفس الفريم تقريبًا. الحل: نمسك آخر وقت
 * مطلوب في ref، ولما الـ seek الحالي يخلص (حدث "seeked") نطبّق آخر قيمة اتطلبت.
 */
export default function ScrollTransportScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  const { scrollYProgress: p } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
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

    // الميتاداتا ممكن تكون اتحملت بالفعل قبل ما الـ effect ده يتنفذ أصلًا
    // (سباق بين تحميل الفيديو وتركيب الـ listener) - نتأكد يدويًا كمان
    if (video.readyState >= 1 && video.duration) {
      durationRef.current = video.duration;
    }

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  useMotionValueEvent(p, "change", (progress) => {
    const video = videoRef.current;
    const duration = durationRef.current;
    if (!video || !duration) return;
    const clamped = Math.min(0.98, Math.max(0.01, progress));
    targetTimeRef.current = clamped * duration;
    if (!seekingRef.current) {
      const diff = Math.abs(video.currentTime - targetTimeRef.current);
      if (diff >= 0.03) {
        seekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    }
  });

  return (
    <div ref={wrapRef} className="relative" style={{ height: "280vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-yellow-soft">
        <video
          ref={videoRef}
          src="/brand/action-reel.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* تظليل خفيف فوق عشان الـ nav يبان واضح، وتحت عشان الانتقال لباقي الصفحة يبقى ناعم */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </div>
  );
}
