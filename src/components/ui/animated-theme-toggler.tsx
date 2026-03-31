"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useHtmlIsDark } from "@/hooks/use-html-is-dark";
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
  const { setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  /** Mirrors `<html class="dark">` so icons never lag stale React state (fixes flaky toggles). */
  const darkMode = useHtmlIsDark();

  /**
   * Diagonal reveal runs in CSS on ::view-transition-new(root) — no await transition.ready,
   * so the animation starts as soon as the browser begins the view transition (fixes perceived lag).
   * Next theme is read from the DOM at click time so rapid taps / view transitions never use a stale mode.
   */
  const onToggle = useCallback(() => {
    if (!buttonRef.current) return;
    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    const run = () => {
      setTheme(next);
    };

    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      run();
      return;
    }

    try {
      document.startViewTransition(() => {
        flushSync(run);
      });
    } catch {
      run();
    }
  }, [prefersReducedMotion, setTheme]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-11 w-11 shrink-0 rounded-[var(--radius)] bg-transparent",
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
      data-theme-toggle
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-11 w-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-[var(--radius)] border border-transparent bg-transparent text-[var(--foreground)] outline-none transition-colors select-none hover:bg-[var(--muted)]/35 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
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
