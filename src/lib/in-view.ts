/**
 * Framer `useInView` options. Positive rootMargin expands the intersection root so
 * sections animate in slightly before they cross the fold — avoids the “late pop-in”
 * caused by negative margins (which shrink the root and delay triggers).
 */
export const inViewOptions = {
  once: true,
  margin: "160px 0px 160px 0px",
} as const;
