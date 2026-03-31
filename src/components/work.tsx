"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { inViewOptions } from "@/lib/in-view";
import { useRef } from "react";

const projects = [
  {
    title: "Orchestration console",
    org: "Enterprise AI platform",
    tags: ["AI workflows", "UX research", "Design system"],
    summary:
      "Authoring and monitoring multi-agent pipelines—with clear states, recovery paths, and operator-grade density.",
    accent: "from-violet-500/25 to-fuchsia-500/15",
  },
  {
    title: "Unified design language",
    org: "B2B analytics suite",
    tags: ["Design tokens", "Figma", "Documentation"],
    summary:
      "A token-first system spanning data viz, tables, and filters—coherent as the footprint grows.",
    accent: "from-cyan-500/20 to-blue-500/12",
  },
  {
    title: "Inclusive component library",
    org: "Collaboration product",
    tags: ["Accessibility", "WCAG 2.2", "Motion"],
    summary:
      "Primitives audited for keyboard, screen readers, and reduced motion—embedded in the pipeline.",
    accent: "from-emerald-500/20 to-teal-500/12",
  },
  {
    title: "Operator command center",
    org: "Infrastructure SaaS",
    tags: ["Information density", "Dark UI", "Research"],
    summary:
      "A mission-critical dashboard for on-call teams—progressive disclosure, keyboard paths, and calm hierarchy.",
    accent: "from-amber-500/15 to-orange-500/10",
  },
];

const tagContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.9, y: 4 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 500, damping: 28 },
  },
};

export function Work() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="work"
      ref={ref}
      className="scroll-mt-24 bg-[var(--muted)]/25 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]"
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.45 }}
            >
              Selected work
            </motion.p>
            <motion.h2
              className="font-[family-name:var(--font-display)] mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Case studies shaped around outcomes—not just screens.
            </motion.h2>
          </div>
          <motion.p
            className="max-w-sm text-sm text-[var(--foreground-muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            Representational engagements. Details anonymized where required for
            confidentiality.
          </motion.p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((proj, i) => (
            <motion.article
              key={proj.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.06 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduce ? undefined : { y: -5 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${proj.accent} opacity-50 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-35`}
              />
              <motion.div
                className="relative min-h-[220px] w-full overflow-hidden border-b border-[var(--border)]/80 bg-[var(--muted)]/40 md:min-h-[280px]"
                whileHover={reduce ? undefined : { scale: 1.01 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                {!reduce && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/25 via-transparent to-[var(--accent-secondary)]/20"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                      duration: 6 + i * 0.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                )}
                {!reduce && (
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 3 + i * 0.3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--foreground-muted)]">
                    Preview
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-80" />
              </motion.div>

              <div className="relative flex flex-1 flex-col p-6 md:p-8">
                <p className="text-xs font-medium text-[var(--foreground-muted)]">
                  {proj.org}
                </p>
                <h3 className="font-[family-name:var(--font-display)] mt-2 text-xl font-semibold text-[var(--foreground)] md:text-2xl">
                  {proj.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {proj.summary}
                </p>
                <motion.ul
                  className="mt-6 flex flex-wrap gap-2"
                  variants={tagContainer}
                  initial="hidden"
                  animate={inView ? "show" : "hidden"}
                >
                  {proj.tags.map((t) => (
                    <motion.li
                      key={t}
                      variants={tagItem}
                      className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)]/60 px-3 py-1 text-xs font-medium text-[var(--foreground-muted)] backdrop-blur-sm"
                      whileHover={
                        reduce ? undefined : { scale: 1.04, y: -2 }
                      }
                    >
                      {t}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.06 }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
