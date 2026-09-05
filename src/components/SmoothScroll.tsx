"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * يفعّل السكرول الناعم (momentum scroll) في الموقع كله،
 * بنفس الفكرة اللي شغالة في terminal-industries.com (مكتبة lenis).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
