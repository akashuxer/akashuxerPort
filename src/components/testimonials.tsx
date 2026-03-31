"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { inViewOptions } from "@/lib/in-view";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, inViewOptions);
  const reduce = useReducedMotion();

  return (
    <section
      id="testimonials"
      ref={ref}
      className="scroll-mt-24 overflow-x-hidden px-6 py-20 text-left md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }
          className="text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
            Testimonials
          </p>
          <h2 className="font-[family-name:var(--font-display)] mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Signal from teams
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--foreground-muted)]">
            Notes from product and engineering partners on AI-assisted workflows,
            systems work, and shipping with clarity.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-10 w-screen max-w-[100vw] overflow-hidden rounded-[var(--radius)] bg-[var(--background)]/25 text-left [margin-inline:calc(50%-50vw)]">
        <StaggerTestimonials />
      </div>
    </section>
  );
}
