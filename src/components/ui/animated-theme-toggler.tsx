"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

export type AnimatedThemeTogglerProps = {
  className?: string;
};

export function AnimatedThemeToggler({ className }: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const darkMode = resolvedTheme === "dark";

  /**
   * Diagonal reveal runs in CSS on ::view-transition-new(root) — no await transition.ready,
   * so the animation starts as soon as the browser begins the view transition (fixes perceived lag).
   */
  const onToggle = useCallback(() => {
    if (!buttonRef.current) return;
    const next = darkMode ? "light" : "dark";

    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      setTheme(next);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(next);
      });
    });
  }, [darkMode, prefersReducedMotion, setTheme]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 shrink-0 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/30",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      data-cursor="pointer"
      data-no-ripple
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/40 text-[var(--foreground)] outline-none backdrop-blur-sm transition-colors hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        className
      )}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <Sun
          className={cn(
            "absolute size-[18px] transition-[opacity,transform] duration-200 ease-out",
            darkMode
              ? "scale-100 rotate-0 opacity-100"
              : "pointer-events-none scale-75 rotate-12 opacity-0"
          )}
          strokeWidth={1.75}
          aria-hidden
        />
        <Moon
          className={cn(
            "absolute size-[18px] transition-[opacity,transform] duration-200 ease-out",
            darkMode
              ? "pointer-events-none scale-75 -rotate-12 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )}
          strokeWidth={1.75}
          aria-hidden
        />
      </span>
    </button>
  );
}
