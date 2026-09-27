"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** يخليها تختفي تاني لو رجعت السكرول لفوق، زي reveal-y في الموقع الأصلي */
  repeat?: boolean;
  /**
   * "up" (افتراضي): فيد-إن + حركة لأعلى بسيطة.
   * "flip": دخول 3D حقيقي — بيميل لفوق من الأسفل (perspective) + بلور بيتصفّى +
   * تكبير خفيف، إحساس أعمق (5D) للعناصر الكبيرة زي العناوين والكروت.
   */
  variant?: "up" | "flip";
};

/**
 * نسخة Next.js من كومبوننت "reveal-y" الموجود في terminal-industries.com:
 * العنصر بيدخل بفيد-إن + حركة لأعلى، ولو خرج من الشاشة تاني (سكرول لفوق) بيختفي من جديد.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  repeat = true,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.3,
    margin: "-10% 0px -10% 0px",
    once: !repeat,
  });

  const variants: Variants =
    variant === "flip"
      ? {
          hidden: { opacity: 0, y: y + 20, rotateX: 55, scale: 0.92, filter: "blur(8px)" },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 1, ease: [0.19, 1, 0.22, 1], delay },
          },
        }
      : {
          hidden: { opacity: 0, y },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.9,
              ease: [0.19, 1, 0.22, 1],
              delay,
            },
          },
        };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      style={variant === "flip" ? { transformPerspective: 1200, transformOrigin: "bottom" } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
