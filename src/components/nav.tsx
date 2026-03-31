"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Mail,
  MessageCircle,
  type LucideIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { NavKey } from "@/hooks/use-active-nav";
import { useActiveNav } from "@/hooks/use-active-nav";
import { LogoAkashWord } from "@/components/logo-akash-word";
import { scrollToSection } from "@/lib/nav-scroll";
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

const mobileBar: {
  href: string;
  shortLabel: string;
  navKey: NavKey;
  Icon: LucideIcon;
}[] = [
  { href: "#work", shortLabel: "Work", navKey: "work", Icon: Briefcase },
  { href: "#about", shortLabel: "About", navKey: "about", Icon: UserRound },
  {
    href: "#testimonials",
    shortLabel: "Say",
    navKey: "testimonials",
    Icon: MessageCircle,
  },
  { href: "#contact", shortLabel: "Contact", navKey: "contact", Icon: Mail },
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
  const reduceMotion = Boolean(useReducedMotion());

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
        scrollToSection(href, reduceMotion, onNavigate);
      }}
      whileHover={reduceMotion ? undefined : { y: -1 }}
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

function MobileBottomItem({
  href,
  shortLabel,
  Icon,
  active,
}: {
  href: string;
  shortLabel: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <button
      type="button"
      data-no-ripple
      onClick={() => scrollToSection(href, reduceMotion)}
      aria-label={shortLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-[3.25rem] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 px-0.5 py-1.5 transition-colors select-none active:opacity-80",
        active
          ? "text-[var(--accent)]"
          : "text-[var(--foreground-muted)]"
      )}
    >
      <Icon
        className="size-[22px] shrink-0 stroke-[1.75]"
        aria-hidden
      />
      <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight tracking-tight">
        {shortLabel}
      </span>
    </button>
  );
}

export function Nav() {
  const pathname = usePathname();
  const reduceMotion = Boolean(useReducedMotion());
  const [scrolled, setScrolled] = useState(false);
  /** Below `md`, top bar stays glassy even at scroll top (mobile polish). */
  const [narrowViewport, setNarrowViewport] = useState(false);
  const activeNav = useActiveNav();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrowViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const glass = scrolled || narrowViewport;

  return (
    <>
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
        <nav className="px-6 md:px-8" aria-label="Primary">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between md:h-16">
            <Link
              href="/"
              className="touch-manipulation rounded-[var(--radius)] py-1 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
              onClick={(e) => {
                if (pathname !== "/") return;
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: reduceMotion ? "auto" : "smooth",
                });
                window.history.replaceState(null, "", "/");
              }}
            >
              <LogoAkashWord />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                Uxer
              </span>
            </Link>
            <div className="hidden items-center md:flex md:gap-4 lg:gap-5">
              <ul className="flex items-center gap-2.5 text-[12px] font-medium text-[var(--foreground-muted)] md:gap-3 lg:gap-4 lg:text-sm">
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
              <span
                className="h-5 w-px shrink-0 bg-[var(--border)]/70 dark:bg-[var(--border)]/50"
                aria-hidden
              />
              <AnimatedThemeToggler />
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile: app-style bottom bar (sections + theme) */}
      <nav
        className={cn(
          "fixed right-0 bottom-0 left-0 z-50 md:hidden",
          "border-t border-[var(--border)]/35 bg-[var(--background)]/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-3xl backdrop-saturate-[1.65]",
          "dark:border-[var(--border)]/30 dark:bg-[var(--background)]/32 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] supports-[backdrop-filter]:bg-[var(--background)]/28"
        )}
        data-no-ripple
        aria-label="Section navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-0.5 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {mobileBar.map((item) => (
            <MobileBottomItem
              key={item.href}
              href={item.href}
              shortLabel={item.shortLabel}
              Icon={item.Icon}
              active={activeNav === item.navKey}
            />
          ))}
          <div className="flex min-h-[3.25rem] shrink-0 flex-col items-center justify-center gap-0.5 px-0.5 pt-0.5">
            <AnimatedThemeToggler />
            <span className="text-center text-[10px] font-medium leading-tight tracking-tight text-[var(--foreground-muted)]">
              Theme
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
