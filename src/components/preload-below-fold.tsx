"use client";

import { useEffect } from "react";

/** Warm below-the-fold dynamic chunks after first paint so scroll feels instant. */
export function PreloadBelowFold() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      void import("@/components/work");
      void import("@/components/about");
      void import("@/components/experience");
      void import("@/components/awards");
      void import("@/components/articles");
      void import("@/components/testimonials");
      void import("@/components/footer-cta");
    }, 100);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
