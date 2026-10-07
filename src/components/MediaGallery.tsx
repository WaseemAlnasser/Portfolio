import type { MediaItem } from "@/lib/site";

/**
 * Local, pre-optimised images: Next's runtime image optimiser is unavailable in
 * static export, so plain <img> with explicit dimensions avoids layout shift.
 */
export function MediaGallery({ items, compact = false }: { items: MediaItem[]; compact?: boolean }) {
  if (items.length === 0) return null;
  const wide = items.every((m) => m.width > m.height);
  const grid = wide
    ? "grid-cols-1"
    : items.length === 1
      ? "grid-cols-1 max-w-[16rem]"
      : compact
        ? "grid-cols-2 max-w-[24rem]"
        : "grid-cols-2 sm:grid-cols-3";
  return (
    <div className={`grid gap-4 ${grid} ${wide && compact ? "max-w-xl" : ""}`}>
      {items.map((m) => (
        <figure key={m.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.src}
            alt={m.alt}
            width={m.width}
            height={m.height}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-lg border border-line bg-card"
          />
          <figcaption className="mt-2 text-xs leading-snug text-muted">{m.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
