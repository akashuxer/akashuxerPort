import confetti from "canvas-confetti";

/** One-shot burst after the intro loader dismisses — matches site accent palette. */
export function fireWelcomeConfetti() {
  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#22d3ee", "#c084fc"];
  const fire = (opts: confetti.Options) => {
    void confetti({
      disableForReducedMotion: true,
      ...opts,
      colors: opts.colors ?? colors,
    });
  };

  fire({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.15, y: 0.55 },
    startVelocity: 38,
    gravity: 0.95,
  });
  fire({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.85, y: 0.55 },
    startVelocity: 38,
    gravity: 0.95,
  });
  fire({
    particleCount: 120,
    spread: 100,
    origin: { x: 0.5, y: 0.45 },
    startVelocity: 42,
    gravity: 1,
    ticks: 220,
  });
  fire({
    particleCount: 60,
    spread: 160,
    origin: { x: 0.5, y: 0.35 },
    startVelocity: 28,
    gravity: 1.05,
    scalar: 0.9,
    ticks: 180,
  });
}
