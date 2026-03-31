"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 380;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [reduce]);

  return (
    <motion.div
      className="pointer-events-none fixed bottom-6 right-6 z-[45] md:bottom-8 md:right-8"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <button
        type="button"
        data-cursor="pointer"
        data-no-ripple
        onClick={goTop}
        aria-label="Scroll to top"
        className={cn(
          "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius)]",
          "border border-[var(--border)]/80 bg-[var(--background)]/85 text-[var(--foreground)] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md",
          "transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--muted)]/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          "dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
        )}
      >
        <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
    </motion.div>
  );
}
