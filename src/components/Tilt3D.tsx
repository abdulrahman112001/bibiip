"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** أقصى زاوية ميل بالدرجات */
  max?: number;
  /** مقدار التكبير عند مرور الماوس */
  scale?: number;
};

/**
 * غلاف بيدّي العنصر إحساس 3D: بيتمايل حسب مكان الماوس بحركة زنبركية ناعمة،
 * وبيرجع لمكانه لما الماوس يسيبه. بيحترم إعداد "تقليل الحركة" في النظام.
 */
export default function Tilt3D({ children, className, max = 9, scale = 1.03 }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 150, damping: 15, mass: 0.3 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
