"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { NavKey } from "@/hooks/use-active-nav";
import { useActiveNav } from "@/hooks/use-active-nav";
import { LogoAkashWord } from "@/components/logo-akash-word";
import { cn } from "@/lib/utils";

const links: {
  href: string;
  label: string;
  navKey: NavKey;
}[] = [
  { href: "#work", label: "Work", navKey: "work" },
  { href: "#about", label: "About", navKey: "about" },
  { href: "#testimonials", label: "What Other's Say?", navKey: "testimonials" },
  { href: "#contact", label: "Get in Touch", navKey: "contact" },
];

function NavAnchor({
  href,
  className,
  children,
  onNavigate,
  active,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const id = href.startsWith("#") ? href.slice(1) : href;

  return (
    <motion.a
      href={href}
      className={cn(
        "relative inline-block touch-manipulation rounded-[var(--radius)] px-2 py-2 transition-colors md:px-1.5 md:py-1",
        active
          ? "font-medium text-[var(--foreground)] md:bg-transparent"
          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] active:bg-[var(--muted)]/50 md:active:bg-transparent",
        active && "bg-[var(--muted)]/45 md:bg-transparent",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        const el = document.getElementById(id);
        el?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", href);
        }
        if (id === "contact" && !reduce) {
          void import("@/lib/contact-confetti").then((m) => m.fireContactConfetti());
        }
      }}
      whileHover={reduce ? undefined : { y: -1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {active ? (
        <span
          className="pointer-events-none absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--accent)]/80 to-transparent"
          aria-hidden
        />
      ) : null}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeNav = useActiveNav();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = scrolled || open;

  return (
    <motion.header
      data-no-ripple
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out",
        glass
          ? "border-b border-[var(--border)]/30 bg-[var(--background)]/28 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-3xl backdrop-saturate-[1.65] dark:bg-[var(--background)]/22 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:border-[var(--border)]/28 supports-[backdrop-filter]:bg-[var(--background)]/20"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none backdrop-saturate-100"
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="px-6 md:px-8">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between md:h-16">
        <Link
          href="/"
          className="touch-manipulation rounded-[var(--radius)] py-1 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
        >
          <LogoAkashWord />
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Uxer
          </span>
        </Link>
        <ul className="hidden items-center gap-2.5 text-[12px] font-medium text-[var(--foreground-muted)] md:flex md:gap-3 lg:gap-4 lg:text-sm">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            >
              <NavAnchor
                href={l.href}
                active={activeNav === l.navKey}
                className="lg:whitespace-nowrap"
              >
                {l.label}
              </NavAnchor>
            </motion.li>
          ))}
        </ul>
        <div className="flex items-center gap-2 md:gap-3">
          <motion.button
            type="button"
            data-no-ripple
            className="relative flex h-11 w-11 touch-manipulation items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/40 select-none active:scale-[0.96] md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative block h-3 w-4">
              <motion.span
                className="absolute left-0 top-0 block h-0.5 w-4 rounded-full bg-[var(--foreground)]"
                animate={
                  open
                    ? { y: 6, rotate: 45 }
                    : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute left-0 top-[7px] block h-0.5 w-4 rounded-full bg-[var(--foreground)]"
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-[14px] block h-0.5 w-4 rounded-full bg-[var(--foreground)]"
                animate={
                  open
                    ? { y: -6, rotate: -45 }
                    : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.25 }}
              />
            </span>
          </motion.button>
          <AnimatedThemeToggler />
        </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 md:px-8">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavAnchor
                    href={l.href}
                    active={activeNav === l.navKey}
                    className="block touch-manipulation rounded-lg px-3 py-3 text-sm hover:bg-[var(--muted)] active:bg-[var(--muted)]/80"
                    onNavigate={() => setOpen(false)}
                  >
                    {l.label}
                  </NavAnchor>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
