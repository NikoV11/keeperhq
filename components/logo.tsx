import Image from "next/image";
import Link from "next/link";

const SIZES = {
  sm: { badge: 28, text: "text-lg" },
  md: { badge: 36, text: "text-xl" },
  lg: { badge: 44, text: "text-2xl" },
} as const;

/**
 * The KeeperHQ lockup: the eagle/globe badge plus the wordmark.
 *
 * The supplied artwork is black linework on white, which would disappear against
 * the site's black chrome — so the badge (whose globe stays opaque white) carries
 * the mark, and the wordmark is set in type that can take the surrounding colour.
 */
export function Logo({
  size = "md",
  href = "/",
  showTagline = false,
  className = "",
}: {
  size?: keyof typeof SIZES;
  href?: string | null;
  showTagline?: boolean;
  className?: string;
}) {
  const { badge, text } = SIZES[size];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/brand/logo-badge.png"
        alt=""
        width={badge}
        height={badge}
        className="shrink-0"
        priority
      />
      <span className="leading-none">
        <span className={`block font-bold tracking-wide ${text}`}>
          KEEPER<span className="text-brand-green-light">HQ</span>
        </span>
        {showTagline && (
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.15em] opacity-70">
            Develop Your Game. Anywhere. Anytime.
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label="KeeperHQ home">
      {content}
    </Link>
  );
}
