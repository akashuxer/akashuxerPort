"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** Particle count + 14s cycle + shell radius (logical units, scaled in draw). */
const TOTAL = 520;
const CYCLE_S = 14;
const ORB_R = 100;
const EXPAND = 3;

const GRATICULE_MERIDIANS = 10;
const GRATICULE_PARALLELS = 6;
const GRATICULE_SEGMENTS = 48;

type Particle = {
  dx: number;
  dy: number;
  dz: number;
  stagger: number;
  hueT: number;
};

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
    out.push({
      dx: x / len,
      dy: y / len,
      dz: z / len,
      stagger: i * 0.01,
      hueT: i / TOTAL,
    });
  }
  return out;
}

/** AI-style edges: connect each node to a few nearest neighbors on the sphere. */
function buildEdges(particles: Particle[]): [number, number][] {
  const n = particles.length;
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const maxEdges = 720;

  for (let i = 0; i < n && edges.length < maxEdges; i++) {
    const scored: { j: number; dot: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const p = particles[i];
      const q = particles[j];
      const dot =
        p.dx * q.dx + p.dy * q.dy + p.dz * q.dz;
      if (dot > 0.78) scored.push({ j, dot });
    }
    scored.sort((a, b) => b.dot - a.dot);
    const kTake = Math.min(5, scored.length);
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

/** Phase 0–1 within one cycle — pulse wave on the shell. */
function radiusForPhase(phase: number): number {
  const t = phase - Math.floor(phase);
  if (t < 0.3) {
    const u = t / 0.3;
    return ORB_R * u * u;
  }
  if (t < 0.8) return ORB_R;
  const u = (t - 0.8) / 0.2;
  return ORB_R + ORB_R * (EXPAND - 1) * u;
}

function opacityForPhase(phase: number): number {
  const t = phase - Math.floor(phase);
  if (t < 0.2) return t / 0.2;
  return 1;
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

/** y-up sphere: colatitude θ ∈ (0,π), azimuth φ ∈ [0,2π) */
function spherePoint(theta: number, phi: number, r: number): [number, number, number] {
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
};

export function HeroParticleOrb({ className }: HeroParticleOrbProps) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => initParticles(), []);
  const edges = useMemo(() => buildEdges(particles), [particles]);
  const rafRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  /** Normalized pointer −1…1 relative to container center (target). */
  const parallaxTargetRef = useRef({ x: 0, y: 0 });
  const parallaxSmoothRef = useRef({ x: 0, y: 0 });
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(cw * dpr);
      const h = Math.floor(ch * dpr);
      if (w < 2 || h < 2) return;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      /** Slightly larger globe vs previous `/400`. */
      const scale = Math.min(cw, ch) / 348;

      const PARALLAX_X_PX = 26;
      const PARALLAX_Y_PX = 22;
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
      /** Globe spin: primary Y (like Earth), slower X + Z for depth & AI drift. */
      const spinY = elapsed * ((Math.PI * 2) / CYCLE_S) * 1.15;
      const spinX = elapsed * ((Math.PI * 2) / CYCLE_S) * 0.28;
      const spinZ = elapsed * ((Math.PI * 2) / CYCLE_S) * 0.08;
      const breathe = 1 + 0.04 * Math.sin(elapsed * 0.9);

      const { a, b, c } = colorsRef.current;

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

      /* Soft core glow — “AI nucleus” behind the globe */
      const glowR = Math.min(cw, ch) * 0.38;
      const g = ctx.createRadialGradient(
        pcx,
        pcy,
        0,
        pcx,
        pcy,
        glowR
      );
      g.addColorStop(0, `rgba(${a[0]},${a[1]},${a[2]},0.14)`);
      g.addColorStop(0.45, `rgba(${b[0]},${b[1]},${b[2]},0.05)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pcx, pcy, glowR, 0, Math.PI * 2);
      ctx.fill();

      const shellR = ORB_R * scale * 1.08 * breathe;

      /* Graticule — meridians & parallels read as a globe */
      if (!reduce) {
        ctx.lineWidth = 0.6;
        const grAlpha = 0.12 + 0.06 * Math.sin(elapsed * 1.2);
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
          ctx.strokeStyle = `rgba(${b[0]},${b[1]},${b[2]},${grAlpha * 0.85})`;
          ctx.stroke();
        }
      }

      /* Network edges on the shell */
      const pulse = 0.55 + 0.45 * Math.sin(elapsed * 2.1);
      const edgeAlphaBase = reduce ? 0.1 : 0.1 + 0.12 * pulse;

      for (let e = 0; e < edges.length; e++) {
        const [ia, ib] = edges[e];
        const pa = particles[ia];
        const pb = particles[ib];
        const cycleT = reduce ? 5.6 : elapsed;
        const phaseA =
          (((cycleT + pa.stagger) % CYCLE_S) + CYCLE_S) % CYCLE_S;
        const phaseB =
          (((cycleT + pb.stagger) % CYCLE_S) + CYCLE_S) % CYCLE_S;
        const rA = radiusForPhase(phaseA / CYCLE_S) * scale * 1.06 * breathe;
        const rB = radiusForPhase(phaseB / CYCLE_S) * scale * 1.06 * breathe;
        let va = shellPoint([pa.dx, pa.dy, pa.dz], rA);
        let vb = shellPoint([pb.dx, pb.dy, pb.dz], rB);
        va = rotateGlobal(va, spinX, spinY, spinZ);
        vb = rotateGlobal(vb, spinX, spinY, spinZ);
        const A = project(va[0], va[1], va[2]);
        const B = project(vb[0], vb[1], vb[2]);
        if (A.z < -120 && B.z < -120) continue;
        const midZ = (A.z + B.z) * 0.5;
        const depth = 0.35 + 0.65 * Math.max(0, Math.min(1, (midZ + ORB_R) / (ORB_R * 2.5)));
        ctx.beginPath();
        ctx.moveTo(A.sx, A.sy);
        ctx.lineTo(B.sx, B.sy);
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${edgeAlphaBase * depth})`;
        ctx.lineWidth = 0.45 * Math.min(A.s, B.s);
        ctx.stroke();
      }

      /* Shell particles (sorted by z for painter’s) */
      type DrawDot = {
        sx: number;
        sy: number;
        size: number;
        alpha: number;
        col: string;
        z: number;
      };
      const dots: DrawDot[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dir = [p.dx, p.dy, p.dz] as [number, number, number];
        const cycleT = reduce ? 5.6 : elapsed;
        const t = cycleT + p.stagger;
        const phaseTime = ((t % CYCLE_S) + CYCLE_S) % CYCLE_S;
        const phase = phaseTime / CYCLE_S;
        const dist = radiusForPhase(phase) * scale * 1.06 * breathe;
        const op = opacityForPhase(phase);
        if (op < 0.01) continue;

        let pt = shellPoint(dir, dist);
        pt = rotateGlobal(pt, spinX, spinY, spinZ);
        const pr = project(pt[0], pt[1], pt[2]);
        const zFade = 0.38 + 0.62 * Math.max(
          0,
          Math.min(1, (pr.z + ORB_R * 1.8) / (ORB_R * 3.2))
        );
        const alpha = op * Math.max(0.15, Math.min(1, zFade));

        const tHue = p.hueT;
        let col: string;
        if (tHue < 0.5) col = mixRgb(a, b, tHue * 2);
        else col = mixRgb(b, c, (tHue - 0.5) * 2);

        const size = Math.max(
          0.65,
          1.45 * pr.s * (0.62 + Math.max(-1, pr.z / 400) * 0.15)
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
        if (!reduce && d.alpha > 0.32) {
          ctx.shadowColor = `${d.col}${d.alpha * 0.4})`;
          ctx.shadowBlur = 4.5 * (d.size / 1.4);
        }
        ctx.fillStyle = `${d.col}${d.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
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
    const onPointerLeave = () => {
      parallaxTargetRef.current.x = 0;
      parallaxTargetRef.current.y = 0;
    };

    if (el && !reduce) {
      el.addEventListener("pointermove", onPointerMove, { passive: true });
      el.addEventListener("pointerleave", onPointerLeave);
    }

    if (reduce) {
      startRef.current = performance.now();
      drawFrame(performance.now());
      return () => {
        ro.disconnect();
        mo.disconnect();
        io?.disconnect();
        el?.removeEventListener("pointermove", onPointerMove);
        el?.removeEventListener("pointerleave", onPointerLeave);
      };
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      mo.disconnect();
      io?.disconnect();
      el?.removeEventListener("pointermove", onPointerMove);
      el?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [drawFrame, loop, readThemeColors, reduce]);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ contain: "strict" }}
      />
    </div>
  );
}
