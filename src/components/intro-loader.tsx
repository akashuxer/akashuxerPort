"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { LogoAkashWord } from "@/components/logo-akash-word";

const INTRO_MS = 3000;
const STEP_MS = 1000;

const subscribeNoop = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

/** Edit these to match your portfolio */
export const INTRO_HIGHLIGHTS = [
  {
    kicker: "Name",
    title: "Akash Upadhyay",
    line: "Product designer · B2B & AI experiences",
  },
  {
    kicker: "Experience",
    title: "AI workflows · Systems · Accessibility",
    line: "Embedded with product & engineering teams",
  },
  {
    kicker: "Awards",
    title: "Recognition",
    line: "UX, design systems, and inclusive product honors",
  },
  {
    kicker: "Work",
    title: "Enterprise & SaaS",
    line: "Case studies across analytics, AI platforms, and collaboration",
  },
  {
    kicker: "Ready",
    title: "Portfolio",
    line: "Scroll to explore — or jump from the nav",
  },
] as const;

const NODES = [
  { x: 10, y: 30 },
  { x: 28, y: 18 },
  { x: 22, y: 48 },
  { x: 48, y: 28 },
  { x: 72, y: 38 },
  { x: 88, y: 24 },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 4],
  [4, 5],
  [0, 2],
  [2, 3],
  [4, 2],
];

function IntroNeuralBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.1]">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {EDGES.map(([a, b], i) => {
          const p = NODES[a];
          const q = NODES[b];
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="var(--accent)"
              strokeWidth={0.06}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.35}
              animate={{ strokeDashoffset: [0, -2] }}
              transition={{
                duration: 4 + (i % 3) * 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.12,
              }}
              style={{ strokeDasharray: "0.15 1.2" }}
            />
          );
        })}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={0.35}
            fill="var(--accent-secondary)"
            initial={false}
            animate={{ opacity: [0.25, 0.7, 0.25] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function IntroSequence() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, INTRO_HIGHLIGHTS.length - 1));
    }, STEP_MS);
    return () => window.clearInterval(iv);
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
            {INTRO_HIGHLIGHTS[step].kicker}
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-5 text-2xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-[1.75rem]">
            {INTRO_HIGHLIGHTS[step].title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--foreground-muted)] sm:text-[15px]">
            {INTRO_HIGHLIGHTS[step].line}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex justify-center gap-2">
        {INTRO_HIGHLIGHTS.map((_, i) => (
          <motion.span
            key={i}
            className={`h-1.5 rounded-full ${
              i === step ? "bg-[var(--accent)]" : "bg-[var(--border)]"
            }`}
            animate={{ width: i === step ? 24 : 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        ))}
      </div>
    </div>
  );
}

export function IntroLoader({ children }: { children: React.ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientMounted,
    getServerMounted
  );
  const reduce = useReducedMotion();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!mounted || reduce) return;

    const openId = window.requestAnimationFrame(() => {
      setShowIntro(true);
    });

    const closeId = window.setTimeout(() => {
      setShowIntro(false);
    }, INTRO_MS);

    return () => {
      window.cancelAnimationFrame(openId);
      window.clearTimeout(closeId);
    };
  }, [mounted, reduce]);

  return (
    <>
      {children}
      {!mounted && (
        <div
          className="fixed inset-0 z-[200] bg-[var(--background)]"
          aria-hidden
        />
      )}
      <AnimatePresence>
        {mounted && showIntro && !reduce && (
          <motion.div
            key="intro"
            role="dialog"
            aria-modal="true"
            aria-label="Introduction"
            className="fixed inset-0 z-[200] flex flex-col bg-[var(--background)]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.28] dark:opacity-[0.16]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
                `,
                backgroundSize: "56px 56px",
              }}
            />

            <IntroNeuralBackdrop />

            <motion.div
              className="pointer-events-none absolute -left-[20%] top-[10%] h-[min(50vw,420px)] w-[min(50vw,420px)] rounded-full bg-[var(--blob-1)] blur-[100px]"
              animate={{ x: [0, 16, 0], y: [0, 12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -right-[15%] bottom-[15%] h-[min(45vw,380px)] w-[min(45vw,380px)] rounded-full bg-[var(--blob-2)] blur-[90px]"
              animate={{ x: [0, -14, 0], y: [0, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]/80" />

            <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8">
              <motion.div
                className="mb-10 text-center"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight sm:text-xl">
                  <LogoAkashWord />
                  <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                    Uxer
                  </span>
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
                  AI · Systems · Accessibility
                </p>
              </motion.div>

              <motion.div
                className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]/75 p-8 shadow-[0_24px_80px_-24px_rgba(99,102,241,0.2)] backdrop-blur-xl dark:bg-[var(--card)]/55 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.5)] sm:p-10"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                <IntroSequence />
              </motion.div>
            </div>

            <div className="relative z-10 shrink-0 px-6 pb-10 pt-2 sm:pb-12">
              <div className="mx-auto h-[3px] max-w-md overflow-hidden rounded-[var(--radius)] bg-[var(--border)]/80">
                <motion.div
                  className="h-full origin-left rounded-[var(--radius)] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTRO_MS / 1000, ease: "linear" }}
                />
              </div>
              <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--foreground-muted)]">
                Entering portfolio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
