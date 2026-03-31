"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type BackgroundRippleEffectProps = {
  rows?: number;
  cols?: number;
  cellSize?: number;
  /** When true, any primary click / tap on the viewport triggers a ripple (grid stays pointer-events-none). */
  clickAnywhere?: boolean;
};

const MAX_COLS = 36;
const MAX_ROWS = 24;

export function BackgroundRippleEffect({
  rows: rowsProp,
  cols: colsProp,
  cellSize = 72,
  clickAnywhere = true,
}: BackgroundRippleEffectProps) {
  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleTick, setRippleTick] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    };
    const onResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    measure();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const cols = Math.min(
    MAX_COLS,
    colsProp ?? Math.max(12, Math.ceil(dims.w / cellSize) + 2)
  );
  const rows = Math.min(
    MAX_ROWS,
    rowsProp ?? Math.max(8, Math.ceil(dims.h / cellSize) + 2)
  );

  const triggerRipple = useCallback(
    (clientX: number, clientY: number) => {
      const col = Math.min(Math.floor(clientX / cellSize), cols - 1);
      const row = Math.min(Math.floor(clientY / cellSize), rows - 1);
      if (row < 0 || col < 0) return;

      setClickedCell(null);
      setRippleTick((t) => t + 1);
      requestAnimationFrame(() => {
        setClickedCell({ row, col });
      });
    },
    [rows, cols, cellSize]
  );

  useEffect(() => {
    if (!clickAnywhere) return;

    const eventTargetElement = (e: PointerEvent): Element | null => {
      const t = e.target;
      if (t instanceof Element) return t;
      if (t instanceof Text) return t.parentElement;
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const el = eventTargetElement(e);
      /* Text nodes don't pass instanceof Element — without this, header clicks still fired ripples and stole the first interaction (e.g. theme toggle). */
      if (el?.closest("[data-no-ripple]") || el?.closest("header")) return;
      triggerRipple(e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [clickAnywhere, triggerRipple]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setClickedCell(null);
    setRippleTick((t) => t + 1);
    requestAnimationFrame(() => {
      setClickedCell({ row, col });
    });
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] h-full w-full overflow-hidden [contain:paint]",
        "[--cell-border-color:color-mix(in_srgb,var(--border)_85%,transparent)]",
        "[--cell-fill-color:color-mix(in_srgb,var(--accent)_10%,var(--background))]",
        "[--cell-shadow-color:color-mix(in_srgb,var(--accent)_35%,transparent)]",
        "dark:[--cell-fill-color:color-mix(in_srgb,var(--accent)_12%,var(--background))]",
        "dark:[--cell-shadow-color:color-mix(in_srgb,var(--accent)_28%,transparent)]"
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
      <div className="relative h-full min-h-full w-full overflow-hidden">
        <DivGrid
          key={rippleTick}
          className="absolute left-0 top-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_95%_75%_at_50%_12%,black,transparent)] dark:opacity-[0.48]"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          onCellClick={handleCellClick}
          interactive={!clickAnywhere}
        />
      </div>
    </div>
  );
}

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
  };

  return (
    <div className={cn("z-[3]", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-50 transition-opacity duration-150 hover:opacity-80 dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
              clickedCell &&
                "animate-cell-ripple will-change-[opacity,filter] [animation-fill-mode:none]",
              !interactive && "pointer-events-none"
            )}
            style={{
              backgroundColor: fillColor,
              borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
