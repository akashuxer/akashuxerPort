"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduce) return null;

  /* Direct scaleX from scroll — avoids spring physics every frame. */
  return (
    <motion.div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)]"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
