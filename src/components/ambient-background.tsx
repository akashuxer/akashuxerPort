"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useMemo } from "react";

/** AI node graph — normalized 0–100 (more nodes + edges for fuller “network”) */
const NODES = [
  { x: 8, y: 22 },
  { x: 18, y: 14 },
  { x: 14, y: 36 },
  { x: 28, y: 28 },
  { x: 24, y: 46 },
  { x: 38, y: 18 },
  { x: 42, y: 34 },
  { x: 36, y: 50 },
  { x: 52, y: 24 },
  { x: 50, y: 42 },
  { x: 58, y: 14 },
  { x: 62, y: 32 },
  { x: 68, y: 48 },
  { x: 72, y: 22 },
  { x: 78, y: 38 },
  { x: 82, y: 18 },
  { x: 88, y: 30 },
  { x: 92, y: 46 },
] as const;

const EDGES: readonly [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [3, 6],
  [4, 7],
  [5, 8],
  [6, 9],
  [7, 9],
  [8, 10],
  [8, 11],
  [9, 12],
  [10, 13],
  [11, 14],
  [12, 15],
  [13, 16],
  [14, 17],
  [5, 11],
  [6, 12],
  [13, 14],
  [15, 16],
  [1, 5],
  [16, 17],
];

/** Extra tiny nodes + faint edges — sparse, reference-style. */
function AiSparkleLayer({ reduce }: { reduce: boolean }) {
  const { dots, lines } = useMemo(() => {
    const dots = Array.from({ length: 56 }, (_, i) => ({
      x: ((i * 41 + 11) % 86) + 7,
      y: ((i * 31 + 17) % 78) + 8,
      phase: (i * 0.11) % 2,
    }));
    const lines: [number, number][] = [];
    for (let i = 0; i < dots.length - 1; i += 2) {
      if (Math.hypot(dots[i + 1].x - dots[i].x, dots[i + 1].y - dots[i].y) < 22) {
        lines.push([i, i + 1]);
      }
    }
    for (let i = 0; i < dots.length - 4; i += 6) {
      lines.push([i, i + 4]);
    }
    return { dots, lines };
  }, []);

  return (
    <g>
      {lines.map(([a, b], i) => {
        const p = dots[a];
        const q = dots[b];
        return (
          <motion.line
            key={`sp-l-${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="var(--accent)"
            strokeWidth={0.022}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={reduce ? 0.06 : 0.12}
            initial={false}
            animate={
              reduce
                ? undefined
                : {
                    strokeDashoffset: [0, -12],
                  }
            }
            transition={{
              duration: 7 + (i % 5) * 0.5,
              repeat: Infinity,
              ease: "linear",
              delay: (i * 0.08) % 2,
            }}
            style={{ strokeDasharray: "0.15 0.9" }}
          />
        );
      })}
      {dots.map((d, i) => (
        <motion.circle
          key={`sp-d-${i}`}
          cx={d.x}
          cy={d.y}
          r={0.1}
          fill="var(--accent)"
          opacity={0.22}
          initial={false}
          animate={
            reduce
              ? undefined
              : {
                  opacity: [0.1, 0.38, 0.12],
                }
          }
          transition={{
            duration: 2.4 + (i % 6) * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.phase,
          }}
        />
      ))}
    </g>
  );
}

function AiNodeField({ reduce }: { reduce: boolean }) {
  const edgeMeta = useMemo(
    () =>
      EDGES.map((_, i) => ({
        duration: 5 + (i % 4) * 0.6,
        delay: (i * 0.15) % 2.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.1]">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="aiNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.65" />
            <stop offset="55%" stopColor="var(--accent-secondary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aiNodeGlowSoft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-tertiary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <filter id="aiEdgeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 2.4, -1.2, 0],
                  y: [0, -1.6, 1.1, 0],
                }
          }
          transition={{
            duration: 44,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
        {EDGES.map(([a, b], i) => {
          const p = NODES[a];
          const q = NODES[b];
          return (
            <motion.line
              key={`${a}-${b}-${i}`}
              x1={p.x}
              y1={p.y}
              x2={q.x}
              y2={q.y}
              stroke="var(--accent)"
              strokeWidth={0.05}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#aiEdgeGlow)"
              opacity={reduce ? 0.14 : 0.28}
              initial={false}
              animate={
                reduce
                  ? undefined
                  : {
                      strokeDashoffset: [0, -18],
                    }
              }
              transition={{
                duration: edgeMeta[i].duration,
                repeat: Infinity,
                ease: "linear",
                delay: edgeMeta[i].delay,
              }}
              style={{
                strokeDasharray: "0.35 1.1",
              }}
            />
          );
        })}

        {NODES.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={0.85}
              fill="url(#aiNodeGlowSoft)"
              opacity={0.35}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={0.72}
              fill="url(#aiNodeGlow)"
              opacity={0.45}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={0.26}
              fill="var(--accent)"
              opacity={0.4}
              initial={false}
              animate={
                reduce
                  ? undefined
                  : {
                      opacity: [0.18, 0.55, 0.22],
                    }
              }
              transition={{
                duration: 2.8 + (i % 4) * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              }}
            />
          </g>
        ))}
        </motion.g>

        <motion.g
          animate={
            reduce
              ? undefined
              : {
                  x: [0, -1.8, 1.5, 0],
                  y: [0, 1.3, -0.9, 0],
                }
          }
          transition={{
            duration: 56,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <AiSparkleLayer reduce={Boolean(reduce)} />
        </motion.g>
      </svg>
    </div>
  );
}

export function AmbientBackground() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const parallax1 = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : 100]);
  const parallax2 = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : -70]);
  const parallax3 = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : 85]);
  const gridShift = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 36]);
  const netParallax = useTransform(scrollY, [0, 1400], [0, reduce ? 0 : 20]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.12]"
        style={{
          y: gridShift,
          backgroundImage: `
            linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div className="absolute inset-0" style={{ y: netParallax }}>
        <AiNodeField reduce={Boolean(reduce)} />
      </motion.div>

      <motion.div className="absolute -top-[20%] left-[10%]" style={{ y: parallax1 }}>
        <motion.div
          className="h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full bg-[var(--blob-1)] blur-[80px]"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 28, -16, 0],
                  y: [0, 22, 8, 0],
                  scale: [1, 1.03, 0.99, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 22, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      <motion.div className="absolute top-[32%] -right-[12%]" style={{ y: parallax2 }}>
        <motion.div
          className="h-[min(45vw,360px)] w-[min(45vw,360px)] rounded-full bg-[var(--blob-2)] blur-[72px]"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, -28, 12, 0],
                  y: [0, 28, -12, 0],
                  scale: [1, 0.98, 1.04, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 26, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      <motion.div className="absolute bottom-[8%] left-[18%]" style={{ y: parallax3 }}>
        <motion.div
          className="h-[min(40vw,320px)] w-[min(40vw,320px)] rounded-full bg-[var(--blob-3)] blur-[64px]"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 18, -22, 0],
                  y: [0, -18, 14, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>

      <motion.div className="absolute top-[48%] left-[4%]" style={{ y: parallax1 }}>
        <motion.div
          className="h-[min(32vw,260px)] w-[min(32vw,260px)] rounded-full bg-[var(--blob-2)] blur-[56px] opacity-80"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 14, -10, 0],
                  y: [0, -12, 16, 0],
                  scale: [1, 1.06, 0.97, 1],
                }
          }
          transition={
            reduce ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      <motion.div className="absolute right-[6%] top-[55%]" style={{ y: parallax2 }}>
        <motion.div
          className="h-[min(38vw,300px)] w-[min(38vw,300px)] rounded-full bg-[var(--blob-1)] blur-[68px] opacity-75 dark:opacity-60"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, -20, 16, 0],
                  y: [0, 14, -10, 0],
                }
          }
          transition={
            reduce ? undefined : { duration: 21, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      <motion.div className="absolute bottom-[22%] right-[22%]" style={{ y: parallax3 }}>
        <motion.div
          className="h-[min(28vw,220px)] w-[min(28vw,220px)] rounded-full bg-[var(--accent)] blur-[72px] opacity-[0.12] dark:opacity-[0.1]"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 12, -14, 0],
                  y: [0, 10, -8, 0],
                  scale: [1, 1.05, 1],
                }
          }
          transition={
            reduce ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      <motion.div className="absolute left-[45%] top-[12%]" style={{ y: netParallax }}>
        <motion.div
          className="h-[min(26vw,200px)] w-[min(26vw,200px)] rounded-full bg-[var(--blob-3)] blur-[52px] opacity-70"
          animate={
            reduce
              ? undefined
              : {
                  x: [0, -16, 12, 0],
                  y: [0, 8, -6, 0],
                }
          }
          transition={
            reduce ? undefined : { duration: 23, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 top-0 h-[120%] bg-gradient-to-b from-transparent via-[var(--shimmer)] to-transparent opacity-20 dark:opacity-12"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
