"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const articles = [
  {
    title: "Designing AI workflows people actually trust",
    outlet: "UX Collective",
    date: "Feb 2025",
    read: "8 min read",
    href: "https://example.com",
    tag: "AI & trust",
    featured: true,
  },
  {
    title: "Tokens, governance, and the politics of design systems",
    outlet: "Systems & Us",
    date: "Nov 2024",
    read: "12 min read",
    href: "https://example.com",
    tag: "Systems",
    featured: false,
  },
  {
    title: "Accessibility isn’t a checklist—it’s a product skill",
    outlet: "A11y Project",
    date: "Aug 2024",
    read: "6 min read",
    href: "https://example.com",
    tag: "A11y",
    featured: false,
  },
  {
    title: "Density without chaos in enterprise dashboards",
    outlet: "Pattern Review",
    date: "May 2024",
    read: "10 min read",
    href: "https://example.com",
    tag: "B2B UX",
    featured: false,
  },
];

export function Articles() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  const featured = articles.find((a) => a.featured)!;
  const rest = articles.filter((a) => !a.featured);

  return (
    <section
      id="articles"
      ref={ref}
      className="scroll-mt-24 bg-[var(--muted)]/25 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Articles
            </p>
            <h2 className="font-[family-name:var(--font-display)] mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              Writing on craft, systems, and humane software.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--foreground-muted)]">
            Long-form notes from the field—how teams ship better B2B experiences.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.a
            href={featured.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] lg:row-span-2"
          >
            <div className="relative min-h-[220px] overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 via-[var(--muted)] to-[var(--accent-secondary)]/15 md:min-h-[280px]">
              {!reduce && (
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, var(--accent) 0%, transparent 45%), radial-gradient(circle at 80% 60%, var(--accent-secondary) 0%, transparent 40%)",
                  }}
                  animate={{ opacity: [0.35, 0.55, 0.35] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-[var(--radius)] border border-[var(--border)]/60 bg-[var(--background)]/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--foreground-muted)] backdrop-blur-sm">
                  Featured essay
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-8">
              <span className="inline-flex w-fit rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                {featured.tag}
              </span>
              <h3 className="font-[family-name:var(--font-display)] mt-4 text-2xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)] md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                {featured.outlet}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                <span>{featured.date}</span>
                <span className="inline-flex items-center gap-2 text-[var(--foreground)]">
                  Read
                  <ArrowIcon />
                </span>
              </div>
            </div>
          </motion.a>

          <div className="flex flex-col gap-4">
            {rest.map((article, i) => (
              <motion.a
                key={article.title}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduce ? undefined : { x: 4 }}
                className="group flex gap-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--muted)]/30 md:p-6"
              >
                <div className="relative hidden h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--card)] sm:block">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                    Cover
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)]/90 to-transparent" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {article.tag}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] mt-2 text-lg font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    {article.outlet}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                    <span>{article.date}</span>
                    <span>{article.read}</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 text-[var(--foreground)]">
                      Open
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
