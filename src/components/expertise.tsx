"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";

const pillars = [
  {
    title: "AI workflow experiences",
    description:
      "Designing trust, clarity, and control for multi-step automations, copilots, and human-in-the-loop flows—so teams ship AI that feels intentional, not improvised.",
    icon: WorkflowIcon,
  },
  {
    title: "Design systems at scale",
    description:
      "Tokens, components, and documentation that align product and engineering. Built for governance, versioning, and adoption across squads and brands.",
    icon: SystemIcon,
  },
  {
    title: "Accessibility by default",
    description:
      "Inclusive patterns, contrast, motion, and keyboard paths baked into the system—so compliance is a baseline, not a late-stage patch.",
    icon: A11yIcon,
  },
];

export function Expertise() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="expertise"
      ref={ref}
      className="scroll-mt-24 px-6 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]"
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            Expertise
          </motion.p>
          <motion.h2
            className="font-[family-name:var(--font-display)] mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            Where strategy meets craft—for teams building serious software.
          </motion.h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.1 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduce ? undefined : { y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.25)]"
            >
              <motion.div
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl"
                initial={false}
                whileHover={{ scale: 1.15, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="relative">
                <motion.div
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 text-[var(--accent)]"
                  whileHover={reduce ? undefined : { rotate: 6, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  <p.icon />
                </motion.div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {p.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="6"
        width="6"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="12"
        y="4"
        width="6"
        height="16"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 12h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.circle
        cx="18"
        cy="12"
        r="2"
        fill="currentColor"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function A11yIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v3M12 16v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 14c1.5 1 6.5 1 8 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
