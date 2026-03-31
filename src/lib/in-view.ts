/**
 * Framer `useInView` options. Positive rootMargin expands the intersection root so
 * sections animate in slightly before they cross the fold — avoids the “late pop-in”
 * caused by negative margins (which shrink the root and delay triggers).
 */
export const inViewOptions = {
  once: true,
  /** Wider vertical margin so sections resolve & animate a bit before they enter the fold. */
  margin: "220px 0px 220px 0px",
} as const;
