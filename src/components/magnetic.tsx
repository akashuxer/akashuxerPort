"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";
import { useRef } from "react";

type MagneticProps = ComponentProps<typeof motion.a> & {
  strength?: number;
};

export function Magnetic({
  children,
  strength = 0.35,
  className,
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={reduce ? undefined : { x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.a>
  );
}
