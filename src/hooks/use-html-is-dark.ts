"use client";

import { useSyncExternalStore } from "react";

function subscribeHtmlClass(onStoreChange: () => void) {
  const el = document.documentElement;
  const mo = new MutationObserver(onStoreChange);
  mo.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}

function getIsDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

/**
 * True when `<html class="dark">` is present — matches actual painted theme
 * (avoids stale / undefined `resolvedTheme` during hydration).
 */
export function useHtmlIsDark() {
  return useSyncExternalStore(
    subscribeHtmlClass,
    getIsDarkSnapshot,
    () => false
  );
}
