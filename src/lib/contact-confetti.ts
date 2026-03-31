import confetti from "canvas-confetti";

const ACCENT_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#22d3ee", "#f472b6"];

/**
 * Full-viewport confetti “shower” for the Get in touch action.
 * Skips when `prefers-reduced-motion: reduce`.
 */
export function fireContactConfetti(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const z = 10000;

  const burst = (origin: { x: number; y: number }, n: number, spread: number) => {
    void confetti({
      particleCount: n,
      spread,
      startVelocity: 38,
      ticks: 220,
      gravity: 0.9,
      scalar: 1.05,
      origin,
      colors: ACCENT_COLORS,
      zIndex: z,
      disableForReducedMotion: true,
    });
  };

  burst({ x: 0.15, y: 0.2 }, 90, 70);
  burst({ x: 0.85, y: 0.25 }, 90, 70);
  burst({ x: 0.5, y: 0.1 }, 100, 100);

  const duration = 2400;
  const end = Date.now() + duration;

  const frame = () => {
    burst(
      { x: Math.random() * 0.2 + 0.05, y: 0 },
      18 + Math.floor(Math.random() * 8),
      65 + Math.random() * 20
    );
    burst(
      { x: Math.random() * 0.2 + 0.75, y: 0 },
      18 + Math.floor(Math.random() * 8),
      65 + Math.random() * 20
    );
    burst(
      { x: Math.random() * 0.4 + 0.3, y: 0.05 },
      12 + Math.floor(Math.random() * 6),
      80
    );
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
