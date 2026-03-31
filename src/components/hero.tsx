"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { HeroParticleOrb } from "./hero-particle-orb";
import { Magnetic } from "./magnetic";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const statContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [0, 72]
  );
  const parallaxOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduce ? [1, 1] : [1, 0.35]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-hidden px-6 pt-28 pb-20 md:px-8 md:pt-36 md:pb-28"
    >
      <motion.div
        className="mx-auto max-w-7xl min-w-0"
        style={{ y: parallaxY, opacity: parallaxOpacity }}
      >
        <div className="relative grid min-w-0 grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(260px,560px)] lg:gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(280px,620px)] xl:gap-3">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 min-w-0 max-w-4xl"
          >
        <motion.p
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)] backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          Available for select engagements
        </motion.p>

        <motion.h1
          variants={item}
          className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.12] tracking-tight text-[var(--foreground)] md:text-6xl md:leading-[1.12]"
        >
          Product design for{" "}
          <span className="relative inline-block">
            <motion.span
              className="inline bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent"
              animate={
                reduce
                  ? undefined
                  : {
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: 8, repeat: Infinity, ease: "linear" }
              }
              style={{
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              intelligent
            </motion.span>
          </span>{" "}
          workflows, systems, and inclusive experiences.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--foreground-muted)] md:text-xl"
        >
          I partner with B2B teams to shape AI-assisted products, mature design
          systems, and ship accessible interfaces that scale with your org—not
          against it.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Magnetic
            href="#work"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-[var(--radius)] bg-[var(--foreground)] px-8 text-sm font-semibold text-[var(--background)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative z-10">View selected work</span>
          </Magnetic>
          <motion.a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/30 px-8 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--muted)]/60"
            whileHover={{ scale: 1.03, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a conversation
          </motion.a>
        </motion.div>

        <motion.div
          variants={statContainer}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-2 gap-6 pt-10 md:grid-cols-4"
        >
          {[
            { k: "AI workflows", v: "Orchestration UX" },
            { k: "Design systems", v: "Tokens & governance" },
            { k: "Accessibility", v: "WCAG-aligned" },
            { k: "Enterprise", v: "B2B SaaS" },
          ].map((row) => (
            <motion.div key={row.k} variants={statItem}>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                {row.k}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {row.v}
              </p>
            </motion.div>
          ))}
        </motion.div>
          </motion.div>

          {/* <lg: orb sits behind copy (decorative). lg+: side column + pointer interaction. */}
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="pointer-events-none absolute left-1/2 top-6 z-0 h-[min(440px,96vw)] w-[min(100%,680px)] max-w-full -translate-x-1/2 opacity-[0.28] [mask-image:radial-gradient(ellipse_88%_82%_at_50%_48%,black_30%,transparent_90%)] md:top-8 md:h-[min(480px,88vw)] md:w-[min(100%,700px)] md:opacity-[0.34] lg:pointer-events-auto lg:relative lg:top-auto lg:-translate-x-7 lg:justify-self-start lg:mx-0 lg:h-[min(560px,68vw)] lg:w-full lg:max-w-[560px] xl:h-[min(600px,62vw)] xl:max-w-[600px] xl:-translate-x-9 lg:opacity-100 lg:[mask-image:none]"
          >
            <HeroParticleOrb
              className="h-full w-full min-h-[360px] md:min-h-[400px] lg:min-h-[460px] xl:min-h-[500px]"
              scrollProgress={scrollYProgress}
            />
          </motion.div>
        </div>
      </motion.div>

      <FloatingNodes />
    </section>
  );
}

function FloatingNodes() {
  const reduce = useReducedMotion();
  const nodes = [
    { x: "85%", y: "18%", delay: 0 },
    { x: "92%", y: "42%", delay: 0.4 },
    { x: "78%", y: "58%", delay: 0.8 },
  ];
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="75%"
          y1="22%"
          x2="88%"
          y2="38%"
          stroke="url(#line)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 0.45 }
              : { opacity: [0.35, 1, 0.35] }
          }
          transition={
            reduce
              ? { duration: 0.6 }
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }
          }
        />
        <motion.line
          x1="88%"
          y1="38%"
          x2="82%"
          y2="55%"
          stroke="url(#line)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 0.45 }
              : { opacity: [0.35, 1, 0.35] }
          }
          transition={
            reduce
              ? { duration: 0.6 }
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.9,
                }
          }
        />
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]"
          style={{ left: n.x, top: n.y, marginLeft: "-4px", marginTop: "-4px" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            reduce
              ? { opacity: 0.7, scale: 1 }
              : {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.2, 1],
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: reduce ? 0 : 3 + i * 0.3,
            repeat: reduce ? 0 : Infinity,
            delay: n.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
