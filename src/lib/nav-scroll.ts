/** Shared anchor behavior for desktop nav links and mobile bottom bar. */
export function scrollToSection(
  href: string,
  reduceMotion: boolean,
  onNavigate?: () => void
) {
  const id = href.startsWith("#") ? href.slice(1) : href;
  onNavigate?.();
  const el = document.getElementById(id);
  el?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", href);
  }
  if (id === "contact" && !reduceMotion) {
    void import("@/lib/contact-confetti").then((m) => m.fireContactConfetti());
  }
}
