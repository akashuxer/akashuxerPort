"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * “akash” in pure black (light theme) / white (dark theme).
 * Uses next-themes `resolvedTheme` — not Tailwind `dark:` — so OS color scheme
 * cannot force white when the app theme is light.
 */
export function LogoAkashWord({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <span
      suppressHydrationWarning
      className={cn(
        isDark ? "text-[#ffffff]" : "text-[#000000]",
        className
      )}
    >
      akash
    </span>
  );
}
