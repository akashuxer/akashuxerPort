"use client";

import { useEffect, useState } from "react";

export type NavKey = "work" | "about" | "testimonials" | "contact";

/** Section order + which nav item should be active while it’s in view. */
const SECTION_MAP: { id: string; key: NavKey }[] = [
  { id: "work", key: "work" },
  { id: "about", key: "about" },
  { id: "experience", key: "about" },
  { id: "awards", key: "about" },
  { id: "articles", key: "about" },
  { id: "testimonials", key: "testimonials" },
  { id: "contact", key: "contact" },
];

/**
 * Picks the nav key for the section intersecting a horizontal band below the header
 * (~35% viewport). Hero (above #work) has no active item — Work only when #work is in view.
 */
export function useActiveNav(): NavKey | null {
  const [active, setActive] = useState<NavKey | null>(null);

  useEffect(() => {
    const compute = () => {
      const marker = window.scrollY + window.innerHeight * 0.35;
      const workSection = document.getElementById("work");
      if (workSection && marker < workSection.offsetTop) {
        setActive(null);
        return;
      }

      for (const { id, key } of SECTION_MAP) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (marker >= top && marker < bottom) {
          setActive(key);
          return;
        }
      }

      for (let i = SECTION_MAP.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_MAP[i].id);
        if (el && marker >= el.offsetTop) {
          setActive(SECTION_MAP[i].key);
          return;
        }
      }

      setActive(null);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute, { passive: true });
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return active;
}
