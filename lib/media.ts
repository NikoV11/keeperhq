import { SUPABASE_URL } from "@/lib/supabase/config";

export const PUBLIC_BUCKET = "public-media";
export const PRIVATE_BUCKET = "media";

/**
 * Resolves a stored path to a usable src.
 *
 * Paths beginning with "/" are files shipped in /public (the placeholder art);
 * anything else is an object key in the public marketing bucket.
 */
export function publicMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${PUBLIC_BUCKET}/${path}`;
}
