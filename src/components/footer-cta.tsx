"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";
import { cn } from "@/lib/utils";

const contactLinks = [
  { label: "Medium", href: "https://medium.com/@akashuxer" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/akashupadhyay" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    title: "Design page",
  },
  { label: "Resume", href: "/resume.pdf" },
] as const;

function HoverWord({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block cursor-default origin-bottom transition-transform duration-200 ease-out will-change-transform hover:scale-125 md:hover:scale-[1.35]">
      {children}
    </span>
  );
}

function AnimatedEmoji({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className="inline-block">{children}</span>;
  }
  return (
    <motion.span
      className="inline-block origin-center will-change-transform"
      aria-hidden
      animate={{
        y: [0, -3, 0],
        rotate: [0, 6, -4, 0],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        repeatDelay: 1.2,
        delay,
        ease: [0.45, 0, 0.55, 1],
      }}
    >
      {children}
    </motion.span>
  );
}

export function FooterCta() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      ref={ref}
      className="scroll-mt-24 bg-[color-mix(in_srgb,var(--muted)_35%,transparent)] px-6 py-24 md:px-8 md:py-32 lg:py-40 xl:py-44"
    >
      <div className="mx-auto max-w-2xl text-center md:max-w-3xl lg:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-[var(--accent)]/55 to-transparent md:mb-10 md:w-20" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] md:text-sm">
            Get in touch
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-5 text-[clamp(1.875rem,4vw+0.5rem,3.5rem)] font-semibold leading-[1.12] tracking-tight text-[var(--foreground)] md:mt-6 lg:text-[clamp(2.5rem,4.5vw,3.75rem)]">
            Let&apos;s design the next version of your product experience.
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-[var(--foreground-muted)] md:mt-10 md:text-lg md:leading-relaxed lg:text-xl lg:leading-relaxed">
            Open to Senior Product Design roles and collaborations across
            enterprise UX, design systems, accessibility and next-gen AI-driven
            experiences. Also happy to talk{" "}
            <HoverWord>
              design <AnimatedEmoji delay={0}>🧠</AnimatedEmoji>
            </HoverWord>
            ,{" "}
            <HoverWord>
              cycling <AnimatedEmoji delay={0.35}>🚴</AnimatedEmoji>
            </HoverWord>
            ,{" "}
            <HoverWord>
              art <AnimatedEmoji delay={0.7}>🎨</AnimatedEmoji>
            </HoverWord>
            , or{" "}
            <HoverWord>
              geopolitics <AnimatedEmoji delay={1.05}>🌎</AnimatedEmoji>
            </HoverWord>{" "}
            over{" "}
            <HoverWord>
              chai <AnimatedEmoji delay={1.4}>☕</AnimatedEmoji>
            </HoverWord>
            .
          </p>

          <p className="mt-12 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--foreground-muted)] md:mt-14 md:text-sm">
            Start a conversation
          </p>
          <a
            href="mailto:akashuxer@gmail.com"
            className="group mx-auto mt-4 inline-flex items-center justify-center gap-2.5 text-xl font-semibold text-[var(--foreground)] no-underline transition-colors hover:text-[var(--accent)] hover:underline hover:decoration-[var(--accent)] hover:underline-offset-[6px] md:mt-5 md:text-2xl lg:text-3xl"
            onClick={() => {
              if (!reduce) {
                void import("@/lib/contact-confetti").then((m) =>
                  m.fireContactConfetti()
                );
              }
            }}
          >
            <span>akashuxer@gmail.com</span>
            <ArrowUpRight
              className="size-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-6 lg:size-7"
              strokeWidth={1.75}
              aria-hidden
            />
          </a>

          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:mt-12 md:gap-x-3 md:gap-y-3"
            aria-label="Social and resume links"
          >
            {contactLinks.map((link, i) => (
              <span key={link.label} className="inline-flex items-center">
                {i > 0 ? (
                  <span className="mx-2 text-[var(--border)] md:mx-3" aria-hidden>
                    ·
                  </span>
                ) : null}
                <a
                  href={link.href}
                  title={"title" in link ? link.title : undefined}
                  className={cn(
                    "rounded-[var(--radius)] px-2 py-1.5 text-sm font-medium text-[var(--foreground-muted)] transition-colors",
                    "hover:text-[var(--foreground)] hover:underline hover:decoration-[var(--accent)] hover:underline-offset-4",
                    "md:text-base lg:text-lg"
                  )}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
        </motion.div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);

  return (
    <motion.footer
      ref={ref}
      className="px-6 py-14 text-center md:px-8"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.45 }}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-sm text-[var(--foreground-muted)]">
        <p className="max-w-md leading-relaxed">
          © {new Date().getFullYear()} Akash Upadhyay. Product design for
          intelligent workflows—crafted with care.
        </p>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.08 },
            },
          }}
        >
          {[
            { href: "https://linkedin.com", label: "LinkedIn" },
            { href: "https://read.cv", label: "Read.cv" },
          ].map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-x-2">
              {i > 0 ? (
                <span className="text-[var(--border)]" aria-hidden>
                  ·
                </span>
              ) : null}
              <motion.a
                href={link.href}
                className="rounded-[var(--radius)] px-2 py-1 transition-colors hover:bg-[var(--muted)]/60 hover:text-[var(--foreground)]"
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 4 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                {link.label}
              </motion.a>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.footer>
  );
}
