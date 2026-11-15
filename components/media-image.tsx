import { publicMediaUrl } from "@/lib/media";

/**
 * Renders an uploaded image, or a neutral placeholder block when nothing has been
 * uploaded yet — so a half-filled admin panel still looks intentional.
 *
 * Uses a plain <img> rather than next/image because sources are user-uploaded to a
 * Supabase bucket whose hostname isn't known at build time.
 */
export function MediaImage({
  path,
  alt,
  className = "",
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const src = publicMediaUrl(path);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-brand-gray-light text-xs text-brand-gray ${className}`}
        role="img"
        aria-label={`${alt} — no image yet`}
      >
        No image yet
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
