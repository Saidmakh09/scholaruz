/* eslint-disable @next/next/no-img-element */

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic accent color from the name so each student looks distinct.
const palette = [
  "bg-brand-500",
  "bg-accent-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

export function Avatar({
  name,
  imageUrl,
  size = "md",
}: {
  name: string;
  imageUrl?: string | null;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${dim} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${dim} ${colorFor(name)} flex shrink-0 items-center justify-center rounded-full font-semibold text-white`}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
