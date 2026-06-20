/* eslint-disable @next/next/no-img-element */

// Plain <img> wrapper so external Wikimedia photos render without Next image
// remote configuration. Always object-cover; pass sizing via className.
export function CoverImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={`object-cover ${className}`}
    />
  );
}
