type LogoProps = {
  /** Tailwind text-size class controlling overall scale, e.g. "text-2xl". */
  sizeClass?: string;
  className?: string;
};

/**
 * ScholarUz wordmark: serif "Scholar" next to a blue rounded "UZ" tile,
 * matching the project logo.
 */
export function Logo({ sizeClass = "text-2xl", className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-serif font-bold leading-none ${sizeClass} ${className}`}
    >
      <span className="tracking-tight text-ink">Scholar</span>
      <span className="inline-flex items-center justify-center rounded-[0.4em] bg-accent-500 px-[0.35em] py-[0.12em] text-white shadow-sm">
        UZ
      </span>
    </span>
  );
}
