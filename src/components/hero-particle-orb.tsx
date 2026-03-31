"use client";

import {
  motionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** Max particles on shell; visible count oscillates DENSITY_MIN↔DENSITY_MAX. */
const TOTAL = 780;
const DENSITY_MIN = 700;
const DENSITY_MAX = 780;
/** Seconds for one full cycle: sparse → dense → sparse. */
const DENSITY_CYCLE_S = 14;
const ORBIT_PERIOD_S = 12;
const ORB_R = 100;

/**
 * Scroll split: one big sphere → a handful of smaller particle spheres (each still a full “circle”),
 * not lots of tiny shards.
 */
const CLUSTER_COUNT = 6;
const CLUSTER_SIZE = Math.ceil(TOTAL / CLUSTER_COUNT);

/** Where each smaller sphere sits around the original (even sphere packing in direction space). */
function clusterScatterDir(k: number): [number, number, number] {
  const [x, y, z] = fibonacciSphere(k, CLUSTER_COUNT);
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

/** Sub-orbit radii stay in a tight band so every piece reads as a small sphere, not crumbs. */
function clusterRadiusScale(k: number): number {
  const t = Math.sin(k * 11.7 + 1.3) * 0.5 + 0.5;
  return 0.4 + t * 0.16;
}

const GRATICULE_MERIDIANS = 12;
const GRATICULE_PARALLELS = 7;
const GRATICULE_SEGMENTS = 36;

/** On-screen orbit size (larger divisor → smaller sphere). */
const SCALE_DIVISOR = 356;
const SHELL_MULT = 1.04;

/** Hover: sphere shatters outward and reforms when pointer leaves. */
const BREAK_LERP = 0.085;
const BURST_RADIAL = 2.35;
const BURST_JITTER = 1.65;

type Particle = {
  dx: number;
  dy: number;
  dz: number;
  hueT: number;
  /** Unit-ish burst direction (fixed per particle, deterministic). */
  bx: number;
  by: number;
  bz: number;
};

function hashBurst(i: number, n: number): [number, number, number] {
  const t = (i / Math.max(1, n)) * Math.PI * 2;
  const x = Math.sin(t * 7.13) + Math.cos(t * 3.07) * 0.5;
  const y = Math.cos(t * 5.91) + Math.sin(t * 11.2) * 0.5;
  const z = Math.sin(t * 9.44) * Math.cos(t * 2.17);
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

function fibonacciSphere(i: number, n: number): [number, number, number] {
  const inc = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / Math.max(1, n - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = i * inc;
  return [Math.cos(phi) * r, y, Math.sin(phi) * r];
}

function initParticles(): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const [x, y, z] = fibonacciSphere(i, TOTAL);
    const len = Math.hypot(x, y, z) || 1;
    const [bx, by, bz] = hashBurst(i, TOTAL);
    out.push({
      dx: x / len,
      dy: y / len,
      dz: z / len,
      hueT: i / TOTAL,
      bx,
      by,
      bz,
    });
  }
  return out;
}

function buildEdges(particles: Particle[]): [number, number][] {
  const n = particles.length;
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const maxEdges = 1500;

  for (let i = 0; i < n && edges.length < maxEdges; i++) {
    const scored: { j: number; dot: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const p = particles[i];
      const q = particles[j];
      const dot = p.dx * q.dx + p.dy * q.dy + p.dz * q.dz;
      if (dot > 0.695) scored.push({ j, dot });
    }
    scored.sort((a, b) => b.dot - a.dot);
    const kTake = Math.min(7, scored.length);
    for (let k = 0; k < kTake; k++) {
      const j = scored[k].j;
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a},${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([a, b]);
      if (edges.length >= maxEdges) break;
    }
  }
  return edges;
}

function shellPoint(
  dir: [number, number, number],
  radius: number
): [number, number, number] {
  return [dir[0] * radius, dir[1] * radius, dir[2] * radius];
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function smoothstep01(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function clusterIndex(i: number): number {
  return Math.min(CLUSTER_COUNT - 1, Math.floor(i / CLUSTER_SIZE));
}

function clusterParticleCount(k: number): number {
  const start = k * CLUSTER_SIZE;
  return Math.min(CLUSTER_SIZE, TOTAL - start);
}

function rotateGlobal(
  p: [number, number, number],
  rx: number,
  ry: number,
  rz: number
): [number, number, number] {
  let [x, y, z] = p;
  let cos = Math.cos(ry);
  let sin = Math.sin(ry);
  let x1 = x * cos + z * sin;
  let z1 = -x * sin + z * cos;
  x = x1;
  z = z1;
  cos = Math.cos(rx);
  sin = Math.sin(rx);
  const y2 = y * cos - z * sin;
  z1 = y * sin + z * cos;
  y = y2;
  z = z1;
  cos = Math.cos(rz);
  sin = Math.sin(rz);
  x1 = x * cos - y * sin;
  const y3 = x * sin + y * cos;
  return [x1, y3, z];
}

function spherePoint(
  theta: number,
  phi: number,
  r: number
): [number, number, number] {
  const st = Math.sin(theta);
  return [r * st * Math.cos(phi), r * Math.cos(theta), r * st * Math.sin(phi)];
}

function parseCssColor(s: string): [number, number, number] {
  const t = s.trim();
  if (t.startsWith("#")) {
    const h = t.slice(1);
    if (h.length === 6) {
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
    }
  }
  const m = t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return [+m[1], +m[2], +m[3]];
  return [129, 140, 248];
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgba(${r},${g},${bl},`;
}

type HeroParticleOrbProps = {
  className?: string;
  /** 0 = top of hero, ~1 = hero scrolled out — drives split into smaller orbits. */
  scrollProgress?: MotionValue<number>;
};

export function HeroParticleOrb({
  className,
  scrollProgress,
}: HeroParticleOrbProps) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => initParticles(), []);
  const edges = useMemo(() => buildEdges(particles), [particles]);
  const rafRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const parallaxTargetRef = useRef({ x: 0, y: 0 });
  const parallaxSmoothRef = useRef({ x: 0, y: 0 });
  /** 0 = formed orbit, 1 = broken — target from pointer enter/leave. */
  const breakTargetRef = useRef(0);
  const breakAmtRef = useRef(0);
  const scrollRawRef = useRef(0);
  const scrollSmoothRef = useRef(0);
  const fallbackScrollMv = useMemo(() => motionValue(0), []);
  const scrollMv = scrollProgress ?? fallbackScrollMv;
  useMotionValueEvent(scrollMv, "change", (v) => {
    scrollRawRef.current = v;
  });
  useEffect(() => {
    scrollRawRef.current = scrollMv.get();
  }, [scrollMv]);
  const colorsRef = useRef<{
    a: [number, number, number];
    b: [number, number, number];
    c: [number, number, number];
  } | null>(null);

  const readThemeColors = useCallback(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const ac = cs.getPropertyValue("--accent").trim() || "#818cf8";
    const a2 = cs.getPropertyValue("--accent-secondary").trim() || "#a78bfa";
    const a3 = cs.getPropertyValue("--accent-tertiary").trim() || "#c084fc";
    colorsRef.current = {
      a: parseCssColor(ac),
      b: parseCssColor(a2),
      c: parseCssColor(a3),
    };
  }, []);

  const drawFrame = useCallback(
    (timeMs: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !colorsRef.current) return;
      if (!reduce && !visibleRef.current) return;

      const { width: cw, height: ch } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(cw * dpr);
      const h = Math.floor(ch * dpr);
      if (w < 2 || h < 2) return;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const scale = Math.min(cw, ch) / SCALE_DIVISOR;

      const PARALLAX_X_PX = 20;
      const PARALLAX_Y_PX = 17;
      const LERP = 0.14;
      if (reduce) {
        parallaxSmoothRef.current.x = 0;
        parallaxSmoothRef.current.y = 0;
      } else {
        const tx = parallaxTargetRef.current.x;
        const ty = parallaxTargetRef.current.y;
        const sx = parallaxSmoothRef.current;
        sx.x += (tx - sx.x) * LERP;
        sx.y += (ty - sx.y) * LERP;
      }
      const offX = parallaxSmoothRef.current.x * PARALLAX_X_PX;
      const offY = parallaxSmoothRef.current.y * PARALLAX_Y_PX;
      const pcx = cx + offX;
      const pcy = cy + offY;

      const elapsed =
        startRef.current === null ? 0 : (timeMs - startRef.current) / 1000;

      /** 520 ↔ 700 in a smooth loop (sine: min at -1, max at +1). */
      const densityWave =
        0.5 +
        0.5 *
          Math.sin((elapsed * Math.PI * 2) / DENSITY_CYCLE_S);
      const activeCount = reduce
        ? Math.round((DENSITY_MIN + DENSITY_MAX) / 2)
        : Math.round(DENSITY_MIN + (DENSITY_MAX - DENSITY_MIN) * densityWave);

      /* Smooth break ↔ rebuild */
      const tgt = reduce ? 0 : breakTargetRef.current;
      let b = breakAmtRef.current;
      b += (tgt - b) * BREAK_LERP;
      if (Math.abs(tgt - b) < 0.002) b = tgt;
      breakAmtRef.current = b;
      const breakAmt = b;

      const scrollTarget = reduce ? 0 : scrollRawRef.current;
      let ss = scrollSmoothRef.current;
      ss += (scrollTarget - ss) * 0.11;
      if (Math.abs(scrollTarget - ss) < 0.0008) ss = scrollTarget;
      scrollSmoothRef.current = ss;
      const splitMix = smoothstep01(ss);

      /** Infinite circular orbit: steady Y spin + light X tilt (no stagger pulse). */
      const omega = (Math.PI * 2) / ORBIT_PERIOD_S;
      const spinY = elapsed * omega;
      const spinX = elapsed * omega * 0.11;
      const spinZ = elapsed * omega * 0.04;
      const subtle = 1 + 0.015 * Math.sin(elapsed * 0.7);

      const { a, b: bc, c } = colorsRef.current;
      /** Slightly deeper particle tint (main orb reads a bit richer, not washed out). */
      const ad: [number, number, number] = [
        Math.round(a[0] * 0.9 + 8),
        Math.round(a[1] * 0.9 + 8),
        Math.round(a[2] * 0.92 + 6),
      ];
      const bcd: [number, number, number] = [
        Math.round(bc[0] * 0.9 + 8),
        Math.round(bc[1] * 0.9 + 8),
        Math.round(bc[2] * 0.92 + 6),
      ];
      const cd: [number, number, number] = [
        Math.round(c[0] * 0.9 + 8),
        Math.round(c[1] * 0.9 + 8),
        Math.round(c[2] * 0.92 + 6),
      ];

      const perspective = 720;
      const project = (
        px: number,
        py: number,
        pz: number
      ): { sx: number; sy: number; s: number; z: number } => {
        const sc = perspective / (perspective + pz * scale * 0.42);
        return {
          sx: pcx + px * scale * sc,
          sy: pcy + py * scale * sc,
          s: sc,
          z: pz,
        };
      };

      const baseShellR =
        ORB_R * scale * SHELL_MULT * subtle *
        (1 + BURST_RADIAL * breakAmt * breakAmt);

      const glowR =
        Math.min(cw, ch) *
        (0.36 + 0.08 * breakAmt) *
        (1 - 0.32 * splitMix);
      const g = ctx.createRadialGradient(pcx, pcy, 0, pcx, pcy, glowR);
      g.addColorStop(0, `rgba(${a[0]},${a[1]},${a[2]},${0.17 + 0.06 * breakAmt})`);
      g.addColorStop(0.45, `rgba(${bc[0]},${bc[1]},${bc[2]},${0.065 + 0.035 * breakAmt})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pcx, pcy, glowR, 0, Math.PI * 2);
      ctx.fill();

      const shellR = baseShellR;
      const grFade =
        (1 - 0.85 * breakAmt) * Math.max(0, 1 - splitMix * 1.05);

      if (!reduce && grFade > 0.04) {
        ctx.lineWidth = 0.58;
        const grAlpha = (0.145 + 0.055 * Math.sin(elapsed * 1.1)) * grFade;
        for (let m = 0; m < GRATICULE_MERIDIANS; m++) {
          const phi = (m / GRATICULE_MERIDIANS) * Math.PI * 2;
          ctx.beginPath();
          for (let seg = 0; seg <= GRATICULE_SEGMENTS; seg++) {
            const theta = (seg / GRATICULE_SEGMENTS) * Math.PI;
            let p = spherePoint(theta, phi, shellR);
            p = rotateGlobal(p, spinX, spinY, spinZ);
            const pr = project(p[0], p[1], p[2]);
            if (seg === 0) ctx.moveTo(pr.sx, pr.sy);
            else ctx.lineTo(pr.sx, pr.sy);
          }
          ctx.strokeStyle = `rgba(${a[0]},${a[1]},${a[2]},${grAlpha})`;
          ctx.stroke();
        }
        for (let p = 0; p < GRATICULE_PARALLELS; p++) {
          const theta = ((p + 1) / (GRATICULE_PARALLELS + 1)) * Math.PI;
          ctx.beginPath();
          for (let seg = 0; seg <= GRATICULE_SEGMENTS; seg++) {
            const phi = (seg / GRATICULE_SEGMENTS) * Math.PI * 2;
            let pt = spherePoint(theta, phi, shellR);
            pt = rotateGlobal(pt, spinX, spinY, spinZ);
            const pr = project(pt[0], pt[1], pt[2]);
            if (seg === 0) ctx.moveTo(pr.sx, pr.sy);
            else ctx.lineTo(pr.sx, pr.sy);
          }
          ctx.strokeStyle = `rgba(${bc[0]},${bc[1]},${bc[2]},${grAlpha * 0.85})`;
          ctx.stroke();
        }
      }

      const particleWorldAt = (
        p: Particle,
        i: number,
        shellRadius: number
      ): [number, number, number] => {
        const dir = [p.dx, p.dy, p.dz] as [number, number, number];
        const single = shellPoint(dir, shellRadius);

        const k = clusterIndex(i);
        const pop = clusterParticleCount(k);
        const localI = i - k * CLUSTER_SIZE;
        const [lx, ly, lz] = fibonacciSphere(localI, Math.max(2, pop));
        const ln = Math.hypot(lx, ly, lz) || 1;
        const dirL: [number, number, number] = [lx / ln, ly / ln, lz / ln];
        const rScale = clusterRadiusScale(k);
        const rSmall =
          shellRadius *
          (1 - 0.4 * splitMix) *
          (1 + (rScale - 0.48) * 0.42 * splitMix);
        const sp = shellPoint(dirL, rSmall);

        const raw = clusterScatterDir(k);
        const orbitYaw = elapsed * 0.07;
        const ca = Math.cos(orbitYaw);
        const sa = Math.sin(orbitYaw);
        let ox = raw[0] * ca - raw[1] * sa;
        let oy = raw[0] * sa + raw[1] * ca;
        let oz = raw[2];
        const oLen = Math.hypot(ox, oy, oz) || 1;
        ox /= oLen;
        oy /= oLen;
        oz /= oLen;
        /** Fewer, larger sub-spheres: modest separation (not “shattered dust”). */
        const splitEase = 1 - Math.pow(1 - splitMix, 1.75);
        const spread = shellRadius * 0.72 * splitEase;
        const depthJitter =
          Math.sin(k * 9.17 + 1.1) * shellRadius * 0.06 * splitEase;
        const micro =
          shellRadius * 0.028 * splitMix * Math.sin(elapsed * 0.48 + k * 1.4);
        const cx = ox * spread + ox * micro + oz * depthJitter * 0.25;
        const cy = oy * spread + oy * micro;
        const cz =
          oz * spread * 0.55 + oz * micro * 0.38 + ox * depthJitter * 0.2;
        const multi: [number, number, number] = [cx + sp[0], cy + sp[1], cz + sp[2]];

        let blended = lerp3(single, multi, splitMix);
        if (breakAmt > 0.001) {
          const jitter =
            ORB_R * scale * BURST_JITTER * breakAmt * breakAmt;
          blended = [
            blended[0] + p.bx * jitter,
            blended[1] + p.by * jitter,
            blended[2] + p.bz * jitter,
          ];
        }
        return rotateGlobal(blended, spinX, spinY, spinZ);
      };

      const pulse = 0.55 + 0.45 * Math.sin(elapsed * 2.1);
      const edgeAlphaBase =
        (reduce ? 0.12 : 0.13 + 0.14 * pulse) *
        (1 - 0.92 * breakAmt) *
        (1 - 0.82 * splitMix);

      for (let e = 0; e < edges.length; e++) {
        const [ia, ib] = edges[e];
        if (ia >= activeCount || ib >= activeCount) continue;
        if (splitMix > 0.12 && clusterIndex(ia) !== clusterIndex(ib)) {
          continue;
        }
        const pa = particles[ia];
        const pb = particles[ib];
        if (edgeAlphaBase < 0.02) break;
        const va = particleWorldAt(pa, ia, baseShellR);
        const vb = particleWorldAt(pb, ib, baseShellR);
        const A = project(va[0], va[1], va[2]);
        const B = project(vb[0], vb[1], vb[2]);
        if (A.z < -120 && B.z < -120) continue;
        const midZ = (A.z + B.z) * 0.5;
        const depth = 0.35 + 0.65 * Math.max(0, Math.min(1, (midZ + ORB_R) / (ORB_R * 2.5)));
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(B.sx, B.sy);
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${edgeAlphaBase * depth})`;
        ctx.lineWidth = 0.42 * Math.min(A.s, B.s);
        ctx.stroke();
      }

      type DrawDot = {
        sx: number;
        sy: number;
        size: number;
        alpha: number;
        col: string;
        z: number;
      };
      const dots: DrawDot[] = [];

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i];
        const pt = particleWorldAt(p, i, baseShellR);
        const pr = project(pt[0], pt[1], pt[2]);
        const zFade = 0.46 + 0.54 * Math.max(
          0,
          Math.min(1, (pr.z + ORB_R * 1.8) / (ORB_R * 3.2))
        );
        const alpha = Math.max(0.22, Math.min(1, zFade * 1.06));

        const tHue = p.hueT;
        let col: string;
        if (tHue < 0.5) col = mixRgb(ad, bcd, tHue * 2);
        else col = mixRgb(bcd, cd, (tHue - 0.5) * 2);

        const size = Math.max(
          0.52,
          1.28 * pr.s * (0.64 + Math.max(-1, pr.z / 400) * 0.15)
        );

        dots.push({
          sx: pr.sx,
          sy: pr.sy,
          size,
          alpha,
          col,
          z: pr.z,
        });
      }

      dots.sort((u, v) => u.z - v.z);

      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.sx, d.sy, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `${d.col}${d.alpha})`;
        ctx.fill();
      }
    },
    [particles, edges, reduce]
  );

  const loop = useCallback(
    (t: number) => {
      if (startRef.current === null) startRef.current = t;
      drawFrame(t);
      if (!reduce) {
        rafRef.current = requestAnimationFrame(loop);
      }
    },
    [drawFrame, reduce]
  );

  useEffect(() => {
    readThemeColors();
    const ro = new ResizeObserver(() => {
      readThemeColors();
      drawFrame(performance.now());
    });
    if (containerRef.current) ro.observe(containerRef.current);

    const mo = new MutationObserver(readThemeColors);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let io: IntersectionObserver | undefined;
    if (containerRef.current && !reduce) {
      io = new IntersectionObserver(
        ([e]) => {
          visibleRef.current = e.isIntersecting;
        },
        { root: null, threshold: 0, rootMargin: "100px" }
      );
      io.observe(containerRef.current);
    }

    const el = containerRef.current;
    const onPointerMove = (ev: PointerEvent) => {
      if (!el || reduce) return;
      const r = el.getBoundingClientRect();
      const mx = ev.clientX - r.left;
      const my = ev.clientY - r.top;
      const nx = (mx / Math.max(r.width, 1)) * 2 - 1;
      const ny = (my / Math.max(r.height, 1)) * 2 - 1;
      parallaxTargetRef.current.x = Math.max(-1, Math.min(1, nx));
      parallaxTargetRef.current.y = Math.max(-1, Math.min(1, ny));
    };
    const onPointerEnter = () => {
      if (!reduce) breakTargetRef.current = 1;
    };
    const onPointerLeave = () => {
      parallaxTargetRef.current.x = 0;
      parallaxTargetRef.current.y = 0;
      if (!reduce) breakTargetRef.current = 0;
    };
    /** Touch/pen: no reliable hover — break on contact like desktop hover. */
    const onPointerDown = (ev: PointerEvent) => {
      if (reduce) return;
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      if (ev.pointerType === "touch" || ev.pointerType === "pen") {
        breakTargetRef.current = 1;
      }
    };
    const onPointerUpOrCancel = (ev: PointerEvent) => {
      if (reduce) return;
      if (ev.pointerType === "touch" || ev.pointerType === "pen") {
        breakTargetRef.current = 0;
        parallaxTargetRef.current.x = 0;
        parallaxTargetRef.current.y = 0;
      }
    };

    if (el && !reduce) {
      el.addEventListener("pointermove", onPointerMove, { passive: true });
      el.addEventListener("pointerenter", onPointerEnter);
      el.addEventListener("pointerleave", onPointerLeave);
      el.addEventListener("pointerdown", onPointerDown, { passive: true });
      el.addEventListener("pointerup", onPointerUpOrCancel, { passive: true });
      el.addEventListener("pointercancel", onPointerUpOrCancel, { passive: true });
    }

    if (reduce) {
      startRef.current = performance.now();
      drawFrame(performance.now());
      return () => {
        ro.disconnect();
        mo.disconnect();
        io?.disconnect();
        el?.removeEventListener("pointermove", onPointerMove);
        el?.removeEventListener("pointerenter", onPointerEnter);
        el?.removeEventListener("pointerleave", onPointerLeave);
        el?.removeEventListener("pointerdown", onPointerDown);
        el?.removeEventListener("pointerup", onPointerUpOrCancel);
        el?.removeEventListener("pointercancel", onPointerUpOrCancel);
      };
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mo.disconnect();
      io?.disconnect();
      el?.removeEventListener("pointermove", onPointerMove);
      el?.removeEventListener("pointerenter", onPointerEnter);
      el?.removeEventListener("pointerleave", onPointerLeave);
      el?.removeEventListener("pointerdown", onPointerDown);
      el?.removeEventListener("pointerup", onPointerUpOrCancel);
      el?.removeEventListener("pointercancel", onPointerUpOrCancel);
    };
  }, [drawFrame, loop, readThemeColors, reduce]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ touchAction: "manipulation" }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ contain: "strict" }}
      />
    </div>
  );
}
