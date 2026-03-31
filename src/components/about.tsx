"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const highlights = [
  { label: "Focus", value: "B2B & AI platforms" },
  { label: "Based in", value: "Remote · Global clients" },
  { label: "Engagements", value: "Embedded & advisory" },
];

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              About
            </p>
            <h2 className="font-[family-name:var(--font-display)] mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
              I design software that teams can run, scale, and defend.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
              I&apos;m a product designer who spends most of my time where
              complexity meets clarity—AI-assisted workflows, design systems, and
              accessibility. I work with product and engineering as one loop:
              research, prototyping, documentation, and the unglamorous follow‑through
              that makes a system stick.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
              Outside of delivery, I write and speak about humane B2B UX—how to
              ship fast without baking in debt for users who rely on your product
              every day.
            </p>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-10"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[var(--accent-secondary)]/10 blur-3xl" />
            <div className="relative aspect-[4/3] max-h-[280px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--muted)] to-[var(--card)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                  Portrait / studio
                </span>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent"
                aria-hidden
              />
            </div>
            <ul className="relative mt-8 flex flex-col gap-5">
              {highlights.map((h, i) => (
                <motion.li
                  key={h.label}
                  className="flex items-baseline justify-between gap-4"
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.45 }}
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                    {h.label}
                  </span>
                  <span className="text-right text-sm font-semibold text-[var(--foreground)]">
                    {h.value}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
