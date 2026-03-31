"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const aboutMetrics = [
  { value: "6+", label: "Yrs" },
  { value: "6+", label: "Honors" },
  { value: "10+", label: "Projects" },
  { value: "100+", label: "Features delivered" },
  { value: "600+", label: "Accessibility fixes" },
] as const;

export function About() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      ref={ref}
      className="scroll-mt-24 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              About
            </p>
            <h2 className="font-[family-name:var(--font-display)] mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--foreground)] md:text-4xl lg:text-[2.5rem]">
              I design software that teams can run, scale, and defend.
            </h2>
            <p className="mt-8 text-lg leading-[1.7] text-[var(--foreground-muted)] md:text-xl">
              I&apos;m a product designer who spends most of my time where
              complexity meets clarity—AI-assisted workflows, design systems, and
              accessibility. I work with product and engineering as one loop:
              research, prototyping, documentation, and the unglamorous follow‑through
              that makes a system stick.
            </p>
            <p className="mt-6 text-lg leading-[1.7] text-[var(--foreground-muted)] md:text-xl">
              Outside of delivery, I write and speak about humane B2B UX—how to
              ship fast without baking in debt for users who rely on your product
              every day.
            </p>

            <motion.div
              className="mt-10 border-t border-[var(--border)] pt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 }}
              role="list"
              aria-label="Career metrics"
            >
              <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-0">
                {aboutMetrics.map((m, i) => {
                  const delay = reduceMotion ? 0 : 0.14 + i * 0.072;
                  return (
                    <li
                      key={`${m.value}-${m.label}`}
                      role="listitem"
                      className={`flex flex-col items-center text-center lg:px-3 ${
                        i > 0 ? "lg:border-l lg:border-[var(--border)]/55" : ""
                      }`}
                    >
                      <motion.span
                        className="inline-block font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--foreground)] sm:text-2xl"
                        initial={
                          reduceMotion
                            ? false
                            : { opacity: 0, y: 18, scale: 0.86 }
                        }
                        animate={
                          inView
                            ? { opacity: 1, y: 0, scale: 1 }
                            : { opacity: 0, y: 18, scale: 0.86 }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                                delay,
                                type: "spring",
                                stiffness: 380,
                                damping: 22,
                                mass: 0.65,
                              }
                        }
                      >
                        {m.value}
                      </motion.span>
                      <motion.span
                        className="mt-1.5 max-w-[10rem] text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-[var(--foreground-muted)] sm:text-[11px] sm:tracking-[0.14em]"
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={
                          inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : {
                                delay: delay + 0.05,
                                duration: 0.35,
                                ease: [0.22, 1, 0.36, 1],
                              }
                        }
                      >
                        {m.label}
                      </motion.span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] max-h-[360px] w-full overflow-hidden rounded-2xl border border-[var(--border)]/55 bg-gradient-to-br from-[var(--muted)] to-[var(--card)] lg:sticky lg:top-28 dark:border-[var(--border)]/40"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[var(--accent)]/14 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[var(--accent-secondary)]/10 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--foreground-muted)]">
                Portrait / studio
              </span>
            </div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/75 via-transparent to-transparent"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
