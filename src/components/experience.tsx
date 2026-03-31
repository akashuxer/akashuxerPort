"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const companies = [
  {
    company: "o9 Solutions",
    roles: [
      {
        title: "Product Designer 2 — UX/Product Design",
        period: "Apr 2024 — Present",
        location: "Bengaluru, Karnataka",
      },
      {
        title: "Product Designer 1 — UX/Product Design",
        period: "Sep 2022 — Apr 2024",
        location: "Bengaluru, Karnataka",
      },
    ],
  },
  {
    company: "Capgemini",
    roles: [
      {
        title:
          "Associate Consultant (Financial Services) — Experience Design (UX)",
        period: "Sep 2021 — Sep 2022",
        location: "Pune, Maharashtra",
      },
      {
        title: "Senior Software Analyst — Experience Design (UX)",
        period: "Sep 2020 — Aug 2021",
        location: "Pune, Maharashtra",
      },
      {
        title: "Software Analyst — Experience Design (UX)",
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
      className="scroll-mt-24 px-6 py-20 text-left md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="mb-12 md:mb-14"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Experience
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Work
          </h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[var(--border)]/40">
          {companies.map((block, bi) => (
            <motion.div
              key={block.company}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: 0.5,
                      delay: 0.06 * bi,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              className={bi === 0 ? "md:pr-10 lg:pr-14" : "md:pl-10 lg:pl-14"}
            >
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--foreground)] md:text-xl">
                {block.company}
              </h3>
              <ul className="mt-8 flex flex-col gap-0">
                {block.roles.map((role, ri) => (
                  <li
                    key={`${role.title}-${role.period}`}
                    className={
                      ri > 0
                        ? "border-t border-[var(--border)]/50 pt-6 dark:border-[var(--border)]/35"
                        : ""
                    }
                  >
                    <p className="text-[15px] font-medium leading-snug text-[var(--foreground)] md:text-[17px] md:leading-relaxed">
                      {role.title}
                    </p>
                    <div className="mt-3 flex flex-col gap-0.5 text-sm text-[var(--foreground-muted)] md:flex-row md:items-baseline md:justify-between md:gap-4 md:text-[15px]">
                      <span className="tabular-nums">{role.period}</span>
                      <span className="md:text-right">{role.location}</span>
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
