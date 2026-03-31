"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function subscribeFinePointer(onChange: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

const subscribeNoop = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

const SELECTOR =
  "a, button, [role='button'], input, textarea, select, [data-cursor='pointer']";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientMounted,
    getServerMounted
  );
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getServerSnapshot
  );

  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);

  /** Direct DOM transform — avoids Framer Motion / React scheduling lag under heavy hero canvas. */
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverSyncedRef = useRef(false);

  const updateHoverAt = useCallback((clientX: number, clientY: number) => {
    const hit = document.elementFromPoint(clientX, clientY);
    const next = !!(hit && hit.closest(SELECTOR));
    if (next !== hoverSyncedRef.current) {
      hoverSyncedRef.current = next;
      setHovering(next);
    }
  }, []);

  const onPointerLike = useCallback(
    (e: PointerEvent) => {
      const coalesced =
        typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
      const list: Pick<PointerEvent, "clientX" | "clientY">[] =
        coalesced.length > 0 ? coalesced : [e];
      const node = rootRef.current;
      for (const ev of list) {
        if (node) {
          node.style.transform = `translate3d(${ev.clientX}px, ${ev.clientY}px, 0)`;
        }
      }
      const last = list[list.length - 1];
      updateHoverAt(last.clientX, last.clientY);
    },
    [updateHoverAt]
  );

  const enabled = mounted && !reduce && finePointer;

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("custom-cursor-active");

    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);

    window.addEventListener("pointermove", onPointerLike, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onPointerLike);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled, onPointerLike]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform [contain:layout_style]"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="rounded-full border-2 border-[var(--accent)] bg-transparent"
          animate={{
            width: hovering ? 44 : 34,
            height: hovering ? 44 : 34,
            opacity: hovering ? 0.95 : 0.65,
            scale: pressing ? 0.9 : 1,
          }}
          transition={{ type: "tween", duration: 0.12, ease: "easeOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]"
          animate={{
            width: hovering ? 5 : 7,
            height: hovering ? 5 : 7,
            opacity: hovering ? 0.35 : 0.9,
            scale: pressing ? 0.85 : 1,
          }}
          transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
