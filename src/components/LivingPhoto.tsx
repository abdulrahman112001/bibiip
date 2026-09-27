"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = { src: string; className?: string };

/**
 * "صورة حيّة": مش صورة ثابتة عادية، فيديو قصير بيتشغل مرة واحدة بس لما
 * يدخل الشاشة، وبمجرد ما يخلص بيتجمّد آخر فريم منه فيحس المستخدم إنها
 * "اتحولت" لصورة ثابتة - نفس تريك "الفيديو المرسوم على canvas" اللي لقيته
 * في كود waabi.ai (بدل عرض الـ<video> مباشرة، بنرسم كل فريم منه على canvas).
 * بيبدأ يشتغل بس لما يدخل الشاشة فعلًا (IntersectionObserver)، وتحت
 * إعداد "تقليل الحركة" بنعرض آخر فريم على طول كصورة ثابتة من غير تشغيل.
 */
export default function LivingPhoto({ src, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !video || !wrap || !ctx) return;

    let rafId = 0;
    let started = false;
    let isVisible = false;
    let metadataReady = false;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.max(1, Math.round(rect.width * dpr));
      canvas!.height = Math.max(1, Math.round(rect.height * dpr));
    }

    function drawFrame() {
      const w = canvas!.width;
      const h = canvas!.height;
      const vw = video!.videoWidth;
      const vh = video!.videoHeight;
      if (!w || !h || !vw || !vh) return;
      const scale = Math.max(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      ctx!.drawImage(video!, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    function loop() {
      drawFrame();
      if (!video!.ended) rafId = requestAnimationFrame(loop);
    }

    function begin() {
      if (started) return;
      started = true;

      if (reduce) {
        const onSeeked = () => {
          drawFrame();
          video!.removeEventListener("seeked", onSeeked);
        };
        video!.addEventListener("seeked", onSeeked);
        video!.currentTime = Math.max(0, (video!.duration || 1) - 0.15);
        return;
      }

      video!.play().catch(() => {});
      rafId = requestAnimationFrame(loop);
    }

    function tryBegin() {
      if (isVisible && metadataReady) begin();
    }

    resize();
    if (video.readyState >= 1) {
      metadataReady = true;
    } else {
      video.addEventListener(
        "loadedmetadata",
        () => {
          metadataReady = true;
          resize();
          tryBegin();
        },
        { once: true }
      );
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) tryBegin();
      },
      { threshold: 0.2 }
    );
    io.observe(wrap);

    const onResize = () => {
      resize();
      drawFrame();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [reduce]);

  return (
    <div ref={wrapRef} className={className}>
      <video ref={videoRef} src={src} muted playsInline preload="metadata" className="hidden" />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
