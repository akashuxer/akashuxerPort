"use client";

import { cn } from "@/lib/utils";
import { useHtmlIsDark } from "@/hooks/use-html-is-dark";

/**
 * “akash” is black in light mode and white in dark mode, driven by `<html class="dark">`
 * so it always matches the real theme (not lagging `resolvedTheme`).
 */
export function LogoAkashWord({ className }: { className?: string }) {
  const isDark = useHtmlIsDark();

  return (
    <span
      suppressHydrationWarning
      className={cn(
        isDark ? "text-white" : "text-black",
        className
      )}
    >
      akash
    </span>
  );
}
