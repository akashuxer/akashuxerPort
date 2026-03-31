"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const featured = {
  year: "2025",
  title: "UX Design Award",
  context: "Enterprise software · AI & automation category",
  org: "Design Guild Awards",
};

const awards = [
  {
    year: "2024",
    title: "Accessibility in practice",
    context: "Honorable mention · Inclusive product design",
    org: "A11y Collective",
  },
  {
    year: "2024",
    title: "Design system leadership",
    context: "Shortlist · Systems at scale",
    org: "Systems Conf",
  },
  {
    year: "2023",
    title: "Best B2B experience",
    context: "Annual product design showcase",
    org: "SaaS Design Review",
  },
];

export function Awards() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="awards"
      ref={ref}
      className="scroll-mt-24 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[var(--accent-secondary)]/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Awards &amp; recognition
            </p>
            <h2 className="font-[family-name:var(--font-display)] mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              Recognition from teams and programs I respect.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="max-w-sm text-right text-sm text-[var(--foreground-muted)] md:text-right">
              Highlights only—most impactful work stays under NDA. Happy to walk
              through specifics in conversation.
            </p>
            <div className="flex gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 px-5 py-3 backdrop-blur-sm">
              <div className="text-center">
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--accent)]">
                  4+
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Honors
                </p>
              </div>
              <div className="w-px bg-[var(--border)]" />
              <div className="text-center">
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--foreground)]">
                  3
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                  Years
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--muted)]/50 p-8 md:p-10"
        >
          <div className="absolute right-6 top-6 opacity-[0.12] md:right-10 md:top-10">
            <AwardGlyph className="h-24 w-24 text-[var(--accent)] md:h-32 md:w-32" />
          </div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
                Featured
              </span>
              <p className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold tabular-nums text-[var(--accent)] md:text-5xl">
                {featured.year}
              </p>
              <h3 className="font-[family-name:var(--font-display)] mt-4 max-w-lg text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm text-[var(--foreground-muted)] md:text-base">
                {featured.context}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--background)]/60 px-5 py-4 text-right backdrop-blur-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Presented by
              </p>
              <p className="mt-1 font-semibold text-[var(--foreground)]">
                {featured.org}
              </p>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-1 w-full origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)]"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.article>

        <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
          {awards.map((a, i) => (
            <motion.article
              key={`${a.year}-${a.title}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.12 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <AwardGlyph className="absolute -right-2 -top-2 h-16 w-16 text-[var(--accent)]/15 transition-transform group-hover:scale-110" />
              <div className="relative flex items-start justify-between gap-3">
                <span className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--accent)]/90">
                  {a.year}
                </span>
                <span className="max-w-[120px] text-right text-[10px] font-medium uppercase leading-tight tracking-wider text-[var(--foreground-muted)]">
                  {a.org}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] relative mt-4 text-base font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                {a.title}
              </h3>
              <p className="relative mt-2 text-xs leading-relaxed text-[var(--foreground-muted)]">
                {a.context}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path
        d="M32 8 38 22l15 2-11 10 3 15-13-8-13 8 3-15-11-10 15-2 6-14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 44c4 4 8 6 12 8 4-2 8-4 12-8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
