"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  /** "ink": نقط بلون brand-ink خفيفة فوق خلفية فاتحة | "glow": نقط صفراء متوهجة فوق خلفية غامقة */
  theme?: "ink" | "glow";
  className?: string;
};

const GAP = 46;

/**
 * خلفية "حيّة" مرسومة بالكامل بـ canvas 2D (نفس الفكرة اللي لقيتها في كود
 * waabi.ai): شبكة نقط بتتوهج بموجة هادئة بتتحرك مع السكرول، وبتلمع أكتر
 * قريب من الماوس. رخيصة جدًا (canvas 2D بسيط، من غير WebGL) وبتوقف الرسم
 * تلقائيًا لو السكشن مش ظاهر في الشاشة، وبتحترم إعداد "تقليل الحركة".
 */
export default function AmbientDots({ theme = "ink", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    let width = 0;
    let height = 0;
    let scrollOffset = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let visible = true;
    let rafId = 0;

    const rgb = theme === "glow" ? "255,196,19" : "83,40,19";
    const baseAlpha = theme === "glow" ? 0.14 : 0.06;
    const waveAlpha = theme === "glow" ? 0.32 : 0.09;
    const mouseAlpha = theme === "glow" ? 0.85 : 0.32;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(time: number) {
      if (visible && !reduce) {
        ctx!.clearRect(0, 0, width, height);
        const t = time * 0.001;
        for (let y = GAP / 2; y < height; y += GAP) {
          for (let x = GAP / 2; x < width; x += GAP) {
            const wave = Math.sin((y + scrollOffset) / 300 + t * 0.5 + x / 620);
            const dist = Math.hypot(x - mouseX, y - mouseY);
            const boost = Math.max(0, 1 - dist / 150);
            const alpha = Math.min(1, baseAlpha + Math.max(0, wave) * waveAlpha + boost * mouseAlpha);
            const r = 1.3 + boost * 1.6;
            ctx!.beginPath();
            ctx!.arc(x, y, r, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
            ctx!.fill();
          }
        }
        rafId = requestAnimationFrame(draw);
      }
    }

    resize();
    if (reduce) {
      draw(0); // فريم ثابت واحد بس - من غير حركة مستمرة
    } else {
      rafId = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible && !reduce) rafId = requestAnimationFrame(draw);
    });
    io.observe(wrap);

    const onResize = () => resize();
    const onScroll = () => {
      scrollOffset = -wrap!.getBoundingClientRect().top;
    };
    const onMouseMove = (e: MouseEvent) => {
      const rect = wrap!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    wrap.addEventListener("mousemove", onMouseMove);
    wrap.addEventListener("mouseleave", onMouseLeave);

    return () => {
      visible = false;
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("mousemove", onMouseMove);
      wrap.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reduce, theme]);

  return (
    <div ref={wrapRef} className={className ?? "absolute inset-0"} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
