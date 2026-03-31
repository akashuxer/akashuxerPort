/** Minimal placeholder while a below-the-fold chunk resolves (keeps layout light). */
export function SectionLoading({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[min(22vh,260px)] w-full items-center justify-center px-6 py-10 md:px-8"
      aria-hidden
    >
      <div className="h-px w-full max-w-sm bg-[var(--border)]/80" />
      <span className="sr-only">Loading {label}…</span>
    </div>
  );
}
