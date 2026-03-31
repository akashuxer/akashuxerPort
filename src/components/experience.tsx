"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

/** Company blocks with promotion history (LinkedIn-aligned). */
const companies = [
  {
    company: "o9 Solutions",
    meta: "Full-time · Hybrid · Bengaluru, Karnataka",
    roles: [
      {
        title: "Product Designer 2 — UX/Product Design",
        focus: "Design system · Rapid prototyping · R&D",
        period: "Apr 2024 — Present",
        location: "Bengaluru",
      },
      {
        title: "Product Designer 1 — UX/Product Design",
        focus: "Design system · Rapid prototyping · R&D",
        period: "Sep 2022 — Apr 2024",
        location: "Bengaluru",
      },
    ],
  },
  {
    company: "Capgemini",
    meta: "Full-time · 3 yrs 2 mos",
    roles: [
      {
        title:
          "Associate Consultant (Financial Services) — Experience Design (UX)",
        focus: "Agile · Accessibility · Financial services",
        period: "Sep 2021 — Sep 2022",
        location: "Pune / Pimpri-Chinchwad",
      },
      {
        title: "Senior Software Analyst — Experience Design (UX)",
        focus: "Enterprise UX · Financial services",
        period: "Sep 2020 — Aug 2021",
        location: "Pune / Pimpri-Chinchwad",
      },
      {
        title: "Software Analyst — Experience Design (UX)",
        focus: "UX delivery · Cross-functional collaboration",
        period: "Aug 2019 — Aug 2020",
        location: "Bengaluru, Karnataka",
      },
    ],
  },
] as const;

export function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-24 px-6 py-9 text-left md:px-8 md:py-11"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="mb-6 md:mb-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            Experience
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Work
          </h2>
        </motion.div>

        <div className="space-y-10 md:space-y-12">
          {companies.map((block, bi) => (
            <motion.div
              key={block.company}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.4, delay: 0.06 * bi, ease: [0.22, 1, 0.36, 1] }
              }
              className="py-1"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] md:text-[15px]">
                  {block.company}
                </h3>
                {block.meta ? (
                  <p className="shrink-0 font-mono text-[10px] text-[var(--foreground-muted)] md:text-[11px]">
                    {block.meta}
                  </p>
                ) : null}
              </div>
              <ul className="mt-4 flex flex-col gap-5 md:mt-3 md:gap-4">
                {block.roles.map((role) => (
                  <li
                    key={`${role.title}-${role.period}`}
                    className="md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:items-start md:gap-6"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[13px] leading-snug text-[var(--foreground)] md:text-sm">
                        {role.title}
                      </p>
                      <p className="font-mono text-[10px] leading-relaxed text-[var(--foreground-muted)] md:text-[11px]">
                        {role.focus}
                      </p>
                    </div>
                    <div className="mt-2 text-left md:mt-0 md:text-right">
                      <p className="font-mono text-[10px] leading-snug text-[var(--foreground-muted)] md:text-[11px]">
                        <span className="block md:inline">{role.period}</span>
                        <span className="hidden text-[var(--foreground-muted)]/50 md:inline">
                          {" "}
                          ·{" "}
                        </span>
                        <span className="mt-0.5 block md:mt-0 md:inline">
                          {role.location}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
