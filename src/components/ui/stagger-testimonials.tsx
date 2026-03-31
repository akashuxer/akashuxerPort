"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const portfolioStaggerItems = [
  {
    id: 0,
    testimonial:
      "They turned a messy AI pilot into something our operators could trust—clear states, honest copy, and a system that didn’t fall apart under edge cases.",
    by: "Jordan Lee, VP Product, Series C SaaS",
    imgSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 1,
    testimonial:
      "The design system work paid for itself in eng velocity. Onboarding new teams went from weeks to days because the patterns were actually documented.",
    by: "Priya Nair, Head of Design, Enterprise analytics",
    imgSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 2,
    testimonial:
      "Accessibility wasn’t a late audit—it was baked into components from day one. Legal and CX both slept better at launch.",
    by: "Marcus Chen, Director of Platform, Collaboration suite",
    imgSrc:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 3,
    testimonial:
      "Stakeholder alignment is rare—here it was the default. The narrative was grounded in research and shipped with engineering buy-in.",
    by: "Sam Rivera, Chief of Staff, B2B workflow startup",
    imgSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 4,
    testimonial:
      "Complex workflows finally felt legible—progressive disclosure without hiding the truth operators need in a crisis.",
    by: "Elena Voss, Principal PM, Ops automation",
    imgSrc:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 5,
    testimonial:
      "Our eng team stopped debating hex codes and started shipping—tokens and governance that matched how we actually build.",
    by: "Chris Okonkwo, Staff Engineer, Data platform",
    imgSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 6,
    testimonial:
      "Enterprise buyers saw a product that matched the story in the deck—rare, and it shortened our sales cycle.",
    by: "Avery Kim, RevOps Lead, Series B infra",
    imgSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 7,
    testimonial:
      "Research wasn’t a deck—it was traceable decisions in Figma and tickets. Design and PM finally spoke one language.",
    by: "Noah Patel, Group PM, Fintech",
    imgSrc:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 8,
    testimonial:
      "We cut time-to-recovery in half because failure states weren’t an afterthought—they were designed with operators.",
    by: "Riley Santos, SRE Manager, Cloud SaaS",
    imgSrc:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 9,
    testimonial:
      "The handoff wasn’t a dump of screens—it was rationale, edge cases, and a spec eng could actually implement.",
    by: "Morgan Blake, EM, Workflow tools",
    imgSrc:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 10,
    testimonial:
      "Inclusive defaults in the library meant we didn’t bolt on a11y—we inherited it with every new screen.",
    by: "Taylor Brooks, CX Strategy, Health tech",
    imgSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=180&fit=crop&auto=format&q=80",
  },
  {
    id: 11,
    testimonial:
      "Calm density in the dashboard—operators could scan, decide, and act without fighting the UI at 2 a.m.",
    by: "Jamie Ortiz, Head of Support, B2B platform",
    imgSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=180&fit=crop&auto=format&q=80",
  },
];

function Card({
  item,
  paused,
  className,
}: {
  item: (typeof portfolioStaggerItems)[0];
  /** Accent border/bg only when strip is paused (pointer on track) and this card is hovered. */
  paused?: boolean;
  className?: string;
}) {
  const name = item.by.split(",")[0]?.trim() ?? "";
  const rest = item.by.includes(",")
    ? item.by.slice(item.by.indexOf(",") + 1).trim()
    : "";

  return (
    <article
      className={cn(
        "testimonial-marquee-card flex h-full flex-col border border-[var(--border)]/70 bg-[var(--card)]/35 p-4 shadow-[0_1px_0_0_color-mix(in_srgb,var(--border)_50%,transparent)] backdrop-blur-[2px] transition-[border-color,background-color,box-shadow] duration-300 md:p-5",
        "rounded-[var(--radius)]",
        paused &&
          "hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent)_7%,var(--card))] dark:hover:bg-[color-mix(in_srgb,var(--accent)_9%,var(--card))]",
        className
      )}
    >
      <p className="flex-1 text-sm leading-relaxed text-[var(--foreground-muted)]">
        &ldquo;{item.testimonial}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-[var(--border)]/30 pt-4">
        <Image
          src={item.imgSrc}
          alt=""
          width={40}
          height={40}
          sizes="40px"
          className="h-10 w-10 shrink-0 rounded-[var(--radius)] border border-[var(--border)]/60 bg-[var(--muted)] object-cover object-top opacity-90 grayscale"
        />
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--foreground)]">{name}</p>
          <p className="truncate text-[11px] text-[var(--foreground-muted)]">
            {rest}
          </p>
        </div>
      </div>
    </article>
  );
}

export function StaggerTestimonials() {
  const items = portfolioStaggerItems;
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (reduce) {
    return (
      <div className="relative w-full px-6 py-5 md:px-8 md:py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} item={item} paused />
          ))}
        </div>
      </div>
    );
  }

  const loop = [...items, ...items];

  return (
    <div className="relative w-full py-5 md:py-6">
      <div
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <div
          className="animate-testimonial-marquee flex w-max gap-4"
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((item, i) => (
            <Card
              key={`${item.id}-${i}`}
              item={item}
              paused={paused}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
